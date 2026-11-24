/* DARK CODE · live dashboard + CODE waterfall stream (classic script → window.DarkFX)
 * - Telemetry: app.js pushes real router/cache/log events; panels mix real metrics (ping RTT, JS heap,
 *   main-thread load, request counts, provider health) with smooth simulation so nothing ever freezes.
 */
(() => {
  const G = '#6366f1', G2 = '#10b981', G3 = '#38bdf8', DIM = '#27272a', TXT = '#e4e4e7';
  const $ = (id) => document.getElementById(id);
  const rnd = (a, b) => a + Math.random() * (b - a);
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const pad = (n, w = 2) => String(n).padStart(w, '0');
  const MONO = "'JetBrains Mono', ui-monospace, monospace";
  function fit(c) {
    if (!c) return null;
    const dpr = Math.min(2, devicePixelRatio || 1); const w = c.clientWidth, h = c.clientHeight;
    if (!w || !h) return null;
    const W = Math.round(w * dpr), H = Math.round(h * dpr);
    if (c.width !== W || c.height !== H) { c.width = W; c.height = H; }
    const x = c.getContext('2d'); x.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { x, w, h };
  }
  const fmtUp = (ms) => { const s = Math.floor(ms / 1000); return `${pad(Math.floor(s / 3600))}:${pad(Math.floor(s / 60) % 60)}:${pad(s % 60)}`; };

  /* ---------------- telemetry bus ---------------- */
  const telemetry = {
    t0: Date.now(), calls: [], total: 0, ok: 0, fail: 0, cacheHit: 0, cacheMiss: 0, running: false, termQ: [],
    providers: () => [], claude: () => ({ in: 0, out: 0, calls: 0 }), free: () => [0, 80], cacheSize: () => 0,
    call(e) { this.calls.push({ ...e, t: performance.now() }); if (this.calls.length > 400) this.calls.shift(); this.total++; e.ok ? this.ok++ : this.fail++; },
    cache(hit) { hit ? this.cacheHit++ : this.cacheMiss++; },
    log(text, cls) { this.termQ.push({ text: String(text).replace(/\s+/g, ' ').trim(), cls: cls || 'real' }); if (this.termQ.length > 40) this.termQ.shift(); },
    recent(ms) { const n = performance.now(); return this.calls.filter((c) => n - c.t < ms); },
  };

  /* ---------------- matrix rain (background) ---------------- */
  class Rain {
    constructor(canvas, { size = 15, alpha = 0.08 } = {}) { this.c = canvas; this.size = size; this.alpha = alpha; this.cols = []; this.on = false; this.f = this.f.bind(this); this.chars = '01アイウエオカキクケコ{}[]<>/=+*#$%DARKCODE'.split(''); }
    start() { if (this.on) return; this.on = true; this.last = 0; this.raf = requestAnimationFrame(this.f); }
    stop() { this.on = false; cancelAnimationFrame(this.raf); }
    f(now) {
      if (!this.on) return;
      this.raf = requestAnimationFrame(this.f);
      if (now - this.last < 50) return; this.last = now;
      const r = fit(this.c); if (!r) return; const { x, w, h } = r;
      const n = Math.ceil(w / this.size);
      if (this.cols.length !== n) this.cols = Array.from({ length: n }, (_, i) => this.cols[i] ?? rnd(-h, 0));
      x.fillStyle = `rgba(0,0,0,${this.alpha})`; x.fillRect(0, 0, w, h);
      x.font = `${this.size - 2}px ${MONO}`;
      for (let i = 0; i < n; i++) {
        const y = this.cols[i];
        x.fillStyle = Math.random() < 0.08 ? '#d8ffe6' : G;
        x.fillText(this.chars[(Math.random() * this.chars.length) | 0], i * this.size, y);
        this.cols[i] = y > h + rnd(0, 300) ? rnd(-80, 0) : y + this.size;
      }
    }
  }

  /* ---------------- dashboard ---------------- */
  const TERM_TPL = [
    '[ OK ] mounted /dev/neural{d} → /core/mesh',
    '[ OK ] loaded module router.wrr v3.{d} (weighted round-robin)',
    '[ .. ] handshake gemini-free · app-check token refresh',
    '[ OK ] cache.lru warm · {cache} entries · ttl 86400s',
    '[INFO] pool health sweep → {ready}/{total} providers online',
    '[ OK ] tls1.3 session resumed · node-{hex}',
    '[ .. ] syncing shard {d}/16 ........ {p}%',
    '[WARN] ollama@localhost:11434 standby (local fallback armed)',
    '[ OK ] zero-claude gate armed · claude {ctok} tok this month',
    '[INFO] rx {kb} KB · tx {kb2} KB · rtt {ping} ms',
    '[ OK ] spawned pid {pid} worker.stream',
    '[ .. ] compiling shader rain.glsl ... done',
    '[ OK ] context compressor ready · threshold 6000 tok',
    '[INFO] heartbeat seq={seq} jitter {j}ms',
    '[ OK ] firewall rule set 0x{hex} applied',
    '[ .. ] indexing artifacts › {d} files',
    '[ OK ] verify.static compiler online (0 tok)',
    '[INFO] gc sweep · heap {heap} MB',
  ];
  const PROC_BASE = [
    ['dc-core', 'orchestrator'], ['router.wrr', 'scheduler'], ['cache.lru', 'storage'], ['ctx.compress', 'summarizer'],
    ['verify.static', 'compiler'], ['rain.render', 'gpu'], ['net.probe', 'network'], ['gate.claude', 'escalation'],
  ];

  class Dashboard {
    constructor() {
      this.on = false; this.f = this.f.bind(this);
      this.N = 90;
      this.s = { down: [], up: [], ping: [], cpu: [], mem: [] };
      this.cur = { down: 40, up: 10, ping: 35, cpu: 14, mem: 52 };
      this.tgt = { ...this.cur };
      for (const k in this.s) this.s[k] = Array(this.N).fill(this.cur[k]);
      this.bars = Array.from({ length: 36 }, () => ({ v: rnd(0.15, 0.6), t: rnd(0.15, 0.6), real: 0 }));
      this.radar = 0; this.contacts = [];
      this.procs = PROC_BASE.map(([n, t], i) => ({ pid: 1000 + i * 37 + ((Math.random() * 30) | 0), name: n, type: t, cpu: rnd(0.2, 4), mem: rnd(8, 60), state: 'RUN' }));
      this.term = []; this.typing = null; this.nextTerm = 0; this.seq = 0;
      this.realPing = null; this.load = 0; this.lastT = 0; this.tick4 = 0; this.tick1 = 0; this.phase = 0;
    }
    mount() {
      this.rain = new Rain($('dashRain'), { size: 15, alpha: 0.09 });
      for (let i = 0; i < 6; i++) this.pushTerm(this.makeLine());
    }
    start() {
      if (this.on) return; this.on = true; this.lastT = performance.now();
      this.raf = requestAnimationFrame(this.f); this.rain.start();
      this.ping(); this.pingT = setInterval(() => this.ping(), 4000);
    }
    stop() { this.on = false; cancelAnimationFrame(this.raf); this.rain.stop(); clearInterval(this.pingT); }
    async ping() {
      if (document.hidden || !/^https?:$/.test(location.protocol)) return;
      const t = performance.now();
      try { await fetch('assets/logo-clean.svg', { method: 'GET', cache: 'no-store' }); this.realPing = performance.now() - t; } catch { this.realPing = null; }
    }
    f(now) {
      if (!this.on) return;
      this.raf = requestAnimationFrame(this.f);
      const dt = Math.min(100, now - this.lastT); this.lastT = now;
      this.load = lerp(this.load, clamp((dt - 16.7) / 40, 0, 1), 0.05);
      this.phase += dt / 1000;
      if (now - this.tick4 > 250) { this.tick4 = now; this.data(); }
      if (now - this.tick1 > 1000) { this.tick1 = now; this.second(); }
      if (now > this.nextTerm) this.termStep(now);
      for (const k in this.cur) this.cur[k] = lerp(this.cur[k], this.tgt[k], 0.08);
      for (const b of this.bars) b.v = lerp(b.v, b.t, 0.1);
      this.radar = (this.radar + dt * 0.0016) % (Math.PI * 2);
      this.drawNet(); this.drawGauge('cCpuG', this.cur.cpu, 'CPU'); this.drawLine('cCpuL', this.s.cpu, G);
      this.drawGauge('cMemG', this.cur.mem, 'MEM'); this.drawLine('cMemL', this.s.mem, G2);
      this.drawBars(); this.drawRadar(); this.typeStep();
    }
    data() {
      const busy = telemetry.running ? 1 : 0;
      const conn = navigator.connection;
      const wave = Math.sin(this.phase * 0.7) * 0.5 + Math.sin(this.phase * 2.3) * 0.25;
      const recent = telemetry.recent(1500).length;
      const baseDown = conn?.downlink ? conn.downlink * 10 : 48;
      this.tgt.down = clamp(baseDown * (0.75 + wave * 0.15 + rnd(-0.08, 0.08)) + busy * rnd(20, 60) + recent * 12, 1, 999);
      this.tgt.up = clamp(this.tgt.down * rnd(0.12, 0.3) + busy * rnd(3, 10), 0.5, 400);
      this.tgt.ping = this.realPing != null ? this.realPing * rnd(0.92, 1.08) : clamp(28 + wave * 10 + rnd(-4, 4), 5, 400);
      this.tgt.cpu = clamp(6 + this.load * 70 + busy * rnd(22, 48) + recent * 6 + (wave + 0.5) * 6 + rnd(-2, 2), 1, 99);
      const pm = performance.memory;
      this.tgt.mem = pm ? clamp((pm.usedJSHeapSize / pm.totalJSHeapSize) * 100 + rnd(-0.6, 0.6), 1, 99) : clamp(48 + wave * 6 + busy * 8, 5, 95);
      for (const k in this.s) { this.s[k].push(this.cur[k]); if (this.s[k].length > this.N) this.s[k].shift(); }
      const net = $('netVals');
      if (net) net.innerHTML = `<span><i style="background:${G}"></i>DOWN <b>${this.cur.down.toFixed(1)}</b> Mbps</span><span><i style="background:${G3}"></i>UP <b>${this.cur.up.toFixed(1)}</b> Mbps</span><span><i style="background:#d8ffe6"></i>PING <b>${Math.round(this.cur.ping)}</b> ms${this.realPing != null ? '<sup>LIVE</sup>' : ''}</span>`;
      const nb = $('netBadge'); if (nb) { nb.textContent = this.realPing != null ? 'LIVE RTT' : 'SIM'; nb.className = this.realPing != null ? 'live' : ''; }
    }
    second() {
      // activity bars: real calls this second + simulated global traffic
      const real = telemetry.recent(1000).length;
      this.bars.shift();
      this.bars.push({ v: 0, t: clamp(rnd(0.12, 0.55) + Math.sin(this.phase) * 0.12 + real * 0.25 + (telemetry.running ? 0.25 : 0), 0.05, 1), real });
      const tot = telemetry.total;
      const av = $('actVals');
      if (av) av.innerHTML = `<span>REQ TOTAL <b>${tot}</b></span><span>OK <b>${telemetry.ok}</b></span><span>FAIL <b>${telemetry.fail}</b></span><span>LAST 60s <b>${telemetry.recent(60000).length}</b></span>`;
      // CPU / MEM footers
      const pm = performance.memory;
      const cv = $('cpuVals'); if (cv) cv.innerHTML = `<span>LOAD <b>${this.cur.cpu.toFixed(0)}%</b></span><span>CORES <b>${navigator.hardwareConcurrency || '?'}</b></span><span>${telemetry.running ? '<b class="hot">EXECUTING</b>' : 'IDLE'}</span>`;
      const mv = $('memVals'); if (mv) mv.innerHTML = pm ? `<span>HEAP <b>${(pm.usedJSHeapSize / 1048576).toFixed(1)}</b>/${(pm.totalJSHeapSize / 1048576).toFixed(0)} MB</span><span>DEVICE <b>${navigator.deviceMemory || '?'}</b> GB</span>` : `<span>HEAP <b>${this.cur.mem.toFixed(0)}%</b> (SIM)</span>`;
      const mb = $('memBadge'); if (mb) { mb.textContent = pm ? 'LIVE HEAP' : 'SIM'; mb.className = pm ? 'live' : ''; }
      const cb = $('cpuBadge'); if (cb) { cb.textContent = 'MAIN THREAD'; cb.className = 'live'; }
      this.procTick(); this.kpis(); this.security();
      if (!this.stT || Date.now() - this.stT > 5000) { this.stT = Date.now(); this.storage(); }
      // radar contacts
      if (Math.random() < 0.5) this.contacts.push({ a: rnd(0, Math.PI * 2), r: rnd(0.25, 0.95), life: 1 });
      this.contacts = this.contacts.filter((c) => (c.life -= 0.08) > 0);
    }
    security() {
      const el = $('secBody'); if (!el) return;
      const fails = telemetry.recent(60000).filter((c) => !c.ok);
      const box = $('secPanel');
      if (fails.length) {
        const f = fails[fails.length - 1];
        box?.classList.add('alert');
        el.innerHTML = `<div class="sec-ico">&#9888;</div><div><b>ROUTER ALERT</b><p>${f.short} · ${f.status} · failover engaged</p><code>Trace: 0x${Math.floor(f.t * 1000).toString(16).toUpperCase().slice(-8)} · ${fails.length} event(s)/60s</code></div>`;
        return;
      }
      box?.classList.remove('alert');
      if (!this.secT || Date.now() - this.secT > 6000) {
        this.secT = Date.now();
        const ip = `${(rnd(20, 223)) | 0}.${(rnd(0, 255)) | 0}.${(rnd(0, 255)) | 0}.${(rnd(1, 254)) | 0}`;
        const ev = [['PORT SCAN BLOCKED', `src ${ip} · dropped`], ['INTEGRITY CHECK', 'core modules sha256 verified'], ['FIREWALL HIT', `rule 0x${Math.floor(rnd(0, 0xffff)).toString(16).toUpperCase()} · ${ip}`], ['KEY VAULT SEALED', 'api keys local-only · never transmitted'], ['ANOMALY SCAN', 'no unauthorized access detected']];
        const [t, d] = ev[(Math.random() * ev.length) | 0];
        el.innerHTML = `<div class="sec-ico ok">&#9737;</div><div><b>${t}</b><p>${d}</p><code>Trace: 0x${Math.floor(rnd(0, 0xffffffff)).toString(16).toUpperCase().padStart(8, '0')} <sup>SIM</sup></code></div>`;
      }
    }
    storage() {
      const el = $('stoBody'); if (!el) return;
      const cat = { Data: 0, System: 0, Logs: 0, Backup: 0 };
      try {
        for (let i = 0; i < localStorage.length; i++) {
          const k = localStorage.key(i); if (!k || !k.startsWith('pst:')) continue;
          const n = (localStorage.getItem(k) || '').length * 2;
          if (k.startsWith('pst:threads')) cat.Data += n; else if (/^pst:(c:|cidx)/.test(k)) cat.Backup += n; else if (/^pst:(health|claude|free)/.test(k)) cat.Logs += n; else cat.System += n;
        }
      } catch {}
      const max = Math.max(1, ...Object.values(cat));
      const lab = { Data: '작업 히스토리', System: '설정·계정', Logs: '헬스·사용량', Backup: '응답 캐시' };
      el.innerHTML = Object.entries(cat).map(([k, v]) => `<div class="sto"><span class="fold"></span><b>${k}</b><small>${lab[k]}</small><em>${v > 1048576 ? (v / 1048576).toFixed(1) + ' MB' : v >= 1024 ? (v / 1024).toFixed(1) + ' KB' : v + ' B'}</em><i><u style="width:${Math.max(2, (v / max) * 100)}%"></u></i></div>`).join('');
    }
    kpis() {
      const k = $('kpis'); if (!k) return;
      const pv = telemetry.providers(); const pool = pv.filter((p) => !p.primary && !p.local);
      const ready = pool.filter((p) => p.state === 'ok').length;
      const hits = telemetry.cacheHit, miss = telemetry.cacheMiss;
      const c = telemetry.claude(); const [fu, fc] = telemetry.free();
      const items = [
        ['UPTIME', fmtUp(Date.now() - telemetry.t0)], ['POOL', `${ready}/${pool.length}`], ['REQUESTS', telemetry.total],
        ['CACHE HIT', hits + miss ? `${Math.round((hits / (hits + miss)) * 100)}%` : '--'], ['CLAUDE TOK', (c.in + c.out).toLocaleString()], ['FREE', `${fu}/${fc}`],
      ];
      k.innerHTML = items.map(([a, b]) => `<div class="kpi"><small>${a}</small><b>${b}</b></div>`).join('');
      const su = $('sideUptime'); if (su) su.textContent = `NODE ONLINE · ${fmtUp(Date.now() - telemetry.t0)}`;
    }
    procTick() {
      const body = $('procBody'); if (!body) return;
      const pv = telemetry.providers();
      const active = new Set(telemetry.recent(4000).map((c) => c.pid));
      const rows = this.procs.map((p) => {
        p.cpu = clamp(p.cpu + rnd(-1.2, 1.2) + (telemetry.running && ['dc-core', 'router.wrr', 'rain.render'].includes(p.name) ? rnd(2, 8) : 0) - (p.cpu > 12 ? 2 : 0), 0.1, 38);
        p.mem = clamp(p.mem + rnd(-1.5, 1.5), 4, 160);
        p.state = p.cpu > 6 ? 'RUN' : p.cpu > 1.5 ? 'IDLE' : 'SLEEP';
        return p;
      });
      pv.forEach((q, i) => {
        let pr = this.procs.find((p) => p.name === 'prov.' + q.id);
        if (!pr) { pr = { pid: 2000 + i * 13, name: 'prov.' + q.id, type: q.short, cpu: 0.3, mem: rnd(6, 20) }; this.procs.push(pr); rows.push(pr); }
        const on = active.has(q.id);
        pr.cpu = on ? clamp(pr.cpu + rnd(4, 12), 0, 45) : clamp(pr.cpu * 0.6 + rnd(0, 0.4), 0, 45);
        pr.state = on ? 'STREAM' : q.state === 'ok' ? 'READY' : q.state === 'cool' ? 'COOLDOWN' : q.state === 'bad' ? 'DEGRADED' : 'OFF';
      });
      const sorted = [...this.procs].sort((a, b) => b.cpu - a.cpu).slice(0, 12);
      body.innerHTML = sorted.map((p) => `<tr class="st-${p.state.toLowerCase()}"><td>${p.pid}</td><td>${p.name}</td><td>${p.state}</td><td>${p.cpu.toFixed(1)}</td><td>${p.mem.toFixed(0)}M</td><td><span class="mbar"><b style="width:${clamp(p.cpu * 2.6, 2, 100)}%"></b></span></td></tr>`).join('');
      const b = $('procBadge'); if (b) b.textContent = `${this.procs.length} PROC`;
    }
    makeLine() {
      const pv = telemetry.providers(); const pool = pv.filter((p) => !p.primary && !p.local);
      const pm = performance.memory; const c = telemetry.claude();
      const t = TERM_TPL[(Math.random() * TERM_TPL.length) | 0];
      return t.replace('{d}', (Math.random() * 15 + 1) | 0).replace('{hex}', Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0'))
        .replace('{p}', (Math.random() * 100) | 0).replace('{cache}', telemetry.cacheSize()).replace('{ready}', pool.filter((p) => p.state === 'ok').length).replace('{total}', pool.length || 8)
        .replace('{kb}', (rnd(40, 900)) | 0).replace('{kb2}', (rnd(5, 200)) | 0).replace('{ping}', Math.round(this.cur.ping)).replace('{pid}', (rnd(2000, 9999)) | 0)
        .replace('{seq}', ++this.seq).replace('{j}', rnd(0.2, 4).toFixed(1)).replace('{ctok}', (c.in + c.out).toLocaleString()).replace('{heap}', pm ? (pm.usedJSHeapSize / 1048576).toFixed(1) : rnd(30, 60).toFixed(1));
    }
    pushTerm(text, cls = '') { this.term.push({ text, cls, shown: text.length }); if (this.term.length > 40) this.term.shift(); this.renderTerm(); }
    termStep(now) {
      const q = telemetry.termQ.shift();
      const line = q ? { text: '▶ ' + q.text, cls: 'real ' + (q.cls || '') } : { text: this.makeLine(), cls: '' };
      const d = new Date(); const ts = `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
      this.term.push({ text: `${ts} ${line.text}`, cls: line.cls, shown: 0 }); if (this.term.length > 40) this.term.shift();
      this.typing = this.term[this.term.length - 1];
      this.nextTerm = now + (q ? 140 : rnd(450, 1500));
      this.renderTerm();
    }
    typeStep() {
      if (!this.typing || this.typing.shown >= this.typing.text.length) return;
      this.typing.shown = Math.min(this.typing.text.length, this.typing.shown + 3);
      const el = $('dTerm')?.lastElementChild; if (el) el.firstChild.textContent = this.typing.text.slice(0, this.typing.shown);
    }
    renderTerm() {
      const el = $('dTerm'); if (!el) return;
      const max = Math.max(5, Math.floor((el.clientHeight || 180) / 17));
      const lines = this.term.slice(-max);
      el.innerHTML = lines.map((l, i) => {
        const cls = /\[WARN\]/.test(l.text) ? 'warn' : /\[ OK \]/.test(l.text) ? 'ok' : '';
        const txt = i === lines.length - 1 ? l.text.slice(0, l.shown) : l.text;
        return `<div class="${l.cls} ${cls}">${txt.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]))}${i === lines.length - 1 ? '<span class="cur">█</span>' : ''}</div>`;
      }).join('');
    }
    /* ---- drawing ---- */
    grid(x, w, h, step = 20) {
      x.strokeStyle = 'rgba(255,255,255,.045)'; x.lineWidth = 1; x.beginPath();
      for (let gx = 0; gx < w; gx += step) { x.moveTo(gx + 0.5, 0); x.lineTo(gx + 0.5, h); }
      for (let gy = 0; gy < h; gy += step) { x.moveTo(0, gy + 0.5); x.lineTo(w, gy + 0.5); }
      x.stroke();
    }
    path(x, arr, w, h, max, color, fill, width = 1.8) {
      const n = arr.length; if (!n) return;
      x.beginPath();
      arr.forEach((v, i) => { const px = (i / (n - 1)) * w, py = h - (clamp(v / max, 0, 1) * (h - 8)) - 4; i ? x.lineTo(px, py) : x.moveTo(px, py); });
      x.strokeStyle = color; x.lineWidth = width; x.stroke();
      if (fill) { x.lineTo(w, h); x.lineTo(0, h); x.closePath(); const g = x.createLinearGradient(0, 0, 0, h); g.addColorStop(0, fill); g.addColorStop(1, 'rgba(99,102,241,0)'); x.fillStyle = g; x.fill(); }
    }
    drawNet() {
      const r = fit($('cNet')); if (!r) return; const { x, w, h } = r;
      x.clearRect(0, 0, w, h); this.grid(x, w, h);
      const max = Math.max(60, ...this.s.down) * 1.15;
      this.path(x, this.s.down, w, h, max, G, 'rgba(99,102,241,.24)');
      this.path(x, this.s.up, w, h, max, G3, 'rgba(56,189,248,.16)', 1.4);
      const pmax = Math.max(80, ...this.s.ping) * 1.3;
      x.setLineDash([3, 3]); this.path(x, this.s.ping, w, h, pmax, '#a1a1aa', null, 1); x.setLineDash([]);
    }
    drawLine(id, arr, color) {
      const r = fit($(id)); if (!r) return; const { x, w, h } = r;
      x.clearRect(0, 0, w, h); this.grid(x, w, h, 16);
      this.path(x, arr, w, h, 100, color, color === G ? 'rgba(99,102,241,.22)' : 'rgba(16,185,129,.22)');
    }
    drawGauge(id, val, label) {
      const r = fit($(id)); if (!r) return; const { x, w, h } = r;
      x.clearRect(0, 0, w, h);
      const cx = w / 2, cy = h * 0.62, rad = Math.min(w / 2 - 8, h * 0.55);
      const a0 = Math.PI * 0.8, a1 = Math.PI * 2.2, av = a0 + (a1 - a0) * clamp(val / 100, 0, 1);
      x.lineCap = 'round';
      x.strokeStyle = 'rgba(255,255,255,.08)'; x.lineWidth = 8; x.beginPath(); x.arc(cx, cy, rad, a0, a1); x.stroke();
      const g = x.createLinearGradient(0, 0, w, 0); g.addColorStop(0, G); g.addColorStop(1, val > 80 ? '#f59e0b' : G2);
      x.strokeStyle = g; x.beginPath(); x.arc(cx, cy, rad, a0, av); x.stroke();
      x.fillStyle = '#f4f4f5'; x.font = `700 ${Math.round(rad * 0.44)}px ${MONO}`; x.textAlign = 'center'; x.textBaseline = 'middle';
      x.fillText(`${Math.round(val)}%`, cx, cy + rad * 0.08);
      x.fillStyle = '#71717a'; x.font = `600 10px ${MONO}`; x.fillText(label, cx, cy - rad * 0.42); x.textAlign = 'start';
    }
    drawBars() {
      const r = fit($('cAct')); if (!r) return; const { x, w, h } = r;
      x.clearRect(0, 0, w, h); this.grid(x, w, h, 18);
      const n = this.bars.length, bw = w / n;
      this.bars.forEach((b, i) => {
        const bh = b.v * (h - 10); const px = i * bw + 1.5, py = h - bh;
        const g = x.createLinearGradient(0, py, 0, h); g.addColorStop(0, b.real ? '#34d399' : '#818cf8'); g.addColorStop(1, 'rgba(99,102,241,.14)');
        x.fillStyle = g; x.fillRect(px, py, bw - 3, bh);
        x.fillStyle = b.real ? '#6ee7b7' : '#a5b4fc'; x.fillRect(px, py, bw - 3, 2);
      });
    }
    drawRadar() {
      const r = fit($('cRadar')); if (!r) return; const { x, w, h } = r;
      x.clearRect(0, 0, w, h);
      const cx = w / 2, cy = h / 2, R = Math.min(w, h) / 2 - 8;
      x.strokeStyle = 'rgba(255,255,255,.08)'; x.lineWidth = 1;
      for (let i = 1; i <= 4; i++) { x.beginPath(); x.arc(cx, cy, (R * i) / 4, 0, Math.PI * 2); x.stroke(); }
      x.beginPath(); x.moveTo(cx - R, cy); x.lineTo(cx + R, cy); x.moveTo(cx, cy - R); x.lineTo(cx, cy + R); x.stroke();
      if (x.createConicGradient) {
        const g = x.createConicGradient(this.radar - Math.PI / 2.2, cx, cy);
        g.addColorStop(0, 'rgba(99,102,241,0)'); g.addColorStop(0.85, 'rgba(99,102,241,0)'); g.addColorStop(1, 'rgba(99,102,241,.28)');
        x.fillStyle = g; x.beginPath(); x.arc(cx, cy, R, 0, Math.PI * 2); x.fill();
      }
      x.strokeStyle = '#818cf8'; x.lineWidth = 1.4; x.beginPath(); x.moveTo(cx, cy); x.lineTo(cx + Math.cos(this.radar) * R, cy + Math.sin(this.radar) * R); x.stroke();
      const pv = telemetry.providers();
      pv.forEach((p, i) => {
        const a = (i / Math.max(1, pv.length)) * Math.PI * 2 + 0.3;
        const rr = R * clamp(0.3 + (p.lat ? Math.min(p.lat, 9000) / 12000 : 0.45), 0.25, 0.95);
        const diff = ((this.radar - a) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);
        const glow = clamp(1 - diff / 2.2, 0.2, 1);
        const col = p.state === 'ok' ? `rgba(16,185,129,${glow})` : p.state === 'cool' ? `rgba(245,158,11,${glow})` : `rgba(113,113,122,${glow * 0.7})`;
        const px = cx + Math.cos(a) * rr, py = cy + Math.sin(a) * rr;
        x.fillStyle = col; x.beginPath(); x.arc(px, py, p.state === 'ok' ? 3.5 : 2.5, 0, Math.PI * 2); x.fill();
        if (p.state === 'ok' && glow > 0.55) { x.fillStyle = '#e4e4e7'; x.font = `9px ${MONO}`; x.fillText(p.short, px + 6, py + 3); }
      });
      this.contacts.forEach((c) => { x.fillStyle = `rgba(165,180,252,${c.life * 0.5})`; x.fillRect(cx + Math.cos(c.a) * R * c.r, cy + Math.sin(c.a) * R * c.r, 2, 2); });
      x.fillStyle = '#71717a'; x.font = `10px ${MONO}`; x.fillText(`AZ ${((this.radar * 180) / Math.PI).toFixed(0).padStart(3, '0')}°`, 8, h - 8);
    }
  }

  /* ---------------- CODE tab: looping code waterfall ---------------- */
  const CORPUS = `// DARK CODE :: core orchestrator
const route = wrr.pick(pool, { role, health, avoid });
if (res.status === 429) cooldown(provider, 60_000);
for await (const chunk of stream(res)) emit(chunk);
cache.set(key, output, { ttl: 86400 });
const snapshot = compress(history, ['완료된 단계','현재 산출물','다음 실행 작업','제약조건']);
if (verify.static(code).length) await repair(free.pool);
gate.escalate('a') ?? keepZeroClaude();
export async function handshake(node) {
  const token = await appCheck.getToken(false);
  return fetch(node.url, { headers: { 'X-Firebase-AppCheck': token } });
}
while (pool.healthy().length === 0) await ollama.fallback('qwen2.5-coder:14b');
SELECT id, status, latency_ms FROM providers WHERE health > 0.35 ORDER BY weight DESC;
<div class="terminal" data-node="0x7f3a">ACCESS GRANTED</div>
function decrypt(buf) { return buf.map((b, i) => b ^ KEY[i % KEY.length]); }
ssh root@darkcode.node -p 2222 -i ~/.ssh/id_ed25519
docker run --gpus all -p 11434:11434 ollama/ollama
git commit -m "feat: zero-claude escalation gate"
python3 -m darkcode.agent --mode council --stream
kubectl rollout status deploy/dark-core --timeout=60s`.split('\n');
  const TERM_LINES = ['[ OK ] stream buffer flushed', '[ .. ] decrypting payload', '[ OK ] node handshake 0x{h}', '>> injecting module ...... done', '[SYS] packet loss 0.0%', '[ OK ] checksum verified', '>> tracing route 10.0.{a}.{b}', '[WARN] entropy pool low, reseeding'];
  const KW = /\b(const|let|var|function|return|await|async|for|of|if|while|export|import|from|new|class|SELECT|FROM|WHERE|ORDER|BY|DESC|sudo|ssh|docker|git|python3|kubectl)\b/g;
  class CodeWaterfall {
    constructor(canvas, getSource) {
      this.c = canvas; this.getSource = getSource; this.on = false; this.f = this.f.bind(this);
      this.lines = []; this.off = 0; this.lh = 19; this.srcIdx = 0; this.lineNo = 1; this.speed = 70; this.burst = 0; this.count = 0;
      this.cols = []; this.binChars = '01';
    }
    start() { if (this.on) return; this.on = true; this.last = performance.now(); this.raf = requestAnimationFrame(this.f); }
    stop() { this.on = false; cancelAnimationFrame(this.raf); }
    nextText() {
      const src = this.getSource?.() || [];
      const pool = src.length ? src : CORPUS;
      const r = Math.random();
      if (r < 0.62) { const t = pool[this.srcIdx++ % pool.length]; return { text: t, kind: 'code' }; }
      if (r < 0.77) { const addr = '0x' + Math.floor(Math.random() * 0xffffffff).toString(16).padStart(8, '0'); return { text: `${addr}  ${Array.from({ length: 12 }, () => Math.floor(Math.random() * 256).toString(16).padStart(2, '0')).join(' ')}  |${Array.from({ length: 8 }, () => String.fromCharCode(33 + Math.random() * 90)).join('')}|`, kind: 'hex' }; }
      if (r < 0.88) return { text: Array.from({ length: 8 }, () => Array.from({ length: 8 }, () => (Math.random() < 0.5 ? '0' : '1')).join('')).join(' '), kind: 'bin' };
      const t = TERM_LINES[(Math.random() * TERM_LINES.length) | 0].replace('{h}', Math.floor(Math.random() * 0xffff).toString(16)).replace('{a}', (Math.random() * 255) | 0).replace('{b}', (Math.random() * 255) | 0);
      return { text: t, kind: 'term' };
    }
    spawn() { const n = this.nextText(); this.lines.unshift({ ...n, no: this.lineNo++, shown: 0, born: performance.now() }); this.count++; }
    f(now) {
      if (!this.on) return;
      this.raf = requestAnimationFrame(this.f);
      const r = fit(this.c); if (!r) return; const { x, w, h } = r;
      const dt = Math.min(64, now - this.last) / 1000; this.last = now;
      if (Math.random() < 0.004) this.burst = 1.2;
      this.burst = Math.max(0, this.burst - dt * 0.6);
      const v = this.speed * (1 + this.burst * 3);
      this.off += v * dt;
      const need = Math.ceil(h / this.lh) + 2;
      if (!this.lines.length) for (let i = 0; i < need; i++) this.spawn();
      while (this.off >= this.lh) { this.off -= this.lh; this.spawn(); }
      if (this.lines.length > need) this.lines.length = need;
      // background
      x.fillStyle = '#09090b'; x.fillRect(0, 0, w, h);
      const gut = 54;
      x.font = `12.5px ${MONO}`; x.textBaseline = 'middle';
      for (let i = 0; i < this.lines.length; i++) {
        const L = this.lines[i];
        const y = this.off + (i - 1) * this.lh + this.lh / 2;
        if (y < -this.lh || y > h + this.lh) continue;
        const depth = clamp(y / h, 0, 1);
        const a = clamp(1 - depth * 0.82, 0.16, 1);
        if (i <= 1) L.shown = Math.min(L.text.length, L.shown + 2 + this.burst * 4); else L.shown = L.text.length;
        x.fillStyle = `rgba(113,113,122,${0.7 * a})`; x.fillText(String(L.no).padStart(5, ' '), 4, y);
        x.fillStyle = `rgba(255,255,255,${0.06 * a})`; x.fillRect(gut - 8, y - this.lh / 2, 1, this.lh);
        const t = L.text.slice(0, L.shown);
        this.drawTokens(x, t, gut, y, a, L.kind, i <= 1);
        if (i === 1 && L.shown < L.text.length) { const mw = x.measureText(t).width; x.fillStyle = '#818cf8'; x.fillRect(gut + mw + 2, y - 7, 7, 14); }
      }
      const tg = x.createLinearGradient(0, 0, 0, 50); tg.addColorStop(0, 'rgba(99,102,241,.08)'); tg.addColorStop(1, 'rgba(99,102,241,0)'); x.fillStyle = tg; x.fillRect(0, 0, w, 50);
      const bg = x.createLinearGradient(0, h - 100, 0, h); bg.addColorStop(0, 'rgba(9,9,11,0)'); bg.addColorStop(1, 'rgba(9,9,11,.94)'); x.fillStyle = bg; x.fillRect(0, h - 100, w, 100);
      const hud = document.getElementById('wfHud');
      if (hud && (!this.hudT || now - this.hudT > 250)) { this.hudT = now; hud.innerHTML = `<span class="rec">●</span> STREAMING <b>${Math.round(v / this.lh * 10) / 10}</b> lines/s · <b>${this.count.toLocaleString()}</b> lines · src <b>${(this.getSource?.() || []).length ? 'artifacts' : 'core corpus'}</b>${this.burst > 0.2 ? ' · <b class="hot">BURST</b>' : ''}`; }
    }
    drawTokens(x, text, x0, y, a, kind, hot) {
      if (kind === 'bin') { x.fillStyle = `rgba(113,113,122,${0.7 * a})`; x.fillText(text, x0, y); return; }
      if (kind === 'hex') { x.fillStyle = `rgba(96,165,250,${0.75 * a})`; x.fillText(text, x0, y); return; }
      if (kind === 'term') { x.fillStyle = /WARN/.test(text) ? `rgba(245,158,11,${a})` : `rgba(52,211,153,${a})`; x.fillText(text, x0, y); return; }
      if (/^\s*(\/\/|#|--)/.test(text)) { x.fillStyle = `rgba(113,113,122,${a})`; x.fillText(text, x0, y); return; }
      let cx = x0; const parts = text.split(/(\b(?:const|let|var|function|return|await|async|for|of|if|while|export|import|from|new|class|SELECT|FROM|WHERE|ORDER|BY|DESC|ssh|docker|git|python3|kubectl)\b|'[^']*'|"[^"]*"|`[^`]*`)/g);
      for (const p of parts) {
        if (!p) continue;
        KW.lastIndex = 0;
        if (KW.test(p) && /^\w+$/.test(p)) x.fillStyle = hot ? '#c4b5fd' : `rgba(167,139,250,${a})`;
        else if (/^['"`]/.test(p)) x.fillStyle = `rgba(52,211,153,${a})`;
        else x.fillStyle = `rgba(228,228,231,${0.88 * a})`;
        x.fillText(p, cx, y); cx += x.measureText(p).width;
      }
    }
  }

  window.DarkFX = { telemetry, Dashboard, CodeWaterfall, Rain };
})();
