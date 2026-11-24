/*
 * DARK CODE · LOCAL 6-AGENT 연결 모듈
 * 상단 LOCAL6 버튼 + 원클릭 Ollama 연결 창 + 자동 감지.
 * window.DCLocal6 = { check, open, waitConnected, host, maxRevisions }
 */
(function () {
  'use strict';

  var LS_HOST = 'dc-l6-host';
  var LS_MAXREV = 'dc-l6-maxrev';
  var LS_CONNECTOR = 'dc-l6-connector';
  var LS_USED = 'dc-l6-used';
  var MODELS = ['ai-router', 'ai-music', 'ai-dev', 'ai-media', 'ai-qa', 'ai-critic'];
  var SITE_BASE = 'https://jake12733.github.io/darkcode-ai/';
  var CMD_WIN = 'powershell -ExecutionPolicy Bypass -c "irm ' + SITE_BASE + 'connect/win.txt|iex"';
  var CMD_UNIX = 'curl -fsSL ' + SITE_BASE + 'connect/unix.sh | sh';

  var last = { ok: false, state: 'unknown', missing: [] };
  var pollTimer = null;
  var waiters = [];

  function $(id) { return document.getElementById(id); }
  function host() { return (localStorage.getItem(LS_HOST) || 'http://localhost:11434').replace(/\/+$/, ''); }
  function maxRevisions() { var n = parseInt(localStorage.getItem(LS_MAXREV) || '2', 10); return Math.max(1, Math.min(3, n || 2)); }

  function detectOS() {
    var p = ((navigator.userAgentData && navigator.userAgentData.platform) || navigator.platform || navigator.userAgent || '').toLowerCase();
    if (p.indexOf('win') !== -1) return 'win';
    if (p.indexOf('mac') !== -1 || p.indexOf('iphone') !== -1 || p.indexOf('ipad') !== -1) return 'mac';
    if (p.indexOf('android') !== -1) return 'mobile';
    if (p.indexOf('linux') !== -1 || p.indexOf('x11') !== -1 || p.indexOf('cros') !== -1) return 'linux';
    return 'win';
  }
  var OS = detectOS();

  function withTimeout(ms) {
    var ctl = new AbortController();
    var t = setTimeout(function () { ctl.abort(); }, ms);
    return { signal: ctl.signal, done: function () { clearTimeout(t); } };
  }

  /* ---------- 상태 확인 ---------- */
  function check() {
    var h = host();
    var to = withTimeout(5000);
    return fetch(h + '/api/tags', { signal: to.signal, cache: 'no-store' }).then(function (res) {
      to.done();
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return res.json();
    }).then(function (data) {
      var names = (data.models || []).map(function (m) { return String(m.name).replace(/:latest$/, ''); });
      var missing = MODELS.filter(function (m) { return names.indexOf(m) === -1; });
      return setState(missing.length ? { ok: false, state: 'models', missing: missing, names: names } : { ok: true, state: 'ok', missing: [], names: names });
    }).catch(function (err) {
      to.done();
      if (err && err.name === 'AbortError') return setState({ ok: false, state: 'permission', missing: [] });
      var p = withTimeout(4000);
      return fetch(h + '/api/version', { mode: 'no-cors', cache: 'no-store', signal: p.signal }).then(function () {
        p.done(); return setState({ ok: false, state: 'blocked', missing: [] });
      }, function () {
        p.done(); return setState({ ok: false, state: 'off', missing: [] });
      });
    });
  }

  var LABEL = { ok: '연결됨', models: '모델 부족', permission: '브라우저 허용 대기', blocked: '접속 허용 필요', off: '연결 안 됨', unknown: '확인 전' };

  function setState(s) {
    s.label = LABEL[s.state] || s.state;
    last = s;
    renderPill();
    renderDialog();
    if (s.ok) {
      stopPolling();
      var w = waiters.splice(0);
      w.forEach(function (fn) { fn(); });
    }
    return s;
  }

  /* ---------- 상단 버튼 ---------- */
  function ensurePill() {
    if ($('l6Pill')) return;
    var right = document.querySelector('.top-right');
    if (!right) return;
    var b = document.createElement('button');
    b.type = 'button';
    b.id = 'l6Pill';
    b.className = 'pill l6-pill';
    b.title = '로컬 6-에이전트 (Ollama) 연결';
    b.innerHTML = '<i></i><span>LOCAL6</span>';
    b.addEventListener('click', function () { open(); });
    right.insertBefore(b, right.firstChild);
  }

  function renderPill() {
    ensurePill();
    var b = $('l6Pill');
    if (!b) return;
    b.classList.remove('ok', 'bad', 'wait');
    b.classList.add(last.ok ? 'ok' : (last.state === 'unknown' ? '' : (last.state === 'permission' ? 'wait' : 'bad')) || 'idle');
    b.querySelector('span').textContent = last.ok ? 'LOCAL6 · 6/6' : 'LOCAL6 · ' + (last.state === 'unknown' ? '연결' : last.label);
  }

  /* ---------- 연결 창 ---------- */
  function ensureDialog() {
    if ($('l6dlg')) return;
    var d = document.createElement('dialog');
    d.id = 'l6dlg';
    d.className = 'settings dc-modal l6-dlg';
    d.innerHTML =
      '<div class="set-inner">' +
      '<div class="set-head"><b>&gt; LOCAL 6-AGENT · OLLAMA LINK</b><button class="icon-btn" id="l6Close" type="button">&#10005;</button></div>' +
      '<div class="set-body">' +
      '<div class="l6-status"><span class="l6-dot" id="l6Dot"></span><b id="l6Title">확인 중</b><em id="l6Live">자동 감지 중</em></div>' +
      '<p class="modal-note" id="l6Reason"></p>' +
      '<div class="l6-actions">' +
      '<button class="btn-neon sm" id="l6Start" type="button" hidden>Ollama 켜기</button>' +
      '<button class="btn-neon sm" id="l6Connect" type="button">원클릭 연결 (Windows)</button>' +
      '<button class="btn-neon sm" id="l6Copy" type="button" hidden>연결 명령어 복사</button>' +
      '<button class="btn-ghost sm" id="l6Recheck" type="button">다시 확인</button>' +
      '</div>' +
      '<div class="l6-ask" id="l6Ask" hidden><b>이 PC에서 Ollama를 찾지 못했어요</b>' +
      '<p>Ollama를 다운로드해서 자동으로 설치할까요? 설치 파일 약 2GB(Mac은 약 230MB), 설치 후 AI 모델(약 5GB)을 한 번 더 받습니다. 이미 설치돼 있다면 설치는 건너뛰고 켜서 연결만 합니다.</p>' +
      '<div class="l6-ask-btns"><button class="btn-neon sm" id="l6AskYes" type="button">예, 설치할게요</button><button class="btn-ghost sm" id="l6AskNo" type="button">아니요</button></div></div>' +
      '<p class="l6-sub" id="l6Sub"></p>' +
      '<details class="l6-more" id="l6More"><summary>파일 실행이 막히면 · 다른 방법</summary>' +
      '<p id="l6AltText"></p><div class="l6-cmd"><code id="l6Cmd"></code><button class="btn-sm" id="l6CmdCopy" type="button">복사</button></div><p class="l6-note" id="l6Note"></p></details>' +
      '<div class="l6-models" id="l6Models"></div>' +
      '<div class="l6-opts"><label>검수 후 수정 최대 <select id="l6MaxRev"><option value="1">1회</option><option value="2">2회</option><option value="3">3회</option></select></label>' +
      '<label>Ollama 주소 <input id="l6Host" type="text" spellcheck="false"></label></div>' +
      '<p class="l6-flow">ai-router(분야 배정) → ai-music / ai-dev / ai-media / ai-qa(초안) → ai-critic(PASS·REVISE) → 반려 시 자동 수정 · 모델은 한 번에 하나씩만 메모리에 올립니다 · 토큰 비용 0</p>' +
      '</div></div>';
    document.body.appendChild(d);

    $('l6Close').addEventListener('click', function () { d.close(); });
    d.addEventListener('close', function () { if (!waiters.length) stopPolling(); });
    $('l6Recheck').addEventListener('click', function () { $('l6Live').textContent = '확인 중...'; check(); });
    $('l6Start').addEventListener('click', function () {
      $('l6Live').textContent = '켜는 중...';
      window.location.href = 'darkcode-ollama://start';
      startPolling();
    });
    $('l6Connect').addEventListener('click', connectFlow);
    $('l6Copy').addEventListener('click', connectFlow);
    $('l6AskYes').addEventListener('click', function () { $('l6Ask').hidden = true; runConnector('install'); });
    $('l6AskNo').addEventListener('click', function () { $('l6Ask').hidden = true; $('l6Sub').textContent = '설치를 취소했어요. 필요할 때 [원클릭 연결]을 다시 눌러 주세요.'; });
    $('l6CmdCopy').addEventListener('click', function () { navigator.clipboard.writeText($('l6Cmd').textContent).then(function () { $('l6CmdCopy').textContent = '복사됨'; setTimeout(function () { $('l6CmdCopy').textContent = '복사'; }, 1200); }); });
    var mr = $('l6MaxRev'); mr.value = String(maxRevisions());
    mr.addEventListener('change', function () { localStorage.setItem(LS_MAXREV, mr.value); });
    var hi = $('l6Host'); hi.value = host();
    hi.addEventListener('change', function () { localStorage.setItem(LS_HOST, hi.value.trim() || 'http://localhost:11434'); check(); });

    if (OS === 'win') {
      $('l6Cmd').textContent = CMD_WIN;
      $('l6AltText').innerHTML = '키보드 <b>Win + R</b> → 아래 명령어 붙여넣기(<b>Ctrl + V</b>) → <b>Enter</b>';
      $('l6Note').innerHTML = '"Windows의 PC 보호" 창이 뜨면 <b>추가 정보 → 실행</b>. 브라우저가 "로컬 네트워크 기기 접근"을 물으면 <b>허용</b>.';
    } else if (OS === 'mobile') {
      $('l6Connect').hidden = true; $('l6More').hidden = true;
    } else {
      $('l6Connect').hidden = true; $('l6Copy').hidden = false;
      $('l6Copy').textContent = '연결 명령어 복사 (' + (OS === 'mac' ? 'Mac' : 'Linux') + ')';
      $('l6Cmd').textContent = CMD_UNIX;
      $('l6AltText').innerHTML = '터미널에 아래 명령어를 붙여넣고 <b>Enter</b>';
      $('l6Note').innerHTML = 'Linux는 sudo 비밀번호를 물을 수 있어요. 브라우저가 "로컬 네트워크 기기 접근"을 물으면 <b>허용</b>.';
    }
  }

  function renderDialog() {
    if (!$('l6dlg')) return;
    var s = last;
    var installed = localStorage.getItem(LS_CONNECTOR) === '1';
    var dot = $('l6Dot');
    dot.className = 'l6-dot ' + (s.ok ? 'ok' : s.state === 'permission' ? 'wait' : 'bad');
    $('l6Title').textContent = s.ok ? 'Ollama 연결됨 · 모델 6/6' : ({
      off: installed ? 'Ollama가 꺼져 있어요' : 'Ollama 연결이 필요해요',
      blocked: 'Ollama는 켜져 있어요. 접속 허용만 하면 돼요',
      permission: '브라우저에서 [허용]만 눌러 주세요',
      models: 'DARK CODE 모델 준비가 필요해요',
      unknown: '확인 중'
    })[s.state];
    var reason = {
      ok: '로컬 6-에이전트 모드로 바로 실행됩니다. 모든 연산은 내 PC의 Ollama에서 처리돼요.',
      off: installed ? '[Ollama 켜기]를 누르면 바로 켜집니다. (처음 한 번 브라우저가 앱 열기를 물으면 허용)' : 'Ollama가 꺼져 있거나 아직 이 사이트와 연결 설정이 안 됐어요. 아래 버튼 하나로 설치 확인부터 연결까지 자동으로 처리됩니다.',
      blocked: '보안 설정 때문에 이 사이트가 Ollama를 부르지 못하고 있어요. 원클릭 연결을 한 번 실행하면 허용 설정과 재시작이 자동으로 됩니다.',
      permission: '브라우저가 이 사이트의 <b>로컬 네트워크 기기 접근</b>을 허용할지 묻고 있어요. 주소창 아래 창에서 <b>허용</b>을 누르면 바로 연결돼요. 창이 안 보이면 주소창 왼쪽 아이콘 → 사이트 설정 → 로컬 네트워크 액세스 → 허용.',
      models: 'Ollama에는 연결됐지만 전용 모델 일부가 없어요. 원클릭 연결을 실행하면 없는 모델만 자동으로 만듭니다.',
      unknown: '연결 상태를 확인하고 있어요.'
    }[s.state];
    $('l6Reason').innerHTML = reason;
    var showActions = !s.ok;
    $('l6Start').hidden = !(s.state === 'off' && installed && OS === 'win');
    if (OS === 'win') $('l6Connect').hidden = !showActions;
    else if (OS !== 'mobile') $('l6Copy').hidden = !showActions;
    $('l6More').hidden = !showActions || OS === 'mobile';
    if (!s.ok && (pollTimer || ($('l6Ask') && !$('l6Ask').hidden))) { /* 진행 중 안내 유지 */ } else
    $('l6Sub').textContent = s.ok ? '' : OS === 'mobile' ? 'Ollama는 PC에서 실행됩니다. Ollama가 설치된 PC 브라우저에서 열어 주세요.'
      : OS === 'win' ? '받은 파일을 더블클릭하면 설치 확인, 접속 허용, 재시작, 모델 준비까지 자동으로 끝나고 이 창이 저절로 바뀝니다.'
      : '터미널을 열고 붙여넣기 → Enter. 연결되면 이 창이 저절로 바뀝니다.';
    $('l6Live').textContent = s.ok ? '연결됨' : (pollTimer ? '자동 감지 중' : '대기');
    var names = s.names || [];
    $('l6Models').innerHTML = MODELS.map(function (m) {
      var have = s.ok || (s.state === 'models' && names.indexOf(m) !== -1);
      var known = s.ok || s.state === 'models';
      return '<span class="l6-chip ' + (known ? (have ? 'ok' : 'miss') : '') + '">' + m + '</span>';
    }).join('');
  }

  /* ---------- 원클릭 연결 흐름 ---------- */
  function setLive(t) { if ($('l6Live')) $('l6Live').textContent = t; }
  function setSub(t) { if ($('l6Sub')) $('l6Sub').textContent = t; }

  function downloadConnector() {
    var a = document.createElement('a');
    a.href = 'connect/DARKCODE-Ollama-Connect.bat';
    a.download = 'DARKCODE-Ollama-Connect.bat';
    document.body.appendChild(a); a.click(); a.remove();
  }

  // why: 'install' (Ollama 없음 → 설치 포함) | 'setup' (설치돼 있음 → 허용 설정·모델만)
  function runConnector(why) {
    if (OS === 'win') {
      downloadConnector();
      setSub(why === 'install'
        ? '연결 파일을 받았어요. 실행하면 Ollama 설치 → 접속 허용 → 모델 준비까지 자동으로 진행되고, 끝나면 이 창이 저절로 "연결됨"으로 바뀝니다. (브라우저가 파일 보관을 물으면 [유지], "Windows의 PC 보호"가 뜨면 [추가 정보 → 실행])'
        : 'Ollama가 설치돼 있어요. 받은 파일을 실행하면 설치는 건너뛰고 접속 허용·모델 준비만 자동으로 진행됩니다.');
    } else if (OS !== 'mobile') {
      navigator.clipboard.writeText(CMD_UNIX).catch(function () {});
      setSub((why === 'install' ? '명령어를 복사했어요. 터미널에 붙여넣고 Enter → Ollama 설치부터 연결까지 자동 진행됩니다.' : '명령어를 복사했어요. 터미널에 붙여넣고 Enter → 접속 허용·모델 준비만 진행됩니다.'));
    }
    setLive('실행 기다리는 중');
    startPolling();
  }

  function tryStartInstalled() {
    // 이전에 원클릭 연결을 실행한 PC면 darkcode-ollama:// 로 Ollama를 켜 본다 (최대 10초)
    return new Promise(function (resolve) {
      window.location.href = 'darkcode-ollama://start';
      var n = 0;
      var t = setInterval(function () {
        n++;
        check().then(function (s) {
          if (s.ok || s.state === 'models' || s.state === 'blocked') { clearInterval(t); resolve(s); }
          else if (n >= 5) { clearInterval(t); resolve(s); }
        });
      }, 2000);
    });
  }

  function connectFlow() {
    if ($('l6Ask')) $('l6Ask').hidden = true;
    setLive('확인 중...');
    setSub('이 PC의 Ollama를 확인하고 있어요...');
    check().then(function (s) {
      if (s.ok) return done();
      if (s.state === 'blocked' || s.state === 'models') return runConnector('setup');
      if (s.state === 'permission') { setLive('브라우저 허용 대기'); setSub('주소창 아래 "로컬 네트워크 기기 접근" 창에서 [허용]을 눌러 주세요.'); startPolling(); return; }
      // off: 꺼져 있거나 설치 안 됨
      var installed = localStorage.getItem(LS_CONNECTOR) === '1';
      if (installed && OS === 'win') {
        setLive('Ollama 켜는 중...');
        setSub('설치된 Ollama를 켜고 있어요. (브라우저가 앱 열기를 물으면 [열기])');
        return tryStartInstalled().then(function (s2) {
          if (s2.ok) return done();
          if (s2.state === 'blocked' || s2.state === 'models') return runConnector('setup');
          askInstall();
        });
      }
      askInstall();
    });
    function done() {
      setLive('연결됨');
      setSub('이미 연결돼 있어요. 바로 시작합니다.');
      setTimeout(function () { var d = $('l6dlg'); if (d && d.open) d.close(); }, 900);
    }
  }

  function askInstall() {
    if (OS === 'mobile') { setSub('Ollama는 PC에서 실행됩니다. Ollama가 설치된 PC 브라우저에서 열어 주세요.'); return; }
    setLive('설치 확인 필요');
    setSub('');
    $('l6Ask').hidden = false;
  }

  function startPolling() {
    if (pollTimer) return;
    pollTimer = setInterval(function () { if (!document.hidden) check(); }, 3000);
    if ($('l6Live')) $('l6Live').textContent = '자동 감지 중';
  }
  function stopPolling() { if (pollTimer) { clearInterval(pollTimer); pollTimer = null; } }

  function open() {
    localStorage.setItem(LS_USED, '1');
    ensureDialog();
    renderDialog();
    var d = $('l6dlg');
    if (!d.open) d.showModal();
    check().then(function (s) { if (!s.ok) startPolling(); });
  }

  function waitConnected(signal) {
    if (last.ok) return Promise.resolve();
    startPolling();
    return new Promise(function (resolve, reject) {
      var fn = function () { resolve(); };
      waiters.push(fn);
      if (signal) signal.addEventListener('abort', function () {
        var i = waiters.indexOf(fn); if (i !== -1) waiters.splice(i, 1);
        var e = new Error('사용자 중단'); e.kind = 'abort'; reject(e);
      });
    });
  }

  /* ---------- 시작 ---------- */
  if (/[?&]connected=1/.test(location.search)) {
    localStorage.setItem(LS_CONNECTOR, '1');
    localStorage.setItem(LS_USED, '1');
    try { history.replaceState(null, '', location.pathname); } catch (e) { /* ignore */ }
  }
  function boot() {
    ensurePill();
    renderPill();
    // 한 번이라도 로컬 모드를 쓴 브라우저에서만 자동 확인 (안 쓰는 사람에게 권한 창을 띄우지 않음)
    if (localStorage.getItem(LS_USED) === '1') check();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();

  window.DCLocal6 = { check: check, open: open, waitConnected: waitConnected, host: host, maxRevisions: maxRevisions, connect: function () { open(); connectFlow(); }, state: function () { return last; } };
})();
