/* DARK CODE · remote support consent page (target side)
 * LIVE: Firestore session state + WebRTC screen stream (getDisplayMedia, user-selected) + optional local host agent (ws://127.0.0.1)
 * DEMO: BroadcastChannel to remote.html in the same browser (the simulated host runs inside the console)
 * Control channel opens only after an explicit ACCEPT; input is forwarded only if INPUT was granted, not paused,
 * a whole monitor is shared and a locally paired host agent reports ready.
 */
import * as cloud from './cloud.js?v=20261122r';

const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const pad = (n) => String(n).padStart(2, '0');
const tm = (x) => (typeof x === 'number' ? x : x?.toMillis?.() ?? 0);
const hms = (t = Date.now()) => { const d = new Date(t); return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`; };
const rid = (n = 8) => { const a = new Uint8Array(n); crypto.getRandomValues(a); return [...a].map((b) => 'abcdefghijkmnopqrstuvwxyz23456789'[b % 33]).join(''); };
const TASKS = {
  diagnose: ['시스템 진단', '운영체제·드라이버·디스크 상태 점검'],
  cleanup: ['임시/불필요 파일 정리', '임시 폴더·캐시·휴지통 등 사용자 데이터가 아닌 파일만'],
  optimize: ['성능 최적화', '시작 프로그램·백그라운드 프로세스·전원 설정 조정'],
};
const ICE = [{ urls: ['stun:stun.l.google.com:19302', 'stun:stun1.l.google.com:19302'] }];
const PRESETS = { auto: {}, high: { h: 1080, fps: 60, br: 8e6 }, balanced: { h: 720, fps: 30, br: 3e6 }, low: { h: 540, fps: 15, br: 1e6 } };
const INPUT_T = new Set(['mm', 'md', 'mu', 'wh', 'kd', 'ku']);
const P = new URLSearchParams(location.search);
const DEMO = P.get('demo') === '1';
const sid = P.get('sid') || '';

const stream = new DCStream.TokenStream($('#bgStream'), { size: 15 });
stream.start();
setInterval(() => { $('#clock').textContent = hms(); }, 1000);
$('#sid').textContent = sid ? `${sid.slice(0, 4)}-${sid.slice(4, 8)}-${sid.slice(-4)}` : '없음';

let sess = null, tick = null, total = 1, responding = false, viewKey = '', granted = null, paused = false, shareErr = '', demoHost = 'negotiating', sigUnsub = null;
const share = { stream: null, surface: '', w: 0, h: 0 };

/* ---------------- transport ---------------- */
function liveTransport() {
  return {
    watch: (cb, err) => cloud.watchRemote(sid, cb, err),
    respond: (st, target) => cloud.respondRemote(sid, st, target),
    expire: () => cloud.expireRemote(sid),
    end: () => cloud.endRemote(sid, 'target'),
    put: (id, d) => cloud.putSignal(sid, id, d),
    watchSignals: (cb, err) => cloud.watchSignals(sid, cb, err),
    scope: () => {},
  };
}
function demoTransport() {
  const bc = new BroadcastChannel('darkcode-remote-demo'); let cb = null, got = false;
  bc.onmessage = (e) => {
    const m = e.data || {}; if (m.sid !== sid) return;
    if (m.t === 'sess') { got = true; cb?.(m.sess ? { ...m.sess } : null); }
    else if (m.t === 'input') showRemoteInput(m.ev, { t: m.res, reason: m.reason });
    else if (m.t === 'host') { demoHost = m.state; updateAccepted(); }
  };
  return {
    watch(f) { cb = f; const hi = () => bc.postMessage({ t: 'hello', sid }); hi(); const iv = setInterval(() => { if (got) clearInterval(iv); else hi(); }, 800); setTimeout(() => { if (!got) f(null); }, 4000); },
    respond: async (status, target) => bc.postMessage({ t: 'answer', sid, status, target }),
    expire: async () => bc.postMessage({ t: 'expire', sid }),
    end: async () => bc.postMessage({ t: 'end', sid }),
    scope: (input) => bc.postMessage({ t: 'scope', sid, input }),
  };
}
const T = DEMO ? demoTransport() : liveTransport();

/* ---------------- helpers ---------------- */
function setCard(cls) { const c = $('#card'); c.classList.remove('alert', 'ok'); if (cls) c.classList.add(cls); }
function timerText(ms) { const s = Math.max(0, Math.ceil(ms / 1000)); return `${pad(Math.floor(s / 60))}:${pad(s % 60)}`; }
function envInfo() {
  const ua = navigator.userAgentData;
  return {
    platform: ua?.platform || navigator.platform || 'unknown',
    browser: ua?.brands?.filter((b) => !/Not.?A.?Brand/i.test(b.brand)).map((b) => `${b.brand} ${b.version}`).slice(-1)[0] || navigator.userAgent.split(' ').slice(-1)[0],
    cores: navigator.hardwareConcurrency || null,
    memoryGB: navigator.deviceMemory || null,
    screen: `${screen.width}x${screen.height}@${devicePixelRatio || 1}x`,
    tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
    lang: navigator.language,
  };
}
const curGranted = () => granted || sess?.target?.granted || { view: false, input: false };
async function applyQuality(sender, preset) {
  const p = PRESETS[preset] || {}; const prm = sender.getParameters();
  if (!prm.encodings || !prm.encodings.length) prm.encodings = [{}];
  const e = prm.encodings[0]; const h = sender.track?.getSettings?.().height || 720;
  if (p.br) e.maxBitrate = p.br; else delete e.maxBitrate;
  if (p.fps) e.maxFramerate = p.fps; else delete e.maxFramerate;
  e.scaleResolutionDownBy = p.h && h > p.h ? h / p.h : 1;
  prm.degradationPreference = 'maintain-resolution';
  try { await sender.setParameters(prm); } catch { delete prm.degradationPreference; await sender.setParameters(prm); }
  return { br: e.maxBitrate ? Math.round(e.maxBitrate / 1e6) + 'Mbps' : 'auto', fps: e.maxFramerate || 'auto', scale: +e.scaleResolutionDownBy.toFixed(2) };
}

/* ---------------- render ---------------- */
function render() {
  const st = $('#state');
  if (!sess) {
    viewKey = 'none'; setCard('alert');
    st.innerHTML = DEMO
      ? '<div class="big bad">DEMO SESSION NOT FOUND</div><p class="sub">이 데모 링크를 만든 DARK CODE 원격 제어 콘솔 탭이 같은 브라우저에 열려 있어야 합니다.</p>'
      : '<div class="big bad">SESSION NOT FOUND</div><p class="sub">유효하지 않거나 삭제된 요청 링크입니다. 요청자에게 새 링크를 받아주세요.</p>';
    return;
  }
  $('#req').textContent = `${sess.requesterName} <${sess.requesterEmail}>`;
  const left = tm(sess.expiresAt) - Date.now();
  if (sess.status === 'pending' && left <= 0) { T.expire().catch(() => {}); sess.status = 'expired'; }
  const s = sess.status;
  if (s === 'pending') { startTimer(); if (viewKey !== 'pending') { viewKey = 'pending'; renderPending(); } return; }
  stopTimer(s);
  if (s === 'accepted') { if (viewKey !== 'accepted') { viewKey = 'accepted'; renderAccepted(); } updateAccepted(); return; }
  viewKey = s; stopAll();
  setCard(s === 'ended' ? '' : 'alert');
  const map = {
    denied: ['ACCESS DENIED', '요청을 거절했습니다. 세션이 폐기되고 차단 상태가 요청자 화면에도 동기화되었습니다.'],
    expired: ['SESSION EXPIRED', '응답 시간이 지나 세션이 자동 폐기되었습니다. 요청자 화면에도 차단 상태로 표시됩니다.'],
    cancelled: ['REQUEST CANCELLED', '요청자가 요청을 취소했습니다.'],
    ended: ['SESSION ENDED', `원격 지원 세션이 종료되었습니다 (${sess.endedBy === 'target' ? '귀하가 종료' : '요청자가 종료'}). 화면 공유와 입력 제어 채널이 모두 닫혔습니다.`],
  };
  const [t, d] = map[s] || ['UNKNOWN', s];
  st.innerHTML = `<div class="big ${s === 'ended' ? 'mut' : 'bad'}">${t}</div><p class="sub">${d}</p><p class="sub" style="font:11px var(--mono)">이 창은 닫아도 됩니다.</p>`;
}

function renderPending() {
  setCard('');
  const sc = sess.scope;
  $('#state').innerHTML = `
    <p class="q">${sc ? '요청자가 이 컴퓨터의 원격 화면 보기 및<br>입력 제어를 요청했습니다. 수락하시겠습니까?' : '귀하의 컴퓨터에 원격 점검 및 시스템 최적화를 위해<br>접근하는 것을 수락하시겠습니까?'}</p>
    <div class="from">요청자 <b>${esc(sess.requesterName)}</b> · ${esc(sess.requesterEmail)} ${DEMO ? '<span style="color:var(--warn)">DEMO 세션</span>' : '<span style="color:var(--g1)">✔ 인증된 DARK CODE 계정</span>'}</div>
    ${sess.targetLabel ? `<div class="from">대상 <b>${esc(sess.targetLabel)}</b></div>` : ''}
    ${sess.note ? `<div class="note">&gt; ${esc(sess.note)}</div>` : ''}
    ${sc ? `
    <div class="scope-h">허용 범위 · 체크를 해제하면 그 권한 없이 수락됩니다</div>
    <ul class="tasks scope-list">
      <li><label><input type="checkbox" id="gView" ${sc.view ? 'checked' : 'disabled'}><div>원격 화면 보기 (VIEW)<small>${sc.view ? '수락 후 공유할 화면을 직접 고릅니다. 고른 화면만 요청자에게 실시간 전송됩니다 (WebRTC 암호화).' : '요청되지 않음'}</small></div></label></li>
      <li><label><input type="checkbox" id="gInput" ${sc.input ? 'checked' : 'disabled'}><div>마우스·키보드 입력 제어 (INPUT)<small>${sc.input ? '이 PC에서 DARK CODE 호스트 에이전트를 직접 실행하고 페어링 코드를 입력해야만 작동합니다. 언제든 일시정지할 수 있습니다.' : '요청되지 않음'}</small></div></label></li>
    </ul>` : ''}
    ${(sess.tasks || []).filter((t) => TASKS[t]).length ? `<ul class="tasks">${sess.tasks.filter((t) => TASKS[t]).map((t) => `<li><i>✓</i><div>${TASKS[t][0]}<small>${TASKS[t][1]}</small></div></li>`).join('')}</ul>` : ''}
    <div class="share"><b style="color:var(--g1)">수락 시 요청자에게 공유되는 정보</b><br>운영체제 · 브라우저 종류 · CPU 코어 수 · 대략적인 메모리 · 화면 해상도 · 시간대 · 언어${sc?.view ? ' · <b style="color:#eafff1">수락 후 직접 고른 화면의 실시간 영상</b>' : ''} (파일·비밀번호·쿠키는 공유되지 않음)</div>
    <div class="warn-box">⚠ 직접 요청하지 않은 지원이라면 <b>거절</b>하세요. ${sc?.input ? '마우스·키보드 제어는 이 PC에서 호스트 에이전트를 직접 실행하고 코드를 입력한 경우에만 가능하며, ' : ''}언제든 일시정지하거나 세션을 종료할 수 있습니다. DARK CODE는 비밀번호·인증번호·결제 정보를 묻지 않습니다.</div>
    <div class="btns">
      <button class="btn accept" id="btnAccept">수락 (ACCEPT)<small>${sc ? '제어 세션 열기 · ACCEPTED' : '연결 승인 · 세션 활성화'}</small></button>
      <button class="btn deny" id="btnDeny">거절 (DENY)<small>세션 폐기 · 차단</small></button>
    </div>`;
  $('#gView')?.addEventListener('change', () => { const gi = $('#gInput'); if (!gi || !sc.input) return; gi.disabled = !$('#gView').checked; if (!$('#gView').checked) gi.checked = false; });
  $('#btnAccept').onclick = () => answer('accepted');
  $('#btnDeny').onclick = () => answer('denied');
}

function renderAccepted() {
  setCard('ok');
  const g = curGranted();
  $('#state').innerHTML = `
    <div class="big ok">ACCESS GRANTED</div>
    <p class="sub">${g.view || g.input ? '제어 세션이 열렸습니다. 이 창을 열어둔 동안에만 화면·입력 채널이 유지됩니다.' : '연결 승인 완료 · 원격 지원 세션이 활성화되었습니다.'}<br>요청자 화면에도 상태가 실시간으로 동기화됩니다.</p>
    ${g.view ? `
    <div class="cs-grid">
      <div class="cs"><span>SCREEN</span><b id="cShare">-</b></div>
      <div class="cs"><span>PEER</span><b id="cPeer">-</b></div>
      <div class="cs"><span>INPUT</span><b id="cInput">-</b></div>
      <div class="cs"><span>HOST AGENT</span><b id="cAgent">-</b></div>
    </div>
    <div class="pv${DEMO ? ' demo' : ''}"><video id="pv" muted playsinline autoplay></video><i class="rptr" id="rptr"></i><div class="pv-empty" id="pvEmpty"></div></div>
    <div class="ctl-row">${DEMO ? '' : '<button class="btn-sm" id="btnShare">화면 공유 시작</button>'}${g.input ? '<button class="btn-sm warn" id="btnPause">입력 일시정지</button>' : ''}</div>
    ${g.input && !DEMO ? `
    <div class="agent-box">
      <b>호스트 에이전트 페어링 · 입력 제어용</b>
      <p>마우스·키보드 제어는 이 PC에서 <code>host_agent.py</code>를 직접 실행한 경우에만 가능합니다. 에이전트 창에 표시된 6자리 코드를 입력한 뒤, 에이전트 창에서 한 번 더 <code>y</code>로 확인하세요. 에이전트가 없으면 요청자는 화면만 볼 수 있습니다. 브라우저가 "로컬 네트워크 접근"을 물으면 허용해야 연결됩니다.</p>
      <div class="ag-row"><input id="agCode" inputmode="numeric" maxlength="6" placeholder="페어링 코드 6자리" autocomplete="off"><input id="agPort" inputmode="numeric" maxlength="5" value="47615" title="에이전트 포트"><button class="btn-sm" id="agGo">연결</button></div>
      <div class="ag-links"><a href="agent/host_agent.py" download>host_agent.py 받기</a> · <a href="https://github.com/jake12733/darkcode-ai/blob/main/agent/README.md" target="_blank" rel="noopener noreferrer">설치 안내 ↗</a></div>
    </div>` : ''}
    <div class="evlog" id="evLog"><div class="mut">요청자가 보내는 입력 이벤트가 여기에 모두 표시됩니다.</div></div>` : ''}
    <div class="log" id="log"></div>
    <button class="btn-end" id="btnEnd">세션 종료 (END SESSION)</button>`;
  $('#btnShare')?.addEventListener('click', async () => { const s = await pickScreen(); if (s) startShare(s); });
  $('#btnPause')?.addEventListener('click', () => {
    paused = !paused;
    if (DEMO) T.scope(!paused); else host.send({ t: 'scope', input: !paused, by: 'target' });
    evLine(paused ? '입력 제어 일시정지 · 모든 입력 차단' : '입력 제어 재개', paused ? 'warn' : '');
    updateAccepted();
  });
  $('#agCode')?.addEventListener('keydown', (e) => { if (e.key === 'Enter') agent.connect(); });
  $('#btnEnd').onclick = async () => {
    $('#btnEnd').disabled = true;
    try { await T.end(); stopAll(); } catch (e) { alert('종료 실패: ' + e.message); $('#btnEnd').disabled = false; }
  };
}

function updateAccepted() {
  if (viewKey !== 'accepted') return;
  const g = curGranted();
  const lg = $('#log');
  if (lg) {
    const log = (sess.log || []).slice(-40);
    lg.innerHTML = log.length ? log.map((l) => `<div><span style="color:var(--mut2)">${hms(l.t)}</span> ${esc(l.msg)}</div>`).join('') : '<div>요청자의 안내 메시지를 기다리는 중…</div>';
    lg.scrollTop = lg.scrollHeight;
  }
  if (!g.view) return;
  const setB = (id, txt, cls = '') => { const el = $(id); if (el) { el.textContent = txt; el.className = cls; } };
  if (DEMO) {
    setB('#cShare', 'SIM HOST', 'on');
    setB('#cPeer', demoHost === 'connected' ? 'CONNECTED' : demoHost === 'lost' ? 'LOST' : 'NEGOTIATING', demoHost === 'connected' ? 'on' : 'wait');
    setB('#cAgent', 'SIM-AGENT', 'on');
    $('#pvEmpty').textContent = 'DEMO 모드 · 화면은 콘솔의 시뮬레이터 호스트가 송출합니다. 요청자가 보내는 입력은 아래에 그대로 표시됩니다.';
  } else {
    setB('#cShare', share.stream ? `${share.surface === 'monitor' ? '전체 화면' : share.surface === 'window' ? '창' : share.surface === 'browser' ? '탭' : share.surface} 공유 중` : shareErr ? '선택 안 됨' : '대기', share.stream ? 'on' : 'wait');
    const cs = host.pc?.connectionState || (share.stream ? 'new' : '-');
    setB('#cPeer', cs.toUpperCase(), cs === 'connected' ? 'on' : cs === 'failed' || cs === 'closed' ? 'off' : 'wait');
    const AG = { none: ['미연결', 'off'], connecting: ['연결 중', 'wait'], pending: ['에이전트 창 확인 대기', 'wait'], ready: ['READY', 'on'], denied: ['거부됨', 'off'], error: ['오류', 'off'] };
    const [at, ac] = g.input ? AG[agent.state] || [agent.state, 'wait'] : ['불필요 (VIEW ONLY)', ''];
    setB('#cAgent', at, ac);
    $('#pvEmpty').textContent = share.stream ? '' : (shareErr ? shareErr + ' · ' : '') + '공유 중인 화면이 없습니다. [화면 공유 시작]을 눌러 요청자에게 보여줄 화면을 고르세요.';
    const v = $('#pv'); if (v && v.srcObject !== share.stream) { v.srcObject = share.stream; if (share.stream) v.play().catch(() => {}); }
    const bs = $('#btnShare'); if (bs) bs.textContent = share.stream ? '공유 화면 다시 선택' : '화면 공유 시작';
    const ab = $('#agGo'); if (ab) { ab.textContent = agent.state === 'ready' ? '연결 해제' : '연결'; ab.onclick = agent.state === 'ready' || agent.state === 'pending' ? () => { agent.close(); agent.set('none', '사용자가 해제'); } : () => agent.connect(); }
    if (agent.reason && ['denied', 'error'].includes(agent.state)) setB('#cAgent', `${AG[agent.state][0]} · ${agent.reason}`, 'off');
  }
  let it, ic;
  if (!g.input) [it, ic] = ['미허용', ''];
  else if (paused) [it, ic] = ['일시정지', 'wait'];
  else if (!DEMO && share.stream && share.surface !== 'monitor') [it, ic] = ['전체 화면 공유 필요', 'off'];
  else if (!DEMO && agent.state !== 'ready') [it, ic] = ['에이전트 필요', 'wait'];
  else [it, ic] = ['ON', 'on'];
  setB('#cInput', it, ic);
  const bp = $('#btnPause'); if (bp) bp.textContent = paused ? '입력 제어 재개' : '입력 일시정지';
}

/* ---------------- accept / deny ---------------- */
function pickScreen() {
  if (!navigator.mediaDevices?.getDisplayMedia) { shareErr = '이 브라우저는 화면 공유를 지원하지 않습니다'; updateAccepted(); return Promise.resolve(null); }
  return navigator.mediaDevices.getDisplayMedia({ video: { displaySurface: 'monitor', frameRate: { ideal: 30, max: 60 } }, audio: false, selfBrowserSurface: 'exclude', surfaceSwitching: 'exclude', monitorTypeSurfaces: 'include' })
    .catch((e) => { shareErr = e.name === 'NotAllowedError' ? '화면 선택이 취소되었습니다' : e.message; updateAccepted(); return null; });
}
async function answer(status) {
  if (responding) return; responding = true;
  $$('.btn').forEach((b) => (b.disabled = true));
  const sc = sess.scope;
  const want = sc ? { view: !!$('#gView')?.checked, input: !!$('#gView')?.checked && !!$('#gInput')?.checked } : null;
  const shareP = status === 'accepted' && want?.view && !DEMO ? pickScreen() : null; // called inside the click gesture
  try { await T.respond(status, status === 'accepted' ? { ...envInfo(), ...(want ? { granted: want } : {}) } : null); }
  catch (e) {
    responding = false; $$('.btn').forEach((b) => (b.disabled = false)); shareP?.then((s) => s?.getTracks().forEach((t) => t.stop()));
    alert('응답 실패: ' + (e.code === 'permission-denied' ? '이미 처리되었거나 만료된 요청입니다' : e.message)); return;
  }
  if (status === 'accepted') { granted = want || { view: false, input: false }; if (shareP) { const s = await shareP; if (s) startShare(s); } }
}

/* ---------------- screen share + WebRTC host peer ---------------- */
function startShare(s) {
  if (!['accepted'].includes(sess?.status) && viewKey !== 'accepted' && !granted) { s.getTracks().forEach((t) => t.stop()); return; }
  share.stream?.getTracks().forEach((t) => t.stop());
  const tr = s.getVideoTracks()[0]; const st = tr.getSettings();
  Object.assign(share, { stream: s, surface: st.displaySurface || 'unknown', w: st.width || 0, h: st.height || 0 }); shareErr = '';
  tr.onended = () => { if (share.stream !== s) return; share.stream = null; host.send({ t: 'share', state: 'stopped' }); host.close(); evLine('화면 공유가 중지되었습니다', 'warn'); updateAccepted(); };
  evLine(`화면 공유 시작 · ${share.surface} ${share.w}×${share.h}${share.surface !== 'monitor' && curGranted().input ? ' (입력 제어는 전체 화면 공유일 때만 작동)' : ''}`);
  if (!sigUnsub) sigUnsub = T.watchSignals((id, d) => host.onSignal(id, d).catch((e) => console.warn(e)), (e) => console.warn('signal', e));
  host.start(s).catch((e) => { evLine('연결 시작 실패: ' + e.message, 'bad'); });
  updateAccepted();
}
const host = {
  pc: null, dc: null, sender: null, g: 0, q: [], lastAnsT: null,
  async start(s) {
    this.close(); const g = (this.g = Date.now()); this.q = []; this.lastAnsT = null;
    const pc = (this.pc = new RTCPeerConnection({ iceServers: ICE }));
    try { s.getVideoTracks()[0].contentHint = 'detail'; } catch {}
    this.sender = pc.addTrack(s.getVideoTracks()[0], s);
    const dc = (this.dc = pc.createDataChannel('dc', { ordered: true }));
    dc.onopen = () => { this.hello(); updateAccepted(); };
    dc.onclose = () => updateAccepted();
    dc.onmessage = (m) => { try { onCtl(JSON.parse(m.data)); } catch {} };
    pc.onicecandidate = (e) => { if (e.candidate && this.g === g) T.put(`tice_${pad(g % 1e6)}_${rid()}`, { c: e.candidate.toJSON(), g, t: Date.now() }).catch(() => {}); };
    pc.onconnectionstatechange = () => updateAccepted();
    const o = await pc.createOffer(); await pc.setLocalDescription(o);
    await T.put('offer', { type: 'offer', sdp: o.sdp, g, t: Date.now() });
  },
  async onSignal(id, d) {
    if (!this.pc || d.g !== this.g) return;
    if (id === 'answer') {
      if (this.pc.signalingState === 'have-local-offer') { this.lastAnsT = d.t; await this.pc.setRemoteDescription({ type: 'answer', sdp: d.sdp }); for (const c of this.q.splice(0)) await this.pc.addIceCandidate(c).catch(() => {}); }
      else if (this.pc.signalingState === 'stable' && d.t !== this.lastAnsT && share.stream) this.start(share.stream); // console reloaded → renegotiate
    } else if (id.startsWith('rice_')) { if (!this.pc.remoteDescription) this.q.push(d.c); else this.pc.addIceCandidate(d.c).catch(() => {}); }
  },
  hello() { this.send({ t: 'hello', impl: 'consent.html', surface: share.surface, w: share.w, h: share.h, agent: agent.state, input: !!curGranted().input && !paused, os: agent.os || envInfo().platform }); },
  send(o) { if (this.dc?.readyState === 'open') this.dc.send(JSON.stringify(o)); },
  close() { try { this.dc?.close(); } catch {} try { this.pc?.close(); } catch {} this.pc = null; this.dc = null; this.sender = null; },
};

/* ---------------- control channel (from console) ---------------- */
let evN = 0; const lastNack = {};
function onCtl(m) {
  if (m.t === 'ping') return host.send({ t: 'pong', ts: m.ts });
  if (m.t === 'quality') { if (host.sender) applyQuality(host.sender, m.preset).then((r) => host.send({ t: 'quality', preset: m.preset, applied: r })).catch((e) => host.send({ t: 'quality', preset: m.preset, error: e.message })); return; }
  if (m.t === 'bye') { evLine('요청자가 연결을 해제했습니다', 'warn'); return; }
  if (!INPUT_T.has(m.t)) return;
  const g = curGranted(); let res;
  if (!g.input) res = { t: 'nack', reason: 'scope' };
  else if (paused) res = { t: 'nack', reason: 'paused' };
  else if (share.surface !== 'monitor') res = { t: 'nack', reason: 'surface' };
  else if (agent.state !== 'ready') res = { t: 'nack', reason: 'agent' };
  else { agent.send(m); evN++; res = { t: 'ack', n: evN, via: 'host-agent' }; }
  res.ev = m.t;
  if (res.t === 'nack') { if (m.t !== 'mm' || Date.now() - (lastNack[res.reason] || 0) > 1000) { lastNack[res.reason] = Date.now(); host.send(res); } }
  else if (m.t !== 'mm' || evN % 10 === 0) host.send(res);
  showRemoteInput(m, res);
}
let moveAgg = 0, rpT = 0;
const RS = { scope: '미허용', paused: '일시정지', agent: '에이전트 미연결', surface: '전체 화면 아님' };
function showRemoteInput(m, res) {
  const rp = $('#rptr');
  if (rp && m.x != null) { rp.style.left = m.x * 100 + '%'; rp.style.top = m.y * 100 + '%'; rp.classList.add('show'); rp.classList.toggle('blocked', res.t !== 'ack'); clearTimeout(rpT); rpT = setTimeout(() => rp.classList.remove('show'), 2500); }
  if (m.t === 'mm') { moveAgg++; return; }
  if (m.t === 'mu' || m.t === 'ku') return;
  const where = m.x != null ? ` (${Math.round(m.x * 100)}%, ${Math.round(m.y * 100)}%)` : '';
  const what = m.t === 'md' ? `CLICK ${['L', 'M', 'R'][m.b] || m.b}${where}` : m.t === 'wh' ? `WHEEL ${m.dy > 0 ? '▼' : '▲'}${where}` : `KEY ${m.key === ' ' ? 'Space' : m.key}`;
  evLine(`${what} → ${res.t === 'ack' ? (DEMO ? '시뮬레이터에 주입' : '에이전트로 주입') : '차단 · ' + (RS[res.reason] || res.reason)}`, res.t === 'ack' ? '' : 'warn');
}
setInterval(() => { if (moveAgg) { evLine(`MOVE ×${moveAgg}`, 'mut'); moveAgg = 0; } }, 1500);
function evLine(txt, cls = '') {
  const el = $('#evLog'); if (!el) return;
  if (el.firstElementChild?.classList.contains('mut') && el.children.length === 1 && el.firstElementChild.textContent.includes('여기에')) el.innerHTML = '';
  const d = document.createElement('div'); if (cls) d.className = cls; d.textContent = `${hms()} ${txt}`; el.appendChild(d);
  while (el.children.length > 120) el.firstChild.remove(); el.scrollTop = el.scrollHeight;
}

/* ---------------- host agent bridge (loopback WebSocket) ---------------- */
const agent = {
  ws: null, state: 'none', token: null, os: null, screen: null, reason: '',
  connect() {
    const code = ($('#agCode')?.value || '').replace(/\D/g, ''); const port = +($('#agPort')?.value || 47615);
    if (code.length !== 6) { alert('에이전트 창에 표시된 6자리 페어링 코드를 입력하세요'); return; }
    if (!(port >= 1024 && port <= 65535)) { alert('포트 번호를 확인하세요 (기본 47615)'); return; }
    this.close(); this.set('connecting');
    let ws; try { ws = this.ws = new WebSocket(`ws://127.0.0.1:${port}`); } catch (e) { this.set('error', e.message); return; }
    ws.onopen = () => ws.send(JSON.stringify({ t: 'hello', v: 1, sid, code, requester: sess?.requesterEmail || '', granted: curGranted() }));
    ws.onmessage = (e) => {
      let m; try { m = JSON.parse(e.data); } catch { return; }
      if (m.t === 'pending') { this.set('pending'); evLine('에이전트 창에서 y를 입력해 제어를 허용하세요'); }
      else if (m.t === 'ready') { this.token = m.token; this.os = m.os; this.screen = m.screen; const c = $('#agCode'); if (c) c.value = ''; this.set('ready'); evLine(`호스트 에이전트 READY · ${m.os || ''} ${m.screen ? m.screen.w + '×' + m.screen.h : ''}`); }
      else if (m.t === 'denied') this.set('denied', m.reason === 'code' ? '페어링 코드 불일치' : m.reason === 'local' ? '에이전트 창에서 거부' : m.reason);
      else if (m.t === 'error') this.set('error', { busy: '다른 세션 사용 중', locked: '코드 오류로 잠시 잠김', token: '토큰 불일치', failsafe: 'FAILSAFE 발동' }[m.reason] || m.reason);
    };
    ws.onerror = () => { if (this.ws === ws && this.state === 'connecting') this.set('error', '에이전트에 연결할 수 없음 (실행 여부·포트·로컬 네트워크 접근 허용 확인)'); };
    ws.onclose = () => { if (this.ws !== ws) return; this.ws = null; this.token = null; if (['ready', 'pending', 'connecting'].includes(this.state)) this.set('none', '연결 종료'); };
  },
  set(st, reason = '') { this.state = st; this.reason = reason; host.send({ t: 'agent', state: st, reason, os: this.os, screen: this.screen }); updateAccepted(); },
  send(m) { if (this.state === 'ready' && this.ws?.readyState === 1) this.ws.send(JSON.stringify({ ...m, tok: this.token })); },
  close() { const w = this.ws; this.ws = null; try { if (w?.readyState === 1) w.send(JSON.stringify({ t: 'bye', tok: this.token })); } catch {} try { w?.close(); } catch {} this.token = null; },
};

function stopAll() {
  agent.close(); if (agent.state !== 'none') agent.state = 'none';
  host.close(); share.stream?.getTracks().forEach((t) => t.stop()); share.stream = null;
  try { sigUnsub?.then?.((u) => u?.()); } catch {} sigUnsub = null;
}

/* ---------------- timer ---------------- */
function startTimer() {
  if (tick) return;
  const exp = tm(sess.expiresAt) || Date.now();
  const created = tm(sess.createdAt) || Date.now();
  total = Math.max(1000, exp - created);
  const step = () => {
    const left = exp - Date.now();
    $('#timer').textContent = timerText(left);
    $('#timer').classList.toggle('low', left < 30000);
    $('#tbar').style.width = `${Math.max(0, Math.min(100, (left / total) * 100))}%`;
    if (left <= 0 && sess.status === 'pending') { stopTimer('expired'); T.expire().catch(() => {}); sess.status = 'expired'; render(); }
  };
  step(); tick = setInterval(step, 1000);
}
function stopTimer(status) { clearInterval(tick); tick = null; $('#timer').textContent = status === 'accepted' ? 'ACTIVE' : '00:00'; $('#timer').classList.remove('low'); $('#tbar').style.width = status === 'accepted' ? '100%' : '0%'; }

window.addEventListener('beforeunload', () => { host.send({ t: 'share', state: 'stopped' }); agent.close(); });

(async () => {
  if (!sid || sid.length < 24) { sess = null; render(); return; }
  try {
    await T.watch((s) => { sess = s; render(); }, (e) => { sess = null; render(); console.warn(e); });
  } catch (e) { sess = null; render(); }
})();
