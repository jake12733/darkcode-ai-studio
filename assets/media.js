/* DARK CODE · 미디어 엔진 (window.DCMedia)
 * 실사 사진·영상 자동 삽입, AI 실사 이미지, 나레이션(TTS) 연결부
 *  사진: Pexels → Unsplash (무료 키) → Wikimedia Commons → Openverse (키 없음 · CC 라이선스 · 출처 자동 표기)
 *  영상: Pexels → Pixabay (무료 키)
 *  AI 실사 이미지: Pollinations (pollen 키) → 키가 없으면 Classic API 재시도
 *  나레이션: Gemini TTS (무료 등급 키) → Azure Speech (F0 키)
 * 키는 DARK CODE 암호화 금고에서 setKeys() 로만 받고, 결과 HTML 에는 절대 넣지 않는다.
 * 사람이 나오는 검색어는 국적 지정이 없으면 korean 을 붙인다 (일러스트·애니 요청이 아니면 실사 기준).
 */
(function () {
  'use strict';
  const KEYS = { pexels: '', unsplash: '', pixabay: '', pollinations: '', gemini: '', azure: '', azureRegion: 'koreacentral' };
  const mem = new Map();
  const BLOCK = /(north[\s_-]?korea|pyongyang|dprk|\bwar\b|protest|funeral|military|soldier|navy|naval|\barmy\b|marines?\b|air force|troops|veteran|weapon|\bgun\b|nude|naked|blood|injur|accident|riot|demonstrat|propaganda)/i;
  const PEOPLE = /\b(people|person|man|men|woman|women|girl|boy|doctor|dentist|nurse|patient|staff|team|family|couple|child|children|kid|student|teacher|customer|client|worker|surgeon|therapist|physician|receptionist|chef|barista|trainer|portrait|smiling|face|businessman|businesswoman|employee|senior|elderly|mother|father|baby)\b/i;
  const NATION = /\b(korean|asian|japanese|chinese|american|european|african|indian|caucasian|black|white|latino|hispanic|western|arab)\b/i;
  const STYLE = /(anime|illustration|cartoon|watercolor|vector|flat design|3d render|pixel art|sketch|line art|clay|일러스트|애니|만화|그림체|수채화|픽셀|캐릭터)/i;
  const ARCHIVE = /(\bNARA\b|\bDPLA\b|\bHABS\b|FindID|Portable Antiquities|Library of Congress|\bLOC\b|archive|collection|exhibit|historic|history|vintage|\bold\b|retiring|state hospital)/i;
  const ART = /(painting|google art project|museum|drawing|engraving|illustration|lithograph|etching|\bmap\b|logo|diagram|poster|stamp|coin|banknote|manuscript|sketch|watercolou?r|fresco|statue|sculpture|\b1[5-9]\d\d\b)/i;

  const setKeys = (k) => { Object.keys(k || {}).forEach((n) => { if (n in KEYS && typeof k[n] === 'string') KEYS[n] = k[n].trim(); }); };
  const has = (n) => Boolean(KEYS[n]);
  const status = () => ({
    photo: ['pexels', 'unsplash'].filter(has).concat('wikimedia', 'openverse'),
    video: ['pexels', 'pixabay'].filter(has),
    ai: has('pollinations') ? 'pollinations' : 'classic',
    tts: ['gemini', 'azure'].filter(has),
  });

  const koreanize = (q) => { const s = String(q || '').trim(); return PEOPLE.test(s) && !NATION.test(s) ? 'korean ' + s : s; };
  const photorealPrompt = (p) => { const s = koreanize(p); return STYLE.test(s) ? s : `${s}, photorealistic, natural lighting, 35mm photo, high detail, realistic skin texture, no text, no watermark`; };
  const sig = (ms, signal) => { const list = [AbortSignal.timeout(ms)]; if (signal) list.push(signal); return AbortSignal.any ? AbortSignal.any(list) : list[0]; };
  async function getJSON(url, init, ms) {
    const r = await fetch(url, { ...(init || {}), signal: sig(ms || 15000, init && init.signal) });
    if (!r.ok) { const e = new Error(`HTTP ${r.status}`); e.status = r.status; throw e; }
    return r.json();
  }
  async function memo(key, fn) { if (mem.has(key)) return mem.get(key); const v = await fn(); mem.set(key, v); return v; }
  const blobToDataUrl = (b) => new Promise((res, rej) => { const fr = new FileReader(); fr.onload = () => res(fr.result); fr.onerror = rej; fr.readAsDataURL(b); });
  const okText = (s) => !BLOCK.test(String(s || ''));

  // ---------- 사진 ----------
  const ORI = {
    landscape: { pexels: 'landscape', unsplash: 'landscape', ov: 'wide' },
    portrait: { pexels: 'portrait', unsplash: 'portrait', ov: 'tall' },
    square: { pexels: 'square', unsplash: 'squarish', ov: 'square' },
  };
  async function pexelsPhotos(q, o, signal) {
    const j = await getJSON(`https://api.pexels.com/v1/search?query=${encodeURIComponent(q)}&per_page=20&orientation=${ORI[o].pexels}`, { headers: { Authorization: KEYS.pexels }, signal });
    return (j.photos || []).filter((p) => okText(p.alt)).map((p) => ({ id: 'pexels:' + p.id, url: p.src.large2x || p.src.large, small: p.src.large, w: p.width, h: p.height, alt: p.alt || q, credit: { source: 'Pexels', author: p.photographer || '', link: p.url, license: 'Pexels License' } }));
  }
  async function unsplashPhotos(q, o, signal) {
    const j = await getJSON(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(q)}&per_page=20&orientation=${ORI[o].unsplash}&content_filter=high`, { headers: { Authorization: `Client-ID ${KEYS.unsplash}` }, signal });
    return (j.results || []).filter((p) => okText(p.alt_description)).map((p) => ({ id: 'unsplash:' + p.id, url: `${p.urls.raw}&w=1800&q=80&fm=jpg&fit=crop`, small: p.urls.regular, w: p.width, h: p.height, alt: p.alt_description || q, credit: { source: 'Unsplash', author: (p.user && p.user.name) || '', link: `${p.links.html}?utm_source=darkcode_ai&utm_medium=referral`, license: 'Unsplash License' } }));
  }
  // 방향이 맞는 사진을 앞으로 (없으면 나머지도 사용)
  const fits = (x, o) => { const r = (x.w || 1) / (x.h || 1); return o === 'portrait' ? r < 0.87 : o === 'square' ? r >= 0.87 && r <= 1.15 : r > 1.15; };
  const byOrientation = (list, o) => list.filter((x) => fits(x, o)).concat(list.filter((x) => !fits(x, o)));
  const strip = (h) => String(h || '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
  async function wikimediaPhotos(q, o, signal) {
    const url = `https://commons.wikimedia.org/w/api.php?action=query&format=json&origin=*&generator=search&gsrsearch=${encodeURIComponent(q + ' filetype:bitmap')}&gsrnamespace=6&gsrlimit=30&prop=imageinfo&iiprop=url|size|mime|extmetadata&iiurlwidth=1600&iiextmetadatafilter=LicenseShortName|Artist|DateTimeOriginal`;
    const j = await getJSON(url, { signal }, 15000);
    const pages = Object.values((j.query && j.query.pages) || {}).sort((a, b) => (a.index || 0) - (b.index || 0));
    const list = pages.map((p) => {
      const ii = p.imageinfo && p.imageinfo[0];
      if (!ii) return null;
      const em = ii.extmetadata || {};
      const lic = strip(em.LicenseShortName && em.LicenseShortName.value);
      const title = String(p.title || '').replace(/^File:/, '').replace(/\.[a-z0-9]+$/i, '');
      const upper = (title.match(/[A-Z]/g) || []).length / Math.max(1, (title.match(/[A-Za-z]/g) || []).length);
      const year = Number((strip(em.DateTimeOriginal && em.DateTimeOriginal.value).match(/(19|20)\d\d/) || [])[0] || 0);
      if ((ii.width || 0) < 800 || /tiff/i.test(ii.mime || '') || !/(cc|public domain|pd)/i.test(lic) || /\b(nc|nd)\b/i.test(lic) || !okText(title) || ART.test(title) || ARCHIVE.test(title) || upper > 0.6 || (year && year < 2005)) return null;
      return { id: 'wm:' + p.pageid, url: ii.thumburl || ii.url, small: ii.thumburl || ii.url, w: ii.width, h: ii.height, alt: title, credit: { source: 'Wikimedia Commons', author: strip(em.Artist && em.Artist.value).slice(0, 60), link: ii.descriptionurl || ii.url, license: lic, title } };
    }).filter(Boolean);
    return byOrientation(list, o);
  }
  // Openverse 는 느리고 동시 요청을 막는 편이라 한 번에 하나씩 보낸다
  let ovChain = Promise.resolve();
  const ovQueue = (fn) => { const p = ovChain.then(fn, fn); ovChain = p.catch(() => {}); return p; };
  async function openversePhotos(q, o, signal) {
    return ovQueue(async () => {
      const j = await getJSON(`https://api.openverse.org/v1/images/?q=${encodeURIComponent(q)}&license_type=commercial&mature=false&page_size=20`, { signal }, 20000);
      const list = (j.results || [])
        .filter((r) => r.url && okText(r.title) && okText((r.tags || []).map((t) => t.name).join(' ')) && (r.width || 0) >= 640 && !ART.test(r.title || ''))
        .map((r) => ({ id: 'ov:' + r.id, url: r.url, small: r.thumbnail || r.url, w: r.width, h: r.height, alt: r.title || q, credit: { source: 'Openverse', author: r.creator || '', link: r.foreign_landing_url || r.url, license: `CC ${String(r.license || '').toUpperCase()} ${r.license_version || ''}`.trim(), title: r.title || '' } }));
      return byOrientation(list, o);
    });
  }
  // 키 있는 스톡(검색이 정확): 긴 검색어부터 · 키 없는 공개 아카이브: 짧은 핵심어만
  function variants(q, open) {
    const base = String(q || '').replace(/^(photo|ai|video)\s*:\s*/i, '').trim();
    const words = base.split(/[\s,]+/).filter(Boolean);
    const w3 = words.slice(0, 3).join(' '), w2 = words.slice(0, 2).join(' ');
    const isPerson = PEOPLE.test(base);
    if (isPerson) {
      // 사람/인물 검색어는 절대로 korean 을 떼고 외국인 검색어로 퇴보하지 않는다 (외국인 스톡 반환 원천 차단)
      return [koreanize(base), 'korean ' + w3, 'korean asian ' + w2].filter(Boolean);
    }
    const list = open ? [koreanize(w3), w3, w2] : [koreanize(base), base, w3];
    return [...new Set(list.filter(Boolean))];
  }
  // ---------- 사진 검수 (Gemini 비전) : 공개 아카이브 사진에 다른 업체 간판·전화번호·무관한 장면이 섞이지 않게 (응답이 없으면 제외) ----------
  async function screenImage(src, query, { signal } = {}) {
    if (!KEYS.gemini) return { ok: true, reason: '키 없음 (검수 생략)' };
    let bmp = src;
    try {
      if (typeof src === 'string') { const r = await fetch(src, { mode: 'cors', signal: sig(30000, signal) }); if (!r.ok) return { ok: false, reason: `불러오기 실패 ${r.status}` }; bmp = await createImageBitmap(await r.blob()); }
    } catch (e) { return { ok: false, reason: '불러오기 실패' }; }
    const c = document.createElement('canvas'); const k = 512 / Math.max(bmp.width, bmp.height);
    c.width = Math.max(1, Math.round(bmp.width * k)); c.height = Math.max(1, Math.round(bmp.height * k));
    c.getContext('2d').drawImage(bmp, 0, 0, c.width, c.height);
    const data = c.toDataURL('image/jpeg', 0.8).split(',')[1];
    const ask = `이 사진을 "${query}" 장면의 광고·홈페이지 사진으로 써도 되는지 판단해. 안 되는 경우: 다른 업체 이름·로고·간판·전화번호·사람 이름 같은 글자가 눈에 띄게 보임 / 주제와 무관 / 흑백·옛날 사진·저화질 / 군대·사고·시위 같은 부적절한 장면. JSON 으로만: {"ok":true 또는 false,"reason":"짧게"}`;
    for (const m of ['gemini-3.5-flash-lite', 'gemini-4-hydrogen', 'gemini-3.8-flash']) {
      for (let a = 0; a < 2; a++) {
        const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-goog-api-key': KEYS.gemini }, body: JSON.stringify({ contents: [{ role: 'user', parts: [{ inline_data: { mime_type: 'image/jpeg', data } }, { text: ask }] }], generationConfig: { responseMimeType: 'application/json', temperature: 0, maxOutputTokens: 160 } }), signal: sig(30000, signal) }).catch(() => null);
        if (!r) continue;
        if (r.status === 429 || r.status === 503) { await new Promise((res) => setTimeout(res, 1500 * (a + 1))); continue; }
        if (!r.ok) break;
        const j = await r.json().catch(() => ({}));
        const txt = ((j.candidates && j.candidates[0] && j.candidates[0].content && j.candidates[0].content.parts) || []).map((p) => p.text || '').join('');
        try { const o = JSON.parse(txt.replace(/^\s*```(?:json)?\s*|\s*```\s*$/g, '')); return { ok: Boolean(o.ok), reason: String(o.reason || '').slice(0, 80) }; } catch { break; }
      }
    }
    return { ok: false, reason: '검수 응답 없음 (안전하게 제외)' };
  }
  async function findPhoto(query, { orientation = 'landscape', used = new Set(), signal, screen = false, onReject } = {}) {
    const isPerson = PEOPLE.test(query);
    if (isPerson && !has('pexels') && !has('unsplash')) {
      // 무료 공개 아카이브(위키미디어/오픈버스)에는 한국인 인물 사진이 없으므로 외국인 사진 노출을 원천 방지하기 위해 즉시 null 반환 -> 100% 한국인 AI 실사 생성으로 연결
      return null;
    }
    const o = ORI[orientation] ? orientation : 'landscape';
    const sources = [['pexels', pexelsPhotos], ['unsplash', unsplashPhotos], ['wikimedia', wikimediaPhotos], ['openverse', openversePhotos]].filter(([n]) => n === 'wikimedia' || n === 'openverse' || has(n));
    for (const [name, fn] of sources) {
      for (const q of variants(query, name === 'wikimedia' || name === 'openverse').slice(0, name === 'openverse' ? 1 : 3)) {
        let list = [];
        try { list = await memo(`${name}|${o}|${q}`, () => fn(q, o, signal)); } catch (e) { if (e.status === 401 || e.status === 403) break; continue; }
        const open = name === 'wikimedia' || name === 'openverse';
        const check = screen && open && has('gemini');
        for (const pick of list.filter((x) => !used.has(x.id)).slice(0, check ? 3 : 1)) {
          used.add(pick.id);
          if (check) { const v = await screenImage(pick.url, query, { signal }); if (!v.ok) { if (onReject) onReject(pick, v.reason); continue; } }
          return pick;
        }
      }
    }
    return null;
  }

  // ---------- 영상 ----------
  function pickPexelsFile(files) {
    const mp4 = (files || []).filter((f) => /mp4/i.test(f.file_type || '') && f.link);
    return mp4.filter((f) => f.width >= 1280 && f.width <= 1920).sort((a, b) => b.width - a.width)[0] || mp4.filter((f) => f.width <= 1920).sort((a, b) => b.width - a.width)[0] || mp4[0] || null;
  }
  async function pexelsVideos(q, o, signal) {
    const j = await getJSON(`https://api.pexels.com/v1/videos/search?query=${encodeURIComponent(q)}&per_page=15&orientation=${ORI[o].pexels}`, { headers: { Authorization: KEYS.pexels }, signal });
    return (j.videos || []).map((v) => { const f = pickPexelsFile(v.video_files); return f && { id: 'pexels-v:' + v.id, url: f.link, w: f.width, h: f.height, poster: v.image, dur: v.duration, credit: { source: 'Pexels', author: (v.user && v.user.name) || '', link: v.url, license: 'Pexels License' } }; }).filter(Boolean);
  }
  async function pixabayVideos(q, o, signal) {
    const j = await getJSON(`https://pixabay.com/api/videos/?key=${encodeURIComponent(KEYS.pixabay)}&q=${encodeURIComponent(q)}&per_page=15&safesearch=true`, { signal });
    return (j.hits || []).filter((h) => okText(h.tags)).map((h) => { const v = (h.videos && (h.videos.medium && h.videos.medium.url ? h.videos.medium : h.videos.small)) || null; return v && { id: 'pixabay-v:' + h.id, url: v.url, w: v.width, h: v.height, poster: v.thumbnail || '', dur: h.duration, credit: { source: 'Pixabay', author: h.user || '', link: h.pageURL, license: 'Pixabay Content License' } }; }).filter(Boolean);
  }

  // ---------- 위키미디어 무료 공용 비디오 검색 (키 불필요) ----------
  async function wikimediaVideos(q, o, signal) {
    const cleanQ = String(q || '').replace(/[^a-zA-Z0-9\s]/g, ' ').trim().split(/\s+/).slice(0, 3).join(' ');
    const url = `https://commons.wikimedia.org/w/api.php?action=query&format=json&origin=*&generator=search&gsrnamespace=6&gsrsearch=filetype:video+${encodeURIComponent(cleanQ)}&gsrlimit=10&prop=imageinfo&iiprop=url|mime`;
    try {
      const j = await getJSON(url, { signal }, 15000);
      const pages = (j.query && j.query.pages) || {};
      return Object.values(pages).map((p) => {
        const ii = p.imageinfo && p.imageinfo[0];
        if (!ii || !ii.url || !/\.(webm|mp4)$/i.test(ii.url)) return null;
        return {
          id: 'wm-v:' + p.pageid,
          url: ii.url,
          w: 1280,
          h: 720,
          poster: '',
          dur: 15,
          credit: { source: 'Wikimedia Commons', author: 'Wikimedia', link: ii.descriptionurl || ii.url, license: 'Creative Commons Video' }
        };
      }).filter(Boolean);
    } catch { return []; }
  }

  const CURATED_VIDEOS = {
    clinic: 'https://upload.wikimedia.org/wikipedia/commons/6/62/Dermatologist_%2C_Eye_%2CCardiac%2CDental%2CENT_%2CGynecology%2CPsychiatry_clinic_at_Mediversal_Health_studio.webm',
    medical: 'https://upload.wikimedia.org/wikipedia/commons/6/62/Dermatologist_%2C_Eye_%2CCardiac%2CDental%2CENT_%2CGynecology%2CPsychiatry_clinic_at_Mediversal_Health_studio.webm',
    hospital: 'https://upload.wikimedia.org/wikipedia/commons/6/62/Dermatologist_%2C_Eye_%2CCardiac%2CDental%2CENT_%2CGynecology%2CPsychiatry_clinic_at_Mediversal_Health_studio.webm',
    dental: 'https://upload.wikimedia.org/wikipedia/commons/6/62/Dermatologist_%2C_Eye_%2CCardiac%2CDental%2CENT_%2CGynecology%2CPsychiatry_clinic_at_Mediversal_Health_studio.webm',
    business: 'https://upload.wikimedia.org/wikipedia/commons/3/3b/Digital_Earth_Globe_Video_Loop.webm',
    office: 'https://upload.wikimedia.org/wikipedia/commons/3/3b/Digital_Earth_Globe_Video_Loop.webm',
    agency: 'https://upload.wikimedia.org/wikipedia/commons/3/3b/Digital_Earth_Globe_Video_Loop.webm',
    tech: 'https://upload.wikimedia.org/wikipedia/commons/3/3b/Digital_Earth_Globe_Video_Loop.webm',
    code: 'assets/matrix-540.mp4',
    cyber: 'assets/matrix-540.mp4',
    matrix: 'assets/matrix-540.mp4',
    nature: 'https://upload.wikimedia.org/wikipedia/commons/4/4e/Ocean_waves_4K.webm',
    ocean: 'https://upload.wikimedia.org/wikipedia/commons/4/4e/Ocean_waves_4K.webm',
    beauty: 'https://upload.wikimedia.org/wikipedia/commons/4/4e/Ocean_waves_4K.webm',
    cafe: 'https://upload.wikimedia.org/wikipedia/commons/4/4e/Ocean_waves_4K.webm',
    food: 'https://upload.wikimedia.org/wikipedia/commons/4/4e/Ocean_waves_4K.webm'
  };

  async function findVideo(query, { orientation = 'landscape', used = new Set(), signal } = {}) {
    const o = ORI[orientation] ? orientation : 'landscape';
    const sources = [['pexels', pexelsVideos], ['pixabay', pixabayVideos], ['wikimedia', wikimediaVideos]].filter(([n]) => n === 'wikimedia' || has(n));
    for (const [name, fn] of sources) {
      for (const q of variants(query)) {
        let list = [];
        try { list = await memo(`v:${name}|${o}|${q}`, () => fn(q, o, signal)); } catch (e) { if (e.status === 401 || e.status === 403) break; continue; }
        const pick = list.find((x) => !used.has(x.id));
        if (pick) { used.add(pick.id); return pick; }
      }
    }
    // 큐레이션 풀 매칭
    for (const [cat, vUrl] of Object.entries(CURATED_VIDEOS)) {
      if (new RegExp(cat, 'i').test(query)) {
        return { id: 'curated:' + cat, url: vUrl, w: 1280, h: 720, poster: '', dur: 15, credit: { source: 'Curated Video Loop', author: 'Public', link: vUrl, license: 'Public' } };
      }
    }
    return null;
  }

  const KO_EN_MAP = [
    [/(여의사|여의료진|여성\s*의사)/i, 'korean female doctor physician in white medical coat clinic gentle warm smile'],
    [/(대표원장|김민준|치과\s*원장)/i, 'korean male dentist director in late 30s, warm professional smile, white dental coat'],
    [/(수술|가이드|네비게이션|임플란트|surgery|식립)/i, 'korean dental surgeons team in modern surgical clinic, scrubs and masks'],
    [/(치과|치과의사)/i, 'korean dentist in modern dental clinic'],
    [/(의사|의료진|원장)/i, 'korean professional doctor physician in white medical coat clinic'],
    [/(환자|진료|상담)/i, 'consulting patient gentle smiling medical care'],
    [/(간호사)/i, 'korean nurse caring hospital'],
    [/(비즈니스|대표|직원|회사원|직장인|오피스)/i, 'korean professional business corporate office employee'],
    [/(바리스타|카페)/i, 'korean barista making coffee in modern cafe'],
    [/(선생님|강사|교사|수업)/i, 'korean teacher tutor instructor teaching classroom'],
    [/(학생|공부|대학생)/i, 'korean student studying in university library'],
    [/(헬스|트레이너|피트니스)/i, 'korean fitness trainer workout gym'],
    [/(가족|부모|아이)/i, 'happy korean family home warm smile'],
    [/(모델|여성|여자)/i, 'beautiful korean woman portrait natural smile'],
    [/(남성|남자)/i, 'handsome korean man portrait professional'],
    [/(피부과|에스테틱|뷰티)/i, 'korean skincare clinic beauty aesthetician treatment'],
    [/(식당|셰프|요리사|음식)/i, 'korean chef cooking delicious gourmet dining restaurant'],
    [/(병원|클리닉|진료실)/i, 'modern bright hospital clinic consultation room interior'],
  ];

  function toEnglishVisualPrompt(q) {
    let s = String(q || '').replace(/^ai\s*:\s*/i, '').trim();
    if (!/[가-힣]/.test(s)) return s;
    const matched = [];
    for (const [re, eng] of KO_EN_MAP) {
      if (re.test(s)) matched.push(eng);
    }
    if (matched.length) {
      return matched.join(', ') + ', photorealistic, 8k, natural lighting, 35mm lens';
    }
    if (/(사람|인물|얼굴|인사|소개)/.test(s)) {
      return 'korean professional person smiling warmly portrait, photorealistic, 8k';
    }
    return 'korean modern scene, photorealistic, high quality, 8k';
  }

  const FALLBACK_PHOTOS = {
    doctor: 'https://images.unsplash.com/photo-1594824813627-2c9dd7348972?auto=format&fit=crop&w=1200&q=80',
    clinic: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1200&q=80',
    dental: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=1200&q=80',
    business: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=80',
    cafe: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=80',
    beauty: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1200&q=80',
    tech: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
    default: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80'
  };

  function getFallbackPhotoUrl(q) {
    const s = String(q || '').toLowerCase();
    if (/doctor|dentist|nurse|의사|환자|병원|진료/.test(s)) return FALLBACK_PHOTOS.doctor;
    if (/clinic|hospital|클리닉/.test(s)) return FALLBACK_PHOTOS.clinic;
    if (/dental|치과/.test(s)) return FALLBACK_PHOTOS.dental;
    if (/business|corporate|회사|대표|오피스/.test(s)) return FALLBACK_PHOTOS.business;
    if (/cafe|coffee|바리스타|카페/.test(s)) return FALLBACK_PHOTOS.cafe;
    if (/beauty|skincare|피부|에스테틱/.test(s)) return FALLBACK_PHOTOS.beauty;
    if (/tech|code|ai|기술|소프트웨어/.test(s)) return FALLBACK_PHOTOS.tech;
    return FALLBACK_PHOTOS.default;
  }

  // ---------- AI 실사 이미지 ----------
  async function aiPhoto(prompt, { width = 1280, height = 768, signal, retries = 3, onWait } = {}) {
    const engPrompt = toEnglishVisualPrompt(prompt);
    const p = photorealPrompt(engPrompt);
    const seed = Math.floor(Math.random() * 1e6);
    if (has('pollinations')) {
      const r = await fetch(`https://gen.pollinations.ai/image/${encodeURIComponent(p)}?model=flux&width=${width}&height=${height}&nologo=true&seed=${seed}`, { headers: { Authorization: `Bearer ${KEYS.pollinations}` }, signal: sig(120000, signal) });
      const ct = r.headers.get('content-type') || '';
      if (!r.ok || !ct.startsWith('image/')) throw new Error(`AI 이미지 실패 (HTTP ${r.status})`);
      const blob = await r.blob();
      return { url: null, dataUrl: await blobToDataUrl(blob), blob, prompt: p, source: 'Pollinations', credit: { source: 'AI 생성 (Pollinations)', author: '', link: '', license: '' } };
    }
    const classicUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(p)}?width=${width}&height=${height}&nologo=true&seed=${seed}`;
    return { url: classicUrl, dataUrl: classicUrl, prompt: p, source: 'Pollinations Classic', credit: { source: 'AI 생성 (Pollinations)', author: '', link: '', license: '' } };
  }

  // ---------- HTML 표식 → 실사 사진·영상 ----------
  function orientOf(el, kind) {
    const o = (el.getAttribute('data-dc-orient') || '').toLowerCase();
    if (ORI[o]) return o;
    if (kind !== 'img') return 'landscape';
    const w = Number(el.getAttribute('width')), h = Number(el.getAttribute('height'));
    if (w && h) return w / h > 1.15 ? 'landscape' : w / h < 0.87 ? 'portrait' : 'square';
    const hint = `${el.className || ''} ${el.getAttribute('alt') || ''} ${el.getAttribute('data-dc-img') || ''}`;
    if (/avatar|profile|portrait|doctor-card|team|staff|인물|원장|의료진/i.test(hint)) return 'portrait';
    return 'landscape';
  }
  // 표식 하나당 최대 대기 (느린 공개 아카이브 때문에 전체가 멈추지 않게)
  const capped = (p, ms) => Promise.race([p, new Promise((res) => setTimeout(() => res(null), ms))]);
  async function pool(tasks, n) {
    const out = []; let i = 0;
    const worker = async () => { while (i < tasks.length) { const k = i++; out[k] = await tasks[k](); } };
    await Promise.all(Array.from({ length: Math.min(n, tasks.length) }, worker));
    return out;
  }
  function creditsHtml(credits) {
    if (!credits.length) return '';
    const by = {};
    credits.forEach((c) => { (by[c.source] = by[c.source] || []).push(c); });
    const esc = (s) => String(s || '').replace(/[&<>"]/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]));
    const parts = Object.entries(by).map(([src, list]) => {
      if (src === 'Openverse' || src === 'Wikimedia Commons') return `${esc(src)}: ` + list.map((c) => `<a href="${esc(c.link)}" target="_blank" rel="noopener">${esc(c.title || '사진')}</a>${c.author ? ' · ' + esc(c.author) : ''} (${esc(c.license)})`).join(', ');
      const authors = [...new Set(list.map((c) => c.author).filter(Boolean))].slice(0, 6).map(esc).join(', ');
      const home = { Pexels: 'https://www.pexels.com', Unsplash: 'https://unsplash.com', Pixabay: 'https://pixabay.com' }[src];
      return `${home ? `<a href="${home}" target="_blank" rel="noopener">${esc(src)}</a>` : esc(src)}${authors ? ` (${authors})` : ''}`;
    });
    return `사진·영상 출처: ${parts.join(' · ')}`;
  }
  async function resolveHtml(html, { log = () => {}, signal } = {}) {
    const stats = { photos: 0, bgs: 0, videos: 0, ai: 0, failed: 0, sources: [] };
    if (!/data-dc-(img|bg|video)\s*=/.test(html)) return { html, stats };
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const used = new Set(); const usedV = new Set(); const credits = [];
    const note = (item) => { if (item && item.credit) { credits.push(item.credit); if (!stats.sources.includes(item.credit.source)) stats.sources.push(item.credit.source); } };
    const tasks = [];
    doc.querySelectorAll('img[data-dc-img]').forEach((el, idx) => {
      if (/^(https?:|data:|blob:)/.test(el.getAttribute('src') || '')) return;
      tasks.push(async () => {
        const q = el.getAttribute('data-dc-img');
        let item = null;
        const isPerson = PEOPLE.test(q) || /(korean|asian|한국|의사|환자|원장|직원|모델|대표|고객|상담사|치과의사|선생님)/i.test(q);
        try {
          if (/^ai\s*:/i.test(q) || isPerson) {
            // 인물 또는 한국인 요청은 100% 한국인 실사 AI 생성으로 직결 (외국인 스톡 오류 원천 차단)
            const clean = q.replace(/^ai\s*:/i, '').trim();
            const prompt = /korean/i.test(clean) ? clean : 'korean ' + clean;
            const orient = orientOf(el, 'img');
            const dims = orient === 'portrait' ? { width: 768, height: 1024 } : orient === 'square' ? { width: 800, height: 800 } : { width: 1280, height: 768 };
            const a = await aiPhoto(prompt, { width: dims.width, height: dims.height, signal, retries: 2 });
            item = { url: a.url || a.dataUrl, alt: q, credit: a.credit };
            stats.ai++;
          } else {
            item = await capped(findPhoto(q, { orientation: orientOf(el, 'img'), used, signal, screen: true, onReject: (p, why) => log(`사진 제외 "${q}" · ${why}`, 't') }), 40000);
            if (!item) {
              const a = await aiPhoto(q, { signal, retries: 2 });
              if (a) { item = { url: a.url || a.dataUrl, alt: q, credit: a.credit }; stats.ai++; }
            }
          }
        } catch (e) { log(`사진 처리 "${q}" · ${e.message}`, 'warn'); }
        if (!item) {
          const fallback = getFallbackPhotoUrl(q);
          item = { url: fallback, alt: q, credit: { source: 'Unsplash Curated', author: 'Unsplash', link: fallback, license: 'Unsplash' } };
        }
        el.setAttribute('src', item.url);
        const fbUrl = getFallbackPhotoUrl(q);
        el.setAttribute('onerror', `this.onerror=null;this.src='${fbUrl}';`);
        if (!el.getAttribute('alt')) el.setAttribute('alt', item.alt || q);
        el.setAttribute('loading', idx < 2 ? 'eager' : 'lazy');
        el.setAttribute('decoding', 'async');
        if (!/object-fit/.test(el.getAttribute('style') || '')) el.setAttribute('style', `${el.getAttribute('style') || ''};object-fit:cover`.replace(/^;/, ''));
        stats.photos++; note(item);
      });
    });

    // 모든 img 태그에 대한 엑스박스(깨진 이미지) 원천 차단 및 한글 URL 자동 변환 가드
    doc.querySelectorAll('img').forEach((img) => {
      const src = img.getAttribute('src') || '';
      const alt = img.getAttribute('alt') || '';
      const fbUrl = getFallbackPhotoUrl(alt + ' ' + src);
      if (!img.getAttribute('onerror')) {
        img.setAttribute('onerror', `this.onerror=null;this.src='${fbUrl}';`);
      }
      if (/image\.pollinations\.ai\/prompt\/([^?]+)/i.test(src) && /[가-힣]/.test(src)) {
        try {
          const rawMatch = src.match(/image\.pollinations\.ai\/prompt\/([^?]+)/i)[1];
          const koPart = decodeURIComponent(rawMatch);
          const engPart = toEnglishVisualPrompt(koPart);
          img.setAttribute('src', `https://image.pollinations.ai/prompt/${encodeURIComponent(photorealPrompt(engPart))}?width=1280&height=768&nologo=true`);
        } catch {}
      }
    });

    // 한국인/국내 사이트 컨텍스트에서 외국인 스톡 사진 감지 시 100% 한국인 실사 AI 사진으로 자동 교체 (Surgical Replacement)
    const isKoreanContext = /(치과|병원|원장|김민준|의료|클리닉|한의원|상담|대표|한국|연세)/i.test(html);
    if (isKoreanContext) {
      doc.querySelectorAll('img').forEach((img) => {
        const src = img.getAttribute('src') || '';
        const alt = img.getAttribute('alt') || '';
        const parent = img.closest('.card, .profile, .doctor, .team, section, div, li');
        const ctxText = (alt + ' ' + (parent ? parent.textContent : '')).slice(0, 500);
        const isPerson = /(대표원장|원장|김민준|의사|치과의사|의료진|스태프|치과|doctor|dentist|surgeon|staff)/i.test(ctxText);
        // 외국인 스톡 사진(위키미디어)이거나 korean 키워드가 없는 사진인 경우 자동 핫패치
        if (isPerson && (/upload\.wikimedia\.org|pexels|unsplash/i.test(src) || !/korean/i.test(src))) {
          const isFemale = /(여의사|여성|여자|female)/i.test(ctxText);
          const isSurgeon = /(수술|가이드|네비게이션|임플란트|surgery)/i.test(ctxText);
          let prompt = isSurgeon 
            ? 'korean dental surgeons team in modern surgical clinic, scrubs and masks, 8k photo'
            : (isFemale ? 'korean female dentist physician in clinic, gentle smile, 8k photo' : 'korean male dentist director in late 30s, warm professional smile, white dental coat, 8k photo');
          const newUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=800&height=1000&nologo=true`;
          img.setAttribute('src', newUrl);
          img.setAttribute('data-dc-img', 'ai:' + prompt);
          img.setAttribute('onerror', `this.onerror=null;this.src='${FALLBACK_PHOTOS.doctor}';`);
          stats.ai++;
        }
      });
    }
    doc.querySelectorAll('[data-dc-bg]').forEach((el) => {
      if (/background-image\s*:\s*url\(\s*['"]?(https?:|data:)/.test(el.getAttribute('style') || '')) return;
      tasks.push(async () => {
        const q = el.getAttribute('data-dc-bg');
        let item = null;
        try {
          item = await capped(findPhoto(q, { orientation: 'landscape', used, signal, screen: true, onReject: (p, why) => log(`배경 제외 "${q}" · ${why}`, 't') }), 40000);
          if (!item) {
            const a = await aiPhoto(q, { signal, retries: 2 });
            if (a) { item = { url: a.url || a.dataUrl, alt: q, credit: a.credit }; stats.ai++; }
          }
        } catch (e) { log(`배경 실패 "${q}" · ${e.message}`, 'warn'); }
        if (!item) { stats.failed++; return; }
        const st = (el.getAttribute('style') || '').replace(/;\s*$/, '');
        el.setAttribute('style', `${st}${st ? ';' : ''}background-image:url("${item.url}");background-size:cover;background-position:center`);
        stats.bgs++; note(item);
      });
    });
    doc.querySelectorAll('video[data-dc-video]').forEach((el) => {
      if (el.getAttribute('src') || el.querySelector('source[src]')) return;
      tasks.push(async () => {
        const q = el.getAttribute('data-dc-video');
        let v = null;
        try { v = await capped(findVideo(q, { orientation: 'landscape', used: usedV, signal }), 20000); } catch (e) { log(`영상 검색 "${q}" · ${e.message}`, 'warn'); }
        ['muted', 'playsinline', 'loop', 'autoplay'].forEach((a) => el.setAttribute(a, ''));
        if (v) { el.setAttribute('src', v.url); if (v.poster) el.setAttribute('poster', v.poster); stats.videos++; note(v); return; }
        // 큐레이션 풀 및 배경 영상 보장
        for (const [cat, vUrl] of Object.entries(CURATED_VIDEOS)) {
          if (new RegExp(cat, 'i').test(q)) {
            el.setAttribute('src', vUrl);
            stats.videos++;
            note({ source: 'Curated Video', author: 'Public', link: vUrl, license: 'Public' });
            return;
          }
        }
        const defaultVid = CURATED_VIDEOS.clinic || 'assets/matrix-540.mp4';
        el.setAttribute('src', defaultVid);
        stats.videos++;
        note({ source: 'Default Video Loop', author: 'Public', link: defaultVid, license: 'Public' });
      });
    });
    log(`표식 ${tasks.length}개 처리 (사진 ${status().photo.join('·')} / 영상 ${status().video.join('·') || '키 없음'})`, 't');
    await pool(tasks, 3);
    const text = creditsHtml(credits);
    if (text && !doc.querySelector('.dc-media-credits')) {
      const p = doc.createElement('p');
      p.className = 'dc-media-credits';
      p.setAttribute('style', 'font:11px/1.6 system-ui,sans-serif;opacity:.65;text-align:center;padding:10px 16px;margin:0');
      p.innerHTML = text;
      (doc.querySelector('footer') || doc.body).appendChild(p);
    }
    const hadDoctype = /^\s*<!doctype/i.test(html);
    return { html: `${hadDoctype ? '<!doctype html>\n' : ''}${doc.documentElement.outerHTML}`, stats, credits };
  }

  function patchKoreanPhotos(html) {
    if (!html || typeof html !== 'string') return html;
    const doc = new DOMParser().parseFromString(html, 'text/html');
    let patched = false;
    doc.querySelectorAll('img').forEach((img) => {
      const src = img.getAttribute('src') || '';
      const alt = img.getAttribute('alt') || '';
      const parent = img.closest('.card, .profile, .doctor, .team, section, div, li');
      const ctxText = (alt + ' ' + (parent ? parent.textContent : '')).slice(0, 500);
      const isPerson = /(대표원장|원장|김민준|의사|치과의사|의료진|스태프|치과|doctor|dentist|surgeon|staff)/i.test(ctxText);
      if (isPerson && (/wikimedia|pexels|unsplash/i.test(src) || !/korean/i.test(src))) {
        const isFemale = /(여성|여의사|여자|female)/i.test(ctxText);
        const isSurgeon = /(수술|가이드|네비게이션|임플란트|surgery)/i.test(ctxText);
        let prompt = isSurgeon 
          ? 'korean dental surgeons team in modern surgical clinic, scrubs and masks, 8k photo'
          : (isFemale ? 'korean female dentist physician in clinic, gentle smile, 8k photo' : 'korean male dentist director in late 30s, warm professional smile, white dental coat, 8k photo');
        const newSrc = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=800&height=1000&nologo=true`;
        img.setAttribute('src', newSrc);
        img.setAttribute('data-dc-img', 'ai:' + prompt);
        img.setAttribute('onerror', `this.onerror=null;this.src='${FALLBACK_PHOTOS.doctor}';`);
        patched = true;
      }
    });
    const hadDoctype = /^\s*<!doctype/i.test(html);
    return patched ? `${hadDoctype ? '<!doctype html>\n' : ''}${doc.documentElement.outerHTML}` : html;
  }

  window.DCMedia = { version: '1.2', setKeys, has, status, koreanize, photorealPrompt, toEnglishVisualPrompt, patchKoreanPhotos, findPhoto, findVideo, aiPhoto, screenImage, resolveHtml, creditsHtml };
})();
