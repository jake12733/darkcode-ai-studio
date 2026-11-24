/* DARK CODE STUDIO · 홍보영상 (실사 영상·사진 + 나레이션 + 자막 + 배경음악 → MP4)
 * 대본: Gemini (무료 등급 키 · DARK CODE 암호화 금고) → 로컬 Ollama → 기본 템플릿
 * 소재: DCMedia (Pexels/Pixabay 실사 영상 → 실사 사진 → AI 실사 이미지)
 * 나레이션: Gemini TTS (gemini-3.8-flash-tts, 무료 등급) → Azure Speech (키 있을 때)
 * 렌더: Mediabunny (WebCodecs · H.264 + AAC) · 브라우저에서 실시간보다 빠르게 MP4 생성
 * 사용자가 애니메이션·일러스트를 요청하지 않으면 실사 소재만 쓴다. 인물은 국적 지정이 없으면 한국인.
 */
import { vault } from './cloud.js?v=20261124p1';

const $ = (s) => document.querySelector(s);
const MB_URL = 'https://cdn.jsdelivr.net/npm/mediabunny@1.66.2/+esm';
const FPS = 30;
const SIZES = { '16:9': [1280, 720], '9:16': [720, 1280], '1:1': [960, 960] };
const STATE = { format: '16:9', seconds: 30, busy: false };
const FONT = '"Pretendard Variable", Pretendard, "Apple SD Gothic Neo", "Malgun Gothic", "Noto Sans KR", sans-serif';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const clamp = (x) => Math.max(0, Math.min(1, x));
const fmt = (s) => `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, '0')}`;
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const capped = (p, ms) => Promise.race([p, new Promise((res) => setTimeout(() => res(null), ms))]);

function log(msg) { const el = $('#pLog'); if (!el) return; el.textContent += `${new Date().toTimeString().slice(0, 8)} ${msg}\n`; el.scrollTop = el.scrollHeight; }
function status(msg) { const el = $('#pStatus'); if (el) el.textContent = msg; }
function toast(m) { const t = $('#toast'); if (!t) return; t.textContent = m; t.classList.add('on'); clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove('on'), 2600); }

/* ---------- STUDIO 저장소 (studio.js 와 같은 dc-studio) ---------- */
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
    all: async (store) => { const r = await tx(store, 'readonly', (s) => s.getAll()); return (r || []).sort((a, b) => b.created - a.created); },
  };
})();

/* ---------- 키 (DARK CODE 설정의 암호화 금고) ---------- */
async function loadKeys() {
  const out = {};
  try { out.gemini = await vault.get('prov:gemini'); } catch { /* 없음 */ }
  for (const id of ['pexels', 'unsplash', 'pixabay', 'pollinations', 'azure']) { try { out[id] = await vault.get('media:' + id); } catch { /* 없음 */ } }
  let azureRegion = 'koreacentral';
  try { azureRegion = JSON.parse(localStorage.getItem('pst:opts') || '{}').azureRegion || azureRegion; } catch { /* 기본값 */ }
  if (window.DCMedia) window.DCMedia.setKeys({ ...out, azureRegion });
  return { ...out, azureRegion };
}

/* ---------- 대본 ---------- */
function scriptPrompt(req, seconds, format) {
  const lo = Math.max(3, Math.round(seconds / 6)), hi = Math.max(4, Math.round(seconds / 4));
  return `너는 한국 광고 영상 작가다. 아래 요청으로 ${seconds}초 홍보영상 대본을 JSON 으로만 작성한다.
요청: ${req}
화면 비율: ${format}
규칙:
- scenes 는 ${lo}~${hi}개, 각 장면 seconds 합계가 약 ${seconds}초.
- narration: 한국어 나레이션 (자연스러운 존댓말, 장면 길이에 맞게 초당 4~5음절).
- subtitle: 화면 자막 (narration 을 18자 안팎으로 줄인 핵심 문구).
- visual.kind: "video"(움직이는 장면) 또는 "photo".
- visual.query: 스톡 영상/사진 검색용 영어 키워드 3~6단어. 사람이 나오면 korean 을 넣는다. 장면마다 다른 대상.
- 첫 장면 title(브랜드·제목 12자 이내), 마지막 장면용 cta(전화·위치·행동 유도 한 줄).
- 사용자가 애니메이션·일러스트를 요청하지 않았다면 실사 기준.
- 의료·건강·뷰티 관련이면 "최고, 1위, 100%, 완치, 보장, 부작용 없음" 같은 과장 표현 금지.
JSON 형식: {"title":"...","cta":"...","scenes":[{"narration":"...","subtitle":"...","seconds":5,"visual":{"kind":"video","query":"..."}}]}`;
}
const GEM_MODELS = ['gemini-4-hydrogen', 'gemini-3.8-flash', 'gemini-3.5-flash-lite'];
async function gemJSON(key, prompt) {
  let lastErr = null;
  for (const m of GEM_MODELS) {
    for (let a = 0; a < 2; a++) {
      try {
        const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key }, body: JSON.stringify({ contents: [{ role: 'user', parts: [{ text: prompt }] }], generationConfig: { responseMimeType: 'application/json', temperature: 0.8, maxOutputTokens: 4096 } }), signal: AbortSignal.timeout(90000) });
        if (r.status === 429 || r.status === 503) { lastErr = new Error(`${m} 혼잡 (HTTP ${r.status})`); await sleep(2500 * (a + 1)); continue; }
        const j = await r.json().catch(() => ({}));
        if (!r.ok) { lastErr = new Error(`${m} HTTP ${r.status}`); break; }
        const txt = ((j.candidates && j.candidates[0] && j.candidates[0].content && j.candidates[0].content.parts) || []).map((p) => p.text || '').join('');
        return { data: JSON.parse(txt.replace(/^\s*```(?:json)?\s*|\s*```\s*$/g, '')), model: m };
      } catch (e) { lastErr = e; }
    }
  }
  throw lastErr || new Error('Gemini 대본 실패');
}
async function ollamaJSON(prompt) {
  const host = (localStorage.getItem('dc-l6-host') || 'http://localhost:11434').replace(/\/+$/, '');
  const tags = await (await fetch(host + '/api/tags', { signal: AbortSignal.timeout(3000) })).json();
  const names = (tags.models || []).map((x) => String(x.name));
  const model = ['qwen3:8b', 'ai-dev:latest', 'qwen2.5-coder:7b'].find((n) => names.includes(n)) || names[0];
  if (!model) throw new Error('Ollama 모델 없음');
  const r = await fetch(host + '/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ model, stream: false, think: false, format: 'json', messages: [{ role: 'user', content: prompt }] }), signal: AbortSignal.timeout(180000) });
  const j = await r.json();
  return { data: JSON.parse(String((j.message && j.message.content) || '').replace(/<think>[\s\S]*?<\/think>/g, '')), model: 'ollama:' + model };
}
const KW = [[/치과|임플란트|교정/, 'dental clinic'], [/피부|에스테틱|뷰티|화장품/, 'skin care beauty'], [/한의원/, 'korean medicine clinic'], [/병원|의원|클리닉/, 'modern clinic'], [/카페|커피/, 'cafe coffee'], [/식당|맛집|레스토랑/, 'restaurant food'], [/헬스|피트니스|필라테스|요가/, 'fitness gym'], [/학원|교육|공부/, 'students studying'], [/부동산|아파트/, 'apartment interior'], [/호텔|숙박|펜션/, 'hotel room'], [/쇼핑|옷|패션/, 'fashion store']];
function templateScenes(req, seconds) {
  const topic = (KW.find(([re]) => re.test(req)) || [null, 'modern business'])[1];
  const n = Math.max(3, Math.round(seconds / 7));
  const lines = [`${req.slice(0, 30)}`, '편안하고 믿을 수 있는 공간에서', '한 분 한 분 정성껏 함께합니다', '지금 바로 만나 보세요'];
  return Array.from({ length: n }, (_, i) => ({ narration: lines[Math.min(i, lines.length - 1)], subtitle: lines[Math.min(i, lines.length - 1)].slice(0, 20), seconds: seconds / n, kind: i % 2 ? 'photo' : 'video', query: [`${topic} interior`, `korean ${topic} staff`, `${topic} detail`, `${topic} exterior`][i % 4] }));
}
function normalize(data, seconds, req) {
  const raw = Array.isArray(data && data.scenes) ? data.scenes : [];
  let scenes = raw.filter((s) => s && (s.narration || s.subtitle)).slice(0, 12).map((s) => ({
    narration: String(s.narration || s.subtitle || '').trim().slice(0, 220),
    subtitle: String(s.subtitle || s.narration || '').trim().slice(0, 60),
    seconds: Math.min(12, Math.max(2.5, Number(s.seconds) || seconds / Math.max(1, raw.length))),
    kind: s.visual && s.visual.kind === 'photo' ? 'photo' : 'video',
    query: String((s.visual && s.visual.query) || s.query || req).slice(0, 120),
  }));
  if (!scenes.length) scenes = templateScenes(req, seconds);
  return { title: String((data && data.title) || '').slice(0, 24), cta: String((data && data.cta) || '').slice(0, 60), scenes };
}

/* ---------- 나레이션 ---------- */
const b64 = (s) => { const bin = atob(s); const u = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i); return u; };
async function ttsGemini(key, text, voice, style) {
  let lastErr = null;
  for (const model of ['gemini-3.8-flash-tts', 'gemini-3.8-flash-lite-tts', 'gemini-3.1-flash-tts-preview']) {
    for (let a = 0; a < 3; a++) {
      const r = await fetch('https://generativelanguage.googleapis.com/v1beta/interactions', { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key }, body: JSON.stringify({ model, input: [{ type: 'user_input', content: [{ type: 'text', text, annotations: [{ type: 'speech_metadata', style }] }] }], response_format: { type: 'audio' }, generation_config: { speech_config: [{ voice }] } }), signal: AbortSignal.timeout(90000) }).catch((e) => ({ ok: false, status: 0, err: e }));
      if (r.status === 429 || r.status === 503 || r.status === 0) { lastErr = new Error(`${model} ${r.status ? 'HTTP ' + r.status : '네트워크'}`); await sleep(3000 * (a + 1)); continue; }
      const j = await r.json().catch(() => ({}));
      if (!r.ok) { lastErr = new Error(`${model} HTTP ${r.status}`); break; }
      const audio = (j.steps || []).filter((s) => s.type === 'model_output').flatMap((s) => s.content || []).filter((c) => c.type === 'audio').pop();
      if (audio && audio.data) return { bytes: b64(audio.data), model };
      lastErr = new Error(`${model} 오디오 없음`); break;
    }
  }
  throw lastErr || new Error('나레이션 생성 실패');
}
async function ttsAzure(key, region, text) {
  const ssml = `<speak version="1.0" xml:lang="ko-KR"><voice name="ko-KR-SunHiNeural">${esc(text)}</voice></speak>`;
  const r = await fetch(`https://${region}.tts.speech.microsoft.com/cognitiveservices/v1`, { method: 'POST', headers: { 'Ocp-Apim-Subscription-Key': key, 'Content-Type': 'application/ssml+xml', 'X-Microsoft-OutputFormat': 'audio-24khz-96kbitrate-mono-mp3' }, body: ssml, signal: AbortSignal.timeout(60000) });
  if (!r.ok) throw new Error(`Azure HTTP ${r.status}`);
  return { bytes: new Uint8Array(await r.arrayBuffer()), model: 'azure:ko-KR-SunHiNeural' };
}
async function decodeAudio(bytes) {
  const ac = new OfflineAudioContext(2, 48000, 48000);
  return ac.decodeAudioData(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength));
}

/* ---------- 소재 ---------- */
async function fetchBlob(url, ms) { const r = await fetch(url, { mode: 'cors', signal: AbortSignal.timeout(ms) }); if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.blob(); }
async function loadVisual(scene, W, H, used, usedV, MB, gemKey) {
  const M = window.DCMedia;
  const orient = W > H ? 'landscape' : W < H ? 'portrait' : 'square';
  if (scene.kind === 'video' && M.status().video.length) {
    const v = await capped(M.findVideo(scene.query, { orientation: orient, used: usedV }), 20000);
    if (v) {
      try {
        const blob = await fetchBlob(v.url, 90000);
        const input = new MB.Input({ source: new MB.BlobSource(blob), formats: MB.ALL_FORMATS });
        const track = await input.getPrimaryVideoTrack();
        if (track) { const dur = await input.computeDuration(); return { type: 'video', sink: new MB.CanvasSink(track, { width: W, height: H, fit: 'cover', poolSize: 2 }), dur: Math.max(1, dur || scene.seconds), credit: v.credit }; }
      } catch (e) { log(`  영상 불러오기 실패 (${e.message}) → 사진으로`); }
    }
  }
  for (let tries = 0; tries < 4; tries++) {
    const p = await capped(M.findPhoto(scene.query, { orientation: orient, used, screen: Boolean(gemKey), onReject: (x, why) => log(`  사진 제외 (${why}) → 다음 후보`) }), 60000);
    if (!p) break;
    let bmp = null;
    try { bmp = await createImageBitmap(await fetchBlob(p.url, 45000)); } catch (e) { log(`  사진 불러오기 실패 (${e.message})`); continue; }
    return { type: 'photo', bmp, credit: p.credit };
  }
  try { const a = await M.aiPhoto(scene.query, { width: W, height: H, retries: 2 }); return { type: 'photo', bmp: await createImageBitmap(a.blob), credit: a.credit }; }
  catch (e) { log(`  AI 이미지도 실패 (${e.message})`); }
  return { type: 'none' };
}

/* ---------- 그리기 ---------- */
function kenBurns(ctx, img, W, H, p, si) {
  const z = 1.05 + 0.1 * p;
  const s = Math.max(W / img.width, H / img.height) * z;
  const w = img.width * s, h = img.height * s;
  const dir = si % 2 ? 1 : -1;
  ctx.drawImage(img, (W - w) / 2 + dir * (w - W) * 0.45 * (p - 0.5), (H - h) / 2 - (h - H) * 0.2 * (p - 0.5), w, h);
}
function gradientCard(ctx, W, H, si) {
  const g = ctx.createLinearGradient(0, 0, W, H);
  const hue = (si * 53 + 200) % 360;
  g.addColorStop(0, `hsl(${hue},35%,18%)`); g.addColorStop(1, `hsl(${(hue + 40) % 360},40%,8%)`);
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
}
function wrap(ctx, text, maxW, maxLines) {
  const words = String(text).split(/\s+/); const lines = []; let cur = '';
  const push = (w) => { const t = cur ? cur + ' ' + w : w; if (ctx.measureText(t).width <= maxW) { cur = t; return; } if (cur) lines.push(cur); cur = w; while (ctx.measureText(cur).width > maxW && cur.length > 1) { let k = cur.length - 1; while (k > 1 && ctx.measureText(cur.slice(0, k)).width > maxW) k--; lines.push(cur.slice(0, k)); cur = cur.slice(k); } };
  words.forEach(push); if (cur) lines.push(cur);
  if (lines.length > maxLines) { const keep = lines.slice(0, maxLines); keep[maxLines - 1] = keep[maxLines - 1].replace(/.$/, '…'); return keep; }
  return lines;
}
function roundRect(ctx, x, y, w, h, r) { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }
function overlay(ctx, W, H, s, lt, si, plan) {
  const base = Math.min(H, W * 1.25);
  const g = ctx.createLinearGradient(0, H * 0.5, 0, H);
  g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,0.62)');
  ctx.fillStyle = g; ctx.fillRect(0, H * 0.5, W, H * 0.5);
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  if (si === 0 && plan.title) {
    const a = clamp((lt - 0.25) / 0.6);
    ctx.save(); ctx.globalAlpha = a; ctx.font = `800 ${Math.round(base * 0.09)}px ${FONT}`; ctx.shadowColor = 'rgba(0,0,0,.6)'; ctx.shadowBlur = base * 0.03; ctx.fillStyle = '#fff';
    ctx.fillText(plan.title, W / 2, H * 0.4 + (1 - a) * base * 0.02); ctx.restore();
  }
  if (si === plan.scenes.length - 1 && plan.cta) {
    const a = clamp((lt - 0.4) / 0.6);
    ctx.save(); ctx.globalAlpha = a; ctx.font = `800 ${Math.round(base * 0.055)}px ${FONT}`;
    const lines = wrap(ctx, plan.cta, W * 0.8, 2); const lh = base * 0.075; const bw = Math.min(W * 0.86, Math.max(...lines.map((l) => ctx.measureText(l).width)) + base * 0.08); const bh = lh * lines.length + base * 0.04;
    ctx.fillStyle = 'rgba(255,255,255,0.92)'; roundRect(ctx, (W - bw) / 2, H * 0.36 - bh / 2, bw, bh, base * 0.02); ctx.fill();
    ctx.fillStyle = '#111'; lines.forEach((l, i) => ctx.fillText(l, W / 2, H * 0.36 - bh / 2 + base * 0.02 + lh * (i + 0.5)));
    ctx.restore();
  }
  if (s.subtitle) {
    const a = Math.min(clamp((lt - 0.12) / 0.25), clamp((s.dur - lt - 0.08) / 0.25));
    if (a > 0) {
      ctx.save(); ctx.globalAlpha = a; ctx.font = `700 ${Math.round(base * 0.05)}px ${FONT}`;
      const lines = wrap(ctx, s.subtitle, W * 0.84, 2); const lh = base * 0.066; const bw = Math.max(...lines.map((l) => ctx.measureText(l).width)) + base * 0.05; const bh = lh * lines.length + base * 0.025;
      const y = H - base * 0.07 - bh;
      ctx.fillStyle = 'rgba(0,0,0,0.5)'; roundRect(ctx, (W - bw) / 2, y, bw, bh, base * 0.014); ctx.fill();
      ctx.fillStyle = '#fff'; lines.forEach((l, i) => ctx.fillText(l, W / 2, y + base * 0.0125 + lh * (i + 0.5)));
      ctx.restore();
    }
  }
  const fin = si === 0 ? clamp(lt / 0.6) : clamp(lt / 0.3);
  const fout = si === plan.scenes.length - 1 ? clamp((s.dur - lt) / 0.7) : 1;
  const k = Math.min(fin, fout);
  if (k < 1) { ctx.fillStyle = `rgba(0,0,0,${1 - k})`; ctx.fillRect(0, 0, W, H); }
}
function drawStill(ctx, W, H, plan, si, lt) {
  const s = plan.scenes[si];
  ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H);
  if (s.visual && s.visual.type === 'photo') kenBurns(ctx, s.visual.bmp, W, H, s.dur ? lt / s.dur : 0.3, si);
  else if (s.visual && s.visual.type === 'video' && s.visual.still) ctx.drawImage(s.visual.still, 0, 0, W, H);
  else gradientCard(ctx, W, H, si);
  overlay(ctx, W, H, { ...s, dur: s.dur || s.seconds }, lt, si, plan);
}
function preview(plan, si, W, H) {
  const c = $('#pStage'); if (!c) return;
  c.width = W; c.height = H;
  drawStill(c.getContext('2d'), W, H, plan, si, 1.2);
}

/* ---------- 오디오 믹스 ---------- */
async function mixAudio(plan, bgm) {
  const SR = 48000;
  const oac = new OfflineAudioContext(2, Math.ceil(plan.total * SR), SR);
  let hasVoice = false;
  for (const s of plan.scenes) if (s.voice) { const src = oac.createBufferSource(); src.buffer = s.voice; src.connect(oac.destination); src.start(s.start + 0.25); hasVoice = true; }
  if (bgm) {
    const src = oac.createBufferSource(); src.buffer = bgm; src.loop = true;
    const gn = oac.createGain(); const lv = hasVoice ? 0.14 : 0.35;
    gn.gain.setValueAtTime(0, 0); gn.gain.linearRampToValueAtTime(lv, Math.min(1, plan.total / 4));
    gn.gain.setValueAtTime(lv, Math.max(1, plan.total - 1.5)); gn.gain.linearRampToValueAtTime(0, plan.total);
    src.connect(gn).connect(oac.destination); src.start(0);
  }
  if (!hasVoice && !bgm) return null;
  return oac.startRendering();
}
async function loadBgm() {
  const f = $('#pBgmFile') && $('#pBgmFile').files[0];
  const id = $('#pBgm') && $('#pBgm').value;
  let blob = f || null;
  if (!blob && id) { const t = (await DB.all('tracks')).find((x) => x.id === id); blob = t && t.blob; }
  if (!blob) return null;
  try { return await decodeAudio(new Uint8Array(await blob.arrayBuffer())); } catch (e) { log(`배경음악 해석 실패 (${e.message})`); return null; }
}

/* ---------- 렌더 (Mediabunny) ---------- */
async function render(plan, W, H, MB, onProgress) {
  const canvas = document.createElement('canvas'); canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext('2d');
  const output = new MB.Output({ format: new MB.Mp4OutputFormat(), target: new MB.BufferTarget() });
  const vsrc = new MB.CanvasSource(canvas, { codec: 'avc', quality: new MB.Quality({ bitrate: Math.max(W, H) >= 1280 ? 5e6 : 4e6 }) });
  output.addVideoTrack(vsrc, { frameRate: FPS });
  let asrc = null;
  if (plan.audio) { asrc = new MB.AudioBufferSource({ codec: 'aac', quality: new MB.Quality({ bitrate: 160e3 }) }); output.addAudioTrack(asrc); }
  await output.start();
  const totalFrames = Math.round(plan.total * FPS);
  let frame = 0;
  for (let si = 0; si < plan.scenes.length; si++) {
    const s = plan.scenes[si];
    const n = Math.round(s.dur * FPS);
    let iter = null;
    if (s.visual.type === 'video') {
      const loopLen = Math.max(0.5, s.visual.dur - 0.06);
      const ts = Array.from({ length: n }, (_, i) => (i / FPS) % loopLen);
      iter = s.visual.sink.canvasesAtTimestamps(ts)[Symbol.asyncIterator]();
    }
    for (let i = 0; i < n; i++) {
      const lt = i / FPS;
      ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H);
      if (iter) { const r = await iter.next(); const c = r.value && r.value.canvas; if (c) ctx.drawImage(c, 0, 0, W, H); else gradientCard(ctx, W, H, si); }
      else if (s.visual.type === 'photo') kenBurns(ctx, s.visual.bmp, W, H, lt / s.dur, si);
      else gradientCard(ctx, W, H, si);
      overlay(ctx, W, H, s, lt, si, plan);
      await vsrc.add(frame / FPS, 1 / FPS);
      frame++;
      if (frame % 15 === 0) onProgress(frame / totalFrames);
    }
    if (iter && iter.return) await iter.return();
  }
  if (asrc) await asrc.add(plan.audio);
  await output.finalize();
  return new Blob([output.target.buffer], { type: 'video/mp4' });
}

/* ---------- 결과 ---------- */
function srt(plan) {
  const ts = (x) => { const ms = Math.max(0, Math.round(x * 1000)); const p2 = (n) => String(n).padStart(2, '0'); return `${p2(Math.floor(ms / 3600000))}:${p2(Math.floor((ms % 3600000) / 60000))}:${p2(Math.floor((ms % 60000) / 1000))},${String(ms % 1000).padStart(3, '0')}`; };
  return plan.scenes.map((s, i) => `${i + 1}\n${ts(s.start + 0.15)} --> ${ts(s.start + s.dur - 0.1)}\n${s.subtitle}\n`).join('\n');
}
function creditText(credits) {
  const seen = new Set();
  return credits.filter((c) => c && c.source && !seen.has(c.link + c.title) && seen.add(c.link + c.title)).map((c) => `${c.source}${c.title ? ' · ' + c.title : ''}${c.author ? ' · ' + c.author : ''}${c.license ? ' (' + c.license + ')' : ''}${c.link ? ' ' + c.link : ''}`).join('\n');
}
function showExport(item, plan, credits, by) {
  const box = $('#pExport'); box.hidden = false;
  const u = URL.createObjectURL(item.blob);
  const su = URL.createObjectURL(new Blob([srt(plan)], { type: 'text/plain' }));
  const ct = creditText(credits);
  box.innerHTML = `<b>완성!</b> ${fmt(item.duration)} · ${(item.blob.size / 1048576).toFixed(1)}MB · MP4 (H.264 + AAC)
    <video src="${u}" controls playsinline style="width:100%;margin-top:10px;border-radius:10px;background:#000"></video>
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:10px"><a class="st-btn sm" href="${u}" download="${esc(item.title)}.mp4">MP4 받기</a><a class="st-btn ghost sm" href="${su}" download="${esc(item.title)}.srt">자막 SRT 받기</a>${ct ? '<button class="st-btn ghost sm" id="pCopyCredit" type="button">소재 출처 복사</button>' : ''}</div>
    <p class="dim" style="margin-top:8px">대본 ${esc(by)} · 나레이션 ${esc(plan.voiceBy || '없음')} · 소재 ${esc([...new Set(credits.map((c) => c.source))].join(', ') || '없음')} · 라이브러리에 저장됨</p>
    ${ct ? `<pre class="dim" style="white-space:pre-wrap;font-size:11px;max-height:120px;overflow:auto">${esc(ct)}</pre>` : ''}`;
  const cb = $('#pCopyCredit'); if (cb) cb.onclick = () => navigator.clipboard.writeText(ct).then(() => toast('출처를 복사했어요 (영상 설명란에 붙여 넣으세요)'));
}
function renderSceneList(plan) {
  const box = $('#pScenes'); if (!box) return;
  box.innerHTML = plan.scenes.map((s, i) => `<div class="scn" style="padding:8px 10px"><div class="scn-row"><span class="scn-n">${String(i + 1).padStart(2, '0')}</span><b style="font-size:13px">${esc(s.subtitle)}</b></div><div class="dim" style="font-size:12px;margin-top:4px">${esc(s.narration)}</div><div class="dim" style="font-size:11px;margin-top:2px">${s.kind === 'video' ? '실사 영상' : '실사 사진'} · ${esc(s.query)}</div></div>`).join('');
}

/* ---------- 실행 ---------- */
async function makePromo() {
  if (STATE.busy) return;
  const req = ($('#pPrompt').value || '').trim();
  if (!req) { toast('무엇을 홍보할지 적어 주세요'); return; }
  STATE.busy = true; $('#pMake').disabled = true; $('#pLog').textContent = ''; $('#pExport').hidden = true;
  const t0 = performance.now();
  try {
    const keys = await loadKeys();
    const [W, H] = SIZES[STATE.format];
    status('1/5 대본 쓰는 중...');
    let data = null, by = '';
    const prompt = scriptPrompt(req, STATE.seconds, STATE.format);
    if (keys.gemini) { try { const r = await gemJSON(keys.gemini, prompt); data = r.data; by = r.model; } catch (e) { log(`Gemini 대본 실패 (${e.message}) → 로컬 Ollama`); } }
    else log('Gemini 키 없음 (DARK CODE 설정에서 넣으면 대본·나레이션 자동) → 로컬 Ollama');
    if (!data) { try { const r = await ollamaJSON(prompt); data = r.data; by = r.model; } catch (e) { log(`로컬 Ollama 대본 실패 (${e.message}) → 기본 템플릿`); } }
    const plan = normalize(data, STATE.seconds, req);
    by = by || '기본 템플릿';
    log(`대본 ${plan.scenes.length}장면 · ${by}${plan.title ? ' · 제목 "' + plan.title + '"' : ''}`);
    renderSceneList(plan);
    await document.fonts.load(`800 40px ${FONT}`).catch(() => {});

    status('2/5 실사 영상·사진 찾는 중...');
    const MB = await import(MB_URL);
    const used = new Set(); const usedV = new Set(); const credits = [];
    for (let i = 0; i < plan.scenes.length; i++) {
      const s = plan.scenes[i];
      s.visual = await loadVisual(s, W, H, used, usedV, MB, keys.gemini);
      if (s.visual.credit) credits.push(s.visual.credit);
      log(`장면 ${i + 1}: ${s.visual.type === 'video' ? '실사 영상' : s.visual.type === 'photo' ? '실사 사진' : '소재 없음 (그라데이션)'}${s.visual.credit ? ' · ' + s.visual.credit.source : ''}`);
      if (s.visual.type === 'video') { try { const w = await s.visual.sink.getCanvas(Math.min(1, s.visual.dur / 2)); if (w && w.canvas) { const c = document.createElement('canvas'); c.width = W; c.height = H; c.getContext('2d').drawImage(w.canvas, 0, 0, W, H); s.visual.still = c; } } catch { /* 미리보기만 */ } }
      preview(plan, i, W, H);
    }

    const voice = $('#pVoice').value;
    if (voice && (keys.gemini || keys.azure)) {
      status('3/5 나레이션 녹음 중...');
      const style = ($('#pStyle') && $('#pStyle').value.trim()) || '따뜻하고 신뢰감 있는 한국어 광고 나레이션, 또렷한 발음, 차분한 속도';
      let next = 0;
      const one = async () => { while (next < plan.scenes.length) { const i = next++; const s = plan.scenes[i];
        try {
          const r = keys.gemini ? await ttsGemini(keys.gemini, s.narration, voice, style) : await ttsAzure(keys.azure, keys.azureRegion, s.narration);
          s.voice = await decodeAudio(r.bytes); plan.voiceBy = r.model;
          log(`  나레이션 ${i + 1}/${plan.scenes.length} · ${s.voice.duration.toFixed(1)}초 · ${r.model}`);
        } catch (e) {
          if (keys.gemini && keys.azure) { try { const r = await ttsAzure(keys.azure, keys.azureRegion, s.narration); s.voice = await decodeAudio(r.bytes); plan.voiceBy = r.model; continue; } catch { /* 아래 */ } }
          log(`  나레이션 ${i + 1} 실패 (${e.message}) → 이 장면은 자막만`);
        }
      } };
      await Promise.all([one(), one()]);
    } else log(voice ? '나레이션 키 없음 (Gemini 키 필요) → 자막만' : '나레이션 없음 (자막만)');

    let t = 0;
    for (const s of plan.scenes) { s.dur = Math.max(s.seconds, s.voice ? s.voice.duration + 0.7 : 0, 2.5); s.start = t; t += s.dur; }
    plan.total = t;
    status('4/5 오디오 믹스 중...');
    const bgm = await loadBgm();
    plan.audio = await mixAudio(plan, bgm);
    log(`길이 ${fmt(plan.total)} · 오디오 ${plan.audio ? (bgm ? '나레이션+배경음악' : '나레이션') : '무음'}`);

    status('5/5 MP4 만드는 중...');
    const blob = await render(plan, W, H, MB, (p) => status(`5/5 MP4 만드는 중... ${Math.round(p * 100)}%`));
    const item = { id: 'promo_' + Date.now().toString(36), title: (plan.title || req).replace(/[\\/:*?"<>|]/g, ' ').slice(0, 40), blob, mime: 'video/mp4', ext: 'mp4', format: STATE.format, quality: Math.min(W, H) >= 720 ? 720 : Math.min(W, H), duration: plan.total, created: Date.now(), kind: 'promo' };
    await DB.put('videos', item);
    showExport(item, plan, credits, by);
    window.__dcLastPromo = { id: item.id, size: blob.size, duration: plan.total, scenes: plan.scenes.length, voiced: plan.scenes.filter((s) => s.voice).length, sources: [...new Set(credits.map((c) => c.source))], by, voiceBy: plan.voiceBy || '' };
    status(`완성 · ${fmt(plan.total)} · ${(blob.size / 1048576).toFixed(1)}MB · ${Math.round((performance.now() - t0) / 1000)}초 걸림`);
    toast('홍보영상 완성! 라이브러리에도 저장했어요');
  } catch (e) {
    log('실패: ' + (e && e.message ? e.message : e));
    status('실패: ' + (e && e.message ? e.message : e));
    window.__dcLastPromo = { error: String(e && e.message ? e.message : e) };
  } finally { STATE.busy = false; $('#pMake').disabled = false; }
}

/* ---------- 화면 연결 ---------- */
async function initPromo() {
  if (!$('#pMake')) return;
  document.querySelectorAll('#pLen button').forEach((b) => (b.onclick = () => { STATE.seconds = Number(b.dataset.s); document.querySelectorAll('#pLen button').forEach((x) => x.classList.toggle('on', x === b)); }));
  document.querySelectorAll('#pFormat button').forEach((b) => (b.onclick = () => { STATE.format = b.dataset.f; document.querySelectorAll('#pFormat button').forEach((x) => x.classList.toggle('on', x === b)); }));
  $('#pMake').onclick = makePromo;
  try { const tracks = (await DB.all('tracks')).filter((t) => t.blob); $('#pBgm').innerHTML = '<option value="">없음</option>' + tracks.map((t) => `<option value="${esc(t.id)}">${esc(t.title || '내 음악')}</option>`).join(''); } catch { /* 저장소 없음 */ }
  const keys = await loadKeys().catch(() => ({}));
  const s = window.DCMedia ? window.DCMedia.status() : { photo: [], video: [], tts: [] };
  $('#pKeys').textContent = `대본·나레이션: ${keys.gemini ? 'Gemini 무료 키 연결됨' : '키 없음 (DARK CODE 설정에서 Gemini 키)'} · 실사 영상: ${s.video.length ? s.video.join('·') : '키 없음 → 실사 사진으로 대체 (Pexels 키 권장)'} · 사진: ${s.photo.join('·')}`;
  const q = new URLSearchParams(location.search);
  if (q.get('tab') === 'promo') {
    const btn = document.querySelector('#tabs [data-tab="promo"]'); if (btn) btn.click();
    if (q.get('q')) { $('#pPrompt').value = q.get('q'); if (q.get('auto') === '1') setTimeout(makePromo, 400); }
  }
}
window.DCPromo = { make: makePromo, srt, normalize };
initPromo();
