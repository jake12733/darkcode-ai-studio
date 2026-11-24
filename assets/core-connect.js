/*
 * DARK CODE · CORE 게이트웨이 연결 (darkcode-core, 기본 http://127.0.0.1:8787)
 * window.DCCore = { url, check, open, waitConnected, run }
 *   run(input, { sessionId, mode, signal, onEvent }) → done 이벤트 데이터
 */
(function () {
  'use strict';
  var LS_URL = 'dc-core-url';
  var LS_USED = 'dc-core-used';
  var REPO = 'https://github.com/jake12733/darkcode-core';
  var ZIP = 'https://github.com/jake12733/darkcode-core/archive/refs/heads/main.zip';
  var last = { ok: false, state: 'unknown' };
  var poll = null; var waiters = [];

  function $(id) { return document.getElementById(id); }
  function url() { return (localStorage.getItem(LS_URL) || 'http://127.0.0.1:8787').replace(/\/+$/, ''); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

  function check() {
    var ctl = new AbortController(); var t = setTimeout(function () { ctl.abort(); }, 4000);
    return fetch(url() + '/health', { signal: ctl.signal, cache: 'no-store' }).then(function (r) { clearTimeout(t); if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
      .then(function (j) { return set({ ok: true, state: 'ok', profile: j.profile, version: j.version, engines: j.engines || [] }); })
      .catch(function (e) { clearTimeout(t); return set({ ok: false, state: e.name === 'AbortError' ? 'permission' : 'off', error: e.message }); });
  }

  function set(s) {
    last = s; pill(); render();
    if (s.ok) { stop(); waiters.splice(0).forEach(function (f) { f(); }); }
    return s;
  }

  function pill() {
    var right = document.querySelector('.top-right'); if (!right) return;
    var b = $('corePill');
    if (!b) {
      b = document.createElement('button'); b.type = 'button'; b.id = 'corePill'; b.className = 'pill l6-pill core-pill'; b.title = 'CORE 게이트웨이 (darkcode-core)';
      b.innerHTML = '<i></i><span>CORE</span>'; b.addEventListener('click', open);
      var l6 = $('l6Pill'); right.insertBefore(b, l6 ? l6.nextSibling : right.firstChild);
    }
    b.classList.remove('ok', 'bad', 'wait');
    if (last.state !== 'unknown') b.classList.add(last.ok ? 'ok' : last.state === 'permission' ? 'wait' : 'bad');
    var up = (last.engines || []).filter(function (e) { return e.ok; }).length;
    b.querySelector('span').textContent = last.ok ? 'CORE · ' + up + ' 엔진' : last.state === 'unknown' ? 'CORE' : 'CORE · 꺼짐';
  }

  function dialog() {
    if ($('coreDlg')) return $('coreDlg');
    var d = document.createElement('dialog'); d.id = 'coreDlg'; d.className = 'settings dc-modal l6-dlg';
    d.innerHTML = '<div class="set-inner"><div class="set-head"><b>&gt; CORE GATEWAY · darkcode-core</b><button class="icon-btn" id="coreClose" type="button">&#10005;</button></div>' +
      '<div class="set-body"><div class="l6-status"><span class="l6-dot" id="coreDot"></span><b id="coreTitle">확인 중</b><em id="coreLive">대기</em></div>' +
      '<p class="modal-note" id="coreReason"></p>' +
      '<div class="core-engines" id="coreEngines"></div>' +
      '<div id="coreSetup"><ol class="core-steps">' +
      '<li><a class="btn-neon sm" href="' + ZIP + '" target="_blank" rel="noopener">darkcode-core 내려받기 (zip)</a> → 압축 풀기</li>' +
      '<li>폴더 안 <b>start-darkcode-core.bat</b> 더블클릭 (Node.js 가 없으면 자동 설치)</li>' +
      '<li>검은 창에 <code>DARK CODE Core … http://127.0.0.1:8787</code> 이 뜨면 이 창이 저절로 "연결됨" 으로 바뀝니다</li></ol>' +
      '<p class="l6-note">브라우저가 "로컬 네트워크 기기 접근" 을 물으면 <b>허용</b>. Ollama 접속 허용(OLLAMA_ORIGINS) 설정은 필요 없어요 — 게이트웨이가 대신 부릅니다. <a href="' + REPO + '" target="_blank" rel="noopener">소스·설계 문서</a></p></div>' +
      '<div class="l6-opts"><label>게이트웨이 주소 <input id="coreUrl" type="text" spellcheck="false"></label><button class="btn-ghost sm" id="coreRecheck" type="button">다시 확인</button><button class="btn-neon sm" id="coreDiagBtn" type="button">연결 진단</button><button class="btn-ghost sm" id="coreDiagCopy" type="button" hidden>결과 복사</button></div>' +
      '<pre class="core-diag" id="coreDiag" hidden></pre>' +
      '<p class="l6-flow">CACHE → CONTEXT → ROUTE → STRATEGIST → IMPLEMENTER → CRITIC/VERIFY → GATE → RENDER · 엔진은 역할별로 자동 선택 (Ollama · llama.cpp · LM Studio · LocalAI · vLLM · SGLang)</p></div></div>';
    document.body.appendChild(d);
    $('coreClose').onclick = function () { d.close(); };
    d.addEventListener('close', function () { if (!waiters.length) stop(); });
    $('coreRecheck').onclick = function () { $('coreLive').textContent = '확인 중...'; check(); };
    $('coreDiagBtn').onclick = function () { diagnose(); };
    $('coreDiagCopy').onclick = function () { navigator.clipboard.writeText($('coreDiag').textContent).then(function () { $('coreDiagCopy').textContent = '복사됨'; setTimeout(function () { $('coreDiagCopy').textContent = '결과 복사'; }, 1200); }); };
    var u = $('coreUrl'); u.value = url();
    u.onchange = function () { localStorage.setItem(LS_URL, u.value.trim() || 'http://127.0.0.1:8787'); check(); };
    return d;
  }

  function render() {
    if (!$('coreDlg')) return;
    var s = last;
    $('coreDot').className = 'l6-dot ' + (s.ok ? 'ok' : s.state === 'permission' ? 'wait' : 'bad');
    $('coreTitle').textContent = s.ok ? 'CORE 게이트웨이 연결됨 · ' + (s.profile || '') + ' 프로필' : s.state === 'permission' ? '브라우저에서 [허용]만 눌러 주세요' : 'CORE 게이트웨이가 꺼져 있어요';
    $('coreReason').innerHTML = s.ok ? '입력창 모드에서 <b>CORE</b> 를 고르면 요청이 분류 → 역할별 엔진 → 검수 루프를 거쳐 돌아옵니다. 세션·스냅샷·로그는 게이트웨이 DB 에 함께 쌓입니다.'
      : s.state === 'permission' ? '주소창 아래 "로컬 네트워크 기기 접근" 창에서 허용을 누르면 연결됩니다.'
      : '이 PC 에서 darkcode-core 를 실행하면 바로 연결됩니다. (처음 한 번만 아래 순서대로)';
    $('coreSetup').hidden = !!s.ok;
    $('coreLive').textContent = s.ok ? '연결됨' : poll ? '자동 감지 중' : '대기';
    $('coreEngines').innerHTML = (s.engines || []).map(function (e) { return '<span class="l6-chip ' + (e.ok ? 'ok' : e.enabled ? 'miss' : '') + '">' + esc(e.id) + (e.enabled ? (e.ok ? ' · UP' : ' · DOWN') : ' · off') + '</span>'; }).join('');
  }

  function start() { if (!poll) poll = setInterval(function () { if (!document.hidden) check(); }, 3000); }
  function stop() { if (poll) { clearInterval(poll); poll = null; } }

  function open() {
    localStorage.setItem(LS_USED, '1');
    var d = dialog(); render(); if (!d.open) d.showModal();
    check().then(function (s) { if (!s.ok) start(); });
  }

  function waitConnected(signal) {
    if (last.ok) return Promise.resolve();
    start();
    return new Promise(function (resolve, reject) {
      var f = function () { resolve(); }; waiters.push(f);
      if (signal) signal.addEventListener('abort', function () { var i = waiters.indexOf(f); if (i >= 0) waiters.splice(i, 1); var e = new Error('사용자 중단'); e.kind = 'abort'; reject(e); });
    });
  }

  // POST /dc/run → SSE 이벤트를 onEvent(type, data) 로 전달, done 데이터 반환
  function run(input, opts) {
    opts = opts || {};
    return fetch(url() + '/dc/run', { method: 'POST', headers: { 'Content-Type': 'application/json' }, signal: opts.signal, body: JSON.stringify({ input: input, sessionId: opts.sessionId || undefined, mode: opts.mode || 'auto', noCache: !!opts.noCache }) })
      .then(function (res) {
        if (!res.ok) return res.text().then(function (t) { throw new Error('CORE HTTP ' + res.status + ' ' + t.slice(0, 160)); });
        var reader = res.body.getReader(); var dec = new TextDecoder(); var buf = ''; var done = null; var err = null;
        function pump() {
          return reader.read().then(function (r) {
            if (r.done) { if (err) throw new Error(err); if (!done) throw new Error('CORE 응답이 중간에 끊겼습니다'); return done; }
            buf += dec.decode(r.value, { stream: true });
            var i;
            while ((i = buf.indexOf('\n\n')) !== -1) {
              var block = buf.slice(0, i); buf = buf.slice(i + 2);
              if (block.indexOf('event:') !== 0) continue;
              var nl = block.indexOf('\n'); var type = block.slice(7, nl).trim(); var data;
              try { data = JSON.parse(block.slice(nl + 1).replace(/^data:\s*/, '')); } catch (e) { continue; }
              if (type === 'done') done = data; else if (type === 'error') err = data.message;
              if (opts.onEvent) opts.onEvent(type, data);
            }
            return pump();
          });
        }
        return pump();
      });
  }

  /* ---------- 브라우저 → 게이트웨이 실경로 진단 ---------- */
  var DIAG_INPUT = 'TCP와 UDP 차이를 한 줄로 알려줘';
  function diagnose() {
    var out = $('coreDiag'); out.hidden = false; $('coreDiagCopy').hidden = false;
    var lines = [];
    var log = function (s) { lines.push(s); out.textContent = lines.join('\n'); out.scrollTop = out.scrollHeight; };
    var btn = $('coreDiagBtn'); btn.disabled = true;
    var t0 = performance.now();
    var ms = function () { return Math.round(performance.now() - t0) + 'ms'; };
    log('DARK CODE CORE 연결 진단 · ' + new Date().toLocaleString('ko-KR'));
    log('페이지 오리진: ' + location.origin + ' · 게이트웨이: ' + url());
    var brave = navigator.brave && navigator.brave.isBrave ? navigator.brave.isBrave().catch(function () { return false; }) : Promise.resolve(false);
    return brave.then(function (isBrave) {
      log('브라우저: ' + (isBrave ? 'Brave' : (navigator.userAgentData && navigator.userAgentData.brands ? navigator.userAgentData.brands.map(function (b) { return b.brand; }).filter(function (b) { return !/Not.A.Brand/i.test(b); }).join(', ') : navigator.userAgent.slice(0, 60))));
      log('[1] GET /health …');
      var ctl = new AbortController(); var tm = setTimeout(function () { ctl.abort(); }, 6000);
      return fetch(url() + '/health', { signal: ctl.signal, cache: 'no-store' }).then(function (r) {
        clearTimeout(tm);
        return r.text().then(function (txt) {
          var j = null; try { j = JSON.parse(txt); } catch (e) { /* not json */ }
          if (r.status === 403) { log('[1] FAIL 403 · 게이트웨이가 이 오리진을 거부 → darkcode.config.json server.cors 에 "' + location.origin + '" 추가'); return false; }
          if (!r.ok || !j || j.name !== 'darkcode-core') { log('[1] FAIL HTTP ' + r.status + ' · darkcode-core 응답이 아님 (같은 포트에 다른 서버?) ' + txt.slice(0, 80)); return false; }
          log('[1] PASS ' + ms() + ' · darkcode-core v' + j.version + ' · profile=' + j.profile + ' · ' + (j.engines || []).filter(function (e) { return e.enabled; }).map(function (e) { return e.id + ':' + (e.ok ? 'UP' : 'DOWN'); }).join(' '));
          var oll = (j.engines || []).find(function (e) { return e.id === 'ollama'; });
          if (oll && !oll.ok) { log('[1] WARN Ollama DOWN → CORE 요청이 실패합니다. Ollama 실행 후 다시 진단'); }
          return true;
        });
      }).catch(function (e) {
        clearTimeout(tm);
        if (e.name === 'AbortError') {
          log('[1] FAIL 6초 동안 응답 없음 → ① 브라우저가 "로컬 네트워크 기기 접근" 허용을 기다리는 중(주소창 아래·왼쪽 확인) ② 보안 프로그램이 연결을 붙잡음 [검증 필요]');
          return false;
        }
        // no-cors 탐침: 네트워크 수준에서 닿으면(응답 내용은 못 봄) → 서버는 떠 있고 CORS/권한 문제
        return fetch(url() + '/health', { mode: 'no-cors', cache: 'no-store' }).then(function () {
          log('[1] FAIL 게이트웨이까지는 닿지만 응답을 읽지 못함(CORS) → 게이트웨이 창에 "CORS 거부: origin=…" 줄이 있으면 server.cors 에 ' + location.origin + ' 추가');
          return false;
        }, function () {
          log('[1] FAIL 연결 자체 실패 (' + e.message + ')');
          log('    ① 게이트웨이 미기동 → darkcode-core 폴더의 verify-core.bat 실행 (PC 쪽 점검)');
          log('    ② verify-core.bat 은 통과인데 여기만 실패 → 브라우저가 공개 사이트의 localhost 접근을 막는 중');
          log('       Chrome: 주소창 왼쪽 아이콘 → 사이트 설정 → 로컬 네트워크 액세스 → 허용 [검증 필요: 버전별 메뉴명]');
          log('       Brave: 주소창의 Shields(사자) 끄기 또는 사이트 설정의 localhost 접근 허용 [검증 필요: 버전별 메뉴명]');
          log('    ③ 주소가 다르면(포트 변경 등) 아래 "게이트웨이 주소" 를 수정');
          return false;
        });
      });
    }).then(function (ok) {
      if (!ok) return false;
      log('[2] POST /dc/run "' + DIAG_INPUT + '" (fast · 캐시 무시) …');
      var t1 = performance.now(); var evs = 0; var routeEv = null; var cat = null;
      return run(DIAG_INPUT, { mode: 'fast', noCache: true, sessionId: 'browser-diagnose', onEvent: function (type, d) {
        evs++;
        if (type === 'route' && !routeEv) routeEv = d;
        if (type === 'stage' && d.name === 'route' && d.status === 'done') cat = d.category + '(' + d.by + ')';
        if (type === 'stage' && d.status === 'done') log('    stage ' + d.name + ' 완료');
      } }).then(function (done) {
        log('[2] PASS ' + Math.round(performance.now() - t1) + 'ms · 분류 ' + (cat || '-') + ' · ' + (routeEv ? routeEv.engine + ':' + routeEv.model : '-') + ' · 이벤트 ' + evs + '개');
        log('    답변: ' + String(done.final || '').replace(/\s+/g, ' ').slice(0, 120));
        log('[3] 게이트웨이 창에 "접속 POST /dc/run ← ' + location.origin + '" 가 찍혔다면 브라우저 → 게이트웨이 → 엔진 전 구간 확인 완료');
        log('결과: 통과 — 입력창 모드에서 CORE 를 골라 바로 쓰면 됩니다');
        return true;
      }, function (e) {
        log('[2] FAIL ' + e.message);
        if (/401/.test(e.message)) log('    → 게이트웨이 .env 의 DC_TOKEN 을 비우세요 (브라우저 CORE 는 토큰을 보내지 않음)');
        else if (/엔진|engine|Ollama/i.test(e.message)) log('    → Ollama 실행/모델 확인 (verify-core.bat 3번 항목)');
        else log('    → 게이트웨이 창의 마지막 warn/error 줄 확인');
        return false;
      });
    }).then(function (pass) { btn.disabled = false; if (!pass) log('결과: 실패 — 위 → 안내 확인. [결과 복사] 해서 보내 주시면 원인을 바로 짚어 드립니다'); check(); return pass; });
  }

  function boot() { pill(); if (localStorage.getItem(LS_USED) === '1') check(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
  window.DCCore = { url: url, check: check, open: open, waitConnected: waitConnected, run: run, diagnose: function () { open(); return diagnose(); }, state: function () { return last; } };
})();
