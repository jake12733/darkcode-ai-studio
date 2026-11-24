/* DARK CODE STUDIO — AI 작곡(darkcode-core /dc/music · ACE-Step) + 음악 반응 영상 제작/내보내기
 * 저장: IndexedDB(dc-studio) — 트랙·영상 원본을 브라우저에 보관(게이트웨이가 꺼져도 재생/편집 가능)
 */
(function () {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const fmt = (s) => { s = Math.max(0, s || 0); return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`; };
  const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  const hash = (s) => { let h = 2166136261; for (const c of String(s)) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; };
  const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
  function toast(m) { const t = $('#toast'); t.textContent = m; t.classList.add('on'); clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove('on'), 2400); }

  /* ================= IndexedDB ================= */
  const DB = (() => {
    let dbp;
    const open = () => dbp || (dbp = new Promise((res, rej) => {
      const r = indexedDB.open('dc-studio', 1);
      r.onupgradeneeded = () => { const d = r.result; d.createObjectStore('tracks', { keyPath: 'id' }); d.createObjectStore('videos', { keyPath: 'id' }); };
      r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error);
    }));
    const tx = async (store, mode, fn) => { const d = await open(); return new Promise((res, rej) => { const t = d.transaction(store, mode); const s = t.objectStore(store); const out = fn(s); t.oncomplete = () => res(out && out.result !== undefined ? out.result : out); t.onerror = () => rej(t.error); }); };
    return {
      put: (store, v) => tx(store, 'readwrite', (s) => s.put(v)),
      del: (store, id) => tx(store, 'readwrite', (s) => s.delete(id)),
      get: (store, id) => tx(store, 'readonly', (s) => s.get(id)),
      all: async (store) => { const r = await tx(store, 'readonly', (s) => s.getAll()); return (r || []).sort((a, b) => b.created - a.created); },
    };
  })();

  /* ================= 커버 아트 (제목 해시 → 고유 그래픽) ================= */
  const PALS = [['#00FF66', '#22D3EE', '#0B1F14'], ['#A855F7', '#F472B6', '#13071F'], ['#22D3EE', '#3B82F6', '#06111F'], ['#F59E0B', '#EF4444', '#1F0A05'], ['#F472B6', '#FDE68A', '#1F0714'], ['#34D399', '#A3E635', '#07160D']];
  function drawCover(cv, seed) {
    const g = cv.getContext('2d'); const W = cv.width, H = cv.height; const h = hash(seed); const p = PALS[h % PALS.length];
    const gr = g.createLinearGradient(0, 0, W, H); gr.addColorStop(0, p[2]); gr.addColorStop(1, '#000'); g.fillStyle = gr; g.fillRect(0, 0, W, H);
    let x = h;
    const rnd = () => { x ^= x << 13; x ^= x >>> 17; x ^= x << 5; return ((x >>> 0) % 1000) / 1000; };
    g.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 6; i++) { const rg = g.createRadialGradient(rnd() * W, rnd() * H, 0, rnd() * W, rnd() * H, W * (0.3 + rnd() * 0.5)); rg.addColorStop(0, (i % 2 ? p[0] : p[1]) + '88'); rg.addColorStop(1, 'transparent'); g.fillStyle = rg; g.fillRect(0, 0, W, H); }
    g.globalCompositeOperation = 'source-over';
    g.strokeStyle = p[0] + 'aa'; g.lineWidth = Math.max(1, W / 60);
    for (let i = 0; i < 3; i++) { g.beginPath(); g.arc(W / 2, H / 2, W * (0.18 + i * 0.12 + rnd() * 0.04), rnd() * 6, rnd() * 6 + 3); g.stroke(); }
  }

  /* ================= CORE 연결 ================= */
  const core = { ok: false, url: () => (localStorage.getItem('dc-core-url') || 'http://127.0.0.1:8787').replace(/\/+$/, ''), engines: [] };
  let pollT = null;
  async function checkCore() {
    try {
      const ctl = new AbortController(); const t = setTimeout(() => ctl.abort(), 4000);
      const r = await fetch(core.url() + '/health', { signal: ctl.signal, cache: 'no-store' }); clearTimeout(t);
      const j = await r.json(); core.ok = !!j.ok; core.engines = j.engines || [];
    } catch { core.ok = false; core.engines = []; }
    const pill = $('#corePill'); const music = core.engines.find((e) => e.id === 'acestep');
    pill.className = 'st-pill ' + (core.ok ? (music?.ok ? 'ok' : 'warn') : 'bad');
    pill.querySelector('span').textContent = core.ok ? (music?.ok ? 'CORE · 음악 엔진 UP' : 'CORE 연결 · 음악 엔진 대기') : 'CORE 꺼짐';
    if (core.ok) { $('#coreBanner').hidden = true; clearInterval(pollT); pollT = null; }
    return core.ok;
  }
  function needCore(msg) {
    const b = $('#coreBanner'); b.hidden = false;
    if (msg) $('#bannerText').textContent = msg;
    if (!pollT) pollT = setInterval(checkCore, 4000);
  }
  $('#corePill').onclick = () => checkCore().then((ok) => { if (!ok) needCore(); else toast('CORE 게이트웨이 연결됨'); });
  $('#bannerClose').onclick = () => { $('#coreBanner').hidden = true; };

  async function sse(path, body, onEvent, signal) {
    const res = await fetch(core.url() + path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body), signal });
    if (!res.ok) throw new Error(`HTTP ${res.status} ${(await res.text()).slice(0, 160)}`);
    const rd = res.body.getReader(); const dec = new TextDecoder(); let buf = '';
    for (;;) {
      const { done, value } = await rd.read(); if (done) break;
      buf += dec.decode(value, { stream: true }); let i;
      while ((i = buf.indexOf('\n\n')) !== -1) {
        const blk = buf.slice(0, i); buf = buf.slice(i + 2);
        if (!blk.startsWith('event:')) continue;
        const nl = blk.indexOf('\n'); const type = blk.slice(7, nl).trim();
        try { onEvent(type, JSON.parse(blk.slice(nl + 1).replace(/^data:\s*/, ''))); } catch (e) { if (e instanceof SyntaxError) continue; throw e; }
      }
    }
  }

  /* ================= 탭 ================= */
  function setTab(t) { $$('#tabs button').forEach((b) => b.classList.toggle('on', b.dataset.tab === t)); $$('.st-view').forEach((v) => v.classList.toggle('on', v.dataset.view === t)); if (t === 'library') renderLibrary(); if (t === 'video') { fillTrackSelect(); fitStage(); } }
  $$('#tabs button').forEach((b) => (b.onclick = () => setTab(b.dataset.tab)));

  /* ================= 플레이어 ================= */
  const audio = $('#audio');
  let nowId = null; const urls = new Map();
  const urlFor = (t) => { if (!urls.has(t.id)) urls.set(t.id, URL.createObjectURL(t.blob)); return urls.get(t.id); };
  async function play(id) {
    const t = await DB.get('tracks', id); if (!t?.blob) return toast('재생할 오디오가 없습니다');
    if (nowId === id && !audio.paused) { audio.pause(); return; }
    if (nowId !== id) { audio.src = urlFor(t); nowId = id; $('#plTitle').textContent = t.title; $('#plTags').textContent = (t.song?.caption || '').slice(0, 80); drawCover($('#plCover'), t.title); }
    $('#player').hidden = false; audio.play();
  }
  $('#plToggle').onclick = () => { if (!audio.src) return; audio.paused ? audio.play() : audio.pause(); };
  $('#plSeek').oninput = (e) => { if (audio.duration) audio.currentTime = (e.target.value / 1000) * audio.duration; };
  audio.addEventListener('play', syncPlayUI); audio.addEventListener('pause', syncPlayUI);
  audio.addEventListener('timeupdate', () => {
    $('#plSeek').value = audio.duration ? (audio.currentTime / audio.duration) * 1000 : 0;
    $('#plTime').textContent = `${fmt(audio.currentTime)} / ${fmt(audio.duration)}`;
    const card = nowId && $(`.trk[data-id="${nowId}"] .trk-wave`); if (card) drawWave(card, card._peaks, audio.duration ? audio.currentTime / audio.duration : 0);
  });
  function syncPlayUI() { $('#plToggle').textContent = audio.paused ? '▶' : '❚❚'; $$('.trk').forEach((c) => { const on = c.dataset.id === nowId && !audio.paused; c.classList.toggle('playing', on); const b = $('.trk-cover button', c); if (b) b.textContent = on ? '❚❚' : '▶'; }); }

  async function peaksOf(blob, n = 140) {
    try {
      const ac = new (window.OfflineAudioContext || window.webkitOfflineAudioContext)(1, 44100, 44100);
      const buf = await ac.decodeAudioData(await blob.arrayBuffer());
      const d = buf.getChannelData(0); const step = Math.floor(d.length / n); const out = [];
      for (let i = 0; i < n; i++) { let m = 0; for (let j = i * step; j < (i + 1) * step; j += 16) m = Math.max(m, Math.abs(d[j] || 0)); out.push(m); }
      const mx = Math.max(...out, 0.01); return { peaks: out.map((v) => v / mx), duration: buf.duration };
    } catch { return { peaks: Array.from({ length: n }, (_, i) => 0.3 + 0.5 * Math.abs(Math.sin(i * 0.37))), duration: 0 }; }
  }
  function drawWave(cv, peaks, prog = 0) {
    if (!peaks) return; const dpr = devicePixelRatio || 1; const W = cv.clientWidth * dpr, H = cv.clientHeight * dpr;
    if (cv.width !== W) { cv.width = W; cv.height = H; }
    const g = cv.getContext('2d'); g.clearRect(0, 0, W, H); const bw = W / peaks.length;
    peaks.forEach((p, i) => { const h = Math.max(2 * dpr, p * H * 0.92); g.fillStyle = i / peaks.length < prog ? '#00FF66' : '#1f4a32'; g.fillRect(i * bw + 1, (H - h) / 2, Math.max(1, bw - 2), h); });
  }

  /* ================= AI 작곡 ================= */
  const CHIPS = ['비 오는 밤 로파이', '운동할 때 신나는 EDM', '새벽 코딩 신스웨이브', '카페 재즈 브금', '첫사랑 감성 발라드', '게임 보스전 오케스트라', '여름 바다 시티팝', '사이버펑크 해커 테마'];
  $('#mChips').innerHTML = CHIPS.map((c) => `<button type="button">${esc(c)}</button>`).join('');
  $$('#mChips button').forEach((b) => (b.onclick = () => { $('#mPrompt').value = b.textContent; $('#mPrompt').focus(); }));
  let vocal = 'vocal';
  $$('#mVocal button').forEach((b) => (b.onclick = () => { vocal = b.dataset.v; $$('#mVocal button').forEach((x) => x.classList.toggle('on', x === b)); }));
  $('#mLyricsToggle').onclick = () => { $('#mLyrics').hidden = !$('#mLyrics').hidden; };
  $('#mPrompt').addEventListener('keydown', (e) => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); create(); } });
  $('#mCreate').onclick = () => create();

  async function create(promptOverride) {
    const input = (promptOverride || $('#mPrompt').value).trim();
    if (!input) { $('#mPrompt').focus(); return toast('한 줄만 써 주세요. 대충 써도 됩니다'); }
    if (!(await checkCore())) { needCore('AI 작곡은 내 PC의 darkcode-core 가 처리합니다. 아래 순서대로 켜면 이 화면이 저절로 연결돼요.'); return; }
    const id = uid();
    const rec = { id, title: '작곡 설계 중…', song: { caption: input }, created: Date.now(), state: 'pending', prompt: input };
    const card = trackCard(rec); $('#trackList').prepend(card);
    $('#mCreate').disabled = true;
    const status = (h) => { const s = $('.trk-status', card); if (s) s.innerHTML = h; };
    status('<b>①</b> AI 가 제목·가사·스타일을 설계하는 중…');
    try {
      let done = null;
      await sse('/dc/music', { input, instrumental: vocal === 'inst', duration: Number($('#mDur').value), language: $('#mLang').value, lyrics: $('#mLyrics').hidden ? undefined : ($('#mLyrics').value.trim() || undefined) }, (type, d) => {
        if (type === 'compose') { rec.title = d.title; rec.song = d; $('.trk-title', card).textContent = d.title; drawCover($('.trk-cover canvas', card), d.title); $('.trk-tags', card).innerHTML = tagsHtml(d); status(`<b>②</b> 노래 생성 중 · ${d.bpm} BPM · ${esc(d.key)} · ${d.duration}초`); }
        else if (type === 'progress') status(`<b>②</b> 노래 생성 중 · ${d.phase === 'queued' ? '대기열' : '렌더링'} ${d.elapsed ? Math.round(d.elapsed / 1000) + '초' : ''}`);
        else if (type === 'done') done = d;
        else if (type === 'error') throw new Error(d.message);
      });
      if (!done) throw new Error('응답이 끝나지 않았습니다');
      if (done.track) {
        status('<b>③</b> 오디오 받는 중…');
        const a = await fetch(core.url() + done.track.url); if (!a.ok) throw new Error('오디오 다운로드 실패');
        const blob = await a.blob(); const pk = await peaksOf(blob);
        Object.assign(rec, { title: done.track.title, song: done.track.song, blob, mime: blob.type || 'audio/mpeg', peaks: pk.peaks, duration: pk.duration, state: 'ready', engine: done.track.engine, coreId: done.track.id });
      } else {
        Object.assign(rec, { song: done.song, title: done.song.title, state: 'plan', handoff: done.handoff, reason: done.reason });
      }
      await DB.put('tracks', rec);
      card.replaceWith(trackCard(rec));
      if (rec.state === 'ready') { play(rec.id); toast(`"${rec.title}" 완성!`); } else toast('작곡안 완성 · 음악 엔진이 꺼져 있어 Suno 로 넘길 수 있어요');
      updateCounts();
    } catch (e) {
      card.classList.remove('pending'); card.classList.add('nopath');
      status(`<span style="color:var(--err)">실패: ${esc(e.message)}</span>`);
    } finally { $('#mCreate').disabled = false; }
  }

  function tagsHtml(s) {
    const tags = String(s.caption || '').split(',').map((x) => x.trim()).filter(Boolean).slice(0, 6);
    return [s.bpm ? `${s.bpm} BPM` : '', s.key || '', s.instrumental ? 'INST' : '', ...tags].filter(Boolean).map((t) => `<span>${esc(t)}</span>`).join('');
  }

  function trackCard(t) {
    const el = document.createElement('article');
    el.className = 'trk' + (t.state === 'pending' ? ' pending' : t.state === 'plan' ? ' nopath' : '');
    el.dataset.id = t.id;
    el.innerHTML = `<div class="trk-cover"><canvas width="192" height="192"></canvas>${t.state === 'ready' ? '<button type="button" aria-label="재생">▶</button>' : ''}</div>
      <div class="trk-main"><h3 class="trk-title">${esc(t.title)}</h3><div class="trk-tags">${tagsHtml(t.song || {})}</div>
      ${t.state === 'ready' ? '<canvas class="trk-wave"></canvas>' : ''}
      <div class="trk-status">${t.state === 'ready' ? `${fmt(t.duration)} · ${esc(t.engine || 'ACE-Step')} · ${new Date(t.created).toLocaleString('ko-KR')}` : t.state === 'plan' ? `작곡안만 완성 — ${esc(t.reason || '음악 엔진 꺼짐')}` : ''}</div></div>
      <div class="trk-acts"></div>`;
    drawCover($('.trk-cover canvas', el), t.title);
    const acts = $('.trk-acts', el);
    const btn = (label, fn) => { const b = document.createElement('button'); b.type = 'button'; b.textContent = label; b.onclick = fn; acts.append(b); return b; };
    if (t.state === 'ready') {
      $('.trk-cover button', el).onclick = () => play(t.id);
      const wave = $('.trk-wave', el); wave._peaks = t.peaks; requestAnimationFrame(() => drawWave(wave, t.peaks, 0));
      wave.onclick = (e) => { if (nowId !== t.id) { play(t.id).then(() => seekWave(e, wave)); } else seekWave(e, wave); };
      const a = document.createElement('a'); a.textContent = '다운로드'; a.href = urlFor(t); a.download = `${t.title}.mp3`; acts.append(a);
      btn('영상 만들기', async () => { setTab('video'); await fillTrackSelect(); $('#vTrack').value = t.id; loadVideoAudio(t.id); });
    }
    if (t.song?.lyrics || t.song?.caption) btn('가사·스타일', () => { const pre = $('.trk-lyrics', el); if (pre) return pre.remove(); const p = document.createElement('pre'); p.className = 'trk-lyrics'; p.textContent = `스타일: ${t.song.caption || ''}\n\n${t.song.lyrics || '(인스트)'}`; el.append(p); });
    if (t.state === 'plan' || t.state === 'ready') btn('Suno로 보내기', async () => {
      const style = t.handoff?.style || `${t.song.caption}, ${t.song.bpm} BPM`; const lyr = t.handoff?.lyrics || t.song.lyrics || '';
      try { await navigator.clipboard.writeText(`[Style]\n${style}\n\n[Lyrics]\n${lyr}`); } catch {}
      window.open('https://suno.com/create', '_blank', 'noopener'); toast('스타일·가사를 복사했어요. Suno 커스텀 모드에 붙여넣으세요');
    });
    if (t.state !== 'pending') btn('삭제', async () => { if (nowId === t.id) { audio.pause(); nowId = null; } await DB.del('tracks', t.id); el.remove(); updateCounts(); });
    return el;
  }
  function seekWave(e, wave) { const r = wave.getBoundingClientRect(); if (audio.duration) audio.currentTime = ((e.clientX - r.left) / r.width) * audio.duration; }

  async function renderTracks() { const list = await DB.all('tracks'); $('#trackList').innerHTML = ''; list.forEach((t) => $('#trackList').append(trackCard(t))); updateCounts(); }
  async function updateCounts() { const [a, b] = await Promise.all([DB.all('tracks'), DB.all('videos')]); $('#libCount').textContent = a.length + b.length ? `(${a.length + b.length})` : ''; }

  /* ================= 영상 만들기 ================= */
  const TEMPLATES = { kinetic: '키네틱 타이포', bars: '스펙트럼 막대', particles: '비트 입자', waves: '파형 물결', grid: '네온 그리드', glitch: '글리치', photo: '내 사진' };
  const V = { scenes: [], format: '9:16', quality: 720, images: new Map(), playing: false, t: 0, audioUrl: null, trackTitle: '' };
  const stage = $('#stage'); const g = stage.getContext('2d');
  const vAudio = new Audio(); vAudio.preload = 'auto';
  let AC = null, analyser = null, srcNode = null, recDest = null; const freq = new Uint8Array(512), wave = new Uint8Array(1024);
  function ensureAudioGraph() {
    if (AC) return;
    AC = new (window.AudioContext || window.webkitAudioContext)();
    analyser = AC.createAnalyser(); analyser.fftSize = 1024; analyser.smoothingTimeConstant = 0.78;
    srcNode = AC.createMediaElementSource(vAudio); srcNode.connect(analyser); analyser.connect(AC.destination);
    recDest = AC.createMediaStreamDestination(); srcNode.connect(recDest);
  }
  function dims() { const q = V.quality; return V.format === '9:16' ? [q, Math.round(q * 16 / 9)] : V.format === '16:9' ? [Math.round(q * 16 / 9), q] : [q, q]; }
  function fitStage() { const [w, h] = dims(); if (stage.width !== w || stage.height !== h) { stage.width = w; stage.height = h; } const wrap = $('#stageWrap'); const s = Math.min((wrap.clientWidth - 24) / w, (wrap.clientHeight - 24) / h); stage.style.width = `${w * s}px`; stage.style.height = `${h * s}px`; }
  addEventListener('resize', fitStage);
  $$('#vFormat button').forEach((b) => (b.onclick = () => { V.format = b.dataset.f; $$('#vFormat button').forEach((x) => x.classList.toggle('on', x === b)); fitStage(); }));
  $('#vQuality').onchange = (e) => { V.quality = Number(e.target.value); fitStage(); };

  async function fillTrackSelect() {
    const list = (await DB.all('tracks')).filter((t) => t.blob);
    const cur = $('#vTrack').value;
    $('#vTrack').innerHTML = '<option value="">라이브러리에서 선택…</option>' + list.map((t) => `<option value="${t.id}">${esc(t.title)} · ${fmt(t.duration)}</option>`).join('');
    if (cur) $('#vTrack').value = cur;
  }
  $('#vTrack').onchange = (e) => e.target.value && loadVideoAudio(e.target.value);
  async function loadVideoAudio(id) {
    const t = await DB.get('tracks', id); if (!t?.blob) return;
    setVideoAudio(URL.createObjectURL(t.blob), t.title, t.song);
  }
  $('#vAudioFile').onchange = (e) => { const f = e.target.files[0]; if (!f) return; $('#vTrack').value = ''; setVideoAudio(URL.createObjectURL(f), f.name.replace(/\.[^.]+$/, ''), null); };
  function setVideoAudio(url, title, song) {
    if (V.audioUrl) URL.revokeObjectURL(V.audioUrl);
    V.audioUrl = url; V.trackTitle = title; V.song = song; vAudio.src = url;
    vAudio.onloadedmetadata = () => {
      $('#vAudioInfo').textContent = `${title} · ${fmt(vAudio.duration)}`;
      if (!V.scenes.length) autoScenes(true); else updateTime();
    };
  }

  const PROMPT_PAL = [[/네온|사이버|해커|코딩|밤|night|cyber/i, ['#00FF66', '#A855F7', '#22D3EE']], [/비|rain|새벽|우울|감성|lofi|로파이/i, ['#60A5FA', '#A78BFA', '#94A3B8']], [/여름|바다|시티팝|summer|청량/i, ['#22D3EE', '#F472B6', '#FDE68A']], [/따뜻|카페|봄|브이로그|vlog|사랑/i, ['#FDBA74', '#F9A8D4', '#FEF3C7']], [/운동|edm|신나|파티|클럽/i, ['#F43F5E', '#FACC15', '#22D3EE']], [/보스|웅장|오케스트라|epic|어둠/i, ['#EF4444', '#F59E0B', '#7C2D12']]];
  function localStoryboard(prompt, title, lyrics, total) {
    const pal = (PROMPT_PAL.find(([re]) => re.test(prompt + ' ' + title)) || [0, ['#00FF66', '#A855F7', '#22D3EE']])[1];
    const lines = String(lyrics || '').split('\n').map((l) => l.trim()).filter((l) => l && !/^\[.*\]$/.test(l));
    const n = clamp(Math.round(total / 5), 3, 14); const order = ['kinetic', 'bars', 'particles', 'grid', 'waves', 'glitch'];
    return Array.from({ length: n }, (_, i) => ({ id: uid(), dur: +(total / n).toFixed(2), template: i === 0 ? 'kinetic' : order[i % order.length], text: i === 0 ? (title || 'DARK CODE') : i === n - 1 ? (title || 'THE END') : (lines[(i - 1) % Math.max(1, lines.length)] || prompt.slice(0, 18) || title), sub: i === 0 ? 'DARK CODE STUDIO' : '', palette: i % 3 === 2 ? [pal[1], pal[2], pal[0]] : pal }));
  }
  async function autoScenes(silent) {
    const total = vAudio.duration && isFinite(vAudio.duration) ? Math.min(vAudio.duration, 600) : 20;
    const prompt = $('#vPrompt').value.trim();
    const btn = $('#vAuto'); btn.disabled = true; btn.textContent = '장면 구성 중…';
    try {
      if (await checkCore()) {
        const r = await fetch(core.url() + '/dc/storyboard', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ input: prompt, song: V.song || { title: V.trackTitle }, duration: total, format: V.format }) });
        const j = await r.json(); if (!r.ok) throw new Error(j.error?.message || r.status);
        V.scenes = j.scenes.map((s) => ({ id: uid(), ...s })); if (!silent) toast(j.by === 'ai' ? 'AI 가 장면을 구성했어요' : '기본 장면으로 구성했어요');
      } else { V.scenes = localStoryboard(prompt, V.trackTitle, V.song?.lyrics, total); if (!silent) toast('게이트웨이 없이 기본 장면으로 구성했어요'); }
    } catch (e) { V.scenes = localStoryboard(prompt, V.trackTitle, V.song?.lyrics, total); toast('AI 장면 구성 실패 → 기본 장면 사용'); }
    finally { btn.disabled = false; btn.textContent = 'AI 장면 자동 구성'; }
    renderScenes(); updateTime();
  }
  $('#vAuto').onclick = () => autoScenes(false);
  $('#vAddScene').onclick = () => { const last = V.scenes[V.scenes.length - 1]; V.scenes.push({ id: uid(), dur: 4, template: 'kinetic', text: '새 장면', sub: '', palette: last ? [...last.palette] : ['#00FF66', '#A855F7', '#22D3EE'] }); renderScenes(); updateTime(); };

  function renderScenes() {
    const box = $('#scenes'); box.innerHTML = '';
    V.scenes.forEach((s, i) => {
      const el = document.createElement('div'); el.className = 'scn'; el.dataset.id = s.id;
      el.innerHTML = `<div class="scn-row"><span class="scn-n">${String(i + 1).padStart(2, '0')}</span><select data-k="template">${Object.entries(TEMPLATES).map(([k, v]) => `<option value="${k}"${k === s.template ? ' selected' : ''}>${v}</option>`).join('')}</select><input type="number" data-k="dur" min="1" max="60" step="0.5" value="${s.dur}" title="초"><button class="scn-x" data-a="up" title="위로">↑</button><button class="scn-x" data-a="del" title="삭제">✕</button></div>
        <div class="scn-row"><input type="text" data-k="text" value="${esc(s.text)}" placeholder="큰 글자"></div>
        <div class="scn-row"><input type="text" data-k="sub" value="${esc(s.sub)}" placeholder="작은 글자 (선택)"></div>
        <div class="scn-row">${s.palette.map((c, k) => `<input type="color" data-c="${k}" value="${c}">`).join('')}<label class="scn-img">사진 <input type="file" accept="image/*" data-k="img" style="width:120px"></label>${V.images.has(s.id) ? '<span class="scn-img">✓</span>' : ''}</div>`;
      el.addEventListener('input', (e) => { const k = e.target.dataset.k; const c = e.target.dataset.c; if (k === 'dur') s.dur = clamp(Number(e.target.value) || 1, 1, 60); else if (k === 'text' || k === 'sub' || k === 'template') s[k] = e.target.value; else if (c !== undefined) s.palette[Number(c)] = e.target.value; updateTime(); });
      el.addEventListener('change', async (e) => { if (e.target.dataset.k === 'img' && e.target.files[0]) { V.images.set(s.id, await createImageBitmap(e.target.files[0])); if (s.template !== 'photo') s.template = 'photo'; renderScenes(); } });
      el.addEventListener('click', (e) => { const a = e.target.dataset.a; if (a === 'del') { V.scenes.splice(i, 1); renderScenes(); updateTime(); } if (a === 'up' && i > 0) { [V.scenes[i - 1], V.scenes[i]] = [V.scenes[i], V.scenes[i - 1]]; renderScenes(); } if (!a && !e.target.matches('input,select')) seekTo(V.scenes.slice(0, i).reduce((x, y) => x + y.dur, 0) + 0.01); });
      box.append(el);
    });
  }
  const total = () => V.scenes.reduce((a, s) => a + s.dur, 0);
  function updateTime() { $('#vTime').textContent = `${fmt(V.t)} / ${fmt(total())}`; $('#vSeek').value = total() ? (V.t / total()) * 1000 : 0; }
  function seekTo(t) { V.t = clamp(t, 0, total()); if (vAudio.src && isFinite(vAudio.duration)) vAudio.currentTime = Math.min(V.t, vAudio.duration - 0.05); updateTime(); }
  $('#vSeek').oninput = (e) => seekTo((e.target.value / 1000) * total());
  $('#vRestart').onclick = () => seekTo(0);
  $('#vPlay').onclick = () => (V.playing ? pause() : start());
  function start() {
    if (!V.scenes.length) { autoScenes(true); }
    ensureAudioGraph(); AC.resume();
    if (V.t >= total() - 0.05) seekTo(0);
    V.playing = true; $('#vPlay').textContent = '일시정지'; V.clock = performance.now() - V.t * 1000;
    if (vAudio.src) vAudio.play().catch(() => {});
  }
  function pause() { V.playing = false; $('#vPlay').textContent = '재생'; vAudio.pause(); }

  /* ----- 오디오 특징 ----- */
  const A = { bass: 0, mid: 0, high: 0, beat: 0, avg: 0.2 };
  function analyse(dt) {
    if (analyser && vAudio.src && !vAudio.paused) {
      analyser.getByteFrequencyData(freq); analyser.getByteTimeDomainData(wave);
      let b = 0, m = 0, h = 0; for (let i = 1; i < 10; i++) b += freq[i]; for (let i = 10; i < 80; i++) m += freq[i]; for (let i = 80; i < 300; i++) h += freq[i];
      A.bass = b / 9 / 255; A.mid = m / 70 / 255; A.high = h / 220 / 255;
    } else { const ph = (V.t * 2) % 1; A.bass = 0.25 + 0.55 * Math.exp(-ph * 6); A.mid = 0.3 + 0.15 * Math.sin(V.t * 3); A.high = 0.2; for (let i = 0; i < freq.length; i++) freq[i] = 255 * clamp(A.bass * 1.2 * Math.exp(-i / 90) + 0.12 * Math.abs(Math.sin(i * 0.3 + V.t * 4)), 0, 1); for (let i = 0; i < wave.length; i++) wave[i] = 128 + 60 * A.bass * Math.sin(i * 0.05 + V.t * 8); }
    A.avg = A.avg * 0.96 + A.bass * 0.04;
    if (A.bass > A.avg * 1.25 && A.bass > 0.35 && A.beat < 0.3) A.beat = 1; else A.beat = Math.max(0, A.beat - dt * 3.2);
  }

  /* ----- 그리기 도우미 ----- */
  function bg(W, H, p, t, k = 1) { const gr = g.createLinearGradient(0, 0, W * Math.cos(t * 0.1) , H); gr.addColorStop(0, shade(p[0], -0.82)); gr.addColorStop(0.5, '#020403'); gr.addColorStop(1, shade(p[1], -0.78)); g.fillStyle = gr; g.fillRect(0, 0, W, H); const rg = g.createRadialGradient(W * 0.5, H * 0.45, 0, W * 0.5, H * 0.45, Math.max(W, H) * 0.7); rg.addColorStop(0, hexA(p[0], 0.18 * k + A.bass * 0.2)); rg.addColorStop(1, 'transparent'); g.fillStyle = rg; g.fillRect(0, 0, W, H); }
  function shade(hex, f) { const n = parseInt(hex.slice(1), 16); let r = n >> 16, gg = (n >> 8) & 255, b = n & 255; const tgt = f < 0 ? 0 : 255; const k = Math.abs(f); r = Math.round(r + (tgt - r) * k); gg = Math.round(gg + (tgt - gg) * k); b = Math.round(b + (tgt - b) * k); return `rgb(${r},${gg},${b})`; }
  function hexA(hex, a) { const n = parseInt(hex.slice(1), 16); return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${clamp(a, 0, 1)})`; }
  function wrapLines(text, maxW, size) { g.font = `900 ${size}px 'Pretendard Variable', Pretendard, sans-serif`; const words = String(text).split(/\s+/); const lines = []; let cur = ''; for (const w of words) { const test = cur ? cur + ' ' + w : w; if (g.measureText(test).width > maxW && cur) { lines.push(cur); cur = w; } else cur = test; } if (cur) lines.push(cur); return lines; }
  function title(text, sub, W, H, p, lt, { y = 0.5, scale = 1, glow = 1, align = 'center' } = {}) {
    if (!text) return;
    let size = Math.round(Math.min(W, H) * 0.11); let lines = wrapLines(text, W * 0.84, size);
    while (lines.length > 3 && size > 18) { size -= 4; lines = wrapLines(text, W * 0.84, size); }
    const inA = clamp(lt / 0.45, 0, 1); const ease = 1 - Math.pow(1 - inA, 3);
    g.save(); g.translate(W / 2, H * y); g.scale(scale, scale); g.textAlign = align; g.textBaseline = 'middle';
    g.font = `900 ${size}px 'Pretendard Variable', Pretendard, sans-serif`;
    const lh = size * 1.12; const top = -((lines.length - 1) * lh) / 2;
    lines.forEach((l, i) => { const yy = top + i * lh + (1 - ease) * size * 0.6; g.globalAlpha = ease; g.shadowColor = p[0]; g.shadowBlur = size * 0.45 * glow * (0.6 + A.bass); g.fillStyle = '#fff'; g.fillText(l, 0, yy); g.shadowBlur = 0; g.fillStyle = hexA(p[0], 0.9); g.fillText(l, 0, yy); g.fillStyle = 'rgba(255,255,255,.88)'; g.fillText(l, 0, yy - size * 0.03); });
    if (sub) { const ss = Math.round(size * 0.32); g.font = `700 ${ss}px ui-monospace, Consolas, monospace`; g.globalAlpha = clamp((lt - 0.3) / 0.5, 0, 1); g.fillStyle = hexA(p[1], 0.95); const typed = sub.slice(0, Math.floor(clamp((lt - 0.3) * 24, 0, sub.length))); g.fillText(typed, 0, top + lines.length * lh + ss * 0.6); }
    g.restore(); g.globalAlpha = 1;
  }

  /* ----- 템플릿 ----- */
  const parts = []; const rnd = Math.random;
  const T = {
    kinetic(W, H, s, lt, t) { bg(W, H, s.palette, t); g.save(); g.translate(W / 2, H / 2); g.strokeStyle = hexA(s.palette[1], 0.5); g.lineWidth = Math.max(2, W / 300); for (let i = 0; i < 3; i++) { g.beginPath(); g.arc(0, 0, Math.min(W, H) * (0.28 + i * 0.09) * (1 + A.beat * 0.06), t * (0.6 + i * 0.3), t * (0.6 + i * 0.3) + Math.PI * (1 + i * 0.3)); g.stroke(); } g.restore(); title(s.text, s.sub, W, H, s.palette, lt, { scale: 1 + A.beat * 0.07 }); },
    bars(W, H, s, lt, t) { bg(W, H, s.palette, t, 0.6); const n = 64; const bw = W / n; for (let i = 0; i < n; i++) { const v = freq[Math.floor(i * 3.5) + 1] / 255; const h = Math.max(4, v * H * 0.42); const gr = g.createLinearGradient(0, H, 0, H - h); gr.addColorStop(0, s.palette[0]); gr.addColorStop(1, s.palette[1]); g.fillStyle = gr; g.fillRect(i * bw + bw * 0.15, H - h, bw * 0.7, h); g.fillStyle = hexA(s.palette[2], 0.25); g.fillRect(i * bw + bw * 0.15, 0, bw * 0.7, h * 0.35); } title(s.text, s.sub, W, H, s.palette, lt, { y: 0.36, scale: 1 + A.beat * 0.04 }); },
    particles(W, H, s, lt, t, dt) { bg(W, H, s.palette, t); if (A.beat > 0.95 || parts.length < 40) for (let i = 0; i < 26; i++) { const a = rnd() * Math.PI * 2, sp = (0.15 + rnd() * 0.6) * Math.min(W, H); parts.push({ x: W / 2, y: H / 2, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life: 1, c: s.palette[i % 3], r: 2 + rnd() * Math.min(W, H) * 0.008 }); } g.globalCompositeOperation = 'lighter'; for (let i = parts.length - 1; i >= 0; i--) { const q = parts[i]; q.x += q.vx * dt; q.y += q.vy * dt; q.vx *= 0.985; q.vy *= 0.985; q.life -= dt * 0.45; if (q.life <= 0) { parts.splice(i, 1); continue; } g.fillStyle = hexA(q.c, q.life); g.beginPath(); g.arc(q.x, q.y, q.r * (1 + A.bass), 0, 7); g.fill(); } g.globalCompositeOperation = 'source-over'; if (parts.length > 900) parts.splice(0, parts.length - 900); title(s.text, s.sub, W, H, s.palette, lt, { scale: 1 + A.beat * 0.05 }); },
    waves(W, H, s, lt, t) { bg(W, H, s.palette, t, 0.7); g.lineWidth = Math.max(2, W / 220); for (let k = 0; k < 4; k++) { g.strokeStyle = hexA(s.palette[k % 3], 0.75 - k * 0.15); g.beginPath(); for (let x = 0; x <= W; x += W / 160) { const i = Math.floor((x / W) * (wave.length - 1)); const v = (wave[i] - 128) / 128; const y = H * (0.62 + k * 0.05) + v * H * 0.16 * (1 + k * 0.2) + Math.sin(x / W * 6 + t * (1 + k * 0.4)) * H * 0.02 * (1 + A.mid * 2); x ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke(); } title(s.text, s.sub, W, H, s.palette, lt, { y: 0.34 }); },
    grid(W, H, s, lt, t) { g.fillStyle = '#05010a'; g.fillRect(0, 0, W, H); const hor = H * 0.58; const sun = g.createLinearGradient(0, hor - H * 0.28, 0, hor); sun.addColorStop(0, s.palette[1]); sun.addColorStop(1, s.palette[0]); g.fillStyle = sun; g.beginPath(); g.arc(W / 2, hor, Math.min(W, H) * 0.22 * (1 + A.bass * 0.08), Math.PI, 0); g.fill(); g.fillStyle = '#05010a'; for (let i = 0; i < 6; i++) g.fillRect(0, hor - i * H * 0.03 - 4, W, 2 + i); g.strokeStyle = hexA(s.palette[0], 0.85); g.lineWidth = Math.max(1, W / 500); for (let i = -14; i <= 14; i++) { g.beginPath(); g.moveTo(W / 2 + i * W * 0.02, hor); g.lineTo(W / 2 + i * W * 0.22, H); g.stroke(); } const off = (t * 0.6) % 1; for (let j = 0; j < 14; j++) { const z = (j + off) / 14; const y = hor + (H - hor) * z * z; g.globalAlpha = z; g.beginPath(); g.moveTo(0, y); g.lineTo(W, y); g.stroke(); } g.globalAlpha = 1; title(s.text, s.sub, W, H, s.palette, lt, { y: 0.3, scale: 1 + A.beat * 0.05 }); },
    glitch(W, H, s, lt, t) { bg(W, H, s.palette, t, 1.2); title(s.text, s.sub, W, H, s.palette, lt, { scale: 1 + A.beat * 0.1 }); const n = 4 + Math.floor(A.bass * 10); for (let i = 0; i < n; i++) { const y = rnd() * H, h = rnd() * H * 0.05 + 2, dx = (rnd() - 0.5) * W * 0.08 * (0.4 + A.beat); try { g.drawImage(stage, 0, y, W, h, dx, y, W, h); } catch {} } g.globalCompositeOperation = 'screen'; g.fillStyle = hexA(s.palette[2], 0.08 + A.beat * 0.15); g.fillRect((rnd() - 0.5) * 12, 0, W, H); g.globalCompositeOperation = 'source-over'; g.fillStyle = 'rgba(255,255,255,.04)'; for (let y = 0; y < H; y += 4) g.fillRect(0, y, W, 1); },
    photo(W, H, s, lt, t, dt, p) { const img = V.images.get(s.id); if (img) { const z = 1.08 + p * 0.12 + A.beat * 0.015; const sc = Math.max(W / img.width, H / img.height) * z; const iw = img.width * sc, ih = img.height * sc; g.drawImage(img, (W - iw) / 2 + Math.sin(t * 0.3) * W * 0.02, (H - ih) / 2 + Math.cos(t * 0.25) * H * 0.02, iw, ih); } else bg(W, H, s.palette, t); const gr = g.createLinearGradient(0, H * 0.4, 0, H); gr.addColorStop(0, 'rgba(0,0,0,0)'); gr.addColorStop(1, 'rgba(0,0,0,.78)'); g.fillStyle = gr; g.fillRect(0, 0, W, H); title(s.text, s.sub, W, H, s.palette, lt, { y: 0.74, glow: 0.6 }); },
  };

  function sceneAt(t) { let acc = 0; for (let i = 0; i < V.scenes.length; i++) { const s = V.scenes[i]; if (t < acc + s.dur || i === V.scenes.length - 1) return { i, s, lt: t - acc, p: clamp((t - acc) / s.dur, 0, 1) }; acc += s.dur; } return null; }
  function render(dt) {
    const W = stage.width, H = stage.height;
    if (!V.scenes.length) { g.fillStyle = '#000'; g.fillRect(0, 0, W, H); g.fillStyle = '#4f6e5a'; g.font = `600 ${Math.round(W / 26)}px ui-monospace, monospace`; g.textAlign = 'center'; g.fillText('음악을 고르고 [AI 장면 자동 구성]', W / 2, H / 2); return; }
    const c = sceneAt(V.t); if (!c) return;
    analyse(dt);
    (T[c.s.template] || T.kinetic)(W, H, c.s, c.lt, V.t, dt, c.p);
    if (c.lt < 0.25 && c.i > 0) { g.fillStyle = `rgba(255,255,255,${(1 - c.lt / 0.25) * 0.5})`; g.fillRect(0, 0, W, H); }
    $$('.scn').forEach((el, k) => el.classList.toggle('active', k === c.i));
    // 워터마크 (작게)
    g.font = `700 ${Math.round(W / 60)}px ui-monospace, monospace`; g.textAlign = 'right'; g.fillStyle = 'rgba(255,255,255,.35)'; g.fillText('DARK CODE STUDIO', W - W * 0.03, H - H * 0.025);
  }
  let last = performance.now();
  function loop(now) {
    const dt = Math.min(0.1, (now - last) / 1000); last = now;
    if (V.playing) {
      V.t = vAudio.src && !vAudio.paused && isFinite(vAudio.duration) ? vAudio.currentTime : (now - V.clock) / 1000;
      if (V.t >= total()) { V.t = total(); if (!V.recording) pause(); }
      updateTime();
    }
    if ($('.st-view[data-view="video"]').classList.contains('on') || V.recording) render(dt);
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);

  /* ----- 내보내기 (MediaRecorder · 실시간 렌더) ----- */
  $('#vExport').onclick = async () => {
    if (!V.scenes.length) return toast('먼저 장면을 구성하세요');
    if (V.recording) return;
    ensureAudioGraph(); await AC.resume(); fitStage();
    const types = ['video/mp4;codecs=avc1.42E01E,mp4a.40.2', 'video/mp4', 'video/webm;codecs=vp9,opus', 'video/webm;codecs=vp8,opus', 'video/webm'];
    const mime = types.find((m) => window.MediaRecorder && MediaRecorder.isTypeSupported(m));
    if (!mime) return toast('이 브라우저는 영상 녹화를 지원하지 않아요 (Chrome 권장)');
    const stream = stage.captureStream(30);
    if (vAudio.src) recDest.stream.getAudioTracks().forEach((tr) => stream.addTrack(tr));
    const rec = new MediaRecorder(stream, { mimeType: mime, videoBitsPerSecond: V.quality >= 1080 ? 10e6 : 5e6 });
    const chunks = []; rec.ondataavailable = (e) => e.data.size && chunks.push(e.data);
    const box = $('#exportBox'); box.hidden = false; box.innerHTML = `<b>녹화 중…</b> 영상 길이만큼 실시간으로 렌더링합니다. 탭을 바꾸면 끊길 수 있어요.<br><progress id="exProg" max="1000" value="0"></progress>`;
    V.recording = true; seekTo(0); start();
    rec.start(500);
    const len = total();
    const tick = setInterval(() => { const pr = $('#exProg'); if (pr) pr.value = (V.t / len) * 1000; if (V.t >= len - 0.02 || !V.playing) { clearInterval(tick); rec.stop(); } }, 200);
    rec.onstop = async () => {
      V.recording = false; pause();
      const blob = new Blob(chunks, { type: mime.split(';')[0] }); const ext = mime.includes('mp4') ? 'mp4' : 'webm';
      const item = { id: uid(), title: (V.scenes[0]?.text || V.trackTitle || 'DARK CODE').slice(0, 40), blob, mime: blob.type, ext, format: V.format, quality: V.quality, duration: len, created: Date.now() };
      await DB.put('videos', item); updateCounts();
      const u = URL.createObjectURL(blob);
      box.innerHTML = `<b>완성!</b> ${fmt(len)} · ${(blob.size / 1048576).toFixed(1)}MB · ${ext.toUpperCase()}<div style="display:flex;gap:8px;margin-top:8px;flex-wrap:wrap"><a class="st-btn sm" href="${u}" download="${esc(item.title)}.${ext}">다운로드</a><button class="st-btn ghost sm" type="button" id="exLib">라이브러리에서 보기</button></div>`;
      $('#exLib').onclick = () => setTab('library');
      toast('영상 내보내기 완료');
    };
  };

  /* ================= 라이브러리 ================= */
  async function renderLibrary() {
    const [tr, vd] = await Promise.all([DB.all('tracks'), DB.all('videos')]);
    $('#libTracks').innerHTML = tr.length ? '' : '<p class="lib-empty">아직 만든 음악이 없어요.</p>';
    tr.forEach((t) => { const c = document.createElement('div'); c.className = 'lib-card'; c.innerHTML = `<canvas width="300" height="160"></canvas><b>${esc(t.title)}</b><span class="dim">${t.state === 'ready' ? fmt(t.duration) : '작곡안'} · ${new Date(t.created).toLocaleDateString('ko-KR')}</span><div class="row"></div>`; drawCover($('canvas', c), t.title); const row = $('.row', c); if (t.blob) { const p = document.createElement('button'); p.textContent = '재생'; p.onclick = () => play(t.id); row.append(p); const a = document.createElement('a'); a.textContent = '다운로드'; a.href = urlFor(t); a.download = `${t.title}.mp3`; row.append(a); } const d = document.createElement('button'); d.textContent = '삭제'; d.onclick = async () => { await DB.del('tracks', t.id); renderLibrary(); renderTracks(); }; row.append(d); $('#libTracks').append(c); });
    $('#libVideos').innerHTML = vd.length ? '' : '<p class="lib-empty">아직 내보낸 영상이 없어요.</p>';
    vd.forEach((v) => { const u = URL.createObjectURL(v.blob); const c = document.createElement('div'); c.className = 'lib-card'; c.innerHTML = `<video src="${u}" controls preload="metadata"></video><b>${esc(v.title)}</b><span class="dim">${v.format} · ${fmt(v.duration)} · ${v.ext.toUpperCase()}</span><div class="row"><a href="${u}" download="${esc(v.title)}.${v.ext}">다운로드</a><button type="button">삭제</button></div>`; $('button', c).onclick = async () => { await DB.del('videos', v.id); renderLibrary(); updateCounts(); }; $('#libVideos').append(c); });
  }

  /* ================= 시작 ================= */
  fitStage(); renderTracks();
  const qs = new URLSearchParams(location.search);
  if (qs.get('tab')) setTab(qs.get('tab'));
  checkCore().then((ok) => {
    const q = qs.get('q');
    if (q) { $('#mPrompt').value = q; history.replaceState(null, '', location.pathname); if (qs.get('auto') === '1') { if (ok) create(q); else needCore('명령을 받았어요. 게이트웨이를 켜면 [만들기]를 눌러 주세요.'); } }
  });
})();
