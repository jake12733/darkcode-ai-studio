/* DARK CODE AI · Google Stitch Infinite Visual Multi-Board Canvas (window.StitchCanvas)
 * - 무한 도트그리드 캔버스 (드래그 팬 · 마우스 휠/버튼 줌 · 한눈에 보기 Fit)
 * - 실시간 그래픽 생성 관찰:
 *   1) Design System 보드 (컬러 팔레트 스와치 · Aa 타이포그래피 · UI 컴포넌트 토큰)
 *   2) 메인 페이지 / 핵심 서비스 / 소개·의료진 / 예약·오시는 길 멀티 아트보드 나란히 표시
 *   3) 생성 중 각 보드의 아키텍처 와이어프레임이 순차적으로 빛나며 조립 → 완성 시 실제 HTML 섹션별 라이브 렌더링!
 *   4) 보드 클릭 시 전체 인터랙티브 프리뷰로 즉시 전환
 */
(function () {
  'use strict';

  const DOMAIN_PRESETS = [
    {
      re: /(병원|치과|클리닉|의원|의료|한의원|성형|피부과|medical|dental|clinic|hospital)/i,
      brand: '세이 메디컬 클리닉',
      palette: [
        { name: 'Primary Navy', hex: '#0F2942' },
        { name: 'Medical Teal', hex: '#0D9488' },
        { name: 'Soft Surface', hex: '#F8FAFC' },
        { name: 'Pure White', hex: '#FFFFFF' },
      ],
      screens: [
        { id: 'main', title: '메인 페이지', icon: '◫', kind: 'hero' },
        { id: 'services', title: '진료 안내', icon: '◈', kind: 'services' },
        { id: 'team', title: '의료진 소개', icon: '◉', kind: 'team' },
        { id: 'contact', title: '오시는 길 · 예약', icon: '◎', kind: 'contact' },
      ],
    },
    {
      re: /(카페|커피|베이커리|레스토랑|식당|호텔|리조트|뷰티|에스테틱|패션|cafe|hotel|beauty)/i,
      brand: '아틀리에 브랜드 스튜디오',
      palette: [
        { name: 'Warm Espresso', hex: '#1C1917' },
        { name: 'Champagne Gold', hex: '#B4834C' },
        { name: 'Ivory Cream', hex: '#FAF8F5' },
        { name: 'Soft Sand', hex: '#EDE7DE' },
      ],
      screens: [
        { id: 'main', title: '메인 랜딩', icon: '◫', kind: 'hero' },
        { id: 'services', title: '시그니처 메뉴 · 컬렉션', icon: '◈', kind: 'services' },
        { id: 'team', title: '브랜드 스토리', icon: '◉', kind: 'team' },
        { id: 'contact', title: '예약 · 위치 안내', icon: '◎', kind: 'contact' },
      ],
    },
    {
      re: /.*/,
      brand: '모던 웹 프로젝트',
      palette: [
        { name: 'Deep Slate', hex: '#0F172A' },
        { name: 'Electric Blue', hex: '#2563EB' },
        { name: 'Clean Surface', hex: '#F8FAFC' },
        { name: 'Accent Mint', hex: '#10B981' },
      ],
      screens: [
        { id: 'main', title: '메인 페이지', icon: '◫', kind: 'hero' },
        { id: 'services', title: '핵심 기능 · 서비스', icon: '◈', kind: 'services' },
        { id: 'team', title: '팀 · 포트폴리오', icon: '◉', kind: 'team' },
        { id: 'contact', title: '문의 · 시작하기', icon: '◎', kind: 'contact' },
      ],
    },
  ];

  function detectPreset(prompt) {
    const s = String(prompt || '');
    return DOMAIN_PRESETS.find((p) => p.re.test(s)) || DOMAIN_PRESETS[DOMAIN_PRESETS.length - 1];
  }

  function extractCssPalette(html, fallback) {
    const found = [];
    const seen = new Set();
    const re = /--[a-z0-9_-]*(?:primary|accent|brand|navy|blue|teal|gold|bg|surface|dark|text)[a-z0-9_-]*\s*:\s*(#[0-9a-fA-F]{3,8})/gi;
    let m;
    while ((m = re.exec(html || '')) && found.length < 4) {
      const hex = m[1].toUpperCase();
      if (!seen.has(hex)) {
        seen.add(hex);
        const label = m[0].split(':')[0].replace(/^--/, '').replace(/[-_]/g, ' ');
        found.push({ name: label, hex });
      }
    }
    return found.length >= 2 ? found : fallback;
  }

  function extractBrandTitle(html, fallback) {
    const m = String(html || '').match(/<title[^>]*>([^<]{2,42})<\/title>/i);
    return m ? m[1].replace(/\s*[·|—-].*$/, '').trim() : fallback;
  }

  function esc(s) {
    return String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  // Build isolated visual section preview HTML for each Stitch artboard (cleanly framed from the generated full HTML)
  function buildScreenSliceDoc(fullHtml, sliceIndex, totalSlices) {
    if (!fullHtml) return '';
    // Keep exact <head> styles + header + target <section> (or scroll-offset fallback so every board shows a distinct visual screen!)
    const doc = new DOMParser().parseFromString(fullHtml, 'text/html');
    const sections = Array.from(doc.querySelectorAll('main > section, body > section, section[id], section[data-stitch-screen]'))
      .filter((el) => !el.closest('dialog, .modal, [hidden]'));

    // Hide modals & floating clutter inside board thumbnails and force all reveal/fade animations visible
    const injectCss = `
      <style data-stitch-slice>
        html, body { overflow: hidden !important; scroll-behavior: auto !important; margin: 0 !important; }
        dialog, .modal, .floating-bar, .fab, #bookingModal, [role="dialog"] { display: none !important; }
        section, section *, main, article, .card, .item, [class*="reveal"], [class*="fade"], [data-dc-motion-init] {
          opacity: 1 !important; transform: none !important; visibility: visible !important; animation: none !important;
        }
        ${sliceIndex > 0 ? 'section { min-height: auto !important; padding-top: 56px !important; }' : ''}
      </style>
    `;

    if (sliceIndex === 0) {
      // Main Hero board: top of the full page
      return fullHtml.replace(/<\/head>/i, injectCss + '</head>');
    }

    if (sections.length >= 2) {
      // Map boards 1, 2, 3 to real distinct sections of the generated site!
      const mappedIdx = Math.min(sections.length - 1, Math.max(1, Math.round((sliceIndex / (totalSlices - 1)) * (sections.length - 1))));
      const header = doc.querySelector('header, nav');
      const targetSec = sections[mappedIdx];
      const nextSec = sliceIndex === totalSlices - 1 ? doc.querySelector('footer') : null;
      const bodyHtml = `${header ? header.outerHTML : ''}${targetSec ? targetSec.outerHTML : ''}${nextSec ? nextSec.outerHTML : ''}`;
      const headHtml = doc.head ? doc.head.innerHTML : '';
      return `<!doctype html><html lang="ko"><head>${headHtml}${injectCss}</head><body class="${esc(doc.body?.className || '')}" style="${esc(doc.body?.getAttribute('style') || '')}">${bodyHtml}</body></html>`;
    }

    // Fallback: jump viewport scroll to distinct vertical bands
    const pct = sliceIndex * 760;
    const scrollJs = `<script>window.addEventListener('DOMContentLoaded',function(){window.scrollTo(0,${pct});});<\/script>`;
    return fullHtml.replace(/<\/head>/i, injectCss + scrollJs + '</head>');
  }

  function wireframeGraphic(kind) {
    if (kind === 'hero') {
      return `<div class="sw-page">
        <div class="sw-nav"><span class="sw-logo"></span><div class="sw-links"><i></i><i></i><i></i></div><span class="sw-cta-sm"></span></div>
        <div class="sw-hero-split">
          <div class="sw-hero-copy"><div class="sw-tag"></div><div class="sw-h1"></div><div class="sw-h1 short"></div><div class="sw-p"></div><div class="sw-btn-row"><span class="sw-btn pri"></span><span class="sw-btn"></span></div></div>
          <div class="sw-hero-img"><span class="sw-img-ico"></span></div>
        </div>
        <div class="sw-3cards"><div></div><div></div><div></div></div>
      </div>`;
    }
    if (kind === 'services') {
      return `<div class="sw-page">
        <div class="sw-nav"><span class="sw-logo"></span><div class="sw-links"><i></i><i></i></div></div>
        <div class="sw-sec-head"><div class="sw-h2"></div><div class="sw-p sm"></div></div>
        <div class="sw-2grid">
          <div class="sw-img-card"><div class="sw-pic"></div><div class="sw-line"></div><div class="sw-line s"></div></div>
          <div class="sw-img-card"><div class="sw-pic"></div><div class="sw-line"></div><div class="sw-line s"></div></div>
        </div>
        <div class="sw-3cards"><div></div><div></div><div></div></div>
      </div>`;
    }
    if (kind === 'team') {
      return `<div class="sw-page">
        <div class="sw-nav"><span class="sw-logo"></span><div class="sw-links"><i></i><i></i></div></div>
        <div class="sw-sec-head"><div class="sw-h2"></div></div>
        <div class="sw-lead-doc"><div class="sw-avatar lg"></div><div class="sw-doc-txt"><div class="sw-line"></div><div class="sw-line s"></div><div class="sw-line xs"></div></div></div>
        <div class="sw-4avatars">
          <div><i class="sw-avatar"></i><span></span></div>
          <div><i class="sw-avatar"></i><span></span></div>
          <div><i class="sw-avatar"></i><span></span></div>
          <div><i class="sw-avatar"></i><span></span></div>
        </div>
      </div>`;
    }
    return `<div class="sw-page">
      <div class="sw-nav"><span class="sw-logo"></span><div class="sw-links"><i></i><i></i></div></div>
      <div class="sw-sec-head"><div class="sw-h2"></div></div>
      <div class="sw-map-box"><span></span></div>
      <div class="sw-form-rows"><div></div><div></div><div class="sw-btn pri full"></div></div>
    </div>`;
  }

  class StitchCanvas {
    constructor(mountEl, { onOpenInteractive } = {}) {
      this.mount = mountEl;
      this.onOpenInteractive = onOpenInteractive || (() => {});
      this.zoom = 0.72;
      this.panX = 28;
      this.panY = 36;
      this.dragging = false;
      this.preset = detectPreset('');
      this.fullHtml = '';
      this.stage = 'IDLE';
      this.buildDom();
      this.bindPanZoom();
    }

    buildDom() {
      this.mount.innerHTML = `
        <div class="sc-viewport" id="scViewport">
          <div class="sc-world" id="scWorld">
            <div class="sc-boards" id="scBoards"></div>
          </div>
          <div class="sc-empty" id="scEmpty">
            <div class="sc-empty-ico">✦</div>
            <b>멀티 보드 비주얼 캔버스</b>
            <p>명령을 입력하면 디자인 시스템과 페이지별 화면이 이곳에 그래픽으로 실시간 생성됩니다.</p>
          </div>
          <div class="sc-dock" aria-label="캔버스 도구">
            <button type="button" data-sc="fit" title="한눈에 맞추기">⊞</button>
            <button type="button" data-sc="in" title="확대">+</button>
            <span class="sc-zval" id="scZval">72%</span>
            <button type="button" data-sc="out" title="축소">−</button>
            <div class="sc-dock-sep"></div>
            <button type="button" data-sc="full" title="전체 인터랙티브 프리뷰 열기">▶</button>
          </div>
          <div class="sc-live-hud" id="scLiveHud" hidden>
            <span class="sc-hud-dot"></span>
            <b id="scHudTitle">실시간 캔버스 생성 중</b>
            <span id="scHudSub">디자인 토큰 및 레이아웃 설계 중…</span>
          </div>
        </div>
      `;
      this.vp = this.mount.querySelector('#scViewport');
      this.world = this.mount.querySelector('#scWorld');
      this.boards = this.mount.querySelector('#scBoards');
      this.empty = this.mount.querySelector('#scEmpty');
      this.zval = this.mount.querySelector('#scZval');
      this.hud = this.mount.querySelector('#scLiveHud');
      this.hudTitle = this.mount.querySelector('#scHudTitle');
      this.hudSub = this.mount.querySelector('#scHudSub');

      this.mount.querySelectorAll('[data-sc]').forEach((b) => {
        b.onclick = () => {
          const a = b.dataset.sc;
          if (a === 'in') this.setTransform(this.panX, this.panY, Math.min(1.45, this.zoom + 0.12));
          else if (a === 'out') this.setTransform(this.panX, this.panY, Math.max(0.32, this.zoom - 0.12));
          else if (a === 'fit') this.fitAll();
          else if (a === 'full') this.onOpenInteractive();
        };
      });
    }

    bindPanZoom() {
      let sx = 0, sy = 0, ox = 0, oy = 0;
      this.vp.addEventListener('pointerdown', (e) => {
        if (e.target.closest('button, .sc-board-act')) return;
        this.dragging = true;
        sx = e.clientX; sy = e.clientY; ox = this.panX; oy = this.panY;
        this.vp.classList.add('grabbing');
        this.vp.setPointerCapture?.(e.pointerId);
      });
      this.vp.addEventListener('pointermove', (e) => {
        if (!this.dragging) return;
        this.setTransform(ox + (e.clientX - sx), oy + (e.clientY - sy), this.zoom);
      });
      const end = () => { this.dragging = false; this.vp.classList.remove('grabbing'); };
      this.vp.addEventListener('pointerup', end);
      this.vp.addEventListener('pointercancel', end);
      this.vp.addEventListener('wheel', (e) => {
        e.preventDefault();
        if (e.ctrlKey || e.metaKey || Math.abs(e.deltaY) > 0) {
          const factor = e.deltaY < 0 ? 1.07 : 0.93;
          const nextZ = Math.max(0.32, Math.min(1.45, this.zoom * factor));
          this.setTransform(this.panX, this.panY, nextZ);
        }
      }, { passive: false });
    }

    setTransform(x, y, z) {
      this.panX = x; this.panY = y; this.zoom = z;
      this.world.style.transform = `translate(${Math.round(x)}px, ${Math.round(y)}px) scale(${z})`;
      if (this.zval) this.zval.textContent = Math.round(z * 100) + '%';
    }

    fitAll() {
      const vr = this.vp.getBoundingClientRect();
      if (!vr.width || !vr.height) return;
      const contentW = 290 + 4 * 410 + 4 * 28 + 48; // Design System + 4 boards
      const contentH = 590;
      const z = Math.max(0.38, Math.min(0.95, Math.min((vr.width - 56) / contentW, (vr.height - 64) / contentH)));
      const x = Math.max(20, (vr.width - contentW * z) / 2);
      const y = Math.max(28, (vr.height - contentH * z) / 2);
      this.setTransform(x, y, z);
    }

    renderDesignSystemBoard(brand, palette, building) {
      const pri = palette[0]?.hex || '#0F2942';
      const acc = palette[1]?.hex || '#0D9488';
      return `
        <article class="sc-board sc-ds ${building ? 'is-building' : 'is-ready'}" data-board="ds">
          <header class="sc-bhead">
            <span class="sc-bico">✦</span>
            <b>${esc(brand)}</b>
            <span class="sc-bstat">${building ? '토큰 추출 중' : '디자인 시스템'}</span>
          </header>
          <div class="sc-ds-body">
            <div class="sc-ds-sec">
              <small>COLOR PALETTE</small>
              <div class="sc-swatches">
                ${palette.map((c) => `<div class="sc-sw"><i style="background:${esc(c.hex)}"></i><span>${esc(c.hex)}</span></div>`).join('')}
              </div>
            </div>
            <div class="sc-ds-sec">
              <small>TYPOGRAPHY</small>
              <div class="sc-typo">
                <div><b style="font-size:26px">Aa</b><span>Display · Bold</span></div>
                <div><b style="font-size:20px;font-weight:600">Aa</b><span>Heading · Semi</span></div>
                <div><b style="font-size:15px;font-weight:400">Aa</b><span>Body · Regular</span></div>
              </div>
            </div>
            <div class="sc-ds-sec">
              <small>UI COMPONENTS</small>
              <div class="sc-comps">
                <span class="sc-cbtn" style="background:${esc(pri)};color:#fff">예약하기</span>
                <span class="sc-cbtn out" style="border-color:${esc(acc)};color:${esc(acc)}">자세히 보기</span>
                <span class="sc-cpill" style="background:${esc(acc)}20;color:${esc(acc)}">실시간 상담</span>
              </div>
            </div>
          </div>
        </article>
      `;
    }

    startBuild(prompt) {
      this.preset = detectPreset(prompt);
      this.fullHtml = '';
      this.empty.hidden = true;
      this.hud.hidden = false;
      this.hudTitle.textContent = '실시간 그래픽 캔버스 설계 중';
      this.hudSub.textContent = `"${String(prompt || '').slice(0, 36)}" · 디자인 시스템 생성`;

      const dsHtml = this.renderDesignSystemBoard(this.preset.brand, this.preset.palette, true);
      const screenBoards = this.preset.screens.map((sc, i) => `
        <article class="sc-board sc-screen is-queued" data-board="${sc.id}" data-idx="${i}">
          <header class="sc-bhead">
            <span class="sc-bico">${sc.icon}</span>
            <b>${esc(sc.title)}</b>
            <span class="sc-bstat" data-stat>대기 중</span>
          </header>
          <div class="sc-frame-wrap">
            <div class="sc-wire-layer">${wireframeGraphic(sc.kind)}<div class="sc-laser"></div></div>
            <div class="sc-live-layer" data-live hidden></div>
          </div>
        </article>
      `).join('');

      this.boards.innerHTML = dsHtml + screenBoards;
      requestAnimationFrame(() => this.fitAll());
      this.setStage('STRATEGIST');
    }

    setStage(stageName) {
      this.stage = stageName;
      const ds = this.boards.querySelector('[data-board="ds"]');
      const screens = Array.from(this.boards.querySelectorAll('.sc-screen'));
      if (!screens.length) return;

      const stageMsg = {
        ROUTE: '요청 의도 및 업종 디자인 시스템 분석 중…',
        STRATEGIST: '브랜드 컬러·타이포그래피 및 4개 페이지 와이어프레임 설계 중…',
        IMPLEMENTER: '각 화면의 HTML · CSS · 인터랙션 컴포넌트 구축 중…',
        GENERATE: 'UI 컴포넌트 및 고화질 에디토리얼 레이아웃 생성 중…',
        CRITIC: '반응형 · 대비 · UX 결함 교차 검증 중…',
        SYNTH: '최종 완성 코드 통합 및 아트보드 조립 중…',
        VERIFY: '정적 검증 및 실사 미디어 매칭 완료 중…',
        RENDER: '모든 아트보드 렌더링 완료',
      };
      if (this.hudSub) this.hudSub.textContent = stageMsg[stageName] || `${stageName} 단계 처리 중…`;

      if (stageName === 'STRATEGIST' || stageName === 'ROUTE' || stageName === 'PLAN') {
        ds?.classList.add('is-building');
        screens.forEach((el, i) => {
          el.classList.remove('is-ready');
          el.classList.toggle('is-building', i === 0);
          el.classList.toggle('is-queued', i > 0);
          const st = el.querySelector('[data-stat]');
          if (st) st.textContent = i === 0 ? '와이어프레임 설계 중…' : '구조 설계 대기';
        });
      } else if (stageName === 'IMPLEMENTER' || stageName === 'GENERATE' || stageName === 'DRAFT') {
        ds?.classList.remove('is-building'); ds?.classList.add('is-ready');
        const dsSt = ds?.querySelector('.sc-bstat'); if (dsSt) dsSt.textContent = '토큰 완료 ✓';
        screens.forEach((el, i) => {
          el.classList.remove('is-queued'); el.classList.add('is-building');
          const st = el.querySelector('[data-stat]');
          if (st) st.textContent = i < 2 ? 'UI 렌더링 생성 중…' : '컴포넌트 조립 중…';
        });
      } else if (stageName === 'CRITIC' || stageName === 'SYNTH' || stageName === 'VERIFY') {
        screens.forEach((el) => {
          el.classList.remove('is-queued'); el.classList.add('is-building');
          const st = el.querySelector('[data-stat]');
          if (st) st.textContent = '품질 검증 · 보정 중…';
        });
      }
    }

    onTokenChunk(chunkText) {
      if (!chunkText || !this.boards.children.length) return;
      // Progressive visual feedback on the HUD as code streams in
      if (/<header|<nav/i.test(chunkText)) this.hudSub.textContent = '네비게이션 헤더 및 브랜드 바 구성 중…';
      else if (/hero|banner|main/i.test(chunkText)) this.hudSub.textContent = '메인 페이지 히어로 및 CTA 배치 중…';
      else if (/doctor|team|staff|의료진/i.test(chunkText)) this.hudSub.textContent = '소개 및 의료진 프로필 그리드 생성 중…';
      else if (/booking|modal|reserv|예약/i.test(chunkText)) this.hudSub.textContent = '실시간 예약 모달 및 인터랙션 스크립트 연결 중…';
    }

    renderComplete(fullHtml, titleHint) {
      if (!fullHtml) return;
      this.fullHtml = fullHtml;
      this.empty.hidden = true;
      this.hud.hidden = true;

      const brand = extractBrandTitle(fullHtml, titleHint || this.preset.brand);
      const palette = extractCssPalette(fullHtml, this.preset.palette);
      const preset = detectPreset(brand + ' ' + fullHtml.slice(0, 1200));
      this.preset = preset;

      // Extract real section headings if present so board titles match the ACTUAL generated site!
      const parsed = new DOMParser().parseFromString(fullHtml, 'text/html');
      const secs = Array.from(parsed.querySelectorAll('main > section, body > section, section[id]')).filter((el) => !el.closest('dialog, .modal, [hidden]'));
      const screenDefs = preset.screens.map((sc, i) => {
        let label = sc.title;
        if (i > 0 && secs.length >= 2) {
          const mappedIdx = Math.min(secs.length - 1, Math.max(1, Math.round((i / (preset.screens.length - 1)) * (secs.length - 1))));
          const h = secs[mappedIdx]?.querySelector('h2, h3, [data-stitch-screen]');
          const txt = (secs[mappedIdx]?.getAttribute('data-stitch-screen') || h?.textContent || '').trim().replace(/\s+/g, ' ');
          if (txt && txt.length >= 2 && txt.length <= 22) label = txt;
        }
        return { ...sc, title: label };
      });

      const dsHtml = this.renderDesignSystemBoard(brand, palette, false);
      const screenBoards = screenDefs.map((sc, i) => `
        <article class="sc-board sc-screen is-ready" data-board="${sc.id}" data-idx="${i}">
          <header class="sc-bhead">
            <span class="sc-bico">${sc.icon}</span>
            <b>${esc(sc.title)}</b>
            <button type="button" class="sc-board-act" data-open-full="${i}" title="인터랙티브 전체 화면으로 보기">열기 ↗</button>
          </header>
          <div class="sc-frame-wrap">
            <div class="sc-live-layer" data-live></div>
          </div>
        </article>
      `).join('');

      this.boards.innerHTML = dsHtml + screenBoards;

      // Mount crisp scaled desktop-width iframes inside each artboard (1280px scaled cleanly to 390px card!)
      const layers = this.boards.querySelectorAll('[data-live]');
      layers.forEach((layer, idx) => {
        const sliceDoc = buildScreenSliceDoc(fullHtml, idx, layers.length);
        const iframe = document.createElement('iframe');
        iframe.className = 'sc-thumb-frame';
        iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin');
        iframe.setAttribute('scrolling', 'no');
        iframe.title = screenDefs[idx]?.title || `Screen ${idx + 1}`;
        iframe.srcdoc = sliceDoc;
        layer.appendChild(iframe);
      });

      this.boards.querySelectorAll('[data-open-full]').forEach((btn) => {
        btn.onclick = (e) => { e.stopPropagation(); this.onOpenInteractive(); };
      });
      this.boards.querySelectorAll('.sc-screen').forEach((card) => {
        card.ondblclick = () => this.onOpenInteractive();
      });

      requestAnimationFrame(() => this.fitAll());
    }

    clear() {
      this.fullHtml = '';
      this.boards.innerHTML = '';
      this.empty.hidden = false;
      this.hud.hidden = true;
    }
  }

  window.StitchCanvas = StitchCanvas;
})();
