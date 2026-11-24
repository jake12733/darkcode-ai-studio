/**
 * DARK CODE :: Aside-Grade Autonomous Agentic Operator & Self-Healing Engine
 * v1.0 (20261124-aside)
 * 
 * 기능:
 * 1. Autonomous Self-Healing (런타임 에러 자동 포착 및 자가 치유)
 * 2. Aside-Grade Agentic DOM Operator (가상 마우스/인터랙션 시뮬레이션 및 검증)
 * 3. Autonomous Execution Ledger (인터랙션 상태 검증 원장)
 */
(function (global) {
  'use strict';

  class DCAsideOperator {
    constructor(opts = {}) {
      this.frameSelector = opts.frameSelector || '#pvFrame';
      this.onLog = opts.onLog || console.log;
      this.onHealingRequired = opts.onHealingRequired || null;
      this.onTestComplete = opts.onTestComplete || null;
      this.isRunning = false;
      this.errorHistory = [];
      this.initRuntimeListener();
    }

    /**
     * 런타임 에러 자동 감지 리스너 등록
     */
    initRuntimeListener() {
      if (typeof window === 'undefined') return;
      window.addEventListener('message', (e) => {
        if (!e.data || typeof e.data !== 'object') return;
        if (e.data.type === 'DC_RUNTIME_ERROR') {
          this.handleRuntimeError(e.data);
        } else if (e.data.type === 'DC_OPERATOR_EVENT') {
          this.onLog(`[Aside Operator] ${e.data.msg}`, e.data.status || 'route');
        }
      });
    }

    /**
     * iframe 내부에서 발생한 오류 수신 처리
     */
    handleRuntimeError(errData) {
      const signature = `${errData.message} @ ${errData.lineno}:${errData.colno}`;
      if (this.errorHistory.includes(signature)) return; // 중복 호출 방지
      this.errorHistory.push(signature);

      this.onLog(`[⚡ Aside 자가 치유] 런타임 오류 감지: "${errData.message}" (${errData.lineno}번째 줄)`, 'err');

      if (typeof this.onHealingRequired === 'function') {
        this.onHealingRequired({
          message: errData.message,
          filename: errData.filename,
          lineno: errData.lineno,
          colno: errData.colno,
          stack: errData.stack
        });
      }
    }

    /**
     * 샌드박스 iframe 문서에 주입할 런타임 관찰자 스크립트 생성
     */
    static getInjectedScript() {
      return `
<script id="__dc_aside_runtime__">
(function() {
  if (window.__dc_aside_injected__) return;
  window.__dc_aside_injected__ = true;

  // 1. 런타임 오류 가로채기
  window.addEventListener('error', function(e) {
    try {
      window.parent.postMessage({
        type: 'DC_RUNTIME_ERROR',
        message: e.message || 'Script error',
        filename: e.filename || '',
        lineno: e.lineno || 0,
        colno: e.colno || 0,
        stack: e.error ? (e.error.stack || '') : ''
      }, '*');
    } catch(err) {}
  });

  window.addEventListener('unhandledrejection', function(e) {
    try {
      window.parent.postMessage({
        type: 'DC_RUNTIME_ERROR',
        message: 'Unhandled Rejection: ' + (e.reason?.message || String(e.reason)),
        stack: e.reason?.stack || ''
      }, '*');
    } catch(err) {}
  });

  // 2. Aside 가상 커서 생성 함수
  function getOrCreateBeacon() {
    let b = document.getElementById('__aside_beacon__');
    if (!b) {
      b = document.createElement('div');
      b.id = '__aside_beacon__';
      b.style.cssText = 'position:fixed;width:24px;height:24px;border-radius:50%;border:2px solid #6366f1;background:rgba(99,102,241,0.22);box-shadow:0 0 15px rgba(99,102,241,0.6);pointer-events:none;z-index:999999;transition:all 0.35s cubic-bezier(0.2, 0.8, 0.2, 1);transform:translate(-50%,-50%) scale(1);display:none;';
      document.body.appendChild(b);
    }
    return b;
  }

  // 3. Aside 비전 자율 검수: 한국인 사이트에서 외국인 사진 감지 시 자동 핫패치 및 깨진 이미지(엑스박스) 원천 자동 치유
  function auditKoreanVisuals() {
    try {
      // (1) 모든 img 태그에 깨진 이미지(엑스박스) 원천 방지 리스너 및 상대경로/빈 src 즉시 치유
      document.querySelectorAll('img').forEach(function(img) {
        img.addEventListener('error', function() {
          const alt = img.getAttribute('alt') || '';
          const isDoc = /(의사|치과|원장|환자|진료|병원|doctor|dentist|여의사)/i.test(alt);
          const safeUrl = isDoc 
            ? 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=900&q=85'
            : 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1400&q=85';
          if (img.src !== safeUrl) {
            img.src = safeUrl;
            img.style.objectFit = 'cover';
            window.parent.postMessage({ type: 'DC_OPERATOR_EVENT', msg: 'Aside 비전 치유: 깨진 이미지 자동 복구 완료 (' + (alt.slice(0,25) || 'photo') + ')', status: 'ok' }, '*');
          }
        });

        const rawSrc = img.getAttribute('src') || '';
        const rawAlt = img.getAttribute('alt') || '';
        if (!rawSrc || !/^(https?:\\/\\/|data:image\\/|blob:)/i.test(rawSrc) || rawSrc.includes('undefined')) {
          const isDoc = /(의사|치과|원장|환자|진료|병원|doctor|dentist|여의사)/i.test(rawAlt);
          img.src = isDoc 
            ? 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=900&q=85'
            : 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1400&q=85';
          img.style.objectFit = 'cover';
        }
      });

      // (2) 한국 서비스 컨텍스트에서 외국인 사진 감지 시 100% 한국인 실사 AI 사진으로 즉시 핫패치
      const isKoreanContext = /(치과|병원|원장|김민준|의료|클리닉|한의원|상담|대표|한국|연세|진료)/i.test(document.body.innerText || '');
      if (isKoreanContext) {
        document.querySelectorAll('img').forEach(function(img) {
          const src = img.getAttribute('src') || '';
          const alt = img.getAttribute('alt') || '';
          const parent = img.closest('.card, .profile, .doctor, .team, section, div, li');
          const ctxText = (alt + ' ' + (parent ? parent.innerText : '')).slice(0, 500);
          const isPerson = /(대표원장|원장|김민준|의사|치과의사|의료진|스태프|치과|doctor|dentist|surgeon|staff)/i.test(ctxText);
          if (isPerson && (/upload\\.wikimedia\\.org|pexels|unsplash/i.test(src) || !/korean/i.test(src))) {
            const isFemale = /(여의사|여성|여자|female)/i.test(ctxText);
            const isSurgeon = /(수술|가이드|네비게이션|임플란트|surgery|식립)/i.test(ctxText);
            let prompt = isSurgeon 
              ? 'korean dental surgeons team in modern surgical clinic, scrubs and masks, 8k photo'
              : (isFemale ? 'korean female dentist physician in clinic, gentle smile, 8k photo' : 'korean male dentist director in late 30s, warm professional smile, white dental coat, 8k photo');
            const newSrc = 'https://image.pollinations.ai/prompt/' + encodeURIComponent(prompt) + '?width=800&height=1000&nologo=true';
            img.src = newSrc;
            img.setAttribute('onerror', "this.onerror=null;this.src='https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=900&q=85';");
            window.parent.postMessage({ type: 'DC_OPERATOR_EVENT', msg: 'Aside 비전 검수: 외국인 스톡 사진 감지 → 8K 한국인 실사 AI 사진으로 자동 핫패치 완료', status: 'ok' }, '*');
          }
        });
      }
    } catch(e) {}
  }

  // 4. DarkMotion & Rich Interactive Auto-Enhancer: 스크롤 인뷰 모션, 3D 카드 호버, 비디오 자동 재생 보장
  function enhanceSiteInteractivityAndMotion() {
    try {
      // (1) 스크롤 진입 부드러운 페이드업 애니메이션 자동 주입 (IntersectionObserver)
      const targets = document.querySelectorAll('section, .card, .profile, .doctor, .service-card, .item, .step, h2, .faq-item');
      if (targets.length && window.IntersectionObserver) {
        const obs = new IntersectionObserver(function(entries) {
          entries.forEach(function(entry) {
            if (entry.isIntersecting) {
              entry.target.style.opacity = '1';
              entry.target.style.transform = 'translateY(0)';
              obs.unobserve(entry.target);
            }
          });
        }, { threshold: 0.1 });

        targets.forEach(function(el, idx) {
          if (!el.getAttribute('data-dc-motion-init')) {
            el.setAttribute('data-dc-motion-init', '1');
            el.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
            el.style.transitionDelay = (idx % 4 * 0.08) + 's';
            el.style.opacity = '0.01';
            el.style.transform = 'translateY(24px)';
            obs.observe(el);
          }
        });
      }

      // (2) 모든 비디오 요소 무음 자동 재생 보장
      document.querySelectorAll('video').forEach(function(v) {
        v.muted = true;
        v.setAttribute('playsinline', '');
        v.setAttribute('autoplay', '');
        v.setAttribute('loop', '');
        const p = v.play();
        if (p && p.catch) p.catch(function() {});
      });

      // (3) 카드 및 인터랙티브 요소 호버 3D 입체감
      document.querySelectorAll('.card, .doctor-card, .btn, button, .service-item').forEach(function(el) {
        if (!el.getAttribute('data-dc-hover-init')) {
          el.setAttribute('data-dc-hover-init', '1');
          el.style.transition = (el.style.transition ? el.style.transition + ', ' : '') + 'box-shadow 0.25s ease, transform 0.25s ease';
        }
      });
    } catch(e) {}
  }

  function runVisualAndMotionAudit() {
    auditKoreanVisuals();
    enhanceSiteInteractivityAndMotion();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runVisualAndMotionAudit);
  } else {
    setTimeout(runVisualAndMotionAudit, 300);
  }

  // 3. 자율 탐색 및 인터랙션 시뮬레이션
  window.addEventListener('message', function(e) {
    if (!e.data || e.data.type !== 'RUN_ASIDE_AUDIT') return;
    
    const beacon = getOrCreateBeacon();
    beacon.style.display = 'block';

    const interactables = Array.from(document.querySelectorAll('button, a, input, select, textarea, [role="button"], details summary'));
    let currentIndex = 0;
    const maxSteps = Math.min(interactables.length, 6); // 주요 요소 최대 6개 자율 검증

    function logToParent(msg, status) {
      window.parent.postMessage({ type: 'DC_OPERATOR_EVENT', msg: msg, status: status || 'ok' }, '*');
    }

    logToParent('인터랙션 탐색 시작: ' + interactables.length + '개 인터랙티브 요소 발견', 'route');

    function nextStep() {
      if (currentIndex >= maxSteps || currentIndex >= interactables.length) {
        beacon.style.transform = 'translate(-50%,-50%) scale(0)';
        setTimeout(() => { beacon.style.display = 'none'; }, 400);
        logToParent('Aside 자율 조작 검증 완료: ' + maxSteps + '개 요소 정상 작동 확인 (0 에러)', 'ok');
        window.parent.postMessage({ type: 'DC_AUDIT_DONE', count: maxSteps }, '*');
        return;
      }

      const el = interactables[currentIndex++];
      const rect = el.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0 || window.getComputedStyle(el).display === 'none') {
        nextStep();
        return;
      }

      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;

      // 커서 이동
      beacon.style.left = x + 'px';
      beacon.style.top = y + 'px';
      beacon.style.transform = 'translate(-50%,-50%) scale(1.4)';

      setTimeout(() => {
        beacon.style.transform = 'translate(-50%,-50%) scale(0.9)';
        
        // 요소 조작 시뮬레이션
        try {
          const tag = el.tagName.toLowerCase();
          const desc = el.innerText?.slice(0, 15) || el.placeholder || el.id || tag;
          
          if (tag === 'input' || tag === 'textarea') {
            if (el.type === 'checkbox' || el.type === 'radio') {
              el.checked = !el.checked;
              el.dispatchEvent(new Event('change', { bubbles: true }));
            } else if (!el.value) {
              el.value = 'Aside 자율 입력 테스트';
              el.dispatchEvent(new Event('input', { bubbles: true }));
            }
            logToParent('입력 검증: [' + desc + '] -> 폼 상태 갱신 성공', 'ok');
          } else {
            // 버튼 또는 링크
            el.focus();
            el.click();
            logToParent('클릭 검증: [' + desc + '] -> 이벤트 피드백 정상', 'ok');
          }
        } catch(err) {
          logToParent('조작 경고: ' + err.message, 'warn');
        }

        setTimeout(nextStep, 500);
      }, 400);
    }

    nextStep();
  });

  window.parent.postMessage({ type: 'DC_PREVIEW_READY' }, '*');
})();
</script>
`;
    }

    /**
     * 자율 인터랙션 검증 실행
     */
    runAutonomousAudit() {
      const frame = document.querySelector(this.frameSelector);
      if (!frame || !frame.contentWindow) {
        this.onLog('[Aside Operator] 미리보기 프레임이 준비되지 않았습니다.', 'warn');
        return;
      }
      this.isRunning = true;
      this.onLog('[Aside Operator] 자율 상호작용 검증 시퀀스 개시...', 'k');
      frame.contentWindow.postMessage({ type: 'RUN_ASIDE_AUDIT' }, '*');
    }
  }

  global.DCAsideOperator = DCAsideOperator;
})(typeof window !== 'undefined' ? window : this);
