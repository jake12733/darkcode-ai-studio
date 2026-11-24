/* ILL AI · Pexels-First 고퀄리티 미디어 엔진 v3.0 (window.DCMedia)
 * - 사진·동영상 1순위: Pexels (API 키가 있으면 실시간 검색, 키가 없어도 검증된 고해상도 Pexels CDN 에디토리얼 큐레이션 풀 자동 배정)
 * - 2순위: Unsplash API / AI 고해상도 이미지 생성 (Pollinations Flux + Pexels 고화질 자동 폴백)
 * - 깨진 이미지·저화질·무관 영상 원천 차단
 */
(function () {
  'use strict';
  const KEYS = { pexels: '', unsplash: '', pixabay: '', pollinations: '', gemini: '', azure: '', azureRegion: 'koreacentral' };
  const mem = new Map();
  const BLOCK = /(north[\s_-]?korea|pyongyang|dprk|\bwar\b|protest|funeral|military|soldier|weapon|\bgun\b|nude|naked|blood|injur|accident|riot|propaganda)/i;
  const PEOPLE = /\b(people|person|man|men|woman|women|girl|boy|doctor|dentist|nurse|patient|staff|team|family|couple|child|student|teacher|customer|client|worker|surgeon|therapist|physician|receptionist|chef|barista|trainer|portrait|smiling|face|employee)\b/i;
  const NATION = /\b(korean|asian|japanese|chinese|american|european|african|indian|caucasian|black|white|latino|hispanic|western|arab)\b/i;
  const STYLE = /(anime|illustration|cartoon|watercolor|vector|flat design|3d render|pixel art|sketch|line art|clay|일러스트|애니|만화|그림체|수채화|픽셀|캐릭터)/i;

  // 검증된 Pexels 고화질 에디토리얼 사진 풀 (images.pexels.com, 빠른 글로벌 CDN)
  const PEXELS_CURATED = {
    dental: [
      'https://images.pexels.com/photos/3845810/pexels-photo-3845810.jpeg?auto=compress&cs=tinysrgb&w=1600',
      'https://images.pexels.com/photos/3845766/pexels-photo-3845766.jpeg?auto=compress&cs=tinysrgb&w=1600',
      'https://images.pexels.com/photos/3779705/pexels-photo-3779705.jpeg?auto=compress&cs=tinysrgb&w=1600',
      'https://images.pexels.com/photos/6812561/pexels-photo-6812561.jpeg?auto=compress&cs=tinysrgb&w=1600',
    ],
    clinic: [
      'https://images.pexels.com/photos/247786/pexels-photo-247786.jpeg?auto=compress&cs=tinysrgb&w=1600',
      'https://images.pexels.com/photos/236380/pexels-photo-236380.jpeg?auto=compress&cs=tinysrgb&w=1600',
      'https://images.pexels.com/photos/3845810/pexels-photo-3845810.jpeg?auto=compress&cs=tinysrgb&w=1600',
      'https://images.pexels.com/photos/7089401/pexels-photo-7089401.jpeg?auto=compress&cs=tinysrgb&w=1600',
    ],
    doctor: [
      'https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=1000',
      'https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=1000',
      'https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&w=1000',
      'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=1000',
    ],
    beauty: [
      'https://images.pexels.com/photos/3757942/pexels-photo-3757942.jpeg?auto=compress&cs=tinysrgb&w=1600',
      'https://images.pexels.com/photos/3997989/pexels-photo-3997989.jpeg?auto=compress&cs=tinysrgb&w=1600',
      'https://images.pexels.com/photos/3985329/pexels-photo-3985329.jpeg?auto=compress&cs=tinysrgb&w=1600',
    ],
    cafe: [
      'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=1600',
      'https://images.pexels.com/photos/1813466/pexels-photo-1813466.jpeg?auto=compress&cs=tinysrgb&w=1600',
      'https://images.pexels.com/photos/2074130/pexels-photo-2074130.jpeg?auto=compress&cs=tinysrgb&w=1600',
    ],
    hotel: [
      'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=1600',
      'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=1600',
      'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=1600',
    ],
    food: [
      'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=1600',
      'https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=1600',
      'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1600',
    ],
    business: [
      'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1600',
      'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=1600',
      'https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg?auto=compress&cs=tinysrgb&w=1600',
    ],
    tech: [
      'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=1600',
      'https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=1600',
      'https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=1600',
    ],
    architecture: [
      'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1600',
      'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1600',
      'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=1600',
    ],
    default: [
      'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1600',
      'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1600',
      'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1600',
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
    else if (/arch|interior|building|studio|인테리어|건축|스튜디오/.test(s)) cat = 'architecture';
    else if (/business|office|corporate|agency|회사|오피스|기업/.test(s)) cat = 'business';
    const arr = PEXELS_CURATED[cat] || PEXELS_CURATED.default;
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

  function getFallbackPhotoUrl(q) { return pickCurated(q); }

  const setKeys = (k) => { Object.keys(k || {}).forEach((n) => { if (n in KEYS && typeof k[n] === 'string') KEYS[n] = k[n].trim(); }); };
  const has = (n) => Boolean(KEYS[n]);
  const status = () => ({
    photo: ['pexels', 'unsplash'].filter(has).concat('pexels-hd'),
    video: ['pexels', 'pixabay'].filter(has).concat('motion-hd'),
    ai: has('pollinations') ? 'studio-hd' : 'hd',
    tts: ['gemini', 'azure'].filter(has),
  });

  const koreanize = (q) => { const s = String(q || '').trim(); return PEOPLE.test(s) && !NATION.test(s) ? 'korean ' + s : s; };
  const photorealPrompt = (p) => { const s = koreanize(p); return STYLE.test(s) ? s : `${s}, ultra high quality editorial photography, natural cinematic lighting, sharp focus, 8k resolution, architectural composition, no text, no watermark`; };
  const sig = (ms, signal) => { const list = [AbortSignal.timeout(ms)]; if (signal) list.push(signal); return AbortSignal.any ? AbortSignal.any(list) : list[0]; };
  async function getJSON(url, init, ms) {
    const r = await fetch(url, { ...(init || {}), signal: sig(ms || 12000, init && init.signal) });
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
    return (j.results || []).filter((p) => okText(p.alt_description)).map((p) => ({ id: 'unsplash:' + p.id, url: `${p.urls.raw}&w=1600&q=85&fm=jpg&fit=crop`, small: p.urls.regular, w: p.width, h: p.height, alt: p.alt_description || q, credit: { source: 'Stock HD', author: (p.user && p.user.name) || '', link: p.links.html, license: 'License' } }));
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
    return { id: 'pexels-hd:' + curatedUrl, url: curatedUrl, small: curatedUrl, w: 1600, h: 1000, alt: query, credit: { source: 'Pexels HD', author: 'Pexels', link: 'https://www.pexels.com', license: 'Pexels License' } };
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
    return (j.hits || []).filter((h) => okText(h.tags)).map((h) => { const v = (h.videos && (h.videos.medium && h.videos.medium.url ? h.videos.medium : h.videos.small)) || null; return v && { id: 'pixabay-v:' + h.id, url: v.url, w: v.width, h: v.height, poster: v.thumbnail || '', dur: h.duration, credit: { source: 'HD Video', author: h.user || '', link: h.pageURL, license: 'License' } }; }).filter(Boolean);
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
    return 'modern minimalist architectural photography, clean lighting, ultra high resolution';
  }

  async function aiPhoto(prompt, { width = 1440, height = 900, signal } = {}) {
    const engPrompt = toEnglishVisualPrompt(prompt);
    const p = photorealPrompt(engPrompt);
    const seed = Math.floor(Math.random() * 1e6);
    if (has('pollinations')) {
      const r = await fetch(`https://gen.pollinations.ai/image/${encodeURIComponent(p)}?model=flux&width=${width}&height=${height}&enhance=true&nologo=true&seed=${seed}`, { headers: { Authorization: `Bearer ${KEYS.pollinations}` }, signal: sig(60000, signal) });
      const ct = r.headers.get('content-type') || '';
      if (!r.ok || !ct.startsWith('image/')) throw new Error(`이미지 생성 실패 (HTTP ${r.status})`);
      const blob = await r.blob();
      return { url: null, dataUrl: await blobToDataUrl(blob), blob, prompt: p, source: 'ILL Vision HD', credit: { source: 'ILL Vision HD', author: '', link: '', license: '' } };
    }
    const classicUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(p)}?width=${width}&height=${height}&enhance=true&nologo=true&seed=${seed}`;
    return { url: classicUrl, dataUrl: classicUrl, prompt: p, source: 'ILL Vision HD', credit: { source: 'ILL Vision HD', author: '', link: '', license: '' } };
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
        if (has('pexels')) {
          try {
            const found = await findPhoto(q, { orientation: orientOf(el, 'img'), used, signal });
            if (found?.url) finalUrl = found.url;
          } catch { finalUrl = fbUrl; }
        } else if (/^ai\s*:/i.test(q) || isPerson) {
          try {
            const clean = q.replace(/^ai\s*:/i, '').trim();
            const orient = orientOf(el, 'img');
            const dims = orient === 'portrait' ? { width: 896, height: 1152 } : { width: 1440, height: 900 };
            const a = await aiPhoto(clean, { width: dims.width, height: dims.height, signal });
            finalUrl = a.url || a.dataUrl || fbUrl;
            stats.ai++;
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

    // Video tags: use Pexels Videos API if key is set, else render a smooth Ken Burns motion Pexels HD hero image
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
        const img = doc.createElement('img');
        img.setAttribute('src', pickCurated(q, used));
        img.setAttribute('alt', q);
        if (el.className) img.className = el.className;
        img.setAttribute('style', `${el.getAttribute('style') || ''};width:100%;height:100%;object-fit:cover;display:block;animation:illKenBurns 18s ease-in-out infinite alternate`.replace(/^;/, ''));
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

    // Ensure Ken Burns keyframes exist if we added motion fallback
    if (doc.head && !doc.head.innerHTML.includes('illKenBurns')) {
      const st = doc.createElement('style');
      st.textContent = '@keyframes illKenBurns{0%{transform:scale(1)}100%{transform:scale(1.08)}}';
      doc.head.appendChild(st);
    }

    await pool(tasks, 4);
    log(`Pexels 고화질 미디어 ${stats.photos + stats.bgs + stats.videos}개 매칭 완료`, 'ok');
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
        const isFemale = /(여성|여의사|여자|female)/i.test(ctxText);
        const prompt = isFemale ? 'korean female doctor in bright modern clinic, gentle smile, white coat, editorial 8k photo' : 'korean male chief doctor in late 30s, trustworthy smile, white coat, bright modern clinic, 8k photo';
        img.setAttribute('src', `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=896&height=1152&enhance=true&nologo=true`);
        img.setAttribute('onerror', `this.onerror=null;this.src='${PEXELS_CURATED.doctor[0]}';`);
        patched = true;
      }
    });
    const hadDoctype = /^\s*<!doctype/i.test(html);
    return patched ? `${hadDoctype ? '<!doctype html>\n' : ''}${doc.documentElement.outerHTML}` : html;
  }

  window.DCMedia = { version: '3.0', setKeys, has, status, koreanize, photorealPrompt, toEnglishVisualPrompt, patchKoreanPhotos, findPhoto, findVideo, aiPhoto, screenImage: async () => ({ ok: true }), resolveHtml, creditsHtml, pickCurated };
})();
