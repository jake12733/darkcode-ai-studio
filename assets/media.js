/* DARK CODE · 프리미엄 미디어 엔진 v2.0 (window.DCMedia)
 * - 위키미디어/오픈버스 무관 사진(인도 행사 등) 완전 제거
 * - Pexels / Unsplash 키가 있으면 우선 검색, 없으면 검증된 업종별 고화질 에디토리얼 Unsplash 큐레이션 풀 사용
 * - 인물 사진은 Pollinations AI 한국인 실사 + 고화질 폴백 보장
 */
(function () {
  'use strict';
  const KEYS = { pexels: '', unsplash: '', pixabay: '', pollinations: '', gemini: '', azure: '', azureRegion: 'koreacentral' };
  const mem = new Map();
  const BLOCK = /(north[\s_-]?korea|pyongyang|dprk|\bwar\b|protest|funeral|military|soldier|navy|naval|\barmy\b|weapon|\bgun\b|nude|naked|blood|injur|accident|riot|propaganda)/i;
  const PEOPLE = /\b(people|person|man|men|woman|women|girl|boy|doctor|dentist|nurse|patient|staff|team|family|couple|child|student|teacher|customer|client|worker|surgeon|therapist|physician|receptionist|chef|barista|trainer|portrait|smiling|face|employee)\b/i;
  const NATION = /\b(korean|asian|japanese|chinese|american|european|african|indian|caucasian|black|white|latino|hispanic|western|arab)\b/i;
  const STYLE = /(anime|illustration|cartoon|watercolor|vector|flat design|3d render|pixel art|sketch|line art|clay|일러스트|애니|만화|그림체|수채화|픽셀|캐릭터)/i;

  // 검증된 업종별 고화질 에디토리얼 사진 컬렉션 (중복 없이 순환 배정)
  const CURATED_GALLERY = {
    dental: [
      'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1400&q=85',
      'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=1400&q=85',
      'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=1400&q=85',
      'https://images.unsplash.com/photo-1629909615184-74f495363b67?auto=format&fit=crop&w=1400&q=85',
    ],
    clinic: [
      'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1400&q=85',
      'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1400&q=85',
      'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1400&q=85',
      'https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=1400&q=85',
    ],
    doctor: [
      'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=900&q=85',
      'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=900&q=85',
      'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=900&q=85',
      'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=900&q=85',
    ],
    beauty: [
      'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1400&q=85',
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1400&q=85',
      'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=1400&q=85',
    ],
    cafe: [
      'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1400&q=85',
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1400&q=85',
      'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1400&q=85',
    ],
    hotel: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1400&q=85',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1400&q=85',
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1400&q=85',
    ],
    food: [
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1400&q=85',
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1400&q=85',
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1400&q=85',
    ],
    business: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1400&q=85',
      'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1400&q=85',
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1400&q=85',
    ],
    tech: [
      'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1400&q=85',
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1400&q=85',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1400&q=85',
    ],
    default: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1400&q=85',
      'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1400&q=85',
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1400&q=85',
    ],
  };

  let pickCursor = 0;
  function pickCurated(q, used) {
    const s = String(q || '').toLowerCase();
    let cat = 'default';
    if (/doctor|dentist|surgeon|physician|nurse|원장|의사|의료진|스태프/.test(s)) cat = 'doctor';
    else if (/dental|implant|orthodont|치과|임플란트|교정/.test(s)) cat = 'dental';
    else if (/hospital|clinic|medical|surgery|lobby|병원|클리닉|진료|수술|내과|정형/.test(s)) cat = 'clinic';
    else if (/beauty|skin|spa|aesthetic|피부|뷰티|에스테틱/.test(s)) cat = 'beauty';
    else if (/cafe|coffee|bakery|카페|커피|베이커리/.test(s)) cat = 'cafe';
    else if (/hotel|resort|stay|room|호텔|리조트|숙소/.test(s)) cat = 'hotel';
    else if (/food|restaurant|chef|dining|식당|레스토랑|요리/.test(s)) cat = 'food';
    else if (/tech|saas|app|dashboard|code|ai|소프트웨어|앱/.test(s)) cat = 'tech';
    else if (/business|office|corporate|agency|회사|오피스|기업/.test(s)) cat = 'business';
    const arr = CURATED_GALLERY[cat] || CURATED_GALLERY.default;
    for (let i = 0; i < arr.length; i++) {
      const url = arr[(pickCursor + i) % arr.length];
      if (!used || !used.has(url)) {
        pickCursor++;
        if (used) used.add(url);
        return url;
      }
    }
    return arr[pickCursor++ % arr.length];
  }

  const FALLBACK_PHOTOS = {
    doctor: CURATED_GALLERY.doctor[0],
    clinic: CURATED_GALLERY.clinic[0],
    dental: CURATED_GALLERY.dental[0],
    business: CURATED_GALLERY.business[0],
    cafe: CURATED_GALLERY.cafe[0],
    beauty: CURATED_GALLERY.beauty[0],
    tech: CURATED_GALLERY.tech[0],
    default: CURATED_GALLERY.default[0],
  };

  function getFallbackPhotoUrl(q) {
    return pickCurated(q);
  }

  const setKeys = (k) => { Object.keys(k || {}).forEach((n) => { if (n in KEYS && typeof k[n] === 'string') KEYS[n] = k[n].trim(); }); };
  const has = (n) => Boolean(KEYS[n]);
  const status = () => ({
    photo: ['pexels', 'unsplash'].filter(has).concat('curated'),
    video: ['pexels', 'pixabay'].filter(has),
    ai: has('pollinations') ? 'pollinations' : 'classic',
    tts: ['gemini', 'azure'].filter(has),
  });

  const koreanize = (q) => { const s = String(q || '').trim(); return PEOPLE.test(s) && !NATION.test(s) ? 'korean ' + s : s; };
  const photorealPrompt = (p) => { const s = koreanize(p); return STYLE.test(s) ? s : `${s}, photorealistic editorial photography, natural soft lighting, architectural clarity, high detail, no text, no watermark`; };
  const sig = (ms, signal) => { const list = [AbortSignal.timeout(ms)]; if (signal) list.push(signal); return AbortSignal.any ? AbortSignal.any(list) : list[0]; };
  async function getJSON(url, init, ms) {
    const r = await fetch(url, { ...(init || {}), signal: sig(ms || 15000, init && init.signal) });
    if (!r.ok) { const e = new Error(`HTTP ${r.status}`); e.status = r.status; throw e; }
    return r.json();
  }
  async function memo(key, fn) { if (mem.has(key)) return mem.get(key); const v = await fn(); mem.set(key, v); return v; }
  const blobToDataUrl = (b) => new Promise((res, rej) => { const fr = new FileReader(); fr.onload = () => res(fr.result); fr.onerror = rej; fr.readAsDataURL(b); });
  const okText = (s) => !BLOCK.test(String(s || ''));

  const ORI = {
    landscape: { pexels: 'landscape', unsplash: 'landscape' },
    portrait: { pexels: 'portrait', unsplash: 'portrait' },
    square: { pexels: 'square', unsplash: 'squarish' },
  };
  async function pexelsPhotos(q, o, signal) {
    const j = await getJSON(`https://api.pexels.com/v1/search?query=${encodeURIComponent(q)}&per_page=15&orientation=${ORI[o].pexels}`, { headers: { Authorization: KEYS.pexels }, signal });
    return (j.photos || []).filter((p) => okText(p.alt)).map((p) => ({ id: 'pexels:' + p.id, url: p.src.large2x || p.src.large, small: p.src.large, w: p.width, h: p.height, alt: p.alt || q, credit: { source: 'Pexels', author: p.photographer || '', link: p.url, license: 'Pexels License' } }));
  }
  async function unsplashPhotos(q, o, signal) {
    const j = await getJSON(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(q)}&per_page=15&orientation=${ORI[o].unsplash}&content_filter=high`, { headers: { Authorization: `Client-ID ${KEYS.unsplash}` }, signal });
    return (j.results || []).filter((p) => okText(p.alt_description)).map((p) => ({ id: 'unsplash:' + p.id, url: `${p.urls.raw}&w=1600&q=85&fm=jpg&fit=crop`, small: p.urls.regular, w: p.width, h: p.height, alt: p.alt_description || q, credit: { source: 'Unsplash', author: (p.user && p.user.name) || '', link: p.links.html, license: 'Unsplash License' } }));
  }
  function variants(q) {
    const base = String(q || '').replace(/^(photo|ai|video)\s*:\s*/i, '').trim();
    const words = base.split(/[\s,]+/).filter(Boolean);
    const w3 = words.slice(0, 3).join(' ');
    return [...new Set([koreanize(base), base, w3].filter(Boolean))];
  }

  async function findPhoto(query, { orientation = 'landscape', used = new Set(), signal } = {}) {
    const o = ORI[orientation] ? orientation : 'landscape';
    const sources = [['pexels', pexelsPhotos], ['unsplash', unsplashPhotos]].filter(([n]) => has(n));
    for (const [name, fn] of sources) {
      for (const q of variants(query).slice(0, 2)) {
        let list = [];
        try { list = await memo(`${name}|${o}|${q}`, () => fn(q, o, signal)); } catch (e) { if (e.status === 401 || e.status === 403) break; continue; }
        for (const pick of list.filter((x) => !used.has(x.id)).slice(0, 1)) {
          used.add(pick.id);
          return pick;
        }
      }
    }
    const curatedUrl = pickCurated(query, used);
    return { id: 'curated:' + curatedUrl, url: curatedUrl, small: curatedUrl, w: 1400, h: 900, alt: query, credit: { source: 'Unsplash Editorial', author: 'Curated', link: curatedUrl, license: 'Unsplash License' } };
  }

  function pickPexelsFile(files) {
    const mp4 = (files || []).filter((f) => /mp4/i.test(f.file_type || '') && f.link);
    return mp4.filter((f) => f.width >= 1280 && f.width <= 1920).sort((a, b) => b.width - a.width)[0] || mp4[0] || null;
  }
  async function pexelsVideos(q, o, signal) {
    const j = await getJSON(`https://api.pexels.com/v1/videos/search?query=${encodeURIComponent(q)}&per_page=10&orientation=${ORI[o].pexels}`, { headers: { Authorization: KEYS.pexels }, signal });
    return (j.videos || []).map((v) => { const f = pickPexelsFile(v.video_files); return f && { id: 'pexels-v:' + v.id, url: f.link, w: f.width, h: f.height, poster: v.image, dur: v.duration, credit: { source: 'Pexels', author: (v.user && v.user.name) || '', link: v.url, license: 'Pexels License' } }; }).filter(Boolean);
  }
  async function pixabayVideos(q, o, signal) {
    const j = await getJSON(`https://pixabay.com/api/videos/?key=${encodeURIComponent(KEYS.pixabay)}&q=${encodeURIComponent(q)}&per_page=10&safesearch=true`, { signal });
    return (j.hits || []).filter((h) => okText(h.tags)).map((h) => { const v = (h.videos && (h.videos.medium && h.videos.medium.url ? h.videos.medium : h.videos.small)) || null; return v && { id: 'pixabay-v:' + h.id, url: v.url, w: v.width, h: v.height, poster: v.thumbnail || '', dur: h.duration, credit: { source: 'Pixabay', author: h.user || '', link: h.pageURL, license: 'Pixabay' } }; }).filter(Boolean);
  }
  async function findVideo(query, { orientation = 'landscape', used = new Set(), signal } = {}) {
    const o = ORI[orientation] ? orientation : 'landscape';
    const sources = [['pexels', pexelsVideos], ['pixabay', pixabayVideos]].filter(([n]) => has(n));
    for (const [name, fn] of sources) {
      for (const q of variants(query)) {
        let list = [];
        try { list = await memo(`v:${name}|${o}|${q}`, () => fn(q, o, signal)); } catch (e) { if (e.status === 401 || e.status === 403) break; continue; }
        const pick = list.find((x) => !used.has(x.id));
        if (pick) { used.add(pick.id); return pick; }
      }
    }
    return null;
  }

  const KO_EN_MAP = [
    [/(여의사|여의료진|여성\s*의사)/i, 'korean female doctor physician in bright modern clinic white coat gentle smile'],
    [/(대표원장|원장|치과\s*원장)/i, 'korean male chief doctor in late 30s white medical coat trustworthy warm smile modern clinic'],
    [/(수술|임플란트|진료|치료)/i, 'modern clean medical dental consultation room architectural bright interior'],
    [/(치과|치과의사)/i, 'korean dentist in minimalist bright modern dental clinic'],
    [/(의사|의료진)/i, 'korean medical doctor portrait in white coat clean light studio'],
    [/(병원|클리닉|로비|인테리어)/i, 'luxury bright minimalist modern hospital clinic reception lobby architecture'],
    [/(카페|커피|바리스타)/i, 'minimalist modern specialty coffee cafe interior natural sunlight'],
    [/(피부과|에스테틱|뷰티)/i, 'luxury modern skincare dermatology clinic bright serene interior'],
    [/(호텔|리조트|객실)/i, 'luxury architectural boutique hotel suite warm lighting interior'],
    [/(식당|레스토랑|다이닝)/i, 'fine dining modern minimalist restaurant warm interior'],
  ];
  function toEnglishVisualPrompt(q) {
    const s = String(q || '').replace(/^ai\s*:\s*/i, '').trim();
    if (!/[가-힣]/.test(s)) return s;
    const matched = [];
    for (const [re, eng] of KO_EN_MAP) if (re.test(s)) matched.push(eng);
    if (matched.length) return matched.join(', ') + ', photorealistic editorial photography, natural light, 8k';
    return 'modern minimalist architectural photography, clean lighting, high quality';
  }

  async function aiPhoto(prompt, { width = 1280, height = 768, signal } = {}) {
    const engPrompt = toEnglishVisualPrompt(prompt);
    const p = photorealPrompt(engPrompt);
    const seed = Math.floor(Math.random() * 1e6);
    if (has('pollinations')) {
      const r = await fetch(`https://gen.pollinations.ai/image/${encodeURIComponent(p)}?model=flux&width=${width}&height=${height}&nologo=true&seed=${seed}`, { headers: { Authorization: `Bearer ${KEYS.pollinations}` }, signal: sig(60000, signal) });
      const ct = r.headers.get('content-type') || '';
      if (!r.ok || !ct.startsWith('image/')) throw new Error(`AI 이미지 실패 (HTTP ${r.status})`);
      const blob = await r.blob();
      return { url: null, dataUrl: await blobToDataUrl(blob), blob, prompt: p, source: 'Pollinations', credit: { source: 'AI (Pollinations)', author: '', link: '', license: '' } };
    }
    const classicUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(p)}?width=${width}&height=${height}&nologo=true&seed=${seed}`;
    return { url: classicUrl, dataUrl: classicUrl, prompt: p, source: 'Pollinations Classic', credit: { source: 'AI (Pollinations)', author: '', link: '', license: '' } };
  }

  function orientOf(el, kind) {
    const o = (el.getAttribute('data-dc-orient') || '').toLowerCase();
    if (ORI[o]) return o;
    if (kind !== 'img') return 'landscape';
    const hint = `${el.className || ''} ${el.getAttribute('alt') || ''} ${el.getAttribute('data-dc-img') || ''}`;
    if (/avatar|profile|portrait|doctor|team|staff|인물|원장|의료진/i.test(hint)) return 'portrait';
    return 'landscape';
  }
  async function pool(tasks, n) {
    const out = []; let i = 0;
    const worker = async () => { while (i < tasks.length) { const k = i++; out[k] = await tasks[k](); } };
    await Promise.all(Array.from({ length: Math.min(n, tasks.length) }, worker));
    return out;
  }
  function creditsHtml() { return ''; }

  async function resolveHtml(html, { log = () => {}, signal } = {}) {
    const stats = { photos: 0, bgs: 0, videos: 0, ai: 0, failed: 0, sources: [] };
    if (!html || typeof html !== 'string') return { html, stats };
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const used = new Set(); const usedV = new Set();
    const tasks = [];

    doc.querySelectorAll('img[data-dc-img]').forEach((el, idx) => {
      if (/^(https?:|data:|blob:)/.test(el.getAttribute('src') || '')) return;
      tasks.push(async () => {
        const q = el.getAttribute('data-dc-img');
        const fbUrl = pickCurated(q, used);
        const isPerson = PEOPLE.test(q) || /(korean|asian|한국|의사|원장|의료진|모델|대표)/i.test(q);
        let finalUrl = fbUrl;
        if (/^ai\s*:/i.test(q) || isPerson) {
          try {
            const clean = q.replace(/^ai\s*:/i, '').trim();
            const orient = orientOf(el, 'img');
            const dims = orient === 'portrait' ? { width: 768, height: 960 } : { width: 1280, height: 768 };
            const a = await aiPhoto(clean, { width: dims.width, height: dims.height, signal });
            finalUrl = a.url || a.dataUrl || fbUrl;
            stats.ai++;
          } catch { finalUrl = fbUrl; }
        } else if (has('pexels') || has('unsplash')) {
          try {
            const found = await findPhoto(q, { orientation: orientOf(el, 'img'), used, signal });
            if (found?.url) finalUrl = found.url;
          } catch { finalUrl = fbUrl; }
        }
        el.setAttribute('src', finalUrl);
        el.setAttribute('onerror', `this.onerror=null;this.src='${fbUrl}';`);
        if (!el.getAttribute('alt')) el.setAttribute('alt', q);
        el.setAttribute('loading', idx < 2 ? 'eager' : 'lazy');
        if (!/object-fit/.test(el.getAttribute('style') || '')) el.setAttribute('style', `${el.getAttribute('style') || ''};object-fit:cover`.replace(/^;/, ''));
        stats.photos++;
      });
    });

    // Replace any broken/wikimedia videos with crisp editorial hero imagery (NEVER Indian conference webms)
    doc.querySelectorAll('video[data-dc-video], video[src*="wikimedia.org"]').forEach((el) => {
      tasks.push(async () => {
        const q = el.getAttribute('data-dc-video') || 'modern architecture interior';
        let v = null;
        if (has('pexels') || has('pixabay')) {
          try { v = await findVideo(q, { orientation: 'landscape', used: usedV, signal }); } catch {}
        }
        if (v?.url) {
          ['muted', 'playsinline', 'loop', 'autoplay'].forEach((a) => el.setAttribute(a, ''));
          el.setAttribute('src', v.url);
          if (v.poster) el.setAttribute('poster', v.poster);
          stats.videos++;
          return;
        }
        // Convert cleanly into a crisp editorial hero <img> with subtle cover styling
        const img = doc.createElement('img');
        img.setAttribute('src', pickCurated(q, used));
        img.setAttribute('alt', q);
        if (el.className) img.className = el.className;
        img.setAttribute('style', `${el.getAttribute('style') || ''};width:100%;height:100%;object-fit:cover;display:block`.replace(/^;/, ''));
        el.replaceWith(img);
        stats.photos++;
      });
    });

    doc.querySelectorAll('[data-dc-bg]').forEach((el) => {
      if (/background-image\s*:\s*url\(\s*['"]?(https?:|data:)/.test(el.getAttribute('style') || '')) return;
      const q = el.getAttribute('data-dc-bg');
      const url = pickCurated(q, used);
      const st = (el.getAttribute('style') || '').replace(/;\s*$/, '');
      el.setAttribute('style', `${st}${st ? ';' : ''}background-image:url("${url}");background-size:cover;background-position:center`);
      stats.bgs++;
    });

    doc.querySelectorAll('img').forEach((img) => {
      const src = (img.getAttribute('src') || '').trim();
      const alt = img.getAttribute('alt') || '';
      // Replace dead Wikimedia URLs or broken relative placeholder paths (e.g., card1.jpg, doctor.png)
      if (!src || !/^(https?:|data:image\/|blob:)/i.test(src) || /upload\.wikimedia\.org|1594824813627/i.test(src)) {
        img.setAttribute('src', pickCurated(alt || src || html.slice(0, 300), used));
      }
      if (!img.getAttribute('onerror')) {
        const fbUrl = pickCurated(alt || src);
        img.setAttribute('onerror', `this.onerror=null;this.src='${fbUrl}';`);
      }
      if (!/object-fit/.test(img.getAttribute('style') || '')) {
        img.setAttribute('style', `${img.getAttribute('style') || ''};object-fit:cover`.replace(/^;/, ''));
      }
    });

    await pool(tasks, 4);
    log(`에디토리얼 미디어 ${stats.photos + stats.bgs + stats.videos}개 매칭 완료`, 'ok');
    const hadDoctype = /^\s*<!doctype/i.test(html);
    return { html: `${hadDoctype ? '<!doctype html>\n' : ''}${doc.documentElement.outerHTML}`, stats, credits: [] };
  }

  function patchKoreanPhotos(html) {
    if (!html || typeof html !== 'string') return html;
    const doc = new DOMParser().parseFromString(html, 'text/html');
    let patched = false;
    doc.querySelectorAll('img').forEach((img) => {
      const src = img.getAttribute('src') || '';
      const alt = img.getAttribute('alt') || '';
      const parent = img.closest('.card, .profile, .doctor, .team, section, div, li');
      const ctxText = (alt + ' ' + (parent ? parent.textContent : '')).slice(0, 400);
      const isPerson = /(대표원장|원장|의사|치과의사|의료진|스태프|doctor|dentist|surgeon)/i.test(ctxText);
      if (isPerson && !/korean/i.test(src)) {
        const isFemale = /(여의사|여성|여자|female)/i.test(ctxText);
        const prompt = isFemale ? 'korean female doctor in bright modern clinic, gentle smile, white coat, editorial 8k photo' : 'korean male chief doctor in late 30s, trustworthy smile, white coat, bright modern clinic, 8k photo';
        img.setAttribute('src', `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=768&height=960&nologo=true`);
        img.setAttribute('onerror', `this.onerror=null;this.src='${FALLBACK_PHOTOS.doctor}';`);
        patched = true;
      }
    });
    const hadDoctype = /^\s*<!doctype/i.test(html);
    return patched ? `${hadDoctype ? '<!doctype html>\n' : ''}${doc.documentElement.outerHTML}` : html;
  }

  window.DCMedia = { version: '2.0', setKeys, has, status, koreanize, photorealPrompt, toEnglishVisualPrompt, patchKoreanPhotos, findPhoto, findVideo, aiPhoto, screenImage: async () => ({ ok: true }), resolveHtml, creditsHtml };
})();
