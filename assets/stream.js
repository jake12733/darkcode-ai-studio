/* DARK CODE · full-screen background token stream (classic script → window.DCStream)
 * Mixed tokens (hex, terminal commands, node status, braces/semicolons) fall vertically with per-column speed.
 * Full redraw per frame (no fade accumulation) so brightness is exactly controlled by CSS opacity (0.16–0.35).
 */
(() => {
  const TOKENS = [
    '0x7F3A9D2E', '0xDEADC0DE', '0x00FF66', '0x1F', 'ff 2a 9b 01', '#!/bin/sh', 'ssh -p 2222', 'ping 10.0.0.7', 'ls -la /core',
    'node:07 OK', 'node:12 SYNC', 'node:03 UP', '[ OK ]', '[SYS]', 'SYN/ACK', 'TLS1.3', 'GET /v1/models', '200 OK', 'ttl=86400',
    '{', '}', '};', '=>', '();', '[]', '&&', '||', '!=', '::', '</>', 'const', 'await', 'return', 'async', 'fn()', 'if(ok)',
    'wrr.pick()', 'cache.hit', 'gate:0tok', 'heap 42MB', 'rtt 12ms', 'pid 1047', 'sudo', 'grep -r', 'chmod 600', 'git push',
    '01101001', '10110011', '0101', 'AES-GCM', 'sha256', 'ACK', 'NULL', 'void*', 'int i=0;', 'i++', 'while(1)', 'exit 0',
  ];
  const rnd = (a, b) => a + Math.random() * (b - a);
  class TokenStream {
    constructor(canvas, { size = 15, density = 1 } = {}) {
      this.c = canvas; this.x = canvas.getContext('2d'); this.size = size; this.density = density;
      this.cols = []; this.on = false; this.f = this.f.bind(this);
      this.ro = new ResizeObserver(() => this.resize()); this.ro.observe(canvas);
      document.addEventListener('visibilitychange', () => { if (document.hidden) cancelAnimationFrame(this.raf); else if (this.on) { this.last = performance.now(); this.raf = requestAnimationFrame(this.f); } });
    }
    makeDrop(h, initial) {
      let txt = ''; while (txt.length < rnd(8, 26)) txt += TOKENS[(Math.random() * TOKENS.length) | 0] + (Math.random() < 0.5 ? ' ' : '');
      return { y: initial ? rnd(-h, h) : rnd(-h * 0.6, -20), v: rnd(38, 165), txt, bright: Math.random() < 0.12 };
    }
    resize() {
      const r = this.c.getBoundingClientRect(); if (!r.width || !r.height) return;
      const dpr = Math.min(2, devicePixelRatio || 1);
      this.c.width = Math.round(r.width * dpr); this.c.height = Math.round(r.height * dpr);
      this.x.setTransform(dpr, 0, 0, dpr, 0, 0); this.w = r.width; this.h = r.height;
      const n = Math.ceil((this.w / this.size) * this.density);
      const old = this.cols; this.cols = [];
      for (let i = 0; i < n; i++) this.cols.push(old[i] || { x: (i / this.density) * this.size, drops: [this.makeDrop(this.h, true)] });
      this.cols.forEach((c, i) => { c.x = (i / this.density) * this.size; });
    }
    start() { if (this.on) return; this.on = true; this.resize(); this.last = performance.now(); this.raf = requestAnimationFrame(this.f); }
    stop() { this.on = false; cancelAnimationFrame(this.raf); }
    f(now) {
      if (!this.on) return;
      this.raf = requestAnimationFrame(this.f);
      const dt = Math.min(0.06, (now - this.last) / 1000); this.last = now;
      const { x, size, w, h } = this; if (!w) return;
      x.clearRect(0, 0, w, h);
      x.font = `${size - 2}px 'JetBrains Mono', ui-monospace, monospace`; x.textBaseline = 'top';
      for (const col of this.cols) {
        for (const d of col.drops) {
          d.y += d.v * dt;
          const len = d.txt.length;
          for (let k = 0; k < len; k++) {
            const cy = d.y - k * size; if (cy < -size || cy > h) continue;
            const ch = d.txt[len - 1 - k]; if (ch === ' ') continue;
            const a = k === 0 ? 1 : Math.max(0, 0.85 - k / len);
            x.fillStyle = k === 0 ? (d.bright ? '#e0e7ff' : '#a5b4fc') : `rgba(99,102,241,${a * 0.5})`;
            x.fillText(ch, col.x, cy);
          }
        }
        col.drops = col.drops.filter((d) => d.y - d.txt.length * size < h);
        if (!col.drops.length || (col.drops.length < 2 && col.drops[col.drops.length - 1].y - col.drops[col.drops.length - 1].txt.length * size > rnd(40, h))) col.drops.push(this.makeDrop(h, false));
      }
    }
  }
  window.DCStream = { TokenStream };
})();
