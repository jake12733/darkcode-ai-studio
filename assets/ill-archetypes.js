/* ILL AI · Multi-Archetype Bespoke Website Renderers
 * Learned from Owen's Archive (41 projects) & 2025-2026 Awwwards / GDWEB top-1% benchmarks:
 * 1. atelier      (TWO FOLD inspired)  : Fashion / Beauty / Jewelry / Cosmetic Atelier Lookbook
 * 2. architecture (Gyeol + Myeongjin)  : Interior / Architecture / Construction + Live Quote Estimator
 * 3. luxury       (BELLUCE + Kwang)    : Nocturnal Hotel / Resort / Fine Dining / Craft + Live Rate Engine
 * 4. cafe         (Orange Dining)      : Organic Cafe / Bakery / Brunch + Film Hero & Menu Board
 * 5. saas         (STRATA Cloud)       : Dark Technical SaaS + Live Telemetry Console, SDK & Pricing Toggle
 * (Medical & Consulting/Enterprise use Meridian-Editorial + Interactive Medical Pathway/Recovery/Triage Modules)
 */
(function () {
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  /* Shared bespoke generative visual synthesizer snippet (0ms, zero external rate-limit banners) */
  const ART_SYNTH_JS = `
function illArt(label, idx, P, mode){
  const c=document.createElement('canvas'); c.width=1200; c.height=900;
  const x=c.getContext('2d'), W=1200, H=900, seed=(idx+1)*119.3;
  const g=x.createLinearGradient(0,0,W,H);
  g.addColorStop(0,P.a||'#1d3a2c'); g.addColorStop(.55,P.b||'#25493a'); g.addColorStop(1,P.c||'#0d0f12');
  x.fillStyle=g; x.fillRect(0,0,W,H);
  const lx=W*(.25+((idx*27)%52)/100), ly=H*(.22+((idx*19)%40)/100);
  const r=x.createRadialGradient(lx,ly,20,lx,ly,W*.75);
  r.addColorStop(0,(P.hi||'#d8e86c')+'aa'); r.addColorStop(.45,(P.hi||'#d8e86c')+'24'); r.addColorStop(1,'transparent');
  x.fillStyle=r; x.fillRect(0,0,W,H);
  x.save();
  if(mode==='atelier'){
    // Soft cotton linen fold & stitching geometry
    x.strokeStyle='rgba(30,27,24,0.18)'; x.lineWidth=2;
    for(let k=0;k<7;k++){x.beginPath();x.moveTo(0,120+k*110);x.bezierCurveTo(W*.35,80+k*110+Math.sin(seed+k)*50,W*.65,160+k*110,W,110+k*110);x.stroke();}
    x.setLineDash([8,8]); x.strokeStyle=(P.hi||'#6A4330')+'88'; x.beginPath(); x.moveTo(W*.5,60); x.lineTo(W*.5,H-60); x.stroke(); x.setLineDash([]);
    x.beginPath(); x.arc(W*.5,H*.46,190,0,Math.PI*2); x.fillStyle='rgba(255,255,255,0.22)'; x.fill();
  } else if(mode==='arch'){
    // Architectural travertine gallery planes & shadow beams
    x.fillStyle='rgba(255,255,255,0.09)'; x.fillRect(W*.14,H*.12,W*.34,H*.74);
    x.fillStyle='rgba(0,0,0,0.18)'; x.fillRect(W*.52,H*.2,W*.36,H*.66);
    x.strokeStyle=(P.hi||'#c8a77c')+'88'; x.lineWidth=1.8;
    x.strokeRect(W*.18,H*.16,W*.64,H*.68);
    x.beginPath(); x.moveTo(W*.14,H*.86); x.lineTo(W*.52,H*.2); x.stroke();
  } else if(mode==='cafe'){
    // Warm sunlight window blinds & organic citrus circles
    for(let k=0;k<5;k++){x.fillStyle='rgba(255,255,255,0.08)';x.fillRect(80+k*210,0,90,H);}
    x.beginPath(); x.arc(W*.55,H*.46,210,0,Math.PI*2); x.fillStyle=(P.hi||'#f2661c')+'55'; x.fill();
    x.beginPath(); x.arc(W*.42,H*.56,120,0,Math.PI*2); x.strokeStyle='rgba(255,255,255,0.4)'; x.lineWidth=2; x.stroke();
  } else {
    // Nocturnal luxury architectural arch + gold contour rings
    x.beginPath(); x.arc(W*.5,H*.45,250,Math.PI,0); x.lineTo(W*.5+250,H*.86); x.lineTo(W*.5-250,H*.86); x.closePath();
    x.fillStyle='rgba(255,255,255,0.08)'; x.fill(); x.strokeStyle=(P.hi||'#c9a45c')+'77'; x.lineWidth=1.8; x.stroke();
    for(let k=1;k<=3;k++){x.beginPath();x.ellipse(W*.5,H*.5,130*k,90*k,idx*.3,0,Math.PI*2);x.strokeStyle='rgba(255,255,255,0.12)';x.stroke();}
  }
  x.restore();
  const sh=x.createLinearGradient(0,H*.62,0,H);
  sh.addColorStop(0,'rgba(0,0,0,0)'); sh.addColorStop(1,'rgba(10,10,12,0.72)');
  x.fillStyle=sh; x.fillRect(0,0,W,H);
  x.fillStyle=P.hi||'#e2c48a'; x.font='600 18px JetBrains Mono,monospace';
  x.fillText('BESPOKE VISUAL · 0'+((idx%9)+1),64,H-92);
  x.fillStyle='#ffffff'; x.font='600 32px Pretendard,sans-serif';
  x.fillText(String(label||'').slice(0,30),64,H-46);
  return c.toDataURL('image/png');
}`;

  /* =========================================================================
   * ARCHETYPE 1: ATELIER LOOKBOOK (Fashion · Beauty · Cosmetic · Jewelry)
   * Inspired by TWO FOLD (cotton paper, Bodoni Moda + MaruBuri, sewing-thread scroll,
   * tilted dual-fold hero cards + atelier stamp, fabric library, collection filters)
   * ========================================================================= */
  function renderAtelier(bp) {
    const brandParts = String(bp.brand || 'TWO FOLD').split(/\s+/);
    const b1 = brandParts[0] || 'ATELIER';
    const b2 = brandParts.slice(1).join(' ') || (bp.brandSub ? bp.brandSub.split(/\s+/)[0] : 'Studio');
    const items = bp.services.concat(bp.cases.slice(0, 2)).map((x, i) => ({
      cat: ['시그니처', '컬렉션', '아카이브'][i % 3],
      code: `NO. 0${i + 1}`,
      name: x.name || x.title,
      desc: x.summary || x.desc,
      tag: (x.tags && x.tags[0]) || x.cat || 'LIMITED',
    }));
    const cfg = JSON.stringify({ brand: bp.brand, sub: bp.brandSub, pal: { a: '#e6dfd3', b: '#cfc3b2', c: '#5c3c2c', hi: '#6A4330' } }).replace(/<\/script/gi, '<\\/script');

    return `<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(bp.brand)} — ${esc(bp.brandSub)}</title>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css">
<link href="https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400..700;1,6..96,400..600&family=DM+Mono:wght@400;500&family=Noto+Serif+KR:wght@400;600;700&display=swap" rel="stylesheet">
<style>
:root{--cotton:#F1ECE3;--paper:#FAF7F1;--ink:#1E1B18;--ink2:#4D463F;--mute:#867C72;--horn:#6A4330;--chalk:#E3EAF0;--chalk-b:#BCCBDA;--line:rgba(30,27,24,.14);--ease:cubic-bezier(.16,1,.3,1);--serif:'Noto Serif KR',serif;--disp:'Bodoni Moda',serif;--mono:'DM Mono',monospace;--sans:'Pretendard Variable',sans-serif}
*{box-sizing:border-box;margin:0;padding:0}
a{color:inherit;text-decoration:none}
html{scroll-behavior:smooth;background:var(--cotton);color:var(--ink)}
body{font-family:var(--sans);background:var(--cotton);color:var(--ink);overflow-x:hidden;word-break:keep-all;line-height:1.6}
.grain{position:fixed;inset:0;pointer-events:none;z-index:900;opacity:.05;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")}
/* Left vertical sewing-thread scroll progress */
.thread{position:fixed;left:18px;top:92px;bottom:32px;width:2px;border-left:1.5px dashed rgba(106,67,48,.35);z-index:850;pointer-events:none}
.thread i{position:absolute;left:-7px;top:0;width:13px;height:13px;border-radius:50%;border:2px solid var(--horn);background:var(--paper);box-shadow:0 0 0 3px var(--cotton)}
@media(max-width:760px){.thread{display:none}}
.wrap{max-width:1320px;margin:0 auto;padding:0 clamp(24px,5vw,68px)}
.mono{font-family:var(--mono);font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:var(--mute)}
header{position:sticky;top:0;z-index:800;display:flex;align-items:center;justify-content:space-between;padding:18px clamp(24px,5vw,68px);background:rgba(241,236,227,.86);backdrop-filter:blur(14px);border-bottom:1px solid var(--line)}
.brand{font-family:var(--disp);font-size:20px;letter-spacing:.08em;font-weight:600;display:flex;align-items:baseline;gap:10px}
.brand small{font-family:var(--sans);font-size:11px;color:var(--mute);letter-spacing:0}
nav{display:flex;gap:26px;font-size:13.5px;color:var(--ink2)}
nav a:hover{color:var(--horn)}
.btn-horn{display:inline-flex;align-items:center;gap:8px;padding:10px 20px;border-radius:999px;background:var(--horn);color:#FAF7F1;font-size:13px;font-weight:600;transition:transform .35s var(--ease),background .3s}
.btn-horn:hover{transform:translateY(-2px);background:#523223}
.btn-out{display:inline-flex;align-items:center;gap:8px;padding:10px 20px;border-radius:999px;border:1px solid var(--ink);font-size:13px;font-weight:600;transition:.3s}
.btn-out:hover{background:var(--ink);color:var(--paper)}
@media(max-width:860px){nav{display:none}}

/* Split Editorial Lookbook Hero */
.hero{padding:clamp(40px,6vw,78px) 0 72px;display:grid;grid-template-columns:1.05fr .95fr;gap:clamp(32px,5vw,64px);align-items:center}
.eyebrow{display:flex;align-items:center;gap:10px;margin-bottom:20px}
.eyebrow::before{content:'';width:28px;border-top:1.5px dashed var(--horn)}
.disp-title{font-family:var(--disp);font-size:clamp(3.6rem,8vw,6.8rem);line-height:.88;letter-spacing:-.02em;font-weight:500;margin-bottom:26px}
.disp-title em{display:block;font-style:italic;color:var(--horn);padding-left:clamp(24px,5vw,74px);font-weight:400}
.kr-lead{font-family:var(--serif);font-size:clamp(1.45rem,2.5vw,2.15rem);line-height:1.45;font-weight:500;margin-bottom:18px}
.chalk{background:var(--chalk);padding:0 6px;box-shadow:inset 0 -3px 0 var(--chalk-b)}
.hero-p{font-size:15px;color:var(--ink2);max-width:480px;margin-bottom:26px;line-height:1.75}
.hero-acts{display:flex;gap:10px;flex-wrap:wrap;margin-bottom:34px}
.meta3{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;padding-top:20px;border-top:1px dashed var(--line)}
.meta3 b{display:block;font-size:13px;margin-top:4px}

/* Tilted Dual-Fold Lookbook Stage */
.fold-stage{position:relative;min-height:460px;display:grid;place-items:center}
.fold-pair{position:relative;display:flex;align-items:center;justify-content:center;width:100%}
.fcard{position:relative;border-radius:16px;overflow:hidden;box-shadow:0 24px 60px rgba(30,27,24,.18);background:#2a221d}
.fcard.one{width:56%;aspect-ratio:3/4;transform:rotate(-2.2deg);z-index:2;border:1px solid rgba(255,255,255,.35)}
.fcard.two{width:48%;aspect-ratio:3/4;margin-left:-10%;transform:rotate(2.4deg) translateY(22px);z-index:1;border-left:2px dashed rgba(250,247,241,.75)}
.fcard canvas,.fcard img{width:100%;height:100%;object-fit:cover;display:block}
.fcap{position:absolute;left:12px;bottom:12px;padding:5px 10px;border-radius:999px;background:rgba(30,27,24,.68);color:#FAF7F1;font-family:var(--mono);font-size:10px;letter-spacing:.08em}
.stamp{position:absolute;right:8px;top:6px;width:92px;height:92px;border-radius:50%;border:1.5px dashed var(--horn);background:rgba(250,247,241,.86);backdrop-filter:blur(6px);display:grid;place-items:center;text-align:center;font-family:var(--mono);font-size:9px;color:var(--horn);line-height:1.3;transform:rotate(12deg);z-index:4;animation:spinSlow 26s linear infinite}
@keyframes spinSlow{to{transform:rotate(372deg)}}
@media(max-width:860px){.hero{grid-template-columns:1fr}.fold-stage{min-height:360px}}

/* Chapters */
.sec{padding:clamp(64px,8vw,112px) 0;border-top:1px solid var(--line)}
.sec-h{display:flex;justify-content:space-between;align-items:flex-end;gap:20px;flex-wrap:wrap;margin-bottom:40px}
.sec-h h2{font-family:var(--serif);font-size:clamp(1.8rem,3.4vw,2.9rem);font-weight:600;letter-spacing:-.02em;line-height:1.25}
.fabric-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:22px}
.fab{background:var(--paper);border:1px solid var(--line);border-radius:16px;padding:24px;display:grid;gap:14px;transition:transform .4s var(--ease)}
.fab:hover{transform:translateY(-5px)}
.fab-sw{height:140px;border-radius:12px;overflow:hidden}
.fab-sw img{width:100%;height:100%;object-fit:cover}
.fab h3{font-family:var(--serif);font-size:18px}
.fab p{font-size:13.8px;color:var(--ink2);line-height:1.7}

/* Collection Filterable Lookbook */
.ftabs{display:flex;gap:8px;flex-wrap:wrap}
.ftabs button{padding:8px 16px;border-radius:999px;border:1px solid var(--line);font-size:13px;background:var(--paper);cursor:pointer;transition:.25s}
.ftabs button.on{background:var(--horn);color:#FAF7F1;border-color:var(--horn)}
.col-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:24px}
.ccard{background:var(--paper);border:1px solid var(--line);border-radius:16px;overflow:hidden;display:flex;flex-direction:column;transition:transform .45s var(--ease)}
.ccard:hover{transform:translateY(-6px)}
.ccard-img{aspect-ratio:4/5;overflow:hidden;position:relative}
.ccard-img img{width:100%;height:100%;object-fit:cover;transition:transform .7s var(--ease)}
.ccard:hover .ccard-img img{transform:scale(1.06)}
.ccard-b{padding:18px 20px;display:grid;gap:8px}
.ccard-b h3{font-family:var(--serif);font-size:17px}
.ccard-b p{font-size:13.5px;color:var(--ink2)}
@media(max-width:860px){.fabric-grid,.col-grid{grid-template-columns:1fr}}

/* Notify / Reserve Atelier */
.notify{background:var(--paper);border:1px solid var(--line);border-radius:24px;padding:clamp(30px,5vw,60px);display:grid;grid-template-columns:1fr 1fr;gap:36px;align-items:center}
.notify form{display:grid;gap:14px}
.notify input{padding:13px 16px;border-radius:12px;border:1px solid var(--line);background:var(--cotton);font:14px var(--sans);outline:none}
.notify input:focus{border-color:var(--horn)}
@media(max-width:820px){.notify{grid-template-columns:1fr}}
footer{padding:44px 0 56px;border-top:1px solid var(--line);display:flex;justify-content:space-between;flex-wrap:wrap;gap:14px;font-size:13px;color:var(--mute)}
</style>
</head>
<body>
<div class="grain"></div>
<div class="thread"><i id="needle"></i></div>
<header>
  <a href="#top" class="brand">${esc(bp.brand)} <small>${esc(bp.brandSub)}</small></a>
  <nav><a href="#story">브랜드 철학</a><a href="#fabric">소재·디테일</a><a href="#collection">컬렉션</a><a href="#notify">예약·알림</a></nav>
  <a href="#notify" class="btn-horn">● ${esc(bp.ctaPrimary)}</a>
</header>

<main class="wrap">
  <section id="top" class="hero" data-stitch-screen="아틀리에 히어로">
    <div>
      <div class="eyebrow mono">${esc(bp.brandSub)} · ${esc(bp.est)}</div>
      <h1 class="disp-title">${esc(b1)}<em>${esc(b2)}</em></h1>
      <p class="kr-lead">${esc(bp.heroLines[0])} <span class="chalk">${esc(bp.heroLines[1])}</span><br>${esc(bp.heroLines[2])}</p>
      <p class="hero-p">${esc(bp.heroDesc)}</p>
      <div class="hero-acts">
        <a href="#notify" class="btn-horn">${esc(bp.ctaPrimary)} →</a>
        <a href="#collection" class="btn-out">${esc(bp.ctaSecondary)}</a>
      </div>
      <div class="meta3">
        <div><span class="mono">FOCUS</span><b>${esc(bp.practice1)}</b></div>
        <div><span class="mono">DETAIL</span><b>${esc(bp.practice2)}</b></div>
        <div><span class="mono">STATUS</span><b>${esc(bp.status)}</b></div>
      </div>
    </div>
    <div class="fold-stage">
      <div class="stamp">CRAFTED<br>ATELIER<br>2026</div>
      <div class="fold-pair">
        <div class="fcard one"><canvas id="atelierCanvas" width="540" height="720"></canvas><span class="fcap">FOLD 01 · MOTION FILM</span></div>
        <div class="fcard two"><img data-ill-art="${esc(bp.brand + ' · LOOKBOOK 02')}" alt="${esc(bp.brand)}"><span class="fcap">FOLD 02 · LOOKBOOK</span></div>
      </div>
    </div>
  </section>

  <section id="story" class="sec" data-stitch-screen="브랜드 철학">
    <div class="sec-h"><div><span class="mono">01 · BRAND PHILOSOPHY</span><h2>${esc(bp.beliefTitle)}</h2></div><span class="mono">${esc(bp.founderName)}</span></div>
    <p style="font-family:var(--serif);font-size:clamp(1.2rem,2.1vw,1.65rem);max-width:860px;line-height:1.75;margin-bottom:36px">${esc(bp.statementText)}</p>
    <div class="fabric-grid">
      ${bp.principles.map(([t, d], i) => `<div class="fab"><span class="mono">PRINCIPLE 0${i + 1}</span><h3>${esc(t)}</h3><p>${esc(d)}</p></div>`).join('')}
    </div>
  </section>

  <section id="fabric" class="sec" data-stitch-screen="소재 · 시그니처">
    <div class="sec-h"><div><span class="mono">02 · MATERIAL & CRAFT</span><h2>${esc(bp.servicesTitle)}</h2></div></div>
    <div class="fabric-grid">
      ${bp.services.slice(0, 3).map((s) => `<div class="fab"><div class="fab-sw"><img data-ill-art="${esc(s.name)}" alt="${esc(s.name)}"></div><span class="mono">${esc(s.code)}</span><h3>${esc(s.name)}</h3><p>${esc(s.summary)}</p></div>`).join('')}
    </div>
  </section>

  <section id="collection" class="sec" data-stitch-screen="컬렉션 아카이브">
    <div class="sec-h">
      <div><span class="mono">03 · FIRST COLLECTION</span><h2>${esc(bp.casesTitle)}</h2></div>
      <div class="ftabs" id="colTabs"><button class="on" data-c="전체">전체</button><button data-c="시그니처">시그니처</button><button data-c="컬렉션">컬렉션</button><button data-c="아카이브">아카이브</button></div>
    </div>
    <div class="col-grid" id="colGrid">
      ${items.map((it) => `<article class="ccard" data-cat="${esc(it.cat)}"><div class="ccard-img"><img data-ill-art="${esc(it.name)}" alt="${esc(it.name)}"></div><div class="ccard-b"><span class="mono">${esc(it.code)} · ${esc(it.cat)}</span><h3>${esc(it.name)}</h3><p>${esc(it.desc)}</p></div></article>`).join('')}
    </div>
  </section>

  <section id="notify" class="sec" data-stitch-screen="프라이빗 알림 · 예약">
    <div class="notify">
      <div>
        <span class="mono">04 · PRIVATE INVITATION</span>
        <h2 style="font-family:var(--serif);font-size:clamp(1.7rem,3vw,2.5rem);margin:10px 0 14px">${esc(bp.contactTitle)} ${esc(bp.contactSub)}</h2>
        <p style="color:var(--ink2);font-size:14.5px;margin-bottom:18px">${esc(bp.address)} · ${esc(bp.hours)}</p>
        <div class="mono">${esc(bp.phone)} · ${esc(bp.email)}</div>
      </div>
      <form id="atForm">
        <input required name="name" placeholder="성함">
        <input required name="contact" placeholder="이메일 또는 연락처">
        <input name="note" placeholder="관심 컬렉션 / 프라이빗 피팅 메모">
        <button type="submit" class="btn-horn" style="justify-content:center">프라이빗 알림 · 예약 등록 →</button>
        <div id="atMsg" class="mono" style="color:var(--horn)"></div>
      </form>
    </div>
  </section>

  <footer>
    <span>© 2026 ${esc(bp.brand)} ATELIER. All rights reserved.</span>
    <span class="mono">${esc(bp.address)}</span>
  </footer>
</main>
<script>
const CFG=${cfg};
${ART_SYNTH_JS}
document.querySelectorAll('img[data-ill-art]').forEach((im,i)=>{im.src=illArt(im.dataset.illArt,i,CFG.pal,'atelier');});
/* 60fps Atelier Silk & Linen Light Motion */
(function(){
  const cv=document.getElementById('atelierCanvas'),x=cv.getContext('2d'); let t=0;
  function draw(){
    requestAnimationFrame(draw); t+=0.012;
    const w=cv.width,h=cv.height;
    const g=x.createLinearGradient(0,0,w,h); g.addColorStop(0,'#e8dfd1'); g.addColorStop(.55,'#cbbba6'); g.addColorStop(1,'#5e3d2d');
    x.fillStyle=g; x.fillRect(0,0,w,h);
    const rg=x.createRadialGradient(w*(.45+Math.sin(t*.4)*.2),h*.32,20,w*.5,h*.45,w*.85);
    rg.addColorStop(0,'rgba(255,250,240,0.82)'); rg.addColorStop(1,'transparent');
    x.fillStyle=rg; x.fillRect(0,0,w,h);
    for(let k=0;k<6;k++){
      x.beginPath();
      for(let py=0;py<=h;py+=16){const px=w*(.22+k*.12)+Math.sin(py*.01+t+k)*26;if(py===0)x.moveTo(px,py);else x.lineTo(px,py);}
      x.strokeStyle=k%2?'rgba(255,255,255,0.42)':'rgba(106,67,48,0.28)'; x.lineWidth=1.8; x.stroke();
    }
    x.setLineDash([6,7]); x.strokeStyle='rgba(250,247,241,0.7)'; x.strokeRect(24,24,w-48,h-48); x.setLineDash([]);
    x.fillStyle='rgba(30,27,24,0.82)'; x.font='600 24px Bodoni Moda,serif'; x.fillText(CFG.brand,36,h-48);
  }
  draw();
})();
/* Sewing-thread scroll needle */
window.addEventListener('scroll',()=>{
  const p=scrollY/Math.max(1,document.documentElement.scrollHeight-innerHeight);
  const n=document.getElementById('needle'); if(n) n.style.top=(p*100)+'%';
},{passive:true});
/* Collection filter */
document.querySelectorAll('#colTabs button').forEach(b=>b.onclick=()=>{
  document.querySelectorAll('#colTabs button').forEach(x=>x.classList.remove('on')); b.classList.add('on');
  const c=b.dataset.c;
  document.querySelectorAll('#colGrid .ccard').forEach(card=>{card.style.display=(c==='전체'||card.dataset.cat===c)?'':'none';});
});
document.getElementById('atForm').onsubmit=(e)=>{
  e.preventDefault();
  document.getElementById('atMsg').textContent='✓ 정상 등록되었습니다. 프라이빗 초대장을 가장 먼저 보내드립니다.';
  e.target.reset();
};
</script>
</body>
</html>`;
  }

  /* =========================================================================
   * ARCHETYPE 2: ARCHITECTURAL STONE + LIVE QUOTE ESTIMATOR
   * Inspired by Gyeol & Myeongjin (Limewash #fbfaf7, Travertine #eee8dd, Oak Bronze #8a6f4d,
   * full-bleed motion hero, 4:5 filterable portfolio, live pyeong/budget quote calculator, quick dock)
   * ========================================================================= */
  function renderArchitecture(bp) {
    const projects = bp.cases.concat(bp.services.slice(0, 2)).map((c, i) => ({
      cat: ['주거', '상업', '오피스'][i % 3],
      title: c.title || c.name,
      area: `${28 + i * 14}평 · ${6 + i * 2}주`,
      desc: c.desc || c.summary,
    }));
    const cfg = JSON.stringify({ brand: bp.brand, sub: bp.brandSub, pal: { a: '#24221e', b: '#3d362d', c: '#141311', hi: '#c8a77c' } }).replace(/<\/script/gi, '<\\/script');
    return `<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(bp.brand)} — ${esc(bp.brandSub)}</title>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css">
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>
:root{--bg:#fbfaf7;--paper:#ffffff;--stone:#eee8dd;--fg:#22211f;--mute:#77726a;--line:#e2dccf;--accent:#8a6f4d;--dark:#161513;--ease:cubic-bezier(.16,1,.3,1);--sans:'Pretendard Variable',sans-serif;--mono:'IBM Plex Mono',monospace}
*{box-sizing:border-box;margin:0;padding:0}
a{color:inherit;text-decoration:none}
html{scroll-behavior:smooth;background:var(--bg);color:var(--fg)}
body{font-family:var(--sans);background:var(--bg);color:var(--fg);overflow-x:hidden;word-break:keep-all;line-height:1.68}
.wrap{max-width:1240px;margin:0 auto;padding:0 clamp(20px,4vw,48px)}
.mono{font-family:var(--mono);font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--accent)}
header{position:fixed;top:0;left:0;right:0;z-index:800;display:flex;align-items:center;justify-content:space-between;padding:18px clamp(20px,4vw,48px);color:#fff;transition:.35s}
header.solid{background:rgba(251,250,247,.9);backdrop-filter:blur(14px);color:var(--fg);border-bottom:1px solid var(--line)}
.logo{font-size:18px;font-weight:700;letter-spacing:.08em}
nav{display:flex;gap:26px;font-size:13.5px;font-weight:500}
.cta-sm{padding:8px 16px;border-radius:999px;border:1px solid currentColor;font-size:12.5px;font-weight:600}
@media(max-width:760px){nav{display:none}}

/* Full-bleed dark-tinted motion architectural hero */
.hero{position:relative;min-height:94vh;display:flex;align-items:flex-end;padding:120px 0 64px;color:#fff;overflow:hidden;background:var(--dark)}
.hero canvas{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.hero-shade{position:absolute;inset:0;background:linear-gradient(180deg,rgba(22,21,19,.35),rgba(22,21,19,.78))}
.hero-in{position:relative;z-index:2;width:100%;display:grid;gap:28px}
.hero h1{font-size:clamp(2.4rem,5.8vw,4.8rem);font-weight:700;letter-spacing:-.04em;line-height:1.12;max-width:840px}
.hero p{max-width:560px;font-size:16px;color:rgba(255,255,255,.8);line-height:1.75}
.acts{display:flex;gap:12px;flex-wrap:wrap}
.btn-p{padding:13px 24px;border-radius:999px;background:#fff;color:var(--dark);font-weight:600;font-size:14px}
.btn-g{padding:13px 24px;border-radius:999px;border:1px solid rgba(255,255,255,.45);color:#fff;font-weight:600;font-size:14px}
.hkpis{display:grid;grid-template-columns:repeat(3,minmax(0,180px));gap:20px;padding-top:24px;border-top:1px solid rgba(255,255,255,.2)}
.hkpis b{display:block;font-size:28px;font-weight:300;letter-spacing:-.03em}
.hkpis span{font-size:12px;color:rgba(255,255,255,.68)}

/* Bands */
.sec{padding:clamp(70px,8vw,116px) 0}
.sec.stone{background:var(--stone)}
.sh{display:flex;justify-content:space-between;align-items:flex-end;gap:20px;flex-wrap:wrap;margin-bottom:40px}
.sh h2{font-size:clamp(1.85rem,3.6vw,3rem);font-weight:700;letter-spacing:-.035em;margin-top:8px}
.pillars{display:grid;grid-template-columns:repeat(3,1fr);gap:24px}
.pil{background:var(--paper);border:1px solid var(--line);border-radius:14px;padding:28px;display:grid;gap:12px}
.pil h3{font-size:18px;font-weight:700}
.pil p{font-size:14px;color:var(--mute)}
.tabs{display:flex;gap:8px;flex-wrap:wrap}
.tabs button{padding:8px 16px;border-radius:999px;border:1px solid var(--line);background:var(--paper);font-size:13px;cursor:pointer}
.tabs button.on{background:var(--fg);color:#fff;border-color:var(--fg)}
.pgrid{display:grid;grid-template-columns:repeat(3,1fr);gap:24px}
.pcard{background:var(--paper);border:1px solid var(--line);border-radius:14px;overflow:hidden;transition:transform .4s var(--ease)}
.pcard:hover{transform:translateY(-6px)}
.pcard-img{aspect-ratio:4/5;position:relative;overflow:hidden}
.pcard-img img{width:100%;height:100%;object-fit:cover;transition:transform .7s var(--ease)}
.pcard:hover .pcard-img img{transform:scale(1.06)}
.pcard-b{padding:18px 20px}
.pcard-b h3{font-size:17px;margin:6px 0 4px}
.pcard-b p{font-size:13px;color:var(--mute)}

/* Interactive Auto Quote Estimator */
.est-box{display:grid;grid-template-columns:1fr 1fr;gap:34px;background:var(--paper);border:1px solid var(--line);border-radius:20px;padding:clamp(24px,4vw,44px)}
.est-ctrl{display:grid;gap:18px}
.est-ctrl label{display:grid;gap:8px;font-size:13px;font-weight:600}
.est-ctrl input[type=range]{accent-color:var(--accent);width:100%}
.est-ctrl select,.est-ctrl input[type=text]{padding:12px 14px;border-radius:10px;border:1px solid var(--line);background:var(--bg);font:14px var(--sans)}
.est-out{background:var(--dark);color:#fff;border-radius:16px;padding:28px;display:flex;flex-direction:column;justify-content:space-between;gap:18px}
.est-price{font-size:clamp(2rem,4vw,3.1rem);font-weight:300;color:#e0c094;font-variant-numeric:tabular-nums}
.dock{position:fixed;right:18px;bottom:24px;z-index:850;display:flex;flex-direction:column;gap:8px}
.dock a{width:46px;height:46px;border-radius:50%;background:var(--dark);color:#fff;border:1px solid rgba(255,255,255,.15);display:grid;place-items:center;font-family:var(--mono);font-size:9px;box-shadow:0 10px 24px rgba(0,0,0,.22)}
@media(max-width:860px){.pillars,.pgrid,.est-box{grid-template-columns:1fr}}
footer{padding:40px 0;border-top:1px solid var(--line);font-size:13px;color:var(--mute);display:flex;justify-content:space-between;flex-wrap:wrap;gap:12px}
</style>
</head>
<body>
<header id="hdr">
  <a href="#top" class="logo">${esc(bp.brand)}</a>
  <nav><a href="#philosophy">철학</a><a href="#portfolio">시공 사례</a><a href="#process">프로세스</a><a href="#quote">자동 견적</a></nav>
  <a href="#quote" class="cta-sm">빠른 견적 문의</a>
</header>

<section id="top" class="hero" data-stitch-screen="아키텍처 히어로">
  <canvas id="archCanvas" width="1440" height="900"></canvas>
  <div class="hero-shade"></div>
  <div class="wrap hero-in">
    <span class="mono" style="color:#e0c094">${esc(bp.brandSub)} · ${esc(bp.est)}</span>
    <h1>${esc(bp.heroLines.join(' '))}</h1>
    <p>${esc(bp.heroDesc)}</p>
    <div class="acts"><a href="#quote" class="btn-p">${esc(bp.ctaPrimary)} →</a><a href="#portfolio" class="btn-g">${esc(bp.ctaSecondary)}</a></div>
    <div class="hkpis">
      ${bp.kpis.slice(0, 3).map(([n, u, l]) => `<div><b>${esc(n)}${esc(u)}</b><span>${esc(l)}</span></div>`).join('')}
    </div>
  </div>
</section>

<section id="philosophy" class="sec" data-stitch-screen="공간 철학">
  <div class="wrap">
    <div class="sh"><div><span class="mono">01 · PHILOSOPHY</span><h2>${esc(bp.beliefTitle)}</h2></div></div>
    <div class="pillars">
      ${bp.principles.map(([t, d], i) => `<div class="pil"><span class="mono">0${i + 1}</span><h3>${esc(t)}</h3><p>${esc(d)}</p></div>`).join('')}
    </div>
  </div>
</section>

<section id="portfolio" class="sec stone" data-stitch-screen="시공 포트폴리오">
  <div class="wrap">
    <div class="sh">
      <div><span class="mono">02 · SELECTED PROJECTS</span><h2>${esc(bp.casesTitle)}</h2></div>
      <div class="tabs" id="pTabs"><button class="on" data-c="전체">전체</button><button data-c="주거">주거</button><button data-c="상업">상업</button><button data-c="오피스">오피스</button></div>
    </div>
    <div class="pgrid" id="pGrid">
      ${projects.map((p) => `<article class="pcard" data-cat="${esc(p.cat)}"><div class="pcard-img"><img data-ill-art="${esc(p.title)}" alt="${esc(p.title)}"></div><div class="pcard-b"><span class="mono">${esc(p.cat)} · ${esc(p.area)}</span><h3>${esc(p.title)}</h3><p>${esc(p.desc)}</p></div></article>`).join('')}
    </div>
  </div>
</section>

<section id="process" class="sec" data-stitch-screen="원스톱 프로세스">
  <div class="wrap">
    <div class="sh"><div><span class="mono">03 · PROCESS</span><h2>${esc(bp.processTitle)}</h2></div></div>
    <div class="pillars" style="grid-template-columns:repeat(4,1fr)">
      ${bp.process.map((p) => `<div class="pil"><span class="mono">${esc(p.time)}</span><h3>${esc(p.title)}</h3><p>${esc(p.desc)}</p></div>`).join('')}
    </div>
  </div>
</section>

<section id="quote" class="sec stone" data-stitch-screen="자동 견적 · 상담">
  <div class="wrap">
    <div class="sh"><div><span class="mono">04 · INSTANT ESTIMATE</span><h2>예상 공사비 자동 견적 & 상담</h2></div></div>
    <div class="est-box">
      <div class="est-ctrl">
        <label>공간 유형<select id="qType"><option value="260">주거 공간 (아파트·주택)</option><option value="310">상업 공간 (카페·쇼룸·병원)</option><option value="240">오피스 · 워크스페이스</option></select></label>
        <label>시공 면적: <b id="qPyeongV">34평</b><input id="qPyeong" type="range" min="15" max="120" value="34"></label>
        <label>마감 등급<select id="qGrade"><option value="1">스탠다드 에디토리얼 (×1.0)</option><option value="1.28" selected>하이엔드 천연 스톤·원목 (×1.28)</option><option value="1.55">시그니처 풀 커스텀 (×1.55)</option></select></label>
        <label>연락처<input id="qPhone" type="text" placeholder="010-0000-0000"></label>
      </div>
      <div class="est-out">
        <div>
          <span class="mono" style="color:#e0c094">ESTIMATED BUDGET</span>
          <div class="est-price" id="qPrice">₩11,315만</div>
          <p style="font-size:13.5px;color:rgba(255,255,255,.72);margin-top:8px" id="qDur">예상 설계·시공 기간: 약 8~10주 · 하자보증 2년 포함</p>
        </div>
        <button type="button" class="btn-p" id="qSubmit">이 조건으로 1:1 실측 상담 신청 →</button>
        <div id="qMsg" class="mono" style="color:#e0c094"></div>
      </div>
    </div>
  </div>
</section>

<div class="dock"><a href="#top">TOP</a><a href="#quote">견적</a><a href="#portfolio">사례</a></div>
<footer class="wrap"><span>© 2026 ${esc(bp.brand)} ${esc(bp.brandSub)}.</span><span>${esc(bp.address)} · ${esc(bp.phone)}</span></footer>
<script>
const CFG=${cfg};
${ART_SYNTH_JS}
document.querySelectorAll('img[data-ill-art]').forEach((im,i)=>{im.src=illArt(im.dataset.illArt,i,CFG.pal,'arch');});
window.addEventListener('scroll',()=>{document.getElementById('hdr').classList.toggle('solid',scrollY>60);},{passive:true});
/* Architectural light-beam 60fps canvas */
(function(){
  const cv=document.getElementById('archCanvas'),x=cv.getContext('2d'); let t=0;
  function draw(){
    requestAnimationFrame(draw); t+=0.008;
    const w=cv.width,h=cv.height;
    const g=x.createLinearGradient(0,0,w,h); g.addColorStop(0,'#1c1916'); g.addColorStop(.55,'#2a251f'); g.addColorStop(1,'#11100e');
    x.fillStyle=g; x.fillRect(0,0,w,h);
    const sx=w*(.65+Math.sin(t*.4)*.15);
    const rg=x.createRadialGradient(sx,h*.22,20,sx,h*.28,w*.68);
    rg.addColorStop(0,'rgba(214,182,138,0.42)'); rg.addColorStop(1,'transparent');
    x.fillStyle=rg; x.fillRect(0,0,w,h);
    x.strokeStyle='rgba(255,255,255,0.09)'; x.lineWidth=1.5;
    for(let k=0;k<6;k++){const ox=(k*260+(t*18))%(w+260)-130; x.beginPath();x.moveTo(ox,0);x.lineTo(ox-180,h);x.stroke();}
  }
  draw();
})();
document.querySelectorAll('#pTabs button').forEach(b=>b.onclick=()=>{
  document.querySelectorAll('#pTabs button').forEach(x=>x.classList.remove('on')); b.classList.add('on');
  const c=b.dataset.c; document.querySelectorAll('#pGrid .pcard').forEach(el=>{el.style.display=(c==='전체'||el.dataset.cat===c)?'':'none';});
});
function calcQ(){
  const base=Number(document.getElementById('qType').value), py=Number(document.getElementById('qPyeong').value), gr=Number(document.getElementById('qGrade').value);
  document.getElementById('qPyeongV').textContent=py+'평';
  const tot=Math.round(base*py*gr);
  document.getElementById('qPrice').textContent='₩'+tot.toLocaleString()+'만';
  const wk=Math.max(5,Math.round(py/5)+2);
  document.getElementById('qDur').textContent='예상 설계·시공 기간: 약 '+wk+'~'+(wk+2)+'주 · 하자보증 2년 포함';
}
['qType','qPyeong','qGrade'].forEach(id=>document.getElementById(id).addEventListener('input',calcQ));
calcQ();
document.getElementById('qSubmit').onclick=()=>{
  document.getElementById('qMsg').textContent='✓ 자동 견적 상담이 접수되었습니다. 담당 디렉터가 24시간 내 연락드립니다.';
};
</script>
</body>
</html>`;
  }

  /* =========================================================================
   * ARCHETYPE 3: NOCTURNAL LUXURY & LIVE RATE BOOKING ENGINE
   * Inspired by BELLUCE Hotel & Kwang (Obsidian/Navy #0b1019, Champagne Gold #c9a45c,
   * Noto Serif KR + Cormorant Garamond, dark cinematic hero, interactive Suite/Course Rate Engine)
   * ========================================================================= */
  function renderLuxury(bp) {
    const tiers = bp.services.slice(0, 3).map((s, i) => ({
      name: s.name,
      summary: s.summary,
      price: [450000, 780000, 1280000][i] || 550000,
      tags: s.tags,
    }));
    const cfg = JSON.stringify({ brand: bp.brand, sub: bp.brandSub, pal: { a: '#0b131f', b: '#182436', c: '#070a0f', hi: '#c9a45c' } }).replace(/<\/script/gi, '<\\/script');
    return `<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(bp.brand)} — ${esc(bp.brandSub)}</title>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css">
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500&family=Noto+Serif+KR:wght@400;600;700&display=swap" rel="stylesheet">
<style>
:root{--bg:#0b1019;--bg2:#101826;--card:#141e30;--gold:#c9a45c;--gold2:#e5c88d;--burg:#7a1f2b;--txt:#ece6da;--mut:#9aa3b2;--line:rgba(201,164,92,.22);--serif:'Noto Serif KR',serif;--en:'Cormorant Garamond',serif;--sans:'Pretendard Variable',sans-serif;--ease:cubic-bezier(.16,1,.3,1)}
*{box-sizing:border-box;margin:0;padding:0}
a{color:inherit;text-decoration:none}
html{scroll-behavior:smooth;background:var(--bg);color:var(--txt)}
body{font-family:var(--sans);background:var(--bg);color:var(--txt);overflow-x:hidden;word-break:keep-all;line-height:1.68}
.wrap{max-width:1240px;margin:0 auto;padding:0 clamp(20px,4vw,48px)}
.ey{font-family:var(--en);font-style:italic;font-size:15px;letter-spacing:.14em;color:var(--gold2);text-transform:uppercase}
header{position:fixed;top:0;left:0;right:0;z-index:800;display:flex;align-items:center;justify-content:space-between;padding:18px clamp(20px,4vw,48px);background:rgba(11,16,25,.82);backdrop-filter:blur(14px);border-bottom:1px solid var(--line)}
.logo{font-family:var(--en);font-size:22px;letter-spacing:.18em;font-weight:600;color:#fff}
nav{display:flex;gap:28px;font-size:12px;letter-spacing:.16em;text-transform:uppercase;color:var(--mut)}
nav a:hover{color:var(--gold2)}
.btn-g{padding:10px 22px;border:1px solid var(--gold);color:var(--gold2);font-size:12px;letter-spacing:.12em;text-transform:uppercase;transition:.3s}
.btn-g:hover{background:var(--gold);color:#090b10}
.btn-solid{padding:13px 26px;background:linear-gradient(135deg,var(--gold2),var(--gold));color:#090b10;font-weight:700;font-size:13.5px;border:0;cursor:pointer}
@media(max-width:760px){nav{display:none}}

.hero{position:relative;min-height:94vh;display:grid;place-items:center;text-align:center;padding:120px 20px 72px;overflow:hidden}
.hero canvas{position:absolute;inset:0;width:100%;height:100%}
.hero-in{position:relative;z-index:2;max-width:820px;display:grid;gap:22px;justify-items:center}
.pill-g{padding:6px 16px;border-radius:999px;border:1px solid var(--line);background:rgba(201,164,92,.1);color:var(--gold2);font-size:12px;letter-spacing:.08em}
.hero h1{font-family:var(--serif);font-size:clamp(2.4rem,5.8vw,4.8rem);font-weight:600;line-height:1.18;letter-spacing:-.02em;color:#fff}
.hero p{max-width:560px;font-size:15.5px;color:rgba(236,230,218,.8)}
.hmetrics{display:grid;grid-template-columns:repeat(3,1fr);gap:24px;width:min(100%,620px);padding-top:24px;border-top:1px solid var(--line);margin-top:12px}
.hmetrics b{display:block;font-family:var(--en);font-size:34px;color:var(--gold2)}
.hmetrics span{font-size:12px;color:var(--mut)}

.sec{padding:clamp(72px,9vw,120px) 0}
.sec.alt{background:var(--bg2)}
.sh{margin-bottom:44px}
.sh h2{font-family:var(--serif);font-size:clamp(1.85rem,3.4vw,2.9rem);margin-top:8px;color:#fff}
.grid3{display:grid;grid-template-columns:repeat(3,1fr);gap:24px}
.lcard{background:var(--card);border:1px solid var(--line);border-radius:14px;overflow:hidden;transition:transform .45s var(--ease)}
.lcard:hover{transform:translateY(-6px)}
.lcard-img{aspect-ratio:4/3;overflow:hidden}
.lcard-img img{width:100%;height:100%;object-fit:cover;transition:transform .7s var(--ease)}
.lcard:hover .lcard-img img{transform:scale(1.06)}
.lcard-b{padding:22px;display:grid;gap:10px}
.lcard-b h3{font-family:var(--serif);font-size:19px;color:#fff}
.lcard-b p{font-size:13.8px;color:var(--mut)}
.price{font-family:var(--en);font-size:22px;color:var(--gold2)}

/* Interactive Reservation Rate Calculator */
.book{display:grid;grid-template-columns:1.1fr .9fr;gap:30px;background:var(--card);border:1px solid var(--line);border-radius:18px;padding:clamp(24px,4vw,42px)}
.tier-btns{display:grid;gap:10px;margin:14px 0 20px}
.tbtn{display:flex;justify-content:space-between;align-items:center;padding:15px 18px;border-radius:12px;border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.02);color:var(--txt);text-align:left;cursor:pointer}
.tbtn.on{border-color:var(--gold);background:rgba(201,164,92,.12)}
.f2{display:grid;grid-template-columns:1fr 1fr;gap:14px}
.book label{display:grid;gap:6px;font-size:12px;color:var(--mut)}
.book input,.book select{padding:11px 13px;border-radius:10px;border:1px solid rgba(255,255,255,.14);background:var(--bg);color:#fff;font:14px var(--sans)}
.summary{background:var(--bg);border:1px solid var(--line);border-radius:14px;padding:26px;display:flex;flex-direction:column;justify-content:space-between;gap:18px}
.sum-val{font-family:var(--en);font-size:40px;color:var(--gold2)}
@media(max-width:860px){.grid3,.book,.f2{grid-template-columns:1fr}}
footer{padding:42px 0;border-top:1px solid var(--line);display:flex;justify-content:space-between;flex-wrap:wrap;gap:12px;font-size:13px;color:var(--mut)}
</style>
</head>
<body>
<header>
  <a href="#top" class="logo">${esc(bp.brand)}</a>
  <nav><a href="#signature">SIGNATURE</a><a href="#craft">EXPERIENCE</a><a href="#reserve">RESERVE</a></nav>
  <a href="#reserve" class="btn-g">Reserve</a>
</header>

<section id="top" class="hero" data-stitch-screen="시네마틱 럭셔리 히어로">
  <canvas id="luxCanvas" width="1440" height="900"></canvas>
  <div class="hero-in">
    <span class="pill-g">${esc(bp.status)}</span>
    <h1>${esc(bp.heroLines.join(' '))}</h1>
    <p>${esc(bp.heroDesc)}</p>
    <div style="display:flex;gap:12px;flex-wrap:wrap;justify-content:center"><a href="#reserve" class="btn-solid">${esc(bp.ctaPrimary)} →</a><a href="#signature" class="btn-g">${esc(bp.ctaSecondary)}</a></div>
    <div class="hmetrics">
      ${bp.kpis.slice(0, 3).map(([n, u, l]) => `<div><b>${esc(n)}${esc(u)}</b><span>${esc(l)}</span></div>`).join('')}
    </div>
  </div>
</section>

<section id="signature" class="sec alt" data-stitch-screen="시그니처 컬렉션">
  <div class="wrap">
    <div class="sh"><span class="ey">Signature Collection</span><h2>${esc(bp.servicesTitle)}</h2></div>
    <div class="grid3">
      ${tiers.map((t) => `<article class="lcard"><div class="lcard-img"><img data-ill-art="${esc(t.name)}" alt="${esc(t.name)}"></div><div class="lcard-b"><span class="ey">${esc(t.tags[0] || 'SIGNATURE')}</span><h3>${esc(t.name)}</h3><p>${esc(t.summary)}</p><div class="price">₩${t.price.toLocaleString()}~</div></div></article>`).join('')}
    </div>
  </div>
</section>

<section id="craft" class="sec" data-stitch-screen="공간 · 장인 철학">
  <div class="wrap">
    <div class="sh"><span class="ey">Private Heritage</span><h2>${esc(bp.beliefTitle)}</h2></div>
    <div class="grid3">
      ${bp.principles.map(([t, d], i) => `<div class="lcard"><div class="lcard-b"><span class="ey">0${i + 1} · PRINCIPLE</span><h3>${esc(t)}</h3><p>${esc(d)}</p></div></div>`).join('')}
    </div>
  </div>
</section>

<section id="reserve" class="sec alt" data-stitch-screen="실시간 요금 · 예약">
  <div class="wrap">
    <div class="sh"><span class="ey">Reservation Details</span><h2>실시간 맞춤 예약 & 요금 조회</h2></div>
    <div class="book">
      <div>
        <span class="ey">01 · Select Tier</span>
        <div class="tier-btns" id="tierBox">
          ${tiers.map((t, i) => `<button type="button" class="tbtn${i === 0 ? ' on' : ''}" data-p="${t.price}" data-n="${esc(t.name)}"><span><b>${esc(t.name)}</b></span><span class="price">₩${t.price.toLocaleString()}</span></button>`).join('')}
        </div>
        <div class="f2">
          <label>수량 / 박수<select id="rQty"><option value="1">1박 / 1세트</option><option value="2">2박 / 2세트</option><option value="3">3박 / 3세트</option></select></label>
          <label>인원<select id="rGuest"><option value="2">성인 2인</option><option value="3">3인 (+15%)</option><option value="4">4인 (+30%)</option></select></label>
        </div>
      </div>
      <div class="summary">
        <div>
          <span class="ey">Estimated Total</span>
          <div class="sum-val" id="rTotal">₩450,000</div>
          <p style="font-size:13.5px;color:var(--mut);margin-top:8px" id="rDesc">${esc(tiers[0].name)} · 세금 및 컨시어지 포함</p>
        </div>
        <button type="button" class="btn-solid" id="rGo">프라이빗 예약 확정하기 →</button>
        <div id="rMsg" class="ey" style="font-style:normal;font-size:12px"></div>
      </div>
    </div>
  </div>
</section>

<footer class="wrap"><span>© 2026 ${esc(bp.brand)} ${esc(bp.brandSub)}.</span><span>${esc(bp.address)} · ${esc(bp.phone)}</span></footer>
<script>
const CFG=${cfg};
${ART_SYNTH_JS}
document.querySelectorAll('img[data-ill-art]').forEach((im,i)=>{im.src=illArt(im.dataset.illArt,i,CFG.pal,'luxury');});
(function(){
  const cv=document.getElementById('luxCanvas'),x=cv.getContext('2d'); let t=0;
  function draw(){
    requestAnimationFrame(draw); t+=0.009;
    const w=cv.width,h=cv.height;
    const g=x.createLinearGradient(0,0,w,h); g.addColorStop(0,'#090e17'); g.addColorStop(.5,'#141e30'); g.addColorStop(1,'#070a0f');
    x.fillStyle=g; x.fillRect(0,0,w,h);
    const rg=x.createRadialGradient(w*(.5+Math.sin(t*.4)*.18),h*.38,20,w*.5,h*.45,w*.62);
    rg.addColorStop(0,'rgba(201,164,92,0.38)'); rg.addColorStop(1,'transparent');
    x.fillStyle=rg; x.fillRect(0,0,w,h);
    x.strokeStyle='rgba(201,164,92,0.16)'; x.lineWidth=1.4;
    for(let k=1;k<=4;k++){x.beginPath();x.arc(w*.5,h*.5,120*k+Math.sin(t+k)*12,0,Math.PI*2);x.stroke();}
  }
  draw();
})();
let selP=${tiers[0].price}, selN=${JSON.stringify(tiers[0].name)};
function updR(){
  const q=Number(document.getElementById('rQty').value), gu=Number(document.getElementById('rGuest').value);
  const mult=gu===2?1:gu===3?1.15:1.3;
  document.getElementById('rTotal').textContent='₩'+Math.round(selP*q*mult).toLocaleString();
  document.getElementById('rDesc').textContent=selN+' · '+q+'박/세트 · '+gu+'인 기준';
}
document.querySelectorAll('#tierBox .tbtn').forEach(b=>b.onclick=()=>{
  document.querySelectorAll('#tierBox .tbtn').forEach(x=>x.classList.remove('on')); b.classList.add('on');
  selP=Number(b.dataset.p); selN=b.dataset.n; updR();
});
['rQty','rGuest'].forEach(id=>document.getElementById(id).addEventListener('change',updR));
document.getElementById('rGo').onclick=()=>{document.getElementById('rMsg').textContent='✓ 프라이빗 예약 요청이 접수되었습니다. 컨시어지가 확인 연락을 드립니다.';};
</script>
</body>
</html>`;
  }

  /* =========================================================================
   * ARCHETYPE 4: ORGANIC CAFE / DINING / BAKERY
   * Inspired by Orange Dining (Warm #fbf8f3, Olive Ink #1f2a22, Tangerine #f2661c,
   * Bagel Fat One + DM Serif Display, film-bordered hero, freshness badge, price menu board)
   * ========================================================================= */
  function renderCafe(bp) {
    const menus = bp.services.concat(bp.cases.slice(0, 2)).map((m, i) => ({
      cat: ['시그니처', '디저트', '음료'][i % 3],
      name: m.name || m.title,
      desc: m.summary || m.desc,
      price: (6500 + i * 1200).toLocaleString(),
      best: i < 2,
    }));
    const cfg = JSON.stringify({ brand: bp.brand, sub: bp.brandSub, pal: { a: '#f4e6d2', b: '#e3bfa0', c: '#2e3b2e', hi: '#f2661c' } }).replace(/<\/script/gi, '<\\/script');
    return `<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(bp.brand)} — ${esc(bp.brandSub)}</title>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css">
<link href="https://fonts.googleapis.com/css2?family=Bagel+Fat+One&family=DM+Serif+Display:ital@0;1&display=swap" rel="stylesheet">
<style>
:root{--bg:#fbf8f3;--sf:#ffffff;--ink:#1f2a22;--mut:#66705f;--ora:#f2661c;--leaf:#3f6b45;--line:rgba(31,42,34,.12);--disp:'Bagel Fat One','Pretendard Variable',sans-serif;--serif:'DM Serif Display',serif;--sans:'Pretendard Variable',sans-serif}
*{box-sizing:border-box;margin:0;padding:0}
a{color:inherit;text-decoration:none}
html{scroll-behavior:smooth;background:var(--bg);color:var(--ink)}
body{font-family:var(--sans);background:var(--bg);color:var(--ink);overflow-x:hidden;word-break:keep-all;line-height:1.65}
.wrap{max-width:1120px;margin:0 auto;padding:0 clamp(18px,4vw,36px)}
header{position:sticky;top:0;z-index:800;display:flex;align-items:center;justify-content:space-between;padding:16px clamp(18px,4vw,36px);background:rgba(251,248,243,.9);backdrop-filter:blur(12px);border-bottom:1px solid var(--line)}
.logo{font-family:var(--serif);font-size:22px;color:var(--ink)}
nav{display:flex;gap:22px;font-size:14px;font-weight:500;color:var(--mut)}
.btn-o{display:inline-flex;align-items:center;gap:6px;padding:10px 20px;border-radius:999px;background:var(--ora);color:#fff;font-weight:700;font-size:13.5px;border:0;cursor:pointer}
.btn-l{display:inline-flex;align-items:center;gap:6px;padding:10px 20px;border-radius:999px;border:1.5px solid var(--ink);color:var(--ink);font-weight:600;font-size:13.5px}
/* Film-frame bordered organic hero */
.hero{padding:28px 0 64px}
.film{position:relative;border-radius:24px;padding:14px;background:#1d241f;box-shadow:0 28px 64px rgba(31,42,34,.18)}
.film-in{position:relative;border-radius:16px;overflow:hidden;min-height:480px;display:flex;flex-direction:column;justify-content:space-between;padding:clamp(26px,4vw,48px);color:#fff}
.film-in canvas{position:absolute;inset:0;width:100%;height:100%}
.film-shade{position:absolute;inset:0;background:linear-gradient(180deg,rgba(24,32,26,.22),rgba(24,32,26,.78))}
.film-top,.film-bot{position:relative;z-index:2}
.fresh-badge{display:inline-flex;align-items:center;gap:8px;padding:7px 14px;border-radius:999px;background:rgba(251,248,243,.92);color:var(--ink);font-size:12.5px;font-weight:600}
.fresh-badge i{width:8px;height:8px;border-radius:50%;background:var(--ora)}
.film-bot h1{font-family:var(--disp);font-size:clamp(2.3rem,5.5vw,4.2rem);font-weight:400;line-height:1.15;margin-bottom:14px}
.film-bot p{max-width:520px;font-size:15.5px;color:rgba(255,255,255,.88);margin-bottom:22px}

.sec{padding:64px 0;border-top:1px solid var(--line)}
.ey{font-family:var(--serif);font-style:italic;font-size:17px;color:var(--leaf)}
.sec h2{font-size:clamp(1.75rem,3.4vw,2.6rem);font-weight:800;letter-spacing:-.03em;margin:6px 0 26px}
.story{display:grid;grid-template-columns:1.05fr .95fr;gap:36px;align-items:center}
.collage{display:grid;grid-template-columns:1.2fr .8fr;gap:14px;align-items:center}
.collage img:first-child{border-radius:22px;aspect-ratio:4/5;width:100%;object-fit:cover}
.collage img:last-child{border-radius:50%;aspect-ratio:1/1;width:100%;object-fit:cover;border:6px solid var(--sf);box-shadow:0 16px 34px rgba(0,0,0,.1)}
.k3{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-top:24px;padding-top:20px;border-top:1px solid var(--line)}
.k3 b{display:block;font-size:24px;color:var(--ora)}
.k3 span{font-size:12.5px;color:var(--mut)}

/* Price-tagged Menu Board */
.mtabs{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:24px}
.mtabs button{padding:8px 16px;border-radius:999px;border:1px solid var(--line);background:var(--sf);font-size:13px;font-weight:600;cursor:pointer}
.mtabs button.on{background:var(--ink);color:#fff;border-color:var(--ink)}
.mgrid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
.mcard{background:var(--sf);border:1px solid var(--line);border-radius:18px;overflow:hidden;position:relative;transition:transform .3s}
.mcard:hover{transform:translateY(-4px)}
.mcard-img{aspect-ratio:4/3;overflow:hidden}
.mcard-img img{width:100%;height:100%;object-fit:cover}
.best{position:absolute;top:12px;left:12px;padding:4px 10px;border-radius:999px;background:var(--ora);color:#fff;font-size:11px;font-weight:700}
.mcard-b{padding:16px 18px;display:grid;gap:6px}
.mcard-top{display:flex;justify-content:space-between;align-items:baseline;gap:8px}
.mcard-top b{font-size:16.5px}
.mcard-top span{font-weight:800;color:var(--leaf)}
.mcard-b p{font-size:13.2px;color:var(--mut)}
.visit{background:var(--sf);border:1px solid var(--line);border-radius:22px;padding:30px;display:grid;grid-template-columns:1fr 1fr;gap:28px;align-items:center}
.visit form{display:grid;gap:12px}
.visit input{padding:12px 14px;border-radius:12px;border:1px solid var(--line);background:var(--bg);font:14px var(--sans)}
@media(max-width:820px){.story,.mgrid,.visit{grid-template-columns:1fr}nav{display:none}}
footer{padding:36px 0;text-align:center;font-size:13px;color:var(--mut)}
</style>
</head>
<body>
<header>
  <a href="#top" class="logo">${esc(bp.brand)}</a>
  <nav><a href="#story">Our Story</a><a href="#menu">Signature Menu</a><a href="#visit">Visit & Reserve</a></nav>
  <a href="#visit" class="btn-o">테이블 예약</a>
</header>
<main class="wrap">
  <section id="top" class="hero" data-stitch-screen="시그니처 필름 히어로">
    <div class="film">
      <div class="film-in">
        <canvas id="cafeCanvas" width="1200" height="620"></canvas>
        <div class="film-shade"></div>
        <div class="film-top" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px">
          <span class="fresh-badge"><i></i>${esc(bp.status)}</span>
          <span style="font-size:12px;letter-spacing:.12em;opacity:.8">${esc(bp.est)}</span>
        </div>
        <div class="film-bot">
          <h1>${esc(bp.heroLines.join(' '))}</h1>
          <p>${esc(bp.heroDesc)}</p>
          <div style="display:flex;gap:10px;flex-wrap:wrap"><a href="#menu" class="btn-o">${esc(bp.ctaPrimary)} →</a><a href="#visit" class="btn-l" style="border-color:#fff;color:#fff">${esc(bp.ctaSecondary)}</a></div>
        </div>
      </div>
    </div>
  </section>

  <section id="story" class="sec" data-stitch-screen="브랜드 스토리">
    <div class="story">
      <div>
        <span class="ey">Our Story</span>
        <h2>${esc(bp.beliefTitle)}</h2>
        <p style="color:var(--mut);font-size:15px;line-height:1.8">${esc(bp.statementText)}</p>
        <div class="k3">
          ${bp.kpis.slice(0, 3).map(([n, u, l]) => `<div><b>${esc(n)}${esc(u)}</b><span>${esc(l)}</span></div>`).join('')}
        </div>
      </div>
      <div class="collage">
        <img data-ill-art="${esc(bp.brand + ' · INTERIOR')}" alt="공간">
        <img data-ill-art="${esc(bp.brand + ' · CRAFT')}" alt="디테일">
      </div>
    </div>
  </section>

  <section id="menu" class="sec" data-stitch-screen="시그니처 메뉴 보드">
    <span class="ey">Signature Menu</span>
    <h2>매일 아침 직접 준비하는 메뉴</h2>
    <div class="mtabs" id="mTabs"><button class="on" data-c="전체">전체 메뉴</button><button data-c="시그니처">시그니처</button><button data-c="디저트">디저트</button><button data-c="음료">음료</button></div>
    <div class="mgrid" id="mGrid">
      ${menus.map((m) => `<article class="mcard" data-cat="${esc(m.cat)}">${m.best ? '<span class="best">BEST</span>' : ''}<div class="mcard-img"><img data-ill-art="${esc(m.name)}" alt="${esc(m.name)}"></div><div class="mcard-b"><div class="mcard-top"><b>${esc(m.name)}</b><span>₩${m.price}</span></div><p>${esc(m.desc)}</p></div></article>`).join('')}
    </div>
  </section>

  <section id="visit" class="sec" data-stitch-screen="오시는 길 · 테이블 예약">
    <div class="visit">
      <div>
        <span class="ey">Visit & Reserve</span>
        <h2 style="margin-bottom:12px">${esc(bp.brand)}에서 만나요</h2>
        <p style="color:var(--mut);margin-bottom:10px">${esc(bp.address)}</p>
        <p style="font-weight:600;margin-bottom:6px">${esc(bp.hours)}</p>
        <p style="color:var(--leaf);font-weight:700">${esc(bp.phone)}</p>
      </div>
      <form id="cForm">
        <input required placeholder="예약자 성함">
        <input required placeholder="연락처 (010-0000-0000)">
        <input placeholder="방문 희망 시간 · 인원 (예: 토요일 14시, 2명)">
        <button type="submit" class="btn-o" style="justify-content:center">테이블 · 포장 예약 신청 →</button>
        <div id="cMsg" style="font-size:13px;font-weight:700;color:var(--leaf)"></div>
      </form>
    </div>
  </section>
  <footer>© 2026 ${esc(bp.brand)} · ${esc(bp.address)}</footer>
</main>
<script>
const CFG=${cfg};
${ART_SYNTH_JS}
document.querySelectorAll('img[data-ill-art]').forEach((im,i)=>{im.src=illArt(im.dataset.illArt,i,CFG.pal,'cafe');});
(function(){
  const cv=document.getElementById('cafeCanvas'),x=cv.getContext('2d'); let t=0;
  function draw(){
    requestAnimationFrame(draw); t+=0.01;
    const w=cv.width,h=cv.height;
    const g=x.createLinearGradient(0,0,w,h); g.addColorStop(0,'#403428'); g.addColorStop(.5,'#875332'); g.addColorStop(1,'#243026');
    x.fillStyle=g; x.fillRect(0,0,w,h);
    const rg=x.createRadialGradient(w*(.72+Math.sin(t*.5)*.12),h*.28,20,w*.68,h*.3,w*.62);
    rg.addColorStop(0,'rgba(242,102,28,0.62)'); rg.addColorStop(1,'transparent');
    x.fillStyle=rg; x.fillRect(0,0,w,h);
    for(let k=0;k<6;k++){x.fillStyle='rgba(255,248,235,0.06)';x.fillRect(100+k*190+Math.sin(t+k)*10,0,72,h);}
  }
  draw();
})();
document.querySelectorAll('#mTabs button').forEach(b=>b.onclick=()=>{
  document.querySelectorAll('#mTabs button').forEach(x=>x.classList.remove('on')); b.classList.add('on');
  const c=b.dataset.c; document.querySelectorAll('#mGrid .mcard').forEach(el=>{el.style.display=(c==='전체'||el.dataset.cat===c)?'':'none';});
});
document.getElementById('cForm').onsubmit=(e)=>{e.preventDefault();document.getElementById('cMsg').textContent='✓ 예약이 접수되었습니다. 확정 알림을 보내드립니다.';e.target.reset();};
</script>
</body>
</html>`;
  }

  /* =========================================================================
   * ARCHETYPE 5: DARK TECHNICAL SAAS + LIVE PRODUCTION CONSOLE & PRICING TOGGLE
   * Inspired by STRATA Cloud (#070b14, Electric Blue #3d7eff, Neon Live #45f0a1,
   * 0 photos, live streaming telemetry console hero, bento features, SDK copy, pricing toggle)
   * ========================================================================= */
  function renderSaaS(bp) {
    const solTabs = bp.cases.slice(0, 4).map((c, i) => ({
      tab: c.cat.split('·')[0].trim() || ['핀테크', '이커머스', 'AI 플랫폼', '엔터프라이즈'][i],
      title: c.title,
      desc: c.desc,
      m1: `${c.k1[0]}${c.k1[1]}`, l1: c.k1[2],
      m2: `${c.k2[0]}${c.k2[1]}`, l2: c.k2[2],
    }));
    return `<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(bp.brand)} — ${esc(bp.brandSub)}</title>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css">
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
<style>
:root{--bg:#070b14;--sf:#0c1220;--el:#111a2d;--fg:#e9eef8;--mut:#93a0b8;--ac:#3d7eff;--live:#45f0a1;--line:rgba(255,255,255,.09);--sans:'Pretendard Variable',sans-serif;--mono:'JetBrains Mono',monospace}
*{box-sizing:border-box;margin:0;padding:0}
a{color:inherit;text-decoration:none}
html{scroll-behavior:smooth;background:var(--bg);color:var(--fg)}
body{font-family:var(--sans);background:radial-gradient(900px 460px at 50% -10%,rgba(61,126,255,.22),transparent 65%),linear-gradient(rgba(255,255,255,.025) 1px,transparent 1px) 0 0/44px 44px,linear-gradient(90deg,rgba(255,255,255,.025) 1px,transparent 1px) 0 0/44px 44px,var(--bg);color:var(--fg);overflow-x:hidden;word-break:keep-all;line-height:1.6}
.wrap{max-width:1200px;margin:0 auto;padding:0 clamp(18px,4vw,40px)}
.mono{font-family:var(--mono);font-size:11.5px}
header{position:sticky;top:0;z-index:800;display:flex;align-items:center;justify-content:space-between;padding:15px clamp(18px,4vw,40px);background:rgba(7,11,20,.82);backdrop-filter:blur(16px);border-bottom:1px solid var(--line)}
.logo{font-weight:800;font-size:17px;letter-spacing:.04em;display:flex;align-items:center;gap:8px}
.logo i{width:9px;height:9px;border-radius:3px;background:var(--ac);box-shadow:0 0 12px var(--ac)}
nav{display:flex;gap:24px;font-size:13.5px;color:var(--mut)}
nav a:hover{color:#fff}
.btn-a{padding:10px 20px;border-radius:10px;background:var(--ac);color:#fff;font-weight:600;font-size:13.5px;border:0;cursor:pointer;box-shadow:0 8px 26px rgba(61,126,255,.35)}
.btn-g{padding:10px 20px;border-radius:10px;border:1px solid var(--line);background:rgba(255,255,255,.03);color:#fff;font-weight:600;font-size:13.5px;cursor:pointer}
@media(max-width:760px){nav{display:none}}

.hero{padding:68px 0 56px;text-align:center;display:grid;gap:22px;justify-items:center}
.pill-n{display:inline-flex;align-items:center;gap:8px;padding:6px 14px;border-radius:999px;border:1px solid rgba(69,240,161,.3);background:rgba(69,240,161,.08);color:var(--live);font-size:12px;font-weight:600}
.pill-n b{width:7px;height:7px;border-radius:50%;background:var(--live)}
.hero h1{font-size:clamp(2.3rem,5.4vw,4.4rem);font-weight:800;letter-spacing:-.04em;line-height:1.12;max-width:860px}
.hero p{max-width:600px;font-size:16px;color:var(--mut)}

/* Live Production Console Mockup */
.console{width:100%;text-align:left;background:rgba(12,18,32,.9);border:1px solid rgba(255,255,255,.12);border-radius:18px;overflow:hidden;box-shadow:0 32px 90px rgba(0,0,0,.6);margin-top:16px}
.c-top{display:flex;align-items:center;justify-content:space-between;padding:11px 16px;background:var(--el);border-bottom:1px solid var(--line)}
.dots{display:flex;gap:6px}.dots i{width:9px;height:9px;border-radius:50%;background:rgba(255,255,255,.18)}
.live-tag{color:var(--live);display:flex;align-items:center;gap:6px}
.live-tag i{width:7px;height:7px;border-radius:50%;background:var(--live);animation:blink 1.3s infinite}
@keyframes blink{50%{opacity:.3}}
.c-kpis{display:grid;grid-template-columns:repeat(4,1fr);border-bottom:1px solid var(--line)}
.ck{padding:18px 20px;border-right:1px solid var(--line)}
.ck:last-child{border-right:0}
.ck span{display:block;font-size:11.5px;color:var(--mut)}
.ck b{display:block;font-family:var(--mono);font-size:24px;color:#fff;margin-top:4px;font-variant-numeric:tabular-nums}
.ck em{font-style:normal;font-size:11.5px;color:var(--live)}
.c-logs{padding:14px 18px;font-family:var(--mono);font-size:12px;color:#b8c7e0;display:grid;gap:6px;background:#070b14;min-height:126px}
@media(max-width:760px){.c-kpis{grid-template-columns:1fr 1fr}}

.sec{padding:72px 0;border-top:1px solid var(--line)}
.sh{margin-bottom:34px}
.sh h2{font-size:clamp(1.75rem,3.4vw,2.7rem);font-weight:800;letter-spacing:-.035em;margin-top:8px}
.bento{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}
.bcard{background:var(--sf);border:1px solid var(--line);border-radius:16px;padding:24px;display:grid;gap:12px;transition:border-color .25s,transform .3s}
.bcard:hover{border-color:rgba(61,126,255,.5);transform:translateY(-4px)}
.bcard h3{font-size:18px}
.bcard p{font-size:13.8px;color:var(--mut)}
.tags{display:flex;gap:6px;flex-wrap:wrap}.tags span{padding:4px 10px;border-radius:6px;background:rgba(61,126,255,.12);color:#9cc0ff;font-size:11.5px}

/* Solutions Switcher + Copyable SDK */
.stabs{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:20px}
.stabs button{padding:9px 16px;border-radius:10px;border:1px solid var(--line);background:var(--sf);color:var(--mut);font-weight:600;cursor:pointer}
.stabs button.on{background:var(--ac);border-color:var(--ac);color:#fff}
.sol-box{display:grid;grid-template-columns:1.1fr .9fr;gap:24px;background:var(--sf);border:1px solid var(--line);border-radius:18px;padding:28px;align-items:center}
.sdk{background:#05080f;border:1px solid var(--line);border-radius:14px;overflow:hidden}
.sdk-h{display:flex;justify-content:space-between;align-items:center;padding:10px 14px;border-bottom:1px solid var(--line);color:var(--mut)}
.sdk pre{padding:16px;overflow:auto;font-family:var(--mono);font-size:12.5px;color:#d6e4ff;line-height:1.7}

/* Pricing Toggle */
.ptog{display:inline-flex;padding:4px;border-radius:10px;background:var(--sf);border:1px solid var(--line);margin-bottom:24px}
.ptog button{padding:8px 16px;border-radius:8px;border:0;background:transparent;color:var(--mut);font-weight:600;cursor:pointer}
.ptog button.on{background:var(--el);color:#fff}
.pgrid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}
.tier{background:var(--sf);border:1px solid var(--line);border-radius:18px;padding:26px;display:grid;gap:14px;align-content:start}
.tier.pop{border-color:var(--ac);box-shadow:0 0 0 1px var(--ac)}
.tier .pv{font-family:var(--mono);font-size:32px;font-weight:700}
.tier ul{list-style:none;display:grid;gap:8px;font-size:13.5px;color:var(--mut)}
.tier li::before{content:'✓ ';color:var(--live)}
@media(max-width:860px){.bento,.sol-box,.pgrid{grid-template-columns:1fr}}
footer{padding:40px 0;border-top:1px solid var(--line);display:flex;justify-content:space-between;flex-wrap:wrap;gap:12px;font-size:13px;color:var(--mut)}
</style>
</head>
<body>
<header>
  <a href="#top" class="logo"><i></i>${esc(bp.brand)}</a>
  <nav><a href="#features">Features</a><a href="#solutions">Solutions</a><a href="#pricing">Pricing</a></nav>
  <a href="#pricing" class="btn-a">무료로 시작하기</a>
</header>
<main class="wrap">
  <section id="top" class="hero" data-stitch-screen="라이브 콘솔 히어로">
    <span class="pill-n"><b></b>${esc(bp.status)}</span>
    <h1>${esc(bp.heroLines.join(' '))}</h1>
    <p>${esc(bp.heroDesc)}</p>
    <div style="display:flex;gap:12px;flex-wrap:wrap;justify-content:center"><a href="#pricing" class="btn-a">${esc(bp.ctaPrimary)} →</a><a href="#solutions" class="btn-g">${esc(bp.ctaSecondary)}</a></div>
    <div class="console">
      <div class="c-top"><div class="dots"><i></i><i></i><i></i></div><span class="mono" style="color:var(--mut)">console.${esc(bp.brand.toLowerCase())}.cloud / production</span><span class="live-tag mono"><i></i>LIVE</span></div>
      <div class="c-kpis">
        <div class="ck"><span>THROUGHPUT</span><b id="mReq">11,482 req/s</b><em>+18.4%</em></div>
        <div class="ck"><span>P95 LATENCY</span><b id="mLat">38ms</b><em>SLA 99.998%</em></div>
        <div class="ck"><span>ACTIVE NODES</span><b>24 / 24</b><em>Auto-Scaled</em></div>
        <div class="ck"><span>MONTHLY SAVED</span><b>₩4,820,000</b><em>AI Optimizer</em></div>
      </div>
      <div class="c-logs" id="cLogs">
        <div><span style="color:var(--live)">[OK]</span> edge-seoul-01 deployed v4.2.0 in 1.4s — zero downtime</div>
        <div><span style="color:#9cc0ff">[AUTO]</span> predictive autoscale +3 instances ahead of traffic peak</div>
        <div><span style="color:var(--live)">[COST]</span> spot-node rebalancing saved 34.2% compute spend</div>
      </div>
    </div>
  </section>

  <section id="features" class="sec" data-stitch-screen="핵심 아키텍처">
    <div class="sh"><span class="mono" style="color:var(--ac)">01 · CORE ENGINE</span><h2>${esc(bp.servicesTitle)}</h2></div>
    <div class="bento">
      ${bp.services.slice(0, 3).map((s) => `<div class="bcard"><span class="mono" style="color:var(--live)">${esc(s.code)}</span><h3>${esc(s.name)}</h3><p>${esc(s.summary)}</p><div class="tags">${s.tags.map((t) => `<span>${esc(t)}</span>`).join('')}</div></div>`).join('')}
    </div>
  </section>

  <section id="solutions" class="sec" data-stitch-screen="솔루션 · SDK">
    <div class="sh"><span class="mono" style="color:var(--ac)">02 · SOLUTIONS & DEVELOPER DX</span><h2>${esc(bp.casesTitle)}</h2></div>
    <div class="stabs" id="solTabs">${solTabs.map((s, i) => `<button class="${i === 0 ? 'on' : ''}" data-i="${i}">${esc(s.tab)}</button>`).join('')}</div>
    <div class="sol-box">
      <div id="solInfo"></div>
      <div class="sdk">
        <div class="sdk-h mono"><span>deploy.ts</span><button type="button" id="copySdk" class="btn-g" style="padding:4px 10px;font-size:11px">복사</button></div>
        <pre id="sdkCode">import { createClient } from '@${esc(bp.brand.toLowerCase())}/sdk';

const app = createClient({ region: 'ap-northeast-2', autoscale: true });
await app.deploy({ zeroDowntime: true, aiCostGuard: 'strict' });</pre>
      </div>
    </div>
  </section>

  <section id="pricing" class="sec" data-stitch-screen="요금제 · 시작하기">
    <div class="sh"><span class="mono" style="color:var(--ac)">03 · PRICING</span><h2>투명한 종량·구독 요금제</h2></div>
    <div class="ptog" id="pTog"><button class="on" data-m="1">월간 결제</button><button data-m="0.8">연간 결제 (20% 할인)</button></div>
    <div class="pgrid">
      <div class="tier"><span class="mono">STARTUP</span><div class="pv" data-base="49000">₩49,000</div><ul><li>월 500만 요청 포함</li><li>자동 무중단 배포</li><li>실시간 로그 대시보드</li></ul><button class="btn-g" onclick="alert('Startup 플랜 체험이 시작되었습니다.')">14일 무료 체험</button></div>
      <div class="tier pop"><span class="mono" style="color:var(--ac)">PRO · MOST POPULAR</span><div class="pv" data-base="189000">₩189,000</div><ul><li>예측형 AI 오토스케일링</li><li>AI 비용 최적화 엔진</li><li>99.99% SLA & 전담 슬랙</li></ul><button class="btn-a" onclick="alert('Pro 플랜 체험이 시작되었습니다.')">Pro 시작하기 →</button></div>
      <div class="tier"><span class="mono">ENTERPRISE</span><div class="pv">맞춤 견적</div><ul><li>전용 VPC / 온프레미스</li><li>SOC2 · ISMS 보안 컴플라이언스</li><li>24/7 아키텍트 전담 지원</li></ul><button class="btn-g" onclick="alert('엔터프라이즈 상담이 접수되었습니다.')">도입 문의</button></div>
    </div>
  </section>
  <footer><span>© 2026 ${esc(bp.brand)} Inc.</span><span class="mono">${esc(bp.email)} · ${esc(bp.phone)}</span></footer>
</main>
<script>
const SOLS=${JSON.stringify(solTabs).replace(/<\/script/gi, '<\\/script')};
function renderSol(i){
  const s=SOLS[i]||SOLS[0];
  document.getElementById('solInfo').innerHTML='<span class="mono" style="color:var(--live)">'+s.tab+'</span><h3 style="font-size:24px;margin:8px 0 10px">'+s.title+'</h3><p style="color:var(--mut);font-size:14.5px;margin-bottom:18px">'+s.desc+'</p><div style="display:flex;gap:28px"><div><b style="font-size:28px;color:var(--live);font-family:var(--mono)">'+s.m1+'</b><div style="font-size:12px;color:var(--mut)">'+s.l1+'</div></div><div><b style="font-size:28px;color:#9cc0ff;font-family:var(--mono)">'+s.m2+'</b><div style="font-size:12px;color:var(--mut)">'+s.l2+'</div></div></div>';
}
renderSol(0);
document.querySelectorAll('#solTabs button').forEach(b=>b.onclick=()=>{document.querySelectorAll('#solTabs button').forEach(x=>x.classList.remove('on'));b.classList.add('on');renderSol(Number(b.dataset.i));});
document.getElementById('copySdk').onclick=(e)=>{navigator.clipboard?.writeText(document.getElementById('sdkCode').textContent);e.target.textContent='복사됨 ✓';setTimeout(()=>e.target.textContent='복사',1600);};
document.querySelectorAll('#pTog button').forEach(b=>b.onclick=()=>{
  document.querySelectorAll('#pTog button').forEach(x=>x.classList.remove('on')); b.classList.add('on');
  const m=Number(b.dataset.m);
  document.querySelectorAll('.pv[data-base]').forEach(el=>{el.textContent='₩'+Math.round(Number(el.dataset.base)*m).toLocaleString();});
});
setInterval(()=>{
  const r=11200+Math.floor(Math.random()*640), l=34+Math.floor(Math.random()*12);
  document.getElementById('mReq').textContent=r.toLocaleString()+' req/s';
  document.getElementById('mLat').textContent=l+'ms';
},1800);
</script>
</body>
</html>`;
  }

  window.ILLArchetypes = { renderAtelier, renderArchitecture, renderLuxury, renderCafe, renderSaaS };
})();
