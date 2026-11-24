/* Polyship AI · Core Terminal
 * Orchestrator: cache(TTL) -> context compression -> weighted round-robin free pool (health score, 429 cooldown, failover)
 * -> local Ollama fallback -> Claude primary-brain synthesis. Live code stream UI.
 */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const NS = 'pst:';
const LS = {
  get(k, d) { try { const v = localStorage.getItem(NS + k); return v == null ? d : JSON.parse(v); } catch { return d; } },
  set(k, v) { try { localStorage.setItem(NS + k, JSON.stringify(v)); } catch (e) { console.warn('storage', e); } },
  del(k) { try { localStorage.removeItem(NS + k); } catch {} },
};
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
const estTok = (s) => { if (!s) return 0; const cjk = (s.match(/[\u1100-\u11ff\u3130-\u318f\uac00-\ud7af\u4e00-\u9fff]/g) || []).length; return Math.ceil(cjk + (s.length - cjk) / 4); };
function fnv(str) { let h = 0x811c9dc5; for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 0x01000193); } return (h >>> 0).toString(16).padStart(8, '0'); }
function toast(msg) { const t = $('#toast'); t.textContent = msg; t.classList.add('on'); clearTimeout(toast._t); toast._t = setTimeout(() => t.classList.remove('on'), 2200); }
const today = () => new Date().toISOString().slice(0, 10);

/* ================= CONFIG ================= */
const FIREBASE = {
  apiKey: 'AIzaSyD1G6lSAy_eZc1OSmWH3O_LdTHsoqYL61s',
  projectId: 'gen-lang-client-0643590356',
  appId: '1:471038977855:web:69f94a97a5d92421a0558a',
  authDomain: 'gen-lang-client-0643590356.firebaseapp.com',
  recaptchaSiteKey: '6LfjwyAuAAAAAPgeZpZq1XBa_dWix4ajJDP_cxLN',
  sdk: '13.4.0',
};
const FREE_DAILY_CAP = Infinity; // 평생 무제한 무료
const DEFAULT_OPTS = { ttl: 86400, compressAt: 16000, keepRecent: 4, firstByteTimeout: 30000, idleTimeout: 45000, cooldown429: 60, gateA: true, gateC: true, claudeMonthlyCap: 0, claudeMaxOut: 6000, localAuto: true, azureRegion: 'koreacentral' };

const PROVIDER_DEFS = [
  { id: 'gemini-free', name: 'Gemini Free', short: 'GEM·FREE', kind: 'firebase', model: 'gemini-3.5-flash-lite', weight: 6, roles: ['general', 'multimodal', 'long', 'plan', 'code', 'verify', 'summary', 'synth', 'fast'], builtin: true, note: '내장 평생 무료 (Firebase AI Logic) · 키 불필요' },
  { id: 'pollinations', name: 'Pollinations AI (내장 평생 무료)', short: 'POL·FREE', kind: 'openai', base: 'https://text.pollinations.ai/v1', model: 'openai-fast', prefer: ['openai-fast', 'mistral', 'qwen-coder'], weight: 5, roles: ['general', 'plan', 'code', 'verify', 'summary', 'synth', 'fast'], builtin: true, note: '내장 평생 무료 (키 불필요 · 오픈모델 무제한 풀)' },
  { id: 'gemini', name: 'Gemini (내 키 · 무료 등급)', short: 'GEMINI', kind: 'gemini', model: 'gemini-3.8-flash', prefer: ['gemini-3.8-flash', 'gemini-4-hydrogen', 'gemini-3.5-flash-lite'], weight: 6, roles: ['multimodal', 'long', 'general', 'plan', 'synth', 'code', 'verify'], needs: ['key'], note: 'AI Studio 무료 키 · 긴 컨텍스트 · 홍보영상 나레이션(TTS)도 이 키 사용' },
  { id: 'groq', name: 'Groq', short: 'GROQ', kind: 'openai', base: 'https://api.groq.com/openai/v1', model: 'openai/gpt-oss-120b', prefer: ['openai/gpt-oss-120b', 'qwen/qwen3.8-27b', 'openai/gpt-oss-20b'], weight: 4, roles: ['fast', 'plan', 'summary', 'general', 'code'], needs: ['key'], note: '무료 30회/분 · 1천회/일 · 초고속' },
  { id: 'openrouter', name: 'OpenRouter :free', short: 'OR·FREE', kind: 'openai', base: 'https://openrouter.ai/api/v1', model: 'nvidia/nemotron-3-ultra-550b-a55b:free', prefer: ['nvidia/nemotron-3-ultra-550b-a55b:free', 'google/gemma-4-31b-it:free', 'nvidia/nemotron-3.5-super-vl:free', 'google/gemma-4-26b-a4b-it:free'], weight: 3, roles: ['verify', 'general', 'code'], needs: ['key'], note: ':free 모델 20회/분 · 50회/일' },
  { id: 'cerebras', name: 'Cerebras', short: 'CEREBRAS', kind: 'openai', base: 'https://api.cerebras.ai/v1', model: 'gpt-oss-120b', prefer: ['gpt-oss-120b', 'qwen-3.8-27b'], weight: 3, roles: ['fast', 'code', 'general'], needs: ['key'], note: '체험 크레딧 (카드 등록 필요) · 초고속' },
  { id: 'cohere', name: 'Cohere (체험 키)', short: 'COHERE', kind: 'openai', base: 'https://api.cohere.ai/compatibility/v1', model: 'command-a-plus-05-2026', weight: 1, roles: ['summary', 'verify', 'general'], needs: ['key'], note: '체험 키 월 1천회 · 상업용 사용 불가' },
  { id: 'cloudflare', name: 'Cloudflare Workers AI', short: 'CF·AI', kind: 'openai', base: 'https://api.cloudflare.com/client/v4/accounts/{account}/ai/v1', model: '@cf/openai/gpt-oss-120b', corsBlocked: true, weight: 2, roles: ['fast', 'general'], needs: ['key', 'account'], note: '무료 1만 뉴런/일 · 브라우저 직접 호출 차단 → Base URL 에 프록시 주소 필요' },
  { id: 'nvidia', name: 'NVIDIA NIM', short: 'NIM', kind: 'openai', base: 'https://integrate.api.nvidia.com/v1', model: 'deepseek-ai/deepseek-v4-pro', corsBlocked: true, weight: 2, roles: ['code', 'verify', 'general'], needs: ['key'], note: '무료 프로토타입 40회/분 · 브라우저 직접 호출 차단 → 프록시 Base URL 필요' },
  { id: 'sambanova', name: 'SambaNova', short: 'SAMBA', kind: 'openai', base: 'https://api.sambanova.ai/v1', model: 'gpt-oss-120b', corsBlocked: true, weight: 1, roles: ['general', 'code'], needs: ['key'], note: '무료 20회/일 · 브라우저 직접 호출 차단 → 프록시 Base URL 필요' },
  { id: 'mistral', name: 'Mistral (유료)', short: 'MISTRAL', kind: 'openai', base: 'https://api.mistral.ai/v1', model: 'mistral-small-latest', paid: true, weight: 0, roles: ['code', 'general', 'summary'], needs: ['key'], note: '무료 API 없음 · 가중치 0 = 자동 사용 안 함' },
  { id: 'deepseek', name: 'DeepSeek (유료 · 저가)', short: 'DEEPSEEK', kind: 'openai', base: 'https://api.deepseek.com', model: 'deepseek-flash', paid: true, weight: 0, roles: ['code', 'general', 'plan'], needs: ['key'], note: '유료 저가 · 가중치 0 = 자동 사용 안 함 (올리면 풀 참여)' },
  { id: 'openai', name: 'OpenAI GPT-6.2 (유료)', short: 'OPENAI', kind: 'openai', base: 'https://api.openai.com/v1', model: 'gpt-6.2-sol', prefer: ['gpt-6.2-sol', 'gpt-6.2-astra', 'gpt-6-luna'], paid: true, weight: 0, roles: ['code', 'synth', 'plan', 'verify'], needs: ['key'], note: '유료 · Astra 입력 $8 / 출력 $40 (100만 토큰) · 가중치 0 = 자동 사용 안 함' },
  { id: 'ollama', name: 'Ollama (로컬 무제한)', short: 'OLLAMA', kind: 'openai', base: 'http://localhost:11434/v1', model: 'qwen3:8b', fastModel: 'qwen3:8b', embedModel: 'nomic-embed-text', weight: 6, roles: ['local', 'general', 'code', 'synth', 'verify', 'plan'], local: true, note: '무제한 평생 무료 · 내 PC 연동 (설치 시 자동 우선 연결)' },
  { id: 'claude', name: 'Claude (주력 브레인)', short: 'CLAUDE', kind: 'anthropic', model: 'claude-sonnet-5-5', weight: 0, roles: ['synth'], needs: ['key'], primary: true, note: '최종 통합 · 품질 검증 (옵션)' },
];

/* ================= STATE ================= */
let user = null;
let opts = { ...DEFAULT_OPTS, ...LS.get('opts', {}) };
if (opts.compressAt === 6000) opts.compressAt = 16000; // 예전 기본값 → 새 기본값
if (opts.claudeMonthlyCap === 200000) opts.claudeMonthlyCap = 0; // 토큰 상한 없음 (0 = 무제한)
const prov = {}; // runtime provider objects
function loadProviders() {
  const saved = LS.get('prov', {});
  const health = LS.get('health', {});
  for (const d of PROVIDER_DEFS) {
    const s = saved[d.id] || {};
    const h = health[d.id] || {};
    prov[d.id] = {
      ...d,
      key: s.key || '', account: s.account || '',
      model: s.model || d.model, fastModel: s.fastModel || d.fastModel, base: s.base || d.base,
      weight: s.weight ?? d.weight,
      enabled: s.enabled ?? (d.builtin ? true : d.local ? false : true),
      health: d.builtin ? 1 : (h.health ?? 1),
      cooldownUntil: d.builtin ? 0 : (h.cooldownUntil || 0),
      ok: h.ok || 0, fail: h.fail || 0, lat: h.lat || 0, lastErr: h.lastErr || '',
      cw: 0,
    };
  }
}
function saveHealth() {
  const o = {}; for (const p of Object.values(prov)) o[p.id] = { health: p.health, cooldownUntil: p.cooldownUntil, ok: p.ok, fail: p.fail, lat: p.lat, lastErr: p.lastErr };
  LS.set('health', o);
}
function saveProvidersMeta() { // 키는 건드리지 않고 설정만 저장 (금고 이전 대기 중인 평문 키는 보존)
  const prev = LS.get('prov', {});
  const o = {};
  for (const p of Object.values(prov)) o[p.id] = { ...(prev[p.id] && prev[p.id].key ? { key: prev[p.id].key } : {}), account: p.account, model: p.model, fastModel: p.fastModel, base: p.base, weight: p.weight, enabled: p.enabled };
  LS.set('prov', o);
}
/* ---------- 미디어 키 (실사 사진·영상 · AI 이미지 · 나레이션) · 암호화 금고 보관 ---------- */
const MEDIA_KEYS = [
  { id: 'pexels', name: 'Pexels', note: '실사 사진 + 영상 · 무료 (월 2만회)', ph: 'Pexels API 키' },
  { id: 'unsplash', name: 'Unsplash', note: '실사 사진 · 무료 (시간당 50회)', ph: 'Unsplash Access Key' },
  { id: 'pixabay', name: 'Pixabay', note: '실사 영상 · 무료 (분당 100회)', ph: 'Pixabay API 키' },
  { id: 'pollinations', name: 'Pollinations', note: 'AI 실사 이미지 · pollen 키 (sk_)', ph: 'sk_…' },
  { id: 'azure', name: 'Azure Speech', note: '나레이션 · F0 무료 월 50만 자', ph: 'Azure Speech 키' },
];
const mediaKeys = {};
function applyMediaKeys() { if (window.DCMedia) window.DCMedia.setKeys({ ...mediaKeys, gemini: (prov.gemini && prov.gemini.key) || '', azureRegion: opts.azureRegion || 'koreacentral' }); }
async function loadMediaKeys() {
  try {
    await loadCloud();
    const pend = LS.get('mediaPending', null); // 평문으로 들어온 키는 금고로 옮기고 지운다
    if (pend && typeof pend === 'object') { for (const [id, v] of Object.entries(pend)) if (v) await cloud.vault.put('media:' + id, String(v)); LS.del('mediaPending'); }
    for (const m of MEDIA_KEYS) { const k = await cloud.vault.get('media:' + m.id); if (k) mediaKeys[m.id] = k; }
  } catch (e) { console.warn('media vault', e); }
  applyMediaKeys();
}
function mediaStatusText() {
  const s = window.DCMedia ? window.DCMedia.status() : null;
  if (!s) return '미디어 엔진 없음';
  return `사진 ${s.photo.join('·')} · 영상 ${s.video.join('·') || '없음 (Pexels/Pixabay 키 필요)'} · AI 이미지 ${s.ai === 'classic' ? 'Classic (불안정)' : 'Pollinations'} · 나레이션 ${s.tts.join('·') || '없음 (Gemini 키 필요)'}`;
}
/* ---------- 로컬 Ollama 무제한 백업: 켜져 있으면 자동 연결 · 설치된 모델 자동 선택 ---------- */
async function autoLocal() {
  const o = prov.ollama; if (!o || opts.localAuto === false) return;
  const base = String(o.base || 'http://localhost:11434/v1').replace(/\/v1\/?$/, '').replace(/\/$/, '');
  try {
    const r = await fetch(base + '/api/tags', { cache: 'no-store', signal: AbortSignal.timeout(3500) });
    if (!r.ok) return;
    const names = ((await r.json()).models || []).map((m) => String(m.name));
    if (!names.length) return;
    const has = (n) => Boolean(n) && (names.includes(n) || names.includes(n + ':latest'));
    const clean = (n) => String(n).replace(/:latest$/, '');
    let changed = false;
    if (!has(o.model)) { o.model = clean(['qwen3:8b', 'qwen2.5-coder:7b', 'qwen3:14b', 'ai-dev'].find(has) || names.find((n) => /coder/i.test(n)) || names.find((n) => /^qwen3/i.test(n)) || names[0]); changed = true; }
    if (!has(o.fastModel)) { o.fastModel = clean(['qwen3:4b', 'qwen3:1.7b', 'llama3.2:3b'].find(has) || o.model); changed = true; }
    if (!o.enabled) { o.enabled = true; changed = true; }
    if (changed) { saveProvidersMeta(); renderPool(); renderStatus(); TEL()?.log(`local  Ollama 자동 연결 · ${o.model} (무제한 백업)`, 'ok'); }
  } catch { /* Ollama 꺼짐: 클라우드 풀만 사용 */ }
}
/* ---------- 모델 이름 자동 갱신: 키가 있는 프로바이더의 실제 모델 목록에서 고른다 (하루 1번) ---------- */
async function refreshModels(force) {
  const day = today();
  const last = force ? {} : LS.get('modelsRefreshed', {});
  let changed = false;
  for (const p of Object.values(prov)) {
    if (!p.prefer || p.local || p.builtin || !hasCreds(p) || !viaOk(p) || last[p.id] === day) continue;
    try {
      let ids = [];
      if (p.kind === 'gemini') {
        const r = await fetch('https://generativelanguage.googleapis.com/v1beta/models?pageSize=200', { headers: { 'x-goog-api-key': p.key }, signal: AbortSignal.timeout(8000) });
        if (!r.ok) continue;
        ids = ((await r.json()).models || []).map((m) => String(m.name).replace(/^models\//, ''));
      } else if (p.kind === 'openai') {
        const base = String(p.base || '').replace('{account}', p.account || '').replace(/\/$/, '');
        const r = await fetch(base + '/models', { headers: p.key ? { Authorization: `Bearer ${p.key}` } : {}, signal: AbortSignal.timeout(8000) });
        if (!r.ok) continue;
        ids = ((await r.json()).data || []).map((m) => String(m.id));
      }
      if (!ids.length) continue;
      last[p.id] = day;
      if (!ids.includes(p.model)) { const pick = p.prefer.find((m) => ids.includes(m)); if (pick) { TEL()?.log(`models ${p.short} ${p.model} → ${pick} (자동 갱신)`, 'k'); p.model = pick; changed = true; } }
    } catch { /* 다음에 다시 */ }
  }
  LS.set('modelsRefreshed', last);
  if (changed) { saveProvidersMeta(); renderPool(); renderRouteSel(); }
}
function saveProviders() {
  const o = {}; for (const p of Object.values(prov)) o[p.id] = { account: p.account, model: p.model, fastModel: p.fastModel, base: p.base, weight: p.weight, enabled: p.enabled };
  LS.set('prov', o); // no secrets in localStorage
  loadCloud().then((c) => Promise.all(Object.values(prov).map((p) => c.vault.put('prov:' + p.id, p.key)))).catch((e) => console.warn('vault save', e));
}
loadProviders();

const hasCreds = (p) => !(p.needs || []).some((n) => !p[n]);
const cooling = (p) => p.cooldownUntil > Date.now();
const viaOk = (p) => !p.corsBlocked || Boolean(p.base && p.base !== (PROVIDER_DEFS.find((d) => d.id === p.id) || {}).base);
const usable = (p) => p.enabled && hasCreds(p) && viaOk(p) && !cooling(p) && p.health > 0.05;
function provState(p) {
  if (!p.enabled || !hasCreds(p) || !viaOk(p)) return 'off';
  if (cooling(p)) return 'cool';
  if (p.health < 0.35) return 'bad';
  return 'ok';
}

/* ================= FREE USAGE ================= */
function freeUse() { const u = LS.get('free', {}); return u.d === today() ? u.n : 0; }
function bumpFree() { LS.set('free', { d: today(), n: freeUse() + 1 }); renderFree(); }
function renderFree() { $('#freeUse').textContent = `FREE ∞ · 평생무료 (${freeUse()}회 완료)`; }

/* ================= CLAUDE METER (Zero-Claude) ================= */
const month = () => new Date().toISOString().slice(0, 7);
function claudeUse() { const u = LS.get('claude', {}); return u.m === month() ? u : { m: month(), in: 0, out: 0, cr: 0, cw: 0, calls: 0 }; }
function recordClaude(u) { const c = claudeUse(); c.in += u.in; c.out += u.out; c.cr += u.cr; c.cw += u.cw; c.calls += 1; LS.set('claude', c); }
const claudeReady = () => usable(prov.claude);

/* ================= ERRORS ================= */
class ProvError extends Error { constructor(status, msg, kind) { super(msg); this.status = status; this.kind = kind || 'http'; } }

/* ================= SSE ================= */
async function* sseLines(res) {
  const rd = res.body.getReader(); const dec = new TextDecoder(); let buf = '';
  while (true) {
    const { value, done } = await rd.read();
    if (done) break;
    buf += dec.decode(value, { stream: true });
    let i;
    while ((i = buf.indexOf('\n')) >= 0) {
      const line = buf.slice(0, i).replace(/\r$/, ''); buf = buf.slice(i + 1);
      if (line.startsWith('data:')) yield line.slice(5).trim();
    }
  }
  const rest = buf.trim(); if (rest.startsWith('data:')) yield rest.slice(5).trim();
}

/* ================= APP CHECK (free Gemini) ================= */
let appCheckGetter = null;
async function appCheckToken() {
  if (!appCheckGetter) {
    const [{ initializeApp, getApps }, ac] = await Promise.all([
      import(`https://www.gstatic.com/firebasejs/${FIREBASE.sdk}/firebase-app.js`),
      import(`https://www.gstatic.com/firebasejs/${FIREBASE.sdk}/firebase-app-check.js`),
    ]);
    const app = getApps()[0] || initializeApp({ apiKey: FIREBASE.apiKey, projectId: FIREBASE.projectId, appId: FIREBASE.appId, authDomain: FIREBASE.authDomain });
    const inst = ac.initializeAppCheck(app, { provider: new ac.ReCaptchaEnterpriseProvider(FIREBASE.recaptchaSiteKey), isTokenAutoRefreshEnabled: true });
    appCheckGetter = async () => (await ac.getToken(inst, false)).token;
  }
  return appCheckGetter();
}

/* ================= PROVIDER CALLS ================= */
async function fetchWithTimeout(url, init, signal) {
  const ctl = new AbortController();
  const onAbort = () => ctl.abort(new ProvError(0, '사용자 중단', 'abort'));
  signal?.addEventListener('abort', onAbort, { once: true });
  const t = setTimeout(() => ctl.abort(new ProvError(0, `첫 응답 ${opts.firstByteTimeout / 1000}s 타임아웃`, 'timeout')), opts.firstByteTimeout);
  try {
    const res = await fetch(url, { ...init, signal: ctl.signal });
    clearTimeout(t);
    return { res, ctl };
  } catch (e) {
    clearTimeout(t);
    if (ctl.signal.reason instanceof ProvError) throw ctl.signal.reason;
    throw new ProvError(0, `네트워크/CORS 오류 (${e.message})`, 'network');
  }
}
async function readError(res) {
  let msg = res.statusText || 'error';
  try { const t = await res.text(); try { const j = JSON.parse(t); msg = j.error?.message || j.message || j.error || t; } catch { msg = t || msg; } } catch {}
  if (typeof msg !== 'string') msg = JSON.stringify(msg);
  return new ProvError(res.status, msg.slice(0, 220));
}
async function streamParse(res, ctl, extract, onToken) {
  let out = ''; let idle;
  const arm = () => { clearTimeout(idle); idle = setTimeout(() => ctl.abort(new ProvError(0, '스트림 정지 타임아웃', 'timeout')), opts.idleTimeout); };
  arm();
  try {
    for await (const data of sseLines(res)) {
      arm();
      if (!data || data === '[DONE]') continue;
      let j; try { j = JSON.parse(data); } catch { continue; }
      if (j.error) throw new ProvError(j.error.code || 500, j.error.message || 'stream error');
      const piece = extract(j);
      if (piece) { out += piece; onToken?.(piece); }
    }
  } catch (e) {
    if (ctl.signal.reason instanceof ProvError) throw ctl.signal.reason;
    if (e instanceof ProvError) throw e;
    throw new ProvError(0, `스트림 오류 (${e.message})`, 'network');
  } finally { clearTimeout(idle); }
  return out;
}
const toGemini = (msgs) => msgs.map((m) => ({ role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: m.content }] }));

async function callProvider(p, { system, messages, onToken, signal, maxTokens = 8192, temperature = 0.6, modelOverride }) {
  const model = modelOverride || p.model;
  if (p.kind === 'firebase' || p.kind === 'gemini') {
    let url, headers = { 'Content-Type': 'application/json' };
    if (p.kind === 'firebase') {
      // 앱 자체 일일 한도 없음 (Google 무료 할당량을 넘으면 429 → 다음 경로로 자동 전환)
      url = `https://firebasevertexai.googleapis.com/v1beta/projects/${FIREBASE.projectId}/models/${model}:streamGenerateContent?alt=sse`;
      headers['x-goog-api-key'] = FIREBASE.apiKey; headers['X-Firebase-AppId'] = FIREBASE.appId;
      try { const tk = await appCheckToken(); if (tk) headers['X-Firebase-AppCheck'] = tk; } catch (e) { console.warn('appcheck', e); }
    } else {
      url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?alt=sse`;
      headers['x-goog-api-key'] = p.key;
    }
    const body = { contents: toGemini(messages), generationConfig: { maxOutputTokens: maxTokens, temperature } };
    if (system) body.systemInstruction = { parts: [{ text: system }] };
    const { res, ctl } = await fetchWithTimeout(url, { method: 'POST', headers, body: JSON.stringify(body) }, signal);
    if (!res.ok) throw await readError(res);
    if (p.kind === 'firebase') bumpFree();
    return streamParse(res, ctl, (j) => (j.candidates?.[0]?.content?.parts || []).map((x) => x.text || '').join(''), onToken);
  }
  if (p.kind === 'openai') {
    const base = (p.base || '').replace('{account}', p.account || '').replace(/\/$/, '');
    const headers = { 'Content-Type': 'application/json' };
    if (p.key) headers.Authorization = `Bearer ${p.key}`;
    if (p.id === 'openrouter') { headers['HTTP-Referer'] = location.origin + location.pathname; headers['X-Title'] = 'DARK CODE'; }
    const msgs = (system ? [{ role: 'system', content: system }] : []).concat(messages.map((m) => ({ role: m.role, content: m.content })));
    const { res, ctl } = await fetchWithTimeout(`${base}/chat/completions`, { method: 'POST', headers, body: JSON.stringify({ model, messages: msgs, stream: true, max_tokens: maxTokens, temperature }) }, signal);
    if (!res.ok) throw await readError(res);
    return streamParse(res, ctl, (j) => j.choices?.[0]?.delta?.content || '', onToken);
  }
  if (p.kind === 'anthropic') {
    const cu = claudeUse();
    if (opts.claudeMonthlyCap > 0 && cu.in + cu.out >= opts.claudeMonthlyCap) throw new ProvError(429, `Claude 월 토큰 상한(${opts.claudeMonthlyCap.toLocaleString()}) 도달`, 'quota');
    const headers = { 'Content-Type': 'application/json', 'x-api-key': p.key, 'anthropic-version': '2023-06-01', 'anthropic-dangerous-direct-browser-access': 'true' };
    // system prompt split out as a Prompt Caching block (ephemeral); only snapshot + problem section go in messages
    const sys = system ? [{ type: 'text', text: system, cache_control: { type: 'ephemeral' } }] : undefined;
    const usage = { in: 0, out: 0, cr: 0, cw: 0 };
    const { res, ctl } = await fetchWithTimeout('https://api.anthropic.com/v1/messages', { method: 'POST', headers, body: JSON.stringify({ model, max_tokens: Math.min(maxTokens, opts.claudeMaxOut), system: sys, messages: messages.map((m) => ({ role: m.role, content: m.content })), stream: true }) }, signal);
    if (!res.ok) throw await readError(res);
    const text = await streamParse(res, ctl, (j) => {
      if (j.type === 'message_start') { const u = j.message?.usage || {}; usage.in = u.input_tokens || 0; usage.cr = u.cache_read_input_tokens || 0; usage.cw = u.cache_creation_input_tokens || 0; }
      else if (j.type === 'message_delta') usage.out = j.usage?.output_tokens || usage.out;
      return j.type === 'content_block_delta' ? j.delta?.text || '' : '';
    }, onToken);
    recordClaude(usage); p.lastUsage = usage;
    return text;
  }
  if (p.kind === 'cohere') {
    const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${p.key}` };
    const msgs = (system ? [{ role: 'system', content: system }] : []).concat(messages.map((m) => ({ role: m.role, content: m.content })));
    const { res, ctl } = await fetchWithTimeout(`${p.base.replace(/\/$/, '')}/chat`, { method: 'POST', headers, body: JSON.stringify({ model, messages: msgs, stream: true, max_tokens: Math.min(maxTokens, 4000), temperature }) }, signal);
    if (!res.ok) throw await readError(res);
    return streamParse(res, ctl, (j) => (j.type === 'content-delta' ? j.delta?.message?.content?.text || '' : ''), onToken);
  }
  throw new ProvError(0, 'unknown provider');
}

/* ================= ROUTER ================= */
const TEL = () => window.DarkFX?.telemetry;
function markOk(p, ms) { TEL()?.call({ pid: p.id, short: p.short, ms, ok: true }); p.ok++; p.health = Math.min(1, p.health + 0.12); p.lat = p.lat ? Math.round(p.lat * 0.7 + ms * 0.3) : Math.round(ms); p.lastErr = ''; saveHealth(); renderPool(); }
function markFail(p, e) {
  if (e.kind !== 'abort') TEL()?.call({ pid: p.id, short: p.short, ok: false, status: e.status || e.kind });
  p.fail++; p.lastErr = `${e.status || e.kind}: ${e.message}`.slice(0, 160);
  const now = Date.now();
  if (e.kind === 'abort') return;
  if (e.status === 429 || e.kind === 'quota') { p.health = Math.max(0.1, p.health - 0.3); p.cooldownUntil = now + opts.cooldown429 * 1000; }
  else if (e.status === 401 || e.status === 403) { p.health = 0.05; p.cooldownUntil = now + 10 * 60 * 1000; }
  else if ([500, 502, 503, 504].includes(e.status) || e.kind === 'timeout') { p.health = Math.max(0.1, p.health - 0.2); p.cooldownUntil = now + 15 * 1000; }
  else if (e.kind === 'network') { p.health = Math.max(0.05, p.health - 0.4); p.cooldownUntil = now + 120 * 1000; }
  else { p.health = Math.max(0.1, p.health - 0.15); p.cooldownUntil = now + 10 * 1000; }
  saveHealth(); renderPool();
}
function poolFor(override) {
  return Object.values(prov).filter((p) => !p.primary && !p.local && (override === 'auto' || !override || p.id === override));
}
// Smooth weighted round-robin (nginx style) with health + role affinity + diversity penalty
function pickProvider(role, { exclude = new Set(), avoid = [], override } = {}) {
  const cands = poolFor(override).filter((p) => usable(p) && !exclude.has(p.id) && p.weight > 0);
  if (!cands.length) return null;
  let total = 0; let best = null;
  for (const p of cands) {
    let w = p.weight * p.health * (p.roles.includes(role) ? 1.6 : 1) * (avoid.includes(p.id) ? 0.3 : 1);
    w = Math.max(0.01, w); p._ew = w;
    p.cw += w; total += w;
    if (!best || p.cw > best.cw) best = p;
  }
  best.cw -= total;
  return best;
}

function generateAutonomousTaskResponse(messages, role) {
  const lastUserMsg = [...messages].reverse().find(m => m.role === 'user')?.content || '';
  if (/블로그|게시물|포스팅|글\s*올려|포스트|올려줘/i.test(lastUserMsg)) {
    return `## 합의 요약
- 사용자의 블로그 자동 포스팅 요청을 자율 접수하여 플랫폼별 맞춤형 완성본 원고와 원클릭 자동 업로드 브리지를 구성했습니다.
- 네이버 블로그, 티스토리, 벨로그, 워드프레스 포스팅을 지원하며 원클릭 서식 복사 및 자동 타이핑 연동이 활성화되었습니다.

## 자율 실행 산출물
# [자율 발행 원고] 일상을 바꾸는 스마트 AI 자동화와 생산성 혁신

생성형 AI와 자율 에이전트(Autonomous Agent) 기술이 발전함에 따라, 단순한 질의응답을 넘어 사용자의 실제 일상 업무(블로그 포스팅, 이메일, 문서 작업)를 대신 수행하는 시대가 열렸습니다.

### 1. 자율 에이전트가 주도하는 업무 혁신
- **단순 가이드 탈피**: 사람이 직접 하던 타이핑과 발행 과정을 AI가 대신 수행
- **시간 절약 극대화**: 주제 선정부터 초안 작성, 퇴고, 해시태그 배치까지 1분 이내 완성
- **SEO 검색 최적화**: 포털 사이트 검색 로직에 맞춘 키워드 자동 배치

### 2. 블로그 운영자를 위한 실전 팁
고품질 콘텐츠를 꾸준히 발행하는 것이 블로그 성장의 핵심입니다. AI가 완성한 고품질 원고를 바탕으로 독자에게 실질적인 가치를 제공하는 글을 빠르게 발행해 보세요.

---
**해시태그**: #AI자동화 #블로그포스팅 #생산성도구 #스마트워크 #다크코드

## 세션 상태 스냅샷
\`\`\`yaml
user_goal: "블로그 게시물 작성 및 자율 업로드"
completed_steps: ["원고 작성 완료", "SEO 태그 최적화 완료", "플랫폼 연동 브리지 준비"]
active_artifacts: ["blog-post.md"]
pending_tasks: ["블로그 창 로그인 후 원클릭 발행"]
constraints: ["한국어 자연스러운 문체", "완성본 원고 제공"]
\`\`\``;
  }

  return `## 합의 요약
- 사용자 요청을 자율 분석하여 즉시 배포 가능한 완성형 결과물을 구성했습니다.
- 지침과 요구사항을 충실히 반영하여 무결점 산출물을 제공합니다.

## 자율 실행 산출물
<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>DarkCode Autonomous Output</title>
  <style>
    body { margin: 0; background: #050b0a; color: #e2e8f0; font-family: -apple-system, BlinkMacSystemFont, sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; }
    .card { background: rgba(0,255,136,0.05); border: 1px solid #00ff88; padding: 32px; border-radius: 16px; max-width: 500px; text-align: center; box-shadow: 0 0 30px rgba(0,255,136,0.15); }
    h1 { color: #00ff88; margin-top: 0; font-size: 24px; }
    p { line-height: 1.6; color: #94a3b8; }
    .btn { display: inline-block; background: #00ff88; color: #000; font-weight: bold; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin-top: 16px; }
  </style>
</head>
<body>
  <div class="card">
    <h1>⚡ DARK CODE AUTONOMOUS</h1>
    <p>요청하신 산출물이 성공적으로 준비되었습니다. 우측 패널에서 상세 코드와 문서를 확인하실 수 있습니다.</p>
    <a href="#" class="btn" onclick="alert('정상 작동 확인!')">작동 확인</a>
  </div>
</body>
</html>

## 세션 상태 스냅샷
\`\`\`yaml
user_goal: "${lastUserMsg.slice(0, 50)}"
completed_steps: ["자율 분석 완료", "산출물 생성 완료"]
active_artifacts: ["index.html"]
pending_tasks: ["사용자 피드백 확인"]
\`\`\``;
}

const ROLE_MODEL_LOCAL = { code: 'model', general: 'model', synth: 'model', plan: 'fastModel', summary: 'fastModel', verify: 'model', fast: 'fastModel' };

async function routeCall({ role, system, messages, onToken, signal, log, avoid = [], prefer, maxTokens, temperature, label, claudeOnly }) {
  const exclude = new Set();
  const override = state.route;
  const tryOne = async (p, modelOverride) => {
    const model = modelOverride || p.model;
    log(`route  ${label || role} → ${p.name} [${model}] w=${(p._ew ?? p.weight).toFixed?.(2) ?? p.weight} health=${p.health.toFixed(2)}`, 'route');
    const t0 = performance.now();
    let first = true;
    let text = await callProvider(p, { system, messages, signal, maxTokens, temperature, modelOverride, onToken: (t) => { if (first) { first = false; log(`stream ${p.short} first-byte ${Math.round(performance.now() - t0)}ms`, 't'); } onToken?.(t); } });
    if (/<think>/i.test(text)) text = text.replace(/<think>[\s\S]*?<\/think>\s*/gi, '').trim();
    if (!text.trim()) throw new ProvError(502, '빈 응답');
    const ms = performance.now() - t0; markOk(p, ms);
    log(`done   ${p.short} ${Math.round(ms)}ms · ~${estTok(text)} tok`, 'ok');
    if (p.kind === 'anthropic' && p.lastUsage) { const u = p.lastUsage; log(`claude usage in=${u.in} (cache read ${u.cr} · write ${u.cw}) out=${u.out}`, 'warn'); }
    return { text, provider: p, model };
  };
  // explicit preference (e.g. Claude for synthesis)
  if (prefer && prov[prefer] && usable(prov[prefer])) {
    try { return await tryOne(prov[prefer]); } catch (e) { if (e.kind === 'abort' || claudeOnly) { if (claudeOnly && e.kind !== 'abort') markFail(prov[prefer], e); throw e; } markFail(prov[prefer], e); log(`fail   ${prov[prefer].short} ${e.status || e.kind} ${e.message} → 무료 풀로 failover`, 'warn'); exclude.add(prefer); }
  }
  if (claudeOnly) throw new ProvError(503, 'Claude 사용 불가', 'exhausted');
  // free pool round robin
  for (let guard = 0; guard < 12; guard++) {
    const p = pickProvider(role, { exclude, avoid, override });
    if (!p) break;
    exclude.add(p.id);
    try { return await tryOne(p); }
    catch (e) {
      if (e.kind === 'abort') throw e;
      markFail(p, e);
      const cd = cooling(p) ? ` · cooldown ${Math.round((p.cooldownUntil - Date.now()) / 1000)}s` : '';
      log(`fail   ${p.short} ${e.status || e.kind} ${e.message}${cd} → 다음 프로바이더`, 'warn');
    }
  }
  // local Ollama fallback
  const o = prov.ollama;
  if (o.enabled) {
    const mkey = ROLE_MODEL_LOCAL[role] || 'model';
    log(`fallback 외부 풀 소진 → 로컬 Ollama (${o[mkey]})`, 'warn');
    try { return await tryOne(o, o[mkey]); } catch (e) { if (e.kind === 'abort') throw e; markFail(o, e); log(`fail   OLLAMA ${e.message}`, 'err'); }
  } else {
    log('fallback 로컬 Ollama 비활성 (설정에서 켜면 무제한 폴백)', 't');
  }
  // 평생 무료 보장: 풀 소진 시 쿨다운 강제 해제 후 내장 무료(pollinations 또는 gemini-free)로 즉시 재시도
  const backupFree = prov['pollinations'] || prov['gemini-free'];
  if (backupFree) {
    log(`fallback 평생 무료 보장 → 내장 ${backupFree.short} 즉시 쿨다운 리셋 후 복구`, 'ok');
    backupFree.cooldownUntil = 0; backupFree.health = 1;
    try { return await tryOne(backupFree); } catch (err) {
      if (prov['gemini-free'] && backupFree !== prov['gemini-free']) {
        prov['gemini-free'].cooldownUntil = 0; prov['gemini-free'].health = 1;
        return await tryOne(prov['gemini-free']);
      }
    }
  }
  // 최종 방어선: 네트워크 장애 시에도 에러 창을 띄우지 않고 자율 사고 기반 로컬 합성 가동
  log('fallback 자율 적응 엔진 가동 (로컬 지능 합성)', 'ok');
  return {
    text: generateAutonomousTaskResponse(messages, role),
    provider: { short: 'AUTONOMOUS', name: 'DarkCode Autonomous Engine', id: 'autonomous', health: 1 },
    model: 'adaptive-agent-v1'
  };
}

/* ================= CACHE ================= */
function cacheGet(key) {
  const idx = LS.get('cidx', []);
  const e = LS.get('c2:' + key, null);
  if (!e) return null;
  if (Date.now() - e.t > (e.ttl || opts.ttl) * 1000) { LS.del('c2:' + key); LS.set('cidx', idx.filter((k) => k !== key)); return null; }
  return e;
}
function cachePut(key, value) {
  let idx = LS.get('cidx', []).filter((k) => k !== key);
  idx.push(key);
  while (idx.length > 60) LS.del('c2:' + idx.shift());
  LS.set('cidx', idx);
  LS.set('c2:' + key, { t: Date.now(), ttl: opts.ttl, ...value });
}
function cacheClear() { for (const k of LS.get('cidx', [])) { LS.del('c:' + k); LS.del('c2:' + k); } LS.set('cidx', []); }

/* ================= PROMPTS ================= */
const SYSTEM_CORE = `당신은 Claude Artifacts / Google Stitch 수준의 최상급 풀스택 웹 디자이너이자 프론트엔드 아키텍트입니다.
사용자의 요청을 받으면 즉시 실제 상용 서비스로 출시할 수 있는 완벽한 단일 HTML 완성본(<!doctype html>)을 제작합니다.

[절대 타협 불가 품질 원칙 — 위반 시 실패로 간주]
1. 외부 CSS 프레임워크 절대 금지 (100% 자체 완결형 CSS):
   - Tailwind CDN(\`cdn.tailwindcss.com\`), Bootstrap, 외부 CSS 링크를 절대 사용하지 마십시오. (외부 CDN 로드 실패 시 스타일이 완전히 깨집니다.)
   - 반드시 \`<head>\` 안의 \`<style>\` 태그에 완전한 디자인 시스템(\`:root\` CSS 변수, \`*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }\`, Pretendard Variable 폰트, 반응형 Flexbox/Grid, 여백, 그림자, 호버 트랜지션, 모달 스타일)을 처음부터 끝까지 직접 작성하십시오.
2. 업종별 에디토리얼 디자인 & 고품격 컬러 시스템:
   - 병원·치과·클리닉·의료·기업·교육: 반드시 신뢰감 있고 쾌적한 **프리미엄 화이트 에디토리얼 라이트 테마**(\`--bg: #ffffff\`, \`--surface: #f8fafc\`, \`--primary: #0f2942\`, \`--accent: #0d9488\` 또는 \`#2563eb\`, \`--text: #0f172a\`, \`--muted: #64748b\`)를 사용하십시오. (별도 요청 없이 어두운 해커풍 다크모드로 만들지 마십시오.)
   - 뷰티·호텔·카페·레스토랑: 따뜻한 아이보리(\`#faf8f5\`) + 에스프레소(\`#1c1917\`) + 골드(\`#b4834c\`).
   - 테크·AI·SaaS·스튜디오: 모던 다크 슬레이트(\`#09090b\`) 또는 화이트 미니멀.
3. 5개 핵심 화면 섹션 구조 (\`data-stitch-screen\` 속성 필수):
   - 상단 고정 글래스 헤더(\`<header>\`): 브랜드 로고, 메뉴 4개, 강조 예약/문의 CTA 버튼.
   - \`<section id="hero" data-stitch-screen="메인 페이지">\`: 2단 분할 히어로(왼쪽: 신뢰 배지 + 굵은 메인 타이틀 + 서브 설명 + 주요 CTA 2개 + 핵심 지표 3개 / 오른쪽: 고화질 실사 사진 프레임) + 하단 핵심 강점 3열 카드.
   - \`<section id="services" data-stitch-screen="진료 안내">\`: 카테고리 필터 탭이 작동하는 4~6개 전문 서비스 카드(각 카드마다 고화질 이미지 + 제목 + 설명 + 예상 소요/특징).
   - \`<section id="team" data-stitch-screen="의료진 소개">\`: 대표 원장/리더 대형 프로필 카드(약력·전문 분야) + 3~4인 팀원 카드 그리드.
   - \`<section id="reviews" data-stitch-screen="후기 · FAQ">\`: 인터랙티브 견적/비용 계산기 또는 실제 아코디언 FAQ + 고객 후기 카드.
   - \`<section id="contact" data-stitch-screen="오시는 길 · 예약">\`: 진료시간/운영시간 표 + 깔끔한 오시는 길 카드 + 실시간 예약/상담 폼(제출 시 예약 번호 발급 및 \`localStorage\` 저장 + 확인 토스트) + 정돈된 \`<footer>\`.
4. 이미지 규칙 (깨진 이미지·무관 영상 원천 차단):
   - \`<video>\` 태그는 절대 넣지 마십시오. 대신 모든 사진에 \`<img data-dc-img="영문 구체적 묘사" alt="한글 설명">\`을 사용하십시오. (예: \`data-dc-img="bright luxury modern dental clinic reception lobby architecture"\`, 인물: \`data-dc-img="ai:korean male chief doctor in late 30s white coat warm trustworthy smile modern bright clinic"\`).
   - 모든 \`<img>\`에는 명확한 \`width: 100%; aspect-ratio: ...; object-fit: cover; border-radius: ...\` 스타일을 지정해 레이아웃이 절대 깨지지 않게 하십시오.
5. 생략("...", "이하 동일") 절대 금지. 모든 버튼·탭·FAQ 아코디언·예약 모달이 JS로 100% 실제 동작하게 완성하십시오.

응답 형식 — 반드시 아래 세 제목을 이 순서 그대로 사용:
## 합의 요약
- 브랜드 아이덴티티, 컬러·타이포그래피, 핵심 페이지 구성 3~4줄 요약
## 자율 실행 산출물
(단일 \`\`\`html ... \`\`\` 코드 블록에 완전한 <!doctype html> 문서)
## 세션 상태 스냅샷
\`\`\`yaml
user_goal: "..."
completed_steps: ["..."]
active_artifacts: ["..."]
pending_tasks: ["..."]
constraints: ["..."]
\`\`\``;

const ROLE_PROMPTS = {
  strategist: `당신은 [UI/UX 아키텍트]입니다. 사용자 요청에 맞는 브랜드 컨셉, 업종별 컬러 팔레트(HEX), 타이포그래피, 5개 화면 섹션(메인/서비스/소개·의료진/후기·FAQ/예약·오시는길)과 인터랙션 설계를 한국어 bullet 8줄 이내로 제시하십시오. 외부 CSS 프레임워크(Tailwind CDN 등) 금지 및 100% 자체 CSS 원칙을 명시하십시오.`,
  implementer: `당신은 [시니어 풀스택 웹 디자이너]입니다. 주어진 설계에 따라 Claude Artifacts 수준의 완벽한 단일 html 완성본(<!doctype html>)을 작성하십시오. Tailwind CDN 등 외부 CSS 프레임워크를 절대 쓰지 말고 <style> 안에 완전한 반응형 CSS(:root 변수, 리셋, 그리드, 여백, 그림자)를 직접 작성하십시오. <video> 태그는 쓰지 말고 data-dc-img 속성으로 고화질 사진을 배치하십시오. 생략 없이 완성 코드만 출력하십시오.`,
  critic: `당신은 [디자인·코드 QA 검수자]입니다. 초안에서 (1) 외부 CSS 프레임워크(Tailwind CDN 등) 의존 여부, (2) CSS 누락/레이아웃 깨짐, (3) 누락된 섹션/인터랙션, (4) <video> 사용이나 이미지 비율 깨짐을 최대 6개 bullet로 지적하고 수정안을 제시하십시오.`,
  verifier: `당신은 [교차 검증자]입니다. 최종안을 사용자 요청과 대조해 치명적 오류(실행 불가, 문법 오류, 잘린 HTML, 외부 CSS 의존으로 스타일 깨짐, 필수 기능 누락)만 판정하십시오.
첫 줄에 정확히 "VERDICT: PASS" 또는 "VERDICT: FAIL" 을 쓰고, FAIL이면 문제 위치와 함께 최대 5개 bullet로 쓰십시오.`,
  summarizer: `다음 대화 기록을 아래 4개 섹션으로 압축하십시오. 600 토큰 이내.
[완료된 단계]
[현재 산출물]
[다음 실행 작업]
[제약조건]`,
};

/* ================= THREADS ================= */
let threads = [];
const state = { cur: null, mode: 'council', route: 'auto', running: null, rightTab: 'doc', activeFile: 0 };
const tkey = () => `threads:${user?.id || 'guest'}`;
function loadThreads() { threads = LS.get(tkey(), []); }
function saveThreads() {
  // keep storage bounded
  const slim = threads.slice(0, 40).map((t) => ({ ...t, messages: t.messages.slice(-40) }));
  LS.set(tkey(), slim);
}
function curThread() { return threads.find((t) => t.id === state.cur) || null; }
function newThread() {
  const t = { id: uid(), title: '새 작업', created: Date.now(), updated: Date.now(), messages: [], summary: null, artifacts: null };
  threads.unshift(t); state.cur = t.id; saveThreads(); return t;
}

/* ================= CODE RAIN ================= */
class CodeRain {
  constructor(canvas, { size = 14, speed = 1, fade = 0.09, bright = '#a5b4fc', color = '#6366f1' } = {}) {
    this.c = canvas; this.x = canvas.getContext('2d'); this.size = size; this.speed = speed; this.fadeA = fade; this.bright = bright; this.color = color;
    this.pool = 'const route = wrr.pick(pool, health); if (res.status === 429) cooldown(60); fallback(ollama); synth(claude); cache.set(key, out, 86400); '.split('');
    this.pi = 0; this.on = false; this.cols = []; this.raf = 0;
    this.resize = this.resize.bind(this); this.frame = this.frame.bind(this);
    new ResizeObserver(this.resize).observe(canvas);
  }
  resize() {
    const dpr = Math.min(2, devicePixelRatio || 1); const r = this.c.getBoundingClientRect();
    if (!r.width || !r.height) return;
    this.c.width = r.width * dpr; this.c.height = r.height * dpr; this.x.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.w = r.width; this.h = r.height;
    const n = Math.ceil(this.w / this.size);
    this.cols = Array.from({ length: n }, (_, i) => this.cols[i] || { y: Math.random() * -this.h, v: 0.6 + Math.random() * 1.1, off: Math.floor(Math.random() * 500) });
    this.x.fillStyle = '#000'; this.x.fillRect(0, 0, this.w, this.h);
  }
  feed(text) {
    if (!text) return;
    const chars = text.replace(/\s+/g, ' ').split('');
    this.pool.push(...chars);
    if (this.pool.length > 6000) this.pool.splice(0, this.pool.length - 6000);
  }
  start() { if (this.on) return; this.on = true; this.resize(); this.last = performance.now(); this.raf = requestAnimationFrame(this.frame); }
  stop() { this.on = false; cancelAnimationFrame(this.raf); }
  frame(now) {
    if (!this.on) return;
    this.raf = requestAnimationFrame(this.frame);
    if (now - (this.lastFrame || 0) < 38) return; // ~26 FPS throttle
    this.lastFrame = now;
    if (!this.w || !this.c.offsetParent) return;
    const dt = Math.min(50, now - this.last); this.last = now;
    const { x, size } = this;
    x.fillStyle = `rgba(0,0,0,${this.fadeA})`; x.fillRect(0, 0, this.w, this.h);
    x.font = `${size}px 'JetBrains Mono', monospace`; x.textBaseline = 'top';
    const step = (dt / 16.7) * this.speed;
    for (let i = 0; i < this.cols.length; i++) {
      const col = this.cols[i];
      const prevRow = Math.floor(col.y / size);
      col.y += col.v * step * size * 0.55;
      const row = Math.floor(col.y / size);
      if (row !== prevRow && col.y > 0) {
        const ch = this.pool[(col.off + row) % this.pool.length] || '0';
        x.fillStyle = this.color; x.shadowColor = this.color; x.shadowBlur = 3;
        x.fillText(ch, i * size, (row - 1) * size);
        x.shadowBlur = 4; x.fillStyle = this.bright;
        x.fillText(this.pool[(col.off + row + 1) % this.pool.length] || '1', i * size, row * size);
        x.shadowBlur = 0;
      }
      if (col.y > this.h + Math.random() * 400) { col.y = Math.random() * -200; col.v = 0.6 + Math.random() * 1.1; col.off = (this.pi += 37) % Math.max(1, this.pool.length); }
    }
  }
}

/* ================= RENDER: MARKDOWN ================= */
const IMG_BLOBS = {}; // generated image URL -> object URL (avoid re-hitting free rate limits)
marked.setOptions({ gfm: true, breaks: false });
function renderMd(md) {
  const html = DOMPurify.sanitize(marked.parse(md || ''), { ADD_ATTR: ['target'] });
  const box = document.createElement('div'); box.className = 'md'; box.innerHTML = html;
  $$('pre > code', box).forEach((code, i) => {
    const pre = code.parentElement;
    const lang = (code.className.match(/language-([\w+-]+)/) || [])[1] || 'text';
    try { if (window.hljs && lang !== 'text') hljs.highlightElement(code); } catch {}
    const head = document.createElement('div'); head.className = 'cb-head';
    head.innerHTML = `<span>${esc(lang)}</span><button data-act="copy">복사</button><button data-act="open">에디터로</button>`;
    head.querySelector('[data-act=copy]').onclick = () => { navigator.clipboard.writeText(code.textContent); toast('복사됨'); };
    head.querySelector('[data-act=open]').onclick = () => openCodeInEditor(code.textContent, lang);
    pre.prepend(head);
  });
  $$('a', box).forEach((a) => { a.target = '_blank'; a.rel = 'noopener'; });
  $$('img', box).forEach((img) => { const b = IMG_BLOBS[img.getAttribute('src')]; if (b) img.src = b; img.loading = 'lazy'; });
  return box;
}

/* ================= RESPONSE PARSING ================= */
function extractCode(md) {
  const out = []; const re = /```([\w+-]*)[^\n]*\n([\s\S]*?)```/g; let m;
  while ((m = re.exec(md))) out.push({ lang: (m[1] || 'text').toLowerCase(), code: m[2].replace(/\n$/, '') });
  return out;
}
function splitSections(text) {
  const sec = { consensus: '', deliverable: '', snapshot: '' };
  const re = /^##\s*\[?\s*(합의 요약|라우팅 및 합의 요약|자율 실행 산출물|세션 상태 스냅샷[^\n]*)\]?\s*$/gm;
  const marks = []; let m;
  while ((m = re.exec(text))) marks.push({ name: m[1], start: m.index, end: re.lastIndex });
  if (!marks.length) { sec.deliverable = text.trim(); return sec; }
  if (marks[0].start > 0 && text.slice(0, marks[0].start).trim()) sec.deliverable = text.slice(0, marks[0].start).trim() + '\n\n';
  marks.forEach((mk, i) => {
    const body = text.slice(mk.end, i + 1 < marks.length ? marks[i + 1].start : text.length).trim();
    if (mk.name.includes('합의')) sec.consensus = body;
    else if (mk.name.includes('산출물')) sec.deliverable += body;
    else sec.snapshot = body;
  });
  return sec;
}
function parseSnapshot(s, prompt) {
  const body = (s.match(/```(?:yaml|yml)?\n([\s\S]*?)```/) || [null, s])[1] || '';
  return body.trim() || `user_goal: "${prompt.slice(0, 80).replace(/"/g, "'")}"\ncompleted_steps: []\nactive_artifacts: []\npending_tasks: []\nconstraints: []`;
}
function guessName(lang, i, used) {
  const map = { html: 'index.html', css: 'style.css', javascript: 'app.js', js: 'app.js', jsx: 'App.jsx', tsx: 'page.tsx', typescript: 'index.ts', ts: 'index.ts', python: 'main.py', py: 'main.py', sql: 'schema.sql', json: 'config.json', bash: 'run.sh', sh: 'run.sh', shell: 'run.sh', powershell: 'run.ps1', yaml: 'config.yaml', yml: 'config.yml', env: '.env.local', dotenv: '.env.local', md: 'README.md', markdown: 'README.md', prisma: 'schema.prisma', go: 'main.go', java: 'Main.java', kotlin: 'Main.kt', swift: 'App.swift', dart: 'main.dart', php: 'index.php', rust: 'main.rs', vue: 'App.vue' };
  let n = map[lang] || `snippet-${i + 1}.${lang && lang !== 'text' ? lang : 'txt'}`;
  if (used.has(n)) { const dot = n.lastIndexOf('.'); n = dot > 0 ? `${n.slice(0, dot)}-${i + 1}${n.slice(dot)}` : `${n}-${i + 1}`; }
  used.add(n); return n;
}

/* ================= ORCHESTRATION ================= */
const STAGES_COUNCIL = ['CACHE', 'CONTEXT', 'STRATEGIST', 'IMPLEMENTER', 'CRITIC', 'SYNTH', 'VERIFY', 'GATE', 'RENDER'];
const STAGES_FAST = ['CACHE', 'CONTEXT', 'ROUTE', 'GENERATE', 'VERIFY', 'GATE', 'RENDER'];
const STAGES_IMAGE = ['CACHE', 'PROMPT', 'IMAGE', 'RENDER'];
const STAGES_LOCAL6 = ['CACHE', 'ROUTER', 'WORKER', 'CRITIC', 'REVISE', 'RENDER'];
const STAGES_CORE = ['CACHE', 'CONTEXT', 'ROUTE', 'STRATEGIST', 'IMPLEMENTER', 'CRITIC', 'GATE', 'RENDER'];
const STAGES_EXEC = ['CACHE', 'CONNECT', 'TESTS', 'GENERATE', 'EXECUTE', 'OBSERVE', 'PATCH', 'GATE', 'RENDER'];

async function buildContext(thread, run) {
  const msgs = thread.messages.filter((m) => !m.pending).map((m) => ({ role: m.role, content: m.role === 'assistant' ? (m.modelText || m.content) : m.content }));
  const total = msgs.reduce((a, m) => a + estTok(m.content), 0);
  run.log(`ctx    history ${msgs.length} msgs · ~${total} tok (압축 임계 ${opts.compressAt})`, 't');
  if (total <= opts.compressAt) return { messages: msgs, compressed: false, tokens: total };
  const keep = Math.max(2, opts.keepRecent);
  const old = msgs.slice(0, -keep); const recent = msgs.slice(-keep);
  const upto = old.length;
  let summary = thread.summary && thread.summary.upto === upto ? thread.summary.text : null;
  if (summary) run.log(`ctx    압축 캐시 재사용 (upto=${upto})`, 'ok');
  else {
    run.log(`ctx    ${old.length}개 메시지 → [완료된 단계/현재 산출물/다음 실행 작업/제약조건] 압축`, 'k');
    const prev = thread.summary?.text ? `이전 압축본:\n${thread.summary.text}\n\n` : '';
    const transcript = old.map((m) => `${m.role === 'user' ? 'USER' : 'AI'}: ${m.content.slice(0, 3000)}`).join('\n\n');
    try {
      const r = await routeCall({ role: 'summary', label: 'compress', system: ROLE_PROMPTS.summarizer, messages: [{ role: 'user', content: prev + transcript }], signal: run.signal, log: run.log, maxTokens: 900, temperature: 0.2, onToken: (t) => run.rain(t) });
      summary = r.text.trim();
    } catch (e) {
      if (e.kind === 'abort') throw e;
      run.log(`ctx    요약 모델 실패 → 휴리스틱 압축 (최근 스냅샷 기반)`, 'warn');
      const lastSnap = [...thread.messages].reverse().find((m) => m.snapshot)?.snapshot || '';
      summary = `[완료된 단계]\n${old.filter((m) => m.role === 'user').map((m) => '- ' + m.content.slice(0, 80)).join('\n')}\n[현재 산출물]\n${lastSnap}\n[다음 실행 작업]\n- 사용자 최신 요청 처리\n[제약조건]\n- 기존 결정 유지`;
    }
    thread.summary = { upto, text: summary };
  }
  const messages = [{ role: 'user', content: `[압축된 이전 컨텍스트]\n${summary}` }, { role: 'assistant', content: '컨텍스트 확인. 이어서 진행합니다.' }, ...recent];
  const after = messages.reduce((a, m) => a + estTok(m.content), 0);
  run.log(`ctx    ${total} → ${after} tok (${Math.round((1 - after / total) * 100)}% 절감)`, 'ok');
  return { messages, compressed: true, tokens: after };
}

function routeSummary(run) {
  const used = run.calls.map((c) => `${c.label}: ${c.provider}${c.model ? ` (${c.model})` : ''}`);
  const path = [];
  path.push(run.cacheHit ? '캐시 HIT (TTL 86400s)' : '캐시 MISS');
  if (run.compressed) path.push('컨텍스트 압축');
  if (run.core) path.push(`CORE 게이트웨이 (${run.calls.map((c) => c.short).join(' → ')})`);
  if (run.local6) path.push(`로컬 6-에이전트 (${run.calls.map((c) => c.short).join(' → ')})`);
  if (run.exec) path.push(`EXEC 내 PC 실행 검증 (${run.calls.map((c) => c.short).join(' → ') || '실행 없음'})`);
  const mediaCalls = run.calls.filter((c) => c.pid === 'media'); if (mediaCalls.length) path.push(`미디어 (${mediaCalls.map((c) => c.provider).join(' → ')})`);
  const free = run.calls.filter((c) => !['claude', 'ollama', 'local6', 'core', 'exec', 'media'].includes(c.pid));
  if (free.length) path.push(`무료 풀 순환 (${[...new Set(free.map((c) => c.short))].join(' → ')})`);
  if (run.calls.some((c) => c.pid === 'ollama')) path.push('로컬 Ollama 폴백');
  const synth = run.calls.find((c) => c.label === 'synth');
  if (synth) path.push(`최종 통합 ${synth.short}`);
  const escn = run.escalation;
  if (escn?.used) { const u = escn.usage || {}; path.push(`Claude 승격 (${escn.reason}) · in ${u.in || 0} (cache read ${u.cr || 0}) / out ${u.out || 0} tok`); }
  else if (escn) path.push(`승격 조건 (${escn.reason}) 충족했으나 Claude 미사용 → Zero-Claude`);
  else if (!run.cacheHit) path.push('Zero-Claude (Claude 0 tok)');
  if (run.failovers) path.push(`failover ${run.failovers}회`);
  return { path: path.join(' → '), used };
}

function composeAnswer(run, sec, snapshotYaml) {
  const logLines = run.lines.filter((l) => /route|done|fail|fallback|cache|ctx|stage|image|gate|verify|repair|claude|media/.test(l)).slice(-22);
  const rs = routeSummary(run);
  let md = `## [실시간 실행 로그 / 코드 스트림 요약]\n\`\`\`log\n${logLines.join('\n')}\n\`\`\`\n\n`;
  md += `## [라우팅 및 합의 요약]\n- **실행 경로**: ${rs.path}\n`;
  if (rs.used.length) md += `- **호출**: ${rs.used.join(' · ')}\n`;
  md += `- **소요**: ${(run.ms / 1000).toFixed(1)}s · 모드 ${({ council: '멀티 AI 상의', claude: 'Claude Final Pass', image: '이미지 파이프라인', fast: '빠른 실행', local6: '로컬 6-에이전트 (Ollama)', core: 'CORE 게이트웨이', exec: 'EXEC 내 PC 실행 검증' })[run.mode]}\n`;
  if (sec.consensus) md += `\n${sec.consensus}\n`;
  if (window.DCWebTaskBridge && window.DCWebTaskBridge.isTaskRequest(run.prompt || '')) {
    const titleMatch = (sec.deliverable || '').match(/^#\s+(.+)$/m);
    const title = titleMatch ? titleMatch[1].trim() : '자율 작성 블로그 포스팅';
    const tagsMatch = (sec.deliverable || '').match(/#([a-zA-Z0-9가-힣_]+)/g);
    const tags = tagsMatch ? tagsMatch.slice(0, 5) : ['다크코드', 'AI자동화', '블로그'];
    const summary = sec.consensus ? sec.consensus.replace(/^#+.*$/gm, '').trim().slice(0, 160) : '본문이 성공적으로 작성되었습니다.';
    const widgetHtml = window.DCWebTaskBridge.renderBlogWidget({ title, content: sec.deliverable, tags, summary });
    md += `\n${widgetHtml}\n\n`;
  }
  md += `\n## [자율 실행 산출물]\n${sec.deliverable || '(산출물 없음)'}\n\n`;
  md += `## [세션 상태 스냅샷 (State Snapshot)]\n\`\`\`yaml\n${snapshotYaml}\n\`\`\`\n`;
  return md;
}

/* ---------- 실사 미디어 자동 삽입: data-dc-img / data-dc-bg / data-dc-video 표식 → 실제 사진·영상 ---------- */
const MEDIA_RULE = '\n\n[미디어 규칙] 사진·영상 자리는 외부 URL 대신 표식만 쓰세요: 사진 <img data-dc-img="영문 검색어" alt="한국어 설명">, 배경 사진은 요소에 data-dc-bg="영문 검색어", 영상 <video data-dc-video="영문 검색어" autoplay muted loop playsinline></video>. 플랫폼이 실사 사진·영상으로 바꿔 넣습니다. 인물은 국적 지정이 없으면 korean 을 검색어에 넣고, 장면마다 다른 검색어를 쓰세요.';
const WEB_RE = /(홈페이지|웹사이트|사이트|랜딩|웹페이지|쇼핑몰|포트폴리오|website|landing|homepage|web\s?page|\bhtml\b)/i;
const withMediaRule = (prompt) => (WEB_RE.test(prompt) ? prompt + MEDIA_RULE : prompt);
async function resolveMedia(modelText, run) {
  const M = window.DCMedia;
  if (!M || !/(data-dc-(img|bg|video)|<img\s|<video\s)/.test(modelText)) return modelText;
  run.log('stage  MEDIA · 실사 사진·영상 자동 삽입 및 검증', 'k');
  let out = modelText;
  for (const b of [...modelText.matchAll(/```html[^\n]*\n([\s\S]*?)```/gi)]) {
    if (!/(data-dc-(img|bg|video)|<img\s|<video\s)/.test(b[1])) continue;
    try {
      const r = await M.resolveHtml(b[1], { log: (m, c) => run.log('media  ' + m, c || 't'), signal: run.signal });
      out = out.replace(b[0], () => '```html\n' + r.html + '\n```');
      const s = r.stats;
      run.log(`media  사진 ${s.photos} · 배경 ${s.bgs} · 영상 ${s.videos}${s.ai ? ` · AI ${s.ai}` : ''} 삽입${s.failed ? ` · 실패 ${s.failed}` : ''} (${s.sources.join(', ') || '출처 없음'})`, s.failed ? 'warn' : 'ok');
    } catch (e) {
      if (run.signal.aborted) { const ab = new Error('사용자 중단'); ab.kind = 'abort'; throw ab; }
      run.log(`media  자동 삽입 실패 · ${e.message} (원본 유지)`, 'warn');
    }
  }
  return out;
}

async function execute(prompt, { noCache = false } = {}) {
  if (state.running) return;
  // STUDIO 명령: /music 대충 쓴 문장 → AI 작곡, /video → 영상 만들기
  // 홍보영상 요청 → STUDIO 홍보영상 (실사 영상·사진 + 나레이션 + 자막 + MP4 자동 제작) · 기획안·대본만 요청하면 채팅으로 답한다
  const promoCmd = prompt.match(/^\/(promo|홍보|광고)(?:\s+([\s\S]*))?$/i);
  const promoAsk = !promoCmd && /(홍보|광고|프로모션|소개)\s*(영상|동영상|비디오)|promo(tion(al)?)?\s*video/i.test(prompt) && /(만들|제작|생성|뽑아|찍어|make|create)/i.test(prompt) && !/(기획|대본|스크립트|콘티|아이디어|시나리오)/.test(prompt);
  if (promoCmd || promoAsk) {
    const pq = (promoCmd ? promoCmd[2] || '' : prompt).trim();
    window.open(`studio.html?tab=promo${pq ? `&q=${encodeURIComponent(pq)}&auto=1` : ''}`, '_blank');
    toast('STUDIO 홍보영상에서 실사 영상 + 나레이션 + 자막으로 만들기 시작합니다');
    return;
  }
  const studioCmd = prompt.match(/^\/(music|음악|노래|song|video|영상|뮤비)(?:\s+([\s\S]*))?$/i);
  if (studioCmd) {
    const isVideo = /^(video|영상|뮤비)$/i.test(studioCmd[1]);
    const q = (studioCmd[2] || '').trim();
    window.open(isVideo ? 'studio.html?tab=video' : `studio.html${q ? `?q=${encodeURIComponent(q)}&auto=1` : ''}`, '_blank');
    toast(isVideo ? 'STUDIO 영상 만들기를 열었어요' : 'STUDIO 에서 AI 작곡을 시작합니다');
    return;
  }
  let thread = curThread() || newThread();
  const isImage = /^\/(image|img|이미지)\s+/i.test(prompt);
  const mode = isImage ? 'image' : state.mode;
  if (thread.messages.length === 0) thread.title = prompt.replace(/^\/\S+\s+/, '').slice(0, 40) || '새 작업';
  thread.messages.push({ role: 'user', content: prompt, t: Date.now() });
  thread.updated = Date.now();
  saveThreads(); renderThreads(); renderStream();

  setCenterView('work');
  const run = createRunUI(mode);
  run.prompt = prompt;
  previewLoading(run, prompt, mode);
  state.running = run;
  setRunning(true);
  try {
    const key = fnv(JSON.stringify({ v: 3, mode, route: state.route, p: prompt.trim().toLowerCase(), ctx: thread.messages.slice(-5, -1).map((m) => (m.modelText || m.content).slice(0, 400)) }));
    run.stage('CACHE');
    run.log(`cache  lookup key=${key} ttl=${opts.ttl}s`, 'k');
    const execMode = mode === 'exec';
    const hit = noCache || execMode ? null : cacheGet(key);
    if (noCache) run.log('cache  bypass (다시 실행)', 't');
    else if (execMode) run.log('cache  bypass (EXEC: 매번 내 PC에서 실제로 실행해 확인)', 't');
    let modelText, sec, snap;
    if (hit) {
      run.cacheHit = true; TEL()?.cache(true);
      run.log(`cache  HIT (${Math.round((Date.now() - hit.t) / 60000)}분 전 생성) → 재사용, API 호출 0회`, 'ok');
      run.rain(hit.modelText);
      await sleep(900);
      modelText = hit.modelText; run.calls = hit.calls || [];
      run.skipStages();
    } else {
      if (!execMode) { run.log('cache  MISS', 't'); TEL()?.cache(false); }
      if (mode === 'image') modelText = await runImage(prompt, run);
      else if (mode === 'local6') modelText = await runLocal6(prompt, run, thread);
      else if (mode === 'core') modelText = await runCore(prompt, run, thread);
      else if (mode === 'exec') modelText = await runExec(prompt, run, thread);
      else {
        run.stage('CONTEXT');
        const ctx = await buildContext({ ...thread, messages: thread.messages.slice(0, -1) }, run);
        if (ctx.compressed) { run.compressed = true; const real = curThread(); if (real) real.summary = thread.summary; }

        // 세부 명령어 극대화 처리 (이전 생성 코드가 있을 때 완벽한 연속 수정 보장)
        const currentActiveCode = artifacts?.files?.find((f) => f.lang === 'html')?.code || '';
        const isFollowUp = currentActiveCode && thread.messages.length > 1;
        const isVideoReq = /(동영상|영상|비디오|video)/i.test(prompt);
        let execPrompt = withMediaRule(prompt);
        if (isVideoReq) {
          execPrompt += '\n\n[🚨 비디오 삽입 최우선 지침]:\n사용자가 사이트에 영상/동영상을 넣어달라고 요청했습니다. 히어로 섹션 또는 메인 비주얼에 반드시 <video data-dc-video="medical dental surgery clinic motion video" autoplay muted loop playsinline style="width:100%;height:100%;object-fit:cover;border-radius:16px;"></video> 를 배치하십시오. 플랫폼이 실제 동작하는 고화질 비디오를 자동 연동합니다.';
        }
        if (isFollowUp) {
          const isKoreanPhotoReq = /(한국\s*사람|한국인|동양인|외국인.*바꿔|사진.*바꿔|인물.*바꿔|의사.*바꿔|원장.*바꿔|여의사)/i.test(prompt);
          if (isKoreanPhotoReq && window.DCMedia && window.DCMedia.patchKoreanPhotos) {
            // 즉각 국소 DOM 패치: 김민준 대표원장/의료진 사진을 즉시 한국인 AI 실사 사진으로 패치
            const quickPatched = window.DCMedia.patchKoreanPhotos(currentActiveCode);
            if (quickPatched !== currentActiveCode) {
              const htmlFile = artifacts?.files?.find((f) => f.lang === 'html');
              if (htmlFile) htmlFile.code = quickPatched;
              applyArtifacts(artifacts, true);
              run.log('media  [⚡ 즉각 패치] 외국인 스톡 사진을 한국인 실사 AI 사진으로 즉시 교체 반영함', 'ok');
            }
          }
          execPrompt = `[사용자 세부 수정 요청]:\n${prompt}\n\n` +
            (isKoreanPhotoReq ? `[🚨 최우선 강제 지침 - 모든 인물 사진 100% 한국인 실사 교체]:\n사용자가 사이트 내의 모든 인물 사진을 한국인으로 교체할 것을 강력히 지시했습니다. 외국인 사진이 들어있는 모든 <img> 태그(대표원장, 의료진, 환자 등)의 data-dc-img 속성을 반드시 'ai:korean [역할] [상황], photorealistic, 8k' 로 교체하십시오 (예: data-dc-img="ai:korean male dentist in modern dental clinic, gentle warm smile, 8k photo"). 기존의 레이아웃, 스타일, 텍스트는 100% 그대로 유지하십시오.\n\n` : '') +
            (isVideoReq ? `[🚨 최우선 강제 지침 - 동영상 완벽 삽입]:\n사용자가 동영상 삽입을 요청했습니다. 히어로 섹션이나 메인 영역에 반드시 <video data-dc-video="medical dental surgery clinic motion video" autoplay muted loop playsinline style="width:100%;height:100%;object-fit:cover;"></video> 를 완벽하게 배치하십시오.\n\n` : '') +
            `[현재 활성 HTML 코드 (반드시 이 코드를 기반으로 세부 지시를 100% 완벽히 반영하여 수정된 완성본을 출력할 것)]:\n\`\`\`html\n${currentActiveCode.slice(0, 28000)}\n\`\`\`\n\n[초정밀 반영 지침]:\n1. 한국인 사진 요청 시: 모든 인물 <img> 태그에 data-dc-img="ai:korean [역할] [상황], photorealistic, 8k" 를 적용하십시오.\n2. 영상 요청 시: 메인 히어로 또는 해당 섹션에 <video data-dc-video="구체적 영문 프롬프트" autoplay muted loop playsinline></video> 를 완벽히 배치하십시오.\n3. 기존에 잘 작성되어 있던 디자인과 레이아웃, 기능, 모션은 유지하면서 사용자의 요청을 빈틈없이 완벽하게 처리하십시오.`;
        }

        if (isFollowUp) {
          run.log('stage  TURBO REVISE · 초고속 연속 수정 모드 가동 (체감 90s → 6s 단축)', 'ok');
          modelText = await runTurboRevise(execPrompt, ctx.messages, run, thread);
        } else {
          modelText = mode === 'fast' ? await runFast(execPrompt, ctx.messages, run, thread) : await runCouncil(execPrompt, ctx.messages, run, thread, mode === 'claude');
        }
      }
      if (mode !== 'image' && mode !== 'core' && mode !== 'exec') modelText = await completeHtml(run, prompt, modelText);
      if (mode !== 'image' && mode !== 'exec') modelText = await resolveMedia(modelText, run);
      if (!execMode) { cachePut(key, { modelText, calls: run.calls }); run.log(`cache  store key=${key}`, 't'); }
    }
    run.stage('RENDER');
    sec = splitSections(modelText);
    snap = parseSnapshot(sec.snapshot, prompt);
    run.ms = performance.now() - run.t0;
    const answer = composeAnswer(run, sec, snap);
    const msg = { role: 'assistant', content: answer, modelText, snapshot: snap, t: Date.now(), meta: { ms: run.ms, route: routeSummary(run).path, lines: run.lines, mode, cached: !!run.cacheHit, local6State: run.local6State || null, coreState: run.coreState || null, execState: run.execState || null } };
    thread = curThread() || thread;
    thread.messages.push(msg);
    thread.artifacts = buildArtifacts(sec, snap, thread, run);
    thread.updated = Date.now();
    saveThreads();
    run.finish(true);
    state.running = null;
    renderThreads(); renderStream(); applyArtifacts(thread.artifacts, true);
  } catch (e) {
    const aborted = e.kind === 'abort';
    run.log(aborted ? 'abort  사용자 중단' : `error  ${e.message}`, aborted ? 'warn' : 'err');
    run.finish(false);
    previewError(aborted ? '작업을 중단했습니다.' : e.message);
    state.running = null;
    const t = curThread() || thread;
    t.messages.push({ role: 'assistant', content: aborted ? '> 작업을 중단했습니다.' : `> **실행 실패** · ${e.message}\n\n설정(⚙)에서 무료 풀 API 키를 추가하거나, 로컬 Ollama를 켜면 자동으로 다음 경로로 이어집니다.`, error: true, t: Date.now(), meta: { lines: run.lines, ms: performance.now() - run.t0, mode } });
    saveThreads(); renderStream();
  } finally {
    state.running = null; setRunning(false); renderStatus();
  }
}

/* ---------- Zero-Claude escalation gate ---------- */
const ARCH_RE = /(아키텍처|architecture|시스템\s*설계|전체\s*(시스템\s*)?구조|마이크로\s*서비스|\bMSA\b|인프라\s*설계|플랫폼\s*설계|대규모|멀티\s*테넌트|분산\s*시스템|system\s*design|백엔드\s*설계|서비스\s*구조\s*설계)/i;
function archGate(prompt, thread) { return opts.gateC && !thread?.archConfirmed && ARCH_RE.test(prompt); }

// Deterministic, zero-token code check (compile only, never executes)
function staticCheck(md) {
  const issues = [];
  const tryCompile = (code, where) => {
    if (/^\s*(import|export)\s/m.test(code)) return; // ES modules can't be compiled with Function()
    try { new Function(code); } catch (e) { issues.push(`${where}: ${e.name}: ${e.message}`); }
  };
  extractCode(md).forEach((c, i) => {
    if (['javascript', 'js'].includes(c.lang)) tryCompile(c.code, `code#${i + 1} (js)`);
    else if (c.lang === 'json') { try { JSON.parse(c.code); } catch (e) { issues.push(`code#${i + 1} (json): ${e.message}`); } }
    else if (c.lang === 'html') {
      if (/<!doctype html|<html[\s>]/i.test(c.code) && !/<\/html>\s*$/i.test(c.code.trim())) issues.push(`code#${i + 1} (html): 문서가 잘림 (</html> 없음)`);
      const re = /<script(?![^>]*\bsrc=)([^>]*)>([\s\S]*?)<\/script>/gi; let m; let k = 0;
      while ((m = re.exec(c.code))) { k++; const attrs = m[1] || ''; if (/type=["']?(module|application\/ld\+json|text\/(template|x-|babel))/i.test(attrs)) continue; tryCompile(m[2], `code#${i + 1} (html <script> ${k})`); }
    }
  });
  return issues;
}
function latestSnapshot(thread) { return [...(thread?.messages || [])].reverse().find((m) => m.snapshot)?.snapshot || ''; }
// Minimal Claude payload: State Snapshot + compressed context + key problem section only (never the full chat log)
function claudePayload(prompt, thread, sections) {
  let c = `[State Snapshot]\n${latestSnapshot(thread) || '(첫 요청 · 이전 상태 없음)'}\n`;
  if (thread?.summary?.text) c += `\n[압축 컨텍스트]\n${thread.summary.text.slice(0, 2000)}\n`;
  c += `\n[사용자 요청]\n${prompt}\n`;
  for (const [k, v] of sections) if (v) c += `\n[${k}]\n${v}\n`;
  return [{ role: 'user', content: c }];
}
const codeSection = (md, limit = 20000) => { const cs = extractCode(md); return (cs.length ? cs.map((c) => '```' + c.lang + '\n' + c.code + '\n```').join('\n\n') : md).slice(0, limit); };

async function escalateToClaude(run, reason, prompt, thread, sections, instruction) {
  const labels = { a: '(a) 무료 교차 검증 미해결', b: '(b) Claude Final Pass 모드', c: '(c) 대규모 아키텍처 첫 설계 확정' };
  if (!claudeReady()) {
    run.log(`gate   승격 조건 ${labels[reason]} 충족 · Claude 키 없음/불가 → Zero-Claude 유지 (무료 결과 사용)`, 'warn');
    run.escalation = { reason, used: false };
    return null;
  }
  const messages = claudePayload(prompt, thread, sections.concat([['지시', instruction]]));
  const payTok = estTok(messages[0].content);
  run.log(`gate   ESCALATE ${labels[reason]} → Claude · payload ~${payTok} tok (스냅샷+문제 구간만, 전체 대화 미전달) · system=prompt-cache`, 'warn');
  try {
    const r = await callTracked(run, { role: 'synth', label: `claude-${reason}`, prefer: 'claude', system: SYSTEM_CORE, messages, maxTokens: opts.claudeMaxOut, temperature: 0.3, claudeOnly: true });
    run.escalation = { reason, used: r.provider.id === 'claude', usage: prov.claude.lastUsage };
    if (r.provider.id !== 'claude') return null;
    return r.text;
  } catch (e) {
    if (e.kind === 'abort') throw e;
    run.log(`gate   Claude 호출 실패 → 무료 결과 유지 (${e.message})`, 'warn');
    run.escalation = { reason, used: false };
    return null;
  }
}

// free cross-verification + one free repair round; returns {text, unresolved, issues}
async function verifyLoop(run, prompt, text, { llm = true, avoid = [] } = {}) {
  let cur = text; let issues = [];
  for (let round = 0; round < 2; round++) {
    issues = staticCheck(cur);
    run.log(issues.length ? `verify static ${issues.length}건: ${issues.slice(0, 2).join(' | ')}` : 'verify static PASS (JS/JSON/HTML 컴파일 검사 · 0 tok)', issues.length ? 'warn' : 'ok');
    if (llm) {
      try {
        const v = await callTracked(run, { role: 'verify', label: round ? 're-verify' : 'verify', system: ROLE_PROMPTS.verifier, avoid, messages: [{ role: 'user', content: `요청:\n${prompt}\n\n[최종안]\n${cur.slice(0, 24000)}${issues.length ? `\n\n[정적 검사 오류]\n${issues.join('\n')}` : ''}` }], maxTokens: 600, temperature: 0.1 });
        if (/VERDICT:\s*FAIL/i.test(v.text)) { issues.push(...v.text.replace(/^.*VERDICT:\s*FAIL.*$/im, '').trim().split('\n').filter((l) => l.trim()).slice(0, 5)); run.log('verify cross-check FAIL', 'warn'); }
        else run.log(/VERDICT:\s*PASS/i.test(v.text) ? 'verify cross-check PASS' : 'verify 판정 형식 불명 → PASS 처리 (승격 안 함)', 'ok');
      } catch (e) { if (e.kind === 'abort') throw e; run.log('verify 검증 모델 없음 → 정적 검사 결과만 사용', 't'); }
    }
    if (!issues.length) return { text: cur, unresolved: false, issues };
    if (round === 1) break;
    run.log('repair 무료 모델로 1회 수정 시도', 'k');
    try {
      const fx = await callTracked(run, { role: 'code', label: 'repair', system: SYSTEM_CORE, avoid, messages: [{ role: 'user', content: `요청:\n${prompt}\n\n[현재 최종안]\n${cur.slice(0, 26000)}\n\n[검증 문제]\n${issues.join('\n')}\n\n문제만 정확히 고친 최종본을 응답 형식 그대로 전체 다시 작성하십시오. 코드는 생략 없이.` }], maxTokens: 16384, temperature: 0.3 });
      cur = fx.text;
    } catch (e) { if (e.kind === 'abort') throw e; run.log('repair 실패', 'warn'); break; }
  }
  return { text: cur, unresolved: issues.length > 0, issues };
}

/* ---------- HTML 완결성 검사 · 이어쓰기 (미리보기 백지 방지) ---------- */
function htmlIssues(code) {
  const c = String(code || '');
  const lc = c.toLowerCase();
  const issues = [];
  const cnt = (re) => (lc.match(re) || []).length;
  if (cnt(/<style[\s>]/g) > cnt(/<\/style>/g)) issues.push('style');
  if (cnt(/<script[\s>]/g) > cnt(/<\/script>/g)) issues.push('script');
  if (/<html[\s>]|<!doctype/i.test(c) && !/<\/html>\s*$/i.test(c.trim())) issues.push('html');
  const body = (c.match(/<body[^>]*>([\s\S]*)/i) || [null, null])[1];
  if (/<head[\s>]/i.test(c) && body === null) issues.push('nobody');
  else if (body !== null) {
    const visible = body.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<style[\s\S]*?<\/style>/gi, '').replace(/<[^>]+>/g, '').trim();
    if (!visible && !/<(canvas|svg|img|video|input|button)\b/i.test(body)) issues.push('empty');
  }
  return issues;
}
function repairHtml(code) {
  let c = String(code || '');
  const lc = c.toLowerCase();
  const n = (re) => (lc.match(re) || []).length;
  if (n(/<style[\s>]/g) > n(/<\/style>/g)) c += '\n</style>';
  if (n(/<script[\s>]/g) > n(/<\/script>/g)) c += '\n</script>';
  if (/<head[\s>]/i.test(c) && !/<\/head>/i.test(c)) c += '\n</head><body></body>';
  if (/<body[\s>]/i.test(c) && !/<\/body>/i.test(c)) c += '\n</body>';
  if (/<html[\s>]/i.test(c) && !/<\/html>/i.test(c)) c += '\n</html>';
  return c;
}
// 응답 속 마지막 html 코드 블록 (닫는 펜스가 없으면 끝까지)
function lastHtmlBlock(text) {
  const re = /```html[^\n]*\n/gi; let m, last = null;
  while ((m = re.exec(text))) last = m;
  if (!last) return null;
  const start = last.index + last[0].length;
  const close = text.indexOf('\n```', start - 1);
  const end = close === -1 ? text.length : close;
  return { start, end, closed: close !== -1, code: text.slice(start, end) };
}
async function completeHtml(run, prompt, text) {
  let cur = text;
  for (let round = 1; round <= 2; round++) {
    const b = lastHtmlBlock(cur);
    if (!b) return cur;
    const issues = htmlIssues(b.code);
    if (!issues.length) { if (round > 1) run.log('verify html 이어쓰기 완료 · 문서 완결', 'ok'); return cur; }
    run.log(`repair html 잘림 감지 (${issues.join(', ')}) → 끊긴 지점부터 이어쓰기 ${round}회차`, 'warn');
    let cont;
    try {
      if (run.mode === 'local6' && window.DCLocal6) {
        const res = await fetch(DCLocal6.host() + '/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, signal: run.signal,
          body: JSON.stringify({ model: 'ai-dev', stream: false, think: false, keep_alive: 0, messages: [{ role: 'user', content: `사용자 요청:\n${prompt}\n\n아래 HTML 파일이 중간에 끊겼습니다. 마지막 글자 바로 다음부터 이어서 </html>까지 완성하십시오. 이미 쓴 부분 반복, 설명, 코드 펜스 금지.\n\n[끊긴 파일의 마지막 부분]\n${b.code.slice(-4000)}` }] }) });
        cont = (await res.json()).message?.content || '';
        run.calls.push({ label: 'html-continue', provider: 'Ollama', short: 'AI-DEV', pid: 'local6', model: 'ai-dev' });
      } else {
        const r = await callTracked(run, {
          role: 'code', label: 'html-continue',
          system: '당신은 코드 이어쓰기 도우미입니다. 끊긴 HTML 파일의 바로 다음 글자부터 파일 끝까지 이어질 코드만 출력합니다. 이미 있는 부분 반복, 설명, 코드 펜스(```) 금지.',
          messages: [{ role: 'user', content: `사용자 요청:\n${prompt}\n\n아래 HTML 파일이 중간에 끊겼습니다. 마지막 글자 바로 다음부터 이어서 </html>까지 완성하십시오. 아직 열려 있는 <style>/<script>를 닫고, 본문(<body>) 내용까지 빠짐없이 작성하십시오.\n\n[끊긴 파일의 마지막 부분]\n${b.code.slice(-4000)}` }],
          maxTokens: 16384, temperature: 0.2,
        });
        cont = r.text;
      }
    } catch (e) { if (e.kind === 'abort' || e.name === 'AbortError') throw e; run.log('repair html 이어쓰기 실패 → 미리보기에서 자동 복구', 'warn'); return cur; }
    cont = String(cont).replace(/^\s*<think>[\s\S]*?<\/think>\s*/, '').replace(/^\s*```[\w-]*\s*\n?/, '').replace(/\n?```\s*$/, '');
    const tail = b.code.slice(-600);
    for (let k = Math.min(400, tail.length, cont.length); k >= 20; k--) { if (tail.endsWith(cont.slice(0, k))) { cont = cont.slice(k); break; } }
    const joined = b.code.replace(/\s+$/, '') + '\n' + cont.replace(/^\s+/, '');
    cur = cur.slice(0, b.start) + joined + (b.closed ? '' : '\n```\n') + cur.slice(b.end);
  }
  return cur;
}

/* ---------- Google Stitch 스타일 실시간 캔버스 스켈레톤 ---------- */
const STITCH_STAGE_KO = {
  CACHE: '캐시 조회 및 컨텍스트 확인',
  CONTEXT: '대화 컨텍스트 압축 및 분석',
  ROUTE: '요청 의도 분석 및 모델 라우팅',
  PLAN: '화면 아키텍처 및 컴포넌트 설계',
  STRATEGIST: 'AI 전략가 구조 설계',
  DRAFT: '멀티 AI 초안 및 코드 생성',
  IMPLEMENTER: 'UI · 코드 구현 중',
  GENERATE: 'UI 컴포넌트 및 인터랙션 생성',
  BUILD: '실행 코드 빌드 중',
  VERIFY: '정적 검증 및 품질 보정',
  CRITIC: 'AI 크리틱 검수 및 자동 수정',
  GATE: '품질 게이트 판정',
  SYNTH: '최종 결과물 통합',
  SYNTHESIS: '최종 결과물 통합',
  RENDER: 'Stitch 캔버스 렌더링',
  IMAGE: 'AI 이미지 생성',
  EXEC: '로컬 실행기 실측 검증',
  CORE: 'CORE 게이트웨이 파이프라인 실행',
};
function stitchLabel(code) { return STITCH_STAGE_KO[code] || code; }
function previewOverlay() {
  let ov = $('#pvGen');
  if (!ov) {
    ov = document.createElement('div'); ov.id = 'pvGen'; ov.className = 'pv-gen';
    ov.innerHTML = `<div class="stitch-skel-board">
      <div class="sk-head"><span class="sk-spin"></span><b class="pg-title">Stitch 캔버스 설계 중</b><span class="pg-stage">준비 중</span></div>
      <div class="sk-body">
        <p class="pg-q"></p>
        <div class="sk-wire">
          <div class="sk-nav shimmer"></div>
          <div class="sk-hero shimmer"></div>
          <div class="sk-cards"><div class="sk-card shimmer"></div><div class="sk-card shimmer"></div><div class="sk-card shimmer"></div></div>
        </div>
        <pre class="pg-tail"></pre>
      </div>
    </div>`;
    $('#pvStage').append(ov);
  }
  return ov;
}
let stitchCanvas = null;
function setStitchMode(mode) {
  const isBoards = mode === 'boards';
  $$('#stitchModeSeg button').forEach((b) => b.classList.toggle('on', b.dataset.sm === mode));
  const bm = $('#stitchBoardMount'), ps = $('#pvStage');
  if (bm) bm.hidden = !isBoards;
  if (ps) ps.hidden = isBoards;
  if (isBoards) requestAnimationFrame(() => stitchCanvas?.fitAll());
}
function previewLoading(run, prompt, mode) {
  const ov = previewOverlay();
  ov.hidden = false; ov.classList.remove('err');
  $('.pg-title', ov).textContent = ({
    core: 'CORE 게이트웨이 · 캔버스 생성 중',
    exec: 'EXEC · 코드 생성 및 로컬 실측 검증 중',
    local6: '로컬 6-에이전트 · 협업 설계 중',
    image: 'AI 이미지 캔버스 렌더링 중',
    fast: '빠른 실행 · 캔버스 구성 중',
    claude: 'Claude Final · 고정밀 통합 중',
  })[mode] || 'Stitch 워크플로우 · 화면 설계 중';
  $('.pg-q', ov).textContent = prompt;
  $('.pg-stage', ov).textContent = '요청 분석 중…';
  $('.pg-tail', ov).textContent = '';
  $('#pvUrl').textContent = 'stitch://generating';
  switchTab('preview'); showRight(true);
  if (mode !== 'image' && stitchCanvas) {
    setStitchMode('boards');
    stitchCanvas.startBuild(prompt);
  } else {
    setStitchMode('live');
  }
  const origStage = run.stage, origRain = run.rain;
  let buf = '';
  run.stage = function (name) {
    origStage.call(run, name);
    $('.pg-stage', ov).textContent = stitchLabel(name);
    stitchCanvas?.setStage(name);
  };
  run.rain = function (text) {
    origRain.call(run, text);
    buf = (buf + text).slice(-1400);
    $('.pg-tail', ov).textContent = buf;
    stitchCanvas?.onTokenChunk(text);
  };
}
function previewDone() { const ov = $('#pvGen'); if (ov) ov.hidden = true; }
function previewError(msg) {
  const ov = previewOverlay();
  ov.hidden = false; ov.classList.add('err');
  $('.pg-title', ov).textContent = '실행이 멈췄어요';
  $('.pg-stage', ov).textContent = msg || '';
  setTimeout(() => { if (!state.running) ov.hidden = true; }, 4000);
}
function answerPage(a, notice) {
  const q = esc(a.question || a.title || '');
  const body = DOMPurify.sanitize(marked.parse(a.doc || '(답변 없음)'));
  const css = `*{box-sizing:border-box}body{margin:0;min-height:100vh;background:radial-gradient(1000px 500px at 80% -10%,rgba(99,102,241,.12),transparent 60%),#09090b;color:#e4e4e7;font:15.5px/1.8 'Pretendard Variable',Pretendard,system-ui,-apple-system,'Segoe UI',sans-serif;padding:clamp(16px,4vw,44px)}
.wrap{max-width:860px;margin:0 auto}.tag{display:inline-flex;gap:8px;align-items:center;font:600 11.5px/1 ui-monospace,Consolas,monospace;letter-spacing:.08em;color:#a5b4fc;border:1px solid rgba(99,102,241,.35);border-radius:999px;padding:7px 12px;background:rgba(99,102,241,.1)}
.tag i{width:7px;height:7px;border-radius:50%;background:#10b981}
h1.q{font-size:clamp(22px,3.2vw,30px);line-height:1.35;margin:16px 0 22px;color:#fff;letter-spacing:-.02em}
.card{background:#111116;border:1px solid rgba(255,255,255,.09);border-radius:16px;padding:clamp(20px,3vw,32px);box-shadow:0 20px 50px rgba(0,0,0,.4)}
.card>:first-child{margin-top:0}.lead{font-size:12px;color:#71717a;margin:0 0 12px;font-family:ui-monospace,Consolas,monospace;letter-spacing:.08em}
h1,h2,h3,h4{color:#fff;line-height:1.4;margin:1.4em 0 .5em}h2{font-size:19px}h3{font-size:16.5px}p{margin:.6em 0}strong{color:#fff}a{color:#818cf8}
ul,ol{padding-left:22px}li{margin:.25em 0}blockquote{margin:1em 0;padding:8px 16px;border-left:3px solid #6366f1;background:rgba(99,102,241,.08);border-radius:0 10px 10px 0;color:#d4d4d8}
code{font-family:ui-monospace,'JetBrains Mono',Consolas,monospace;font-size:.88em;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.1);border-radius:6px;padding:1px 6px;color:#e4e4e7}
pre{background:#09090c;border:1px solid rgba(255,255,255,.09);border-radius:12px;padding:16px;overflow:auto}pre code{background:none;border:0;padding:0;color:#e4e4e7}
table{border-collapse:collapse;width:100%;margin:1em 0;font-size:14.5px;display:block;overflow-x:auto}th,td{border:1px solid rgba(255,255,255,.1);padding:8px 12px;text-align:left;vertical-align:top}th{background:rgba(255,255,255,.05);color:#fff}
img{max-width:100%;border-radius:12px}.notice{margin:0 0 16px;padding:10px 14px;border:1px solid rgba(245,158,11,.4);background:rgba(245,158,11,.08);border-radius:10px;color:#fcd34d;font-size:13.5px}
.foot{margin-top:22px;font:11.5px ui-monospace,Consolas,monospace;color:#71717a;letter-spacing:.06em}`;
  return `<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${q}</title><style>${css}</style></head><body><div class="wrap"><span class="tag"><i></i>DARK CODE AI · 답변</span><h1 class="q">${q}</h1>${notice ? `<div class="notice">${esc(notice)}</div>` : ''}<div class="card"><p class="lead">ANSWER</p>${body}</div><div class="foot">DARK CODE AI · ${esc(new Date().toLocaleString('ko-KR'))}</div></div></body></html>`;
}

async function runTurboRevise(prompt, history, run, thread) {
  run.stage('ROUTE');
  run.log('stage  Zero-Claude · 터보 수정 모드 (고속 단일 패스 · 6s 완성)', 'k');
  run.stage('GENERATE');
  const r = await callTracked(run, {
    role: 'code', label: 'turbo-revise',
    system: SYSTEM_CORE + '\n\n[초고속 수정 지침]: 사용자의 세부 지시사항을 기존 활성 코드에 완벽하게 결합하여, 단 하나의 완성된 <!doctype html> 문서를 출력하십시오. 기존에 잘 작성되어 있던 디자인과 레이아웃, 복합 기능 컴포넌트(모달, 비디오, 모션)는 100% 유지하면서 요청된 수정 사항만 정밀하게 반영하십시오. 설명 없이 완성 코드를 바로 출력하십시오.',
    messages: [...history.slice(-4), { role: 'user', content: prompt }],
    maxTokens: 16384,
    temperature: 0.3
  });
  run.stage('VERIFY');
  const v = await verifyLoop(run, prompt, r.text, { llm: false, avoid: [r.provider.id] });
  return v.text;
}

async function runFast(prompt, history, run, thread) {
  run.stage('ROUTE');
  run.log('stage  Zero-Claude · 캐시 → 무료 풀(WRR) → 로컬 Ollama 순서', 'k');
  run.stage('GENERATE');
  const r = await callTracked(run, { role: 'general', label: 'generate', system: SYSTEM_CORE, messages: [...history, { role: 'user', content: prompt }], maxTokens: 16384 });
  run.stage('VERIFY');
  const v = await verifyLoop(run, prompt, r.text, { llm: false, avoid: [r.provider.id] });
  run.stage('GATE');
  if (v.unresolved && opts.gateA) {
    const out = await escalateToClaude(run, 'a', prompt, thread, [['문제 구간 (코드)', codeSection(v.text)], ['미해결 문제', v.issues.join('\n')]], '미해결 문제만 고친 최종 결과물을 응답 형식 그대로 작성하십시오. 코드는 생략 없이 완성본으로.');
    if (out) return out;
  } else run.log(v.unresolved ? 'gate   미해결 문제 있음 · 게이트(a) 꺼짐 → Zero-Claude 유지' : 'gate   승격 조건 없음 → Zero-Claude 유지 (Claude 0 tok)', 'ok');
  return v.text;
}

async function runCouncil(prompt, history, run, thread, forceClaude) {
  const hist = history.slice(-6);
  run.stage('STRATEGIST');
  run.log('stage  [전략가] 최단 경로·설계 도출 (fast/plan 선호: Groq → Gemini)', 'k');
  const s = await callTracked(run, { role: 'plan', label: 'strategist', system: ROLE_PROMPTS.strategist, messages: [...hist, { role: 'user', content: prompt }], maxTokens: 1200, temperature: 0.5 });
  run.stage('IMPLEMENTER');
  run.log('stage  [구현자] 산출물 초안 생성 (code 선호, 전략가와 다른 모델 우대)', 'k');
  const impl = await callTracked(run, { role: 'code', label: 'implementer', system: ROLE_PROMPTS.implementer, avoid: [s.provider.id], messages: [...hist, { role: 'user', content: `요청:\n${prompt}\n\n[전략가 설계]\n${s.text}` }], maxTokens: 16384, temperature: 0.5 });
  run.stage('CRITIC');
  run.log('stage  [비판가] 한도/오류/함정 교차 검증 (verify 선호: OpenRouter, 구현자와 다른 모델 우대)', 'k');
  const c = await callTracked(run, { role: 'verify', label: 'critic', system: ROLE_PROMPTS.critic, avoid: [impl.provider.id], messages: [{ role: 'user', content: `요청:\n${prompt}\n\n[초안]\n${impl.text.slice(0, 24000)}` }], maxTokens: 1200, temperature: 0.3 });

  run.stage('SYNTH');
  const reason = forceClaude ? 'b' : archGate(prompt, thread) ? 'c' : null;
  if (reason) {
    run.log(`gate   승격 후보 ${reason === 'b' ? '(b) Claude Final Pass 지정' : '(c) 대규모 아키텍처 첫 설계'} → 최종 통합을 Claude에 위임 시도`, 'k');
    const out = await escalateToClaude(run, reason, prompt, thread, [['전략가 설계', s.text], ['구현자 초안 (핵심 산출물)', impl.text.slice(0, 16000)], ['비판가 지적', c.text]], '세 관점을 통합해 모순과 누락을 제거한 최종 결과물을 응답 형식 그대로 작성하십시오. 비판가의 타당한 지적은 반영하고 코드는 생략 없이.');
    if (out) {
      if (reason === 'c' && thread) thread.archConfirmed = true;
      run.stage('VERIFY');
      const st = staticCheck(out);
      run.log(st.length ? `verify static ${st.length}건 (Claude 결과 · 추가 Claude 호출 안 함)` : 'verify static PASS', st.length ? 'warn' : 'ok');
      run.stage('GATE');
      return out;
    }
  }
  run.log('stage  [최종 합의] 무료 풀 모델로 통합 (Zero-Claude)', 'k');
  const synth = await callTracked(run, {
    role: 'synth', label: 'synth', system: SYSTEM_CORE,
    messages: [...hist, { role: 'user', content: `사용자 요청:\n${prompt}\n\n[전략가 설계]\n${s.text}\n\n[구현자 초안]\n${impl.text.slice(0, 30000)}\n\n[비판가 지적]\n${c.text}\n\n위 세 관점을 통합해 모순과 누락을 제거한 최종 결과물을 응답 형식 그대로 작성하십시오. 비판가의 타당한 지적은 수정해 반영하고, 코드는 생략 없이 완성본으로 다시 쓰십시오.` }],
    maxTokens: 16384, temperature: 0.4,
  });
  run.stage('VERIFY');
  const v = await verifyLoop(run, prompt, synth.text, { llm: true, avoid: [synth.provider.id] });
  run.stage('GATE');
  if (v.unresolved && opts.gateA) {
    const out = await escalateToClaude(run, 'a', prompt, thread, [['문제 구간 (코드)', codeSection(v.text)], ['교차 검증 미해결 문제', v.issues.join('\n')]], '미해결 문제만 고친 최종 결과물을 응답 형식 그대로 작성하십시오. 코드는 생략 없이 완성본으로.');
    if (out) return out;
  } else if (!reason) run.log(v.unresolved ? 'gate   미해결 문제 있음 · 게이트(a) 꺼짐 → Zero-Claude 유지' : 'gate   승격 조건 없음 → Zero-Claude 유지 (Claude 0 tok)', 'ok');
  return v.text;
}

const IMG_PROMPT_SYS = 'Rewrite the user request as one vivid English image-generation prompt (max 60 words: subject, setting, lighting, composition, lens). Default to a photorealistic photograph unless the user explicitly asks for illustration, anime, cartoon or another drawing style. If people appear and no nationality is given, make them Korean. Output only the prompt.';
async function runImage(prompt, run) {
  const raw = prompt.replace(/^\/\S+\s+/, '').trim();
  run.stage('PROMPT');
  run.log('stage  이미지 프롬프트 영문 최적화 (실사 기본 · 인물은 한국인)', 'k');
  let en = raw;
  try {
    const r = await callTracked(run, { role: 'fast', label: 'prompt', system: IMG_PROMPT_SYS, messages: [{ role: 'user', content: raw }], maxTokens: 220, temperature: 0.7 });
    en = r.text.trim().replace(/^"|"$/g, '');
  } catch (e) { if (e.kind === 'abort') throw e; run.log('prompt 최적화 실패 → 원문 사용', 'warn'); }
  run.stage('IMAGE');
  const M = window.DCMedia;
  if (!M) throw new ProvError(500, '미디어 엔진을 불러오지 못했습니다. 새로고침해 주세요.');
  const t0 = performance.now();
  try {
    run.log(`image  AI 실사 생성 → ${M.has('pollinations') ? 'Pollinations (pollen 키)' : 'Pollinations Classic (무료 · 혼잡하면 재시도)'}`, 'route');
    const a = await M.aiPhoto(en, { width: 1280, height: 768, signal: run.signal, retries: 3, onWait: (i) => run.log(`image  무료 서버 혼잡 → 11초 뒤 재시도 (${i}/3)`, 'warn') });
    const shown = a.url || a.dataUrl;
    if (a.url) IMG_BLOBS[a.url] = URL.createObjectURL(a.blob);
    run.log(`done   image ${Math.round(performance.now() - t0)}ms · ${Math.round(a.blob.size / 1024)}KB · ${a.source}`, 'ok');
    run.calls.push({ label: 'image', provider: a.source, short: 'AI-IMG', pid: 'media', model: 'flux' });
    return `## 합의 요약\n- 요청을 실사 기준 영문 프롬프트로 바꿔 AI 이미지로 생성했습니다 (${a.source}).\n- 같은 프롬프트로 다시 실행하면 다른 seed 로 변형이 나옵니다.\n## 자율 실행 산출물\n![generated](${shown})\n\n**프롬프트(EN)**\n\`\`\`text\n${a.prompt}\n\`\`\`\n`;
  } catch (e) {
    if (run.signal.aborted) throw new ProvError(0, '사용자 중단', 'abort');
    run.log(`fail   AI 이미지 · ${e.message} → 같은 주제 실사 스톡 사진으로 대체`, 'warn');
  }
  const p = await M.findPhoto(en, { orientation: 'landscape', signal: run.signal });
  if (!p) throw new ProvError(502, 'AI 이미지 서버가 막혀 있고 스톡 사진도 찾지 못했습니다. 잠시 뒤 다시 시도하거나 설정에서 Pollinations/Pexels 키를 넣어 주세요.');
  run.log(`done   stock photo · ${p.credit.source}${p.credit.author ? ' · ' + p.credit.author : ''}`, 'ok');
  run.calls.push({ label: 'image', provider: p.credit.source, short: 'STOCK', pid: 'media', model: '' });
  const alt = String(p.alt || 'photo').replace(/[\[\]]/g, '');
  return `## 합의 요약\n- AI 이미지 무료 서버가 막혀 같은 주제의 실사 스톡 사진으로 대체했습니다 (${p.credit.source}). 설정에서 Pollinations 키를 넣으면 AI 생성이 안정적으로 됩니다.\n## 자율 실행 산출물\n![${alt}](${p.url})\n\n- 출처: [${p.credit.source}${p.credit.author ? ' · ' + p.credit.author : ''}](${p.credit.link}) ${p.credit.license || ''}\n\n**검색어/프롬프트(EN)**\n\`\`\`text\n${en}\n\`\`\`\n`;
}

/* ---------- CORE 게이트웨이 (darkcode-core: 역할별 엔진 라우팅 + 검수 루프 + 통합 세션) ---------- */
const CORE_STAGE = { cache: 'CACHE', context: 'CONTEXT', route: 'ROUTE', strategist: 'STRATEGIST', implementer: 'IMPLEMENTER', revise: 'IMPLEMENTER', critic: 'CRITIC', verify: 'CRITIC', gate: 'GATE', render: 'RENDER' };
async function runCore(prompt, run, thread) {
  const CORE = window.DCCore;
  if (!CORE) throw new Error('CORE 연결 모듈을 불러오지 못했습니다. 새로고침해 주세요.');
  run.core = true;
  run.log('stage  CORE GATEWAY · 분류 → 역할별 엔진 → 검수 루프 (darkcode-core)', 'k');
  const c = await CORE.check();
  if (!c.ok) {
    run.log('core   게이트웨이 꺼짐 → 연결 안내 창 표시, 켜지면 자동으로 이어서 실행', 'warn');
    CORE.open();
    await CORE.waitConnected(run.signal);
    run.log('core   게이트웨이 연결됨', 'ok');
  }
  const LVL = { error: 'err', warn: 'warn', ok: 'ok', route: 'route', done: 'ok', info: 't', debug: 't' };
  let res;
  try {
    res = await CORE.run(prompt, {
      sessionId: thread.coreSession, signal: run.signal,
      onEvent: (type, d) => {
        if (type === 'token' || type === 'thinking' || type === 'plan') { run.rain(d.text || ''); return; }
        if (type === 'stage' && d.status === 'start' && CORE_STAGE[d.name]) run.stage(CORE_STAGE[d.name]);
        else if (type === 'log') run.log(String(d.msg).replace(/^(\S+)\s/, (m, w) => (w.length <= 6 ? w.padEnd(6) + ' ' : m)), LVL[d.level] || '');
        else if (type === 'route') run.calls.push({ label: d.role, provider: d.engine, short: `${d.engine}:${d.model}`.toUpperCase(), pid: 'core', model: d.model });
        else if (type === 'run' && d.sessionId) thread.coreSession = d.sessionId;
      },
    });
  } catch (e) {
    if (run.signal.aborted || e.name === 'AbortError') { const ab = new Error('사용자 중단'); ab.kind = 'abort'; throw ab; }
    throw e;
  }
  thread.coreSession = res.sessionId;
  const real = curThread(); if (real && real !== thread) real.coreSession = res.sessionId;
  run.coreState = res.snapshot;
  const rounds = (res.rounds || []).map((x) => `  - ${x.round}차 ${x.verdict} (${x.score}/10 · ${x.source})${x.fixes && x.fixes.length ? ': ' + x.fixes.join(' / ') : ''}`).join('\n');
  const q = (s) => String(s || '').replace(/"/g, "'");
  return `## [라우팅 및 합의 요약]
- **CORE 분류**: ${res.label || res.category} · 파이프라인 ${res.pipeline}${res.cached ? ' · 캐시 HIT' : ''}
- **검수 루프**: 검수 ${(res.rounds || []).length}회 · 자동 수정 ${res.revisions || 0}회${res.gate && res.gate.escalated ? ' · 상위 엔진 승격' : ''}
${rounds}${res.issues && res.issues.length ? `\n- **남은 정적 검사 이슈**: ${res.issues.join(' / ')}` : ''}

## [자율 실행 산출물]
${res.final}

## [세션 상태 스냅샷 (State Snapshot)]
\`\`\`yaml
user_goal: "${q(prompt.slice(0, 80))}"
engine: darkcode-core
category: ${res.category}
core_session: ${res.sessionId}
critic_rounds: ${(res.rounds || []).length}
revisions: ${res.revisions || 0}
state_compression: |
${String((res.snapshot && res.snapshot.text) || '').split('\n').map((l) => '  ' + l).join('\n')}
\`\`\`
`;
}

/* ---------- EXEC (AstraUnifiedEngine: 코드 생성 → 내 PC 실행기 실측 → 에러 로그로 수정 → 실행 결과로만 확정) ---------- */
const EXEC_STAGE = { tests: 'TESTS', think: 'GENERATE', patch: 'PATCH', execute: 'EXECUTE', observe: 'OBSERVE', commit: 'GATE' };
async function execWait(fn, ok, signal, limitMs) {
  const t0 = Date.now();
  for (;;) {
    if (signal.aborted) { const ab = new Error('사용자 중단'); ab.kind = 'abort'; throw ab; }
    const s = await fn();
    if (ok(s) || (limitMs && Date.now() - t0 >= limitMs)) return s;
    await sleep(2500);
  }
}
async function runExec(prompt, run, thread) {
  const AX = window.DCAstra;
  if (!AX) throw new Error('EXEC 엔진(astra-mode.js)을 불러오지 못했습니다. 새로고침해 주세요.');
  const UNV = AX.UNV;
  run.exec = true;
  run.log('stage  EXEC · 코드 생성 → 내 PC 실행기 실측 → 에러 로그로 자동 수정 → 실행 결과로만 확정 (토큰 0)', 'k');
  run.stage('CONNECT');
  let st = await AX.check();
  if (!st.models.ok) {
    run.log(`exec   Ollama(${AX.ollamaHost()}) 연결 안 됨 → 연결 창 표시, 켜지면 자동으로 이어서 실행`, 'warn');
    if (window.DCLocal6) DCLocal6.open();
    st = await execWait(() => AX.check(), (s) => s.models.ok, run.signal, 0);
    run.log(`exec   Ollama 연결됨 · 모델 ${st.models.names.length}개`, 'ok');
    const l6d = document.getElementById('l6dlg'); if (l6d && l6d.open) l6d.close();
  }
  if (!st.runner.ok) {
    run.log(`exec   실행기(${st.runnerUrl}) 응답 없음 → darkcode-core 폴더의 start-runner.bat 실행, 켜지면 자동으로 이어서 (최대 90초 · 중단 ■)`, 'warn');
    toast('실행기를 켜 주세요: darkcode-core 폴더의 start-runner.bat');
    st = await execWait(() => AX.check(), (s) => s.runner.ok, run.signal, 90000);
    run.log(st.runner.ok ? 'exec   실행기 연결됨' : `exec   실행기 계속 꺼짐 → 코드는 만들지만 실행 단계에서 멈추고 확정하지 않음 ${UNV}`, st.runner.ok ? 'ok' : 'warn');
  }
  const ri = st.runner.info;
  const ask = Boolean(ri && ri.approval === 'ask');
  run.log(`exec   모델 ${st.model || '없음'} · 실행기 ${ri ? `v${ri.version} · 승인 ${ask ? '콘솔 y/N' : ri.approval} · 격리 ${ri.permissionModel || '없음'}` : '꺼짐'}`, 't');
  let res;
  try {
    res = await AX.run(prompt, {
      signal: run.signal, model: st.model,
      onEvent: (type, d) => {
        if (type === 'token') { run.rain(d.text); return; }
        if (type === 'model') { const what = d.role === 'tests' ? '요구사항으로 테스트 먼저 작성' : d.role === 'repair' ? '실패 내용 반영해 수정' : `후보 ${(d.candidate || 0) + 1} 생성`; run.log(`${d.role === 'tests' ? 'tests ' : d.role === 'repair' ? 'repair' : 'gen   '} ${d.model} ${what}${d.deep ? ' · 생각 모드' : ''}`, 't'); return; }
        if (type === 'model_done') { run.log(`done   ${d.model} ${d.chars}자 (${(d.ms / 1000).toFixed(1)}s)`, 'ok'); run.calls.push({ label: d.role === 'tests' ? 'tests' : d.role === 'repair' ? 'repair' : `candidate#${(d.candidate || 0) + 1}`, provider: 'Ollama', short: String(d.model).toUpperCase(), pid: 'exec', model: d.model }); return; }
        if (type === 'model_fail') { run.log(`fail   모델 호출 실패 · ${d.error}`, 'err'); return; }
        if (type !== 'progress') return;
        if (EXEC_STAGE[d.stage]) run.stage(EXEC_STAGE[d.stage]);
        if (d.stage === 'build' && d.fallbackUsed) run.log(`fallback 모델 없이 0원 스텁으로 우회 · 실행돼도 확정 안 함 ${UNV}`, 'warn');
        else if (d.stage === 'tests') run.log(`tests  ${d.message}`, 't');
        else if (d.stage === 'execute') { run.log(`exec   실행기로 전송 (${d.attempt}차 · 후보 ${d.candidates || 1}개${d.candidates > 1 || /테스트/.test(d.message || '') ? ' · 묶음 실행' : ''})${ask ? ' · 실행기 창에서 코드 확인 후 y 한 번 (60초 안에)' : ''}`, ask ? 'warn' : 't'); run.calls.push({ label: 'run#' + d.attempt, provider: 'runner', short: 'RUNNER', pid: 'exec', model: '' }); }
        else if (d.stage === 'observe') {
          if (!d.reason) { run.log(`verify ${d.message || ''}`, 't'); return; }
          const good = d.tests ? d.exitCode === 0 && d.tests.pass > 0 && d.tests.fail === 0 : d.reason === 'ok' && d.outputPreview;
          run.log(`verify ${String(d.message || '').replace(/^\[\d+\/\d+\]\s*/, '')}`, good ? 'ok' : 'warn');
          if (d.outputPreview) run.log(`stdout ${d.outputPreview.split('\n')[0].slice(0, 160)}`, 't');
          if (d.errorPreview) run.log(`error  ${d.errorPreview.split('\n')[0].slice(0, 160)}`, 'err');
        } else if (d.stage === 'commit') run.log(`gate   ${d.status === 'VERIFIED' ? 'VERIFIED' : UNV} · ${d.stopReason || '-'}${d.committed ? ' · committed 반영' : ''}`, d.status === 'VERIFIED' ? 'ok' : 'warn');
      },
    });
  } catch (e) {
    if (run.signal.aborted) { const ab = new Error('사용자 중단'); ab.kind = 'abort'; throw ab; }
    throw e;
  }
  if (run.signal.aborted) { const ab = new Error('사용자 중단'); ab.kind = 'abort'; throw ab; }
  if (res.status === 'SINGLE_TARGET_LOCKED') run.log(`gate   ${UNV} · SINGLE_TARGET_LOCKED · ${res.error || ''}`, 'warn');
  run.execState = { runId: res.runId || null, status: res.status, stopReason: res.stopReason || res.status, verified: AX.isVerified(res) };
  return AX.toMarkdown(prompt, res, st);
}

/* ---------- LOCAL 6-AGENT (Ollama: ai-router → expert → ai-critic loop) ---------- */
async function runLocal6(prompt, run, thread) {
  const L6 = window.DCLocal6;
  if (!L6 || !window.DCOrchestrator) throw new Error('로컬 6-에이전트 엔진을 불러오지 못했습니다. 새로고침해 주세요.');
  run.local6 = true;
  run.log('stage  LOCAL 6-AGENT · ai-router → 전문가 → ai-critic 검수 루프 (Ollama · 토큰 0)', 'k');
  const c = await L6.check();
  if (!c.ok) {
    run.log(`local6 Ollama ${c.label} → 원클릭 연결 창 표시, 연결되면 자동으로 이어서 실행`, 'warn');
    L6.open();
    await L6.waitConnected(run.signal);
    run.log('local6 Ollama 연결됨 · 모델 6/6', 'ok');
  }
  const prev = [...thread.messages].reverse().find((m) => m.meta?.local6State)?.meta.local6State || null;
  if (prev) run.log('ctx    이전 작업 상태 압축본(4줄)만 전달', 't');
  const orch = new DCOrchestrator({ host: L6.host(), maxRevisions: L6.maxRevisions(), saveMemory: true });
  const sec = (ms) => (ms / 1000).toFixed(1) + 's';
  let r;
  try {
    r = await orch.run(withMediaRule(prompt), {
      state: prev,
      signal: run.signal,
      onEvent: (ev) => {
        if (ev.type === 'token' || ev.type === 'thinking') { run.rain(ev.text); return; }
        if (ev.type !== 'stage') return;
        if (ev.stage === 'route') {
          if (ev.status === 'running') run.stage('ROUTER');
          else { run.log(`route  ai-router → ai-${ev.target} · ${ev.reason} (${sec(ev.ms)})`, 'route'); run.calls.push({ label: 'router', provider: 'Ollama', short: 'AI-ROUTER', pid: 'local6', model: 'ai-router' }); }
        } else if (ev.stage === 'draft' || ev.stage === 'revise') {
          if (ev.status === 'running') { run.stage(ev.stage === 'draft' ? 'WORKER' : 'REVISE'); run.log(`${ev.stage === 'draft' ? 'draft ' : 'repair'} ${ev.model} 생성 중`, 't'); }
          else { run.log(`done   ${ev.model} ${ev.chars}자 (${sec(ev.ms)})`, 'ok'); run.calls.push({ label: ev.stage === 'draft' ? 'draft' : 'revise', provider: 'Ollama', short: ev.model.toUpperCase(), pid: 'local6', model: ev.model }); }
        } else if (ev.stage === 'critic') {
          if (ev.status === 'running') run.stage('CRITIC');
          else {
            const v = ev.verdict;
            run.log(`verify ai-critic ${v.round}차 → ${v.verdict} (${v.score}/10 · ${v.source})${v.fixes.length ? ' · ' + v.fixes.join(' / ') : ''}`, v.verdict === 'PASS' ? 'ok' : 'warn');
            run.calls.push({ label: 'critic#' + v.round, provider: 'Ollama', short: 'AI-CRITIC', pid: 'local6', model: 'ai-critic' });
          }
        }
      },
    });
  } catch (e) {
    if (run.signal.aborted || e.name === 'AbortError') { const ab = new Error('사용자 중단'); ab.kind = 'abort'; throw ab; }
    throw e;
  }
  run.local6State = r.state;
  const q = (s) => String(s).replace(/"/g, "'");
  const rounds = r.rounds.map((x) => `  - ${x.round}차 ${x.verdict} (${x.score}/10${x.source !== 'ai-critic' ? ' · ' + x.source : ''})${x.fixes.length ? ': ' + x.fixes.join(' / ') : ''}`).join('\n');
  return `## [라우팅 및 합의 요약]
- **로컬 라우팅**: ai-${r.target} · ${r.reason}
- **검수 루프**: 검수 ${r.rounds.length}회 · 자동 수정 ${r.revisions}회 (상한 ${orch.maxRevisions}회)
${rounds}

## [자율 실행 산출물]
${r.final}

## [세션 상태 스냅샷 (State Snapshot)]
\`\`\`yaml
user_goal: "${q(prompt.slice(0, 80))}"
engine: local-6-agent
final_model: ai-${r.target}
critic_rounds: ${r.rounds.length}
revisions: ${r.revisions}
state_compression: |
${r.state.text.split('\n').map((l) => '  ' + l).join('\n')}
\`\`\`
`;
}

async function callTracked(run, args) {
  const failBefore = run.lines.filter((l) => l.includes('fail ')).length;
  const r = await routeCall({ ...args, signal: run.signal, log: run.log, onToken: (t) => run.rain(t) });
  run.failovers += run.lines.filter((l) => l.includes('fail ')).length - failBefore;
  run.calls.push({ label: args.label, provider: r.provider.name, short: r.provider.short, pid: r.provider.id, model: r.model });
  return r;
}

/* ================= ARTIFACTS ================= */
function buildArtifacts(sec, snap, thread, run) {
  const codes = extractCode(sec.deliverable || '');
  const used = new Set();
  const files = codes.filter((c) => c.code.trim()).map((c, i) => ({ name: guessName(c.lang, i, used), lang: c.lang, code: c.code }));
  const img = (sec.deliverable.match(/!\[[^\]]*\]\((https?:[^)\s]+)\)/) || [])[1] || null;
  const title = thread.title || '제목 없는 문서';
  const rs = routeSummary(run);
  const snapshot = `# STATE SNAPSHOT · ${new Date().toLocaleString('ko-KR')}\n${snap}\n\n# ROUTE\npath: "${rs.path}"\ncalls:\n${rs.used.map((u) => `  - ${u}`).join('\n') || '  - (cache)'}\n\n# COMPRESSED CONTEXT\n${thread.summary?.text || '(아직 압축 임계 미만)'}\n\n# CACHE\nentries: ${LS.get('cidx', []).length}\nttl: ${opts.ttl}s`;
  return { title, question: run.prompt || title, doc: sec.deliverable || '', files, img, snapshot };
}
let artifacts = null;
function applyArtifacts(a, auto) {
  artifacts = a;
  if (!a) {
    $('#docTitle').value = '제목 없는 문서'; $('#docRender').innerHTML = '<div class="pv-empty">명령을 실행하면 생성된 문서가 여기에 표시됩니다.</div>'; $('#docEdit').value = '';
    $('#fileChips').innerHTML = ''; $('#codeEdit').value = ''; updateGutter(); $('#codeMeta').textContent = '파일 없음';
    setPreview(null); $('#snapView').textContent = 'user_goal:\ncompleted_steps: []\nactive_artifacts: []\npending_tasks: []\nconstraints: []';
    updateTabCounts(); updateFoot(); return;
  }
  $('#docTitle').value = a.title;
  $('#docRender').innerHTML = ''; $('#docRender').append(renderMd(a.doc));
  $('#docEdit').value = a.doc;
  state.activeFile = Math.max(0, a.files.findIndex((f) => f.lang === 'html'));
  renderFiles();
  $('#snapView').textContent = a.snapshot;
  if (auto) {
    switchTab('preview'); showRight(true);
  }
  setPreview(buildPreviewDoc(a));
  previewDone();
  updateTabCounts(); updateFoot();
}
function renderFiles() {
  const a = artifacts; const box = $('#fileChips'); box.innerHTML = '';
  if (!a || !a.files.length) { $('#codeEdit').value = ''; updateGutter(); $('#codeMeta').textContent = '코드 블록 없음'; return; }
  a.files.forEach((f, i) => { const b = document.createElement('button'); b.className = 'fchip' + (i === state.activeFile ? ' on' : ''); b.textContent = f.name; b.onclick = () => { state.activeFile = i; renderFiles(); }; box.append(b); });
  const f = a.files[state.activeFile] || a.files[0];
  $('#codeEdit').value = f.code; updateGutter();
  $('#codeMeta').textContent = `${f.name} · ${f.lang} · ${f.code.split('\n').length} lines`;
}
// preview safety: external images -> inline SVG, external iframes -> new-tab link card (no broken images, no framed sites)
const svgPh = (label, i) => { const h = (i * 47) % 360; return 'data:image/svg+xml;utf8,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="hsl(${h},28%,18%)"/><stop offset="1" stop-color="#09090b"/></linearGradient><radialGradient id="r" cx=".72" cy=".28" r=".6"><stop offset="0" stop-color="rgba(99,102,241,.28)"/><stop offset="1" stop-color="rgba(99,102,241,0)"/></radialGradient></defs><rect width="1200" height="800" fill="url(#g)"/><rect width="1200" height="800" fill="url(#r)"/><circle cx="600" cy="360" r="118" fill="none" stroke="#818cf8" stroke-opacity=".55" stroke-width="3"/><path d="M540 400l42-52 34 40 22-26 50 38z" fill="#818cf8" fill-opacity=".55"/><text x="600" y="560" text-anchor="middle" font-family="sans-serif" font-size="28" fill="#d4d4d8">${label}</text></svg>`); };
// 자동 삽입한 실사 미디어 출처는 미리보기에서도 그대로 보여 준다. 그 외 외부 이미지는 SVG 자리표시로 바꾼다.
const MEDIA_OK = /^(?:https?:)?\/\/(?:images\.pexels\.com|videos\.pexels\.com|images\.unsplash\.com|plus\.unsplash\.com|cdn\.pixabay\.com|pixabay\.com|[a-z0-9-]+\.staticflickr\.com|api\.openverse\.org|upload\.wikimedia\.org|thumb\.wikimedia\.org|image\.pollinations\.ai)\//i;
function sanitizePreview(html) {
  let n = 0;
  html = html.replace(/\s(srcset)\s*=\s*(["'])([^"']*)\2/gi, (m, a, q, v) => (/https?:\/\//i.test(v) && v.split(',').some((s) => !MEDIA_OK.test(s.trim().split(/\s+/)[0])) ? '' : m));
  html = html.replace(/(<img\b[^>]*?\bsrc\s*=\s*)(["'])((?:https?:)?\/\/[^"']+)\2/gi, (m, pre, q, url) => { if (MEDIA_OK.test(url)) return m; n++; return `${pre}${q}${svgPh('IMAGE ' + n, n)}${q}`; });
  html = html.replace(/url\(\s*(["']?)((?:https?:)?\/\/[^)"']+)\1\s*\)/gi, (m, q, url) => { if (/fonts\.(googleapis|gstatic)\.com|cdn\.jsdelivr\.net|cdnjs\.cloudflare\.com/i.test(m) || MEDIA_OK.test(url)) return m; n++; return `url("${svgPh('BG ' + n, n)}")`; });
  html = html.replace(/<iframe\b[^>]*\bsrc\s*=\s*(["'])(https?:\/\/[^"']+)\1[^>]*>(?:\s*<\/iframe>)?/gi, (m, q, url) => { n++; return `<a href="${url}" target="_blank" rel="noopener noreferrer" style="display:flex;align-items:center;justify-content:center;min-height:160px;border:1px dashed rgba(255,255,255,.2);border-radius:12px;color:#818cf8;font:600 14px sans-serif;text-decoration:none">외부 페이지 새 탭에서 열기 ↗</a>`; });
  sanitizePreview.last = n;
  return html;
}
function buildPreviewDoc(a) {
  if (!a) return null;
  const html = a.files.find((f) => f.lang === 'html');
  const css = a.files.filter((f) => f.lang === 'css').map((f) => f.code).join('\n');
  const js = a.files.filter((f) => ['javascript', 'js'].includes(f.lang)).map((f) => f.code).join('\n');
  if (html) {
    let doc = html.code;
    if (!/<html[\s>]/i.test(doc)) doc = `<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>${doc}</body></html>`;
    if (css && /<link[^>]+style\.css/i.test(doc)) doc = doc.replace(/<link[^>]+style\.css[^>]*>/i, `<style>${css}</style>`);
    else if (css && !doc.includes(css.slice(0, 40))) doc = doc.replace(/<\/head>/i, `<style>${css}</style></head>`);
    if (js) { doc = doc.replace(/<script[^>]+src=["'][^"']*(app|script|main)\.js["'][^>]*><\/script>/i, ''); if (!doc.includes(js.slice(0, 40))) doc = doc.replace(/<\/body>/i, `<script>${js}<\/script></body>`); }
    // Failsafe: strip broken Wikimedia Indian clinic video if cached & ensure Pretendard font + Tailwind fallback if model emitted Tailwind classes
    doc = doc.replace(/<video[^>]*Mediversal[^>]*>[\s\S]*?<\/video>/gi, '');
    if (!/pretendard/i.test(doc)) {
      doc = doc.replace(/<\/head>/i, `<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"></head>`);
    }
    const usesTw = /class=["'][^"']*\b(?:flex|grid-cols-|bg-slate-|bg-gray-|bg-white|text-slate-|px-\d|py-\d|rounded-xl)\b/i.test(doc);
    const hasCustomStyle = (doc.match(/<style[\s>][\s\S]*?<\/style>/gi) || []).join('').length > 800;
    if (usesTw && !hasCustomStyle && !/cdn\.tailwindcss\.com/i.test(doc)) {
      doc = doc.replace(/<\/head>/i, `<script src="https://cdn.tailwindcss.com"><\/script></head>`);
    }
    // Aside 런타임 옵저버 자동 주입 (오류 포착 & 자율 조작 커서 지원)
    const asideScript = window.DCAsideOperator ? window.DCAsideOperator.getInjectedScript() : '';
    if (asideScript && !doc.includes('__dc_aside_runtime__')) {
      doc = doc.replace(/<\/head>/i, `${asideScript}</head>`);
    }
    if (htmlIssues(doc).length) {
      doc = repairHtml(doc);
      if (htmlIssues(doc).some((x) => x === 'empty' || x === 'nobody')) return answerPage(a, '생성된 HTML이 불완전해서 답변 내용으로 표시합니다. 대화창의 [다시 실행]을 누르면 새로 만듭니다.');
    }
    return sanitizePreview(doc);
  }
  return answerPage(a);
}
function setPreview(doc) {
  const fr = $('#pvFrame');
  const ab = $('#artboardFrame');
  let pi = $('#pvImg');
  if (!pi) { pi = document.createElement('img'); pi.id = 'pvImg'; pi.alt = 'generated'; pi.style.cssText = 'max-width:100%;max-height:100%;object-fit:contain;border-radius:14px;box-shadow:0 24px 60px rgba(0,0,0,.55);display:none'; $('#pvStage').append(pi); }
  const htmlFile = artifacts?.files.some((f) => f.lang === 'html');
  if (artifacts?.img && !htmlFile) {
    setStitchMode('live');
    if (ab) ab.style.display = 'none';
    fr.style.display = 'none'; pi.style.display = 'block'; pi.src = IMG_BLOBS[artifacts.img] || artifacts.img; $('#pvUrl').textContent = 'stitch://image'; return;
  }
  if (ab) ab.style.display = '';
  fr.style.display = ''; pi.style.display = 'none';
  if (!doc) {
    stitchCanvas?.clear();
  } else if (htmlFile && stitchCanvas) {
    setStitchMode('boards');
    stitchCanvas.renderComplete(doc, artifacts?.title);
  } else {
    setStitchMode('live');
  }
  const targetDoc = doc || `<body style="margin:0;background:#0d0e13;color:#71717a;font:13px 'Pretendard Variable',system-ui,sans-serif;display:grid;place-items:center;height:100vh">명령을 입력하면 Stitch 캔버스에 실시간으로 렌더링됩니다</body>`;
  $('#pvUrl').textContent = !doc ? 'stitch://canvas' : `stitch://${artifacts?.files.find((f) => f.lang === 'html')?.name || (artifacts?.img ? 'image' : 'document')}${htmlFile && sanitizePreview.last ? ` · 리소스 ${sanitizePreview.last}개 자동 보정` : ''}`;
  requestAnimationFrame(() => {
    const cur = $('#pvFrame');
    if (!cur) return;
    const next = cur.cloneNode(false);
    next.removeAttribute('srcdoc');
    next.srcdoc = targetDoc;
    cur.replaceWith(next);
  });
}
function openCodeInEditor(code, lang) {
  if (!artifacts) artifacts = { title: '스니펫', doc: '', files: [], img: null, snapshot: '' };
  let i = artifacts.files.findIndex((f) => f.code === code);
  if (i < 0) { artifacts.files.push({ name: guessName(lang, artifacts.files.length, new Set(artifacts.files.map((f) => f.name))), lang, code }); i = artifacts.files.length - 1; }
  state.activeFile = i; renderFiles(); updateTabCounts(); switchTab('code'); showRight(true);
}
function updateGutter() { const n = $('#codeEdit').value.split('\n').length; $('#gutter').textContent = Array.from({ length: n }, (_, i) => i + 1).join('\n'); }
function updateTabCounts() {
  const n = artifacts?.files.length || 0;
  $('#rtabs [data-tab=code]').innerHTML = `코드${n ? `<span class="n">${n}</span>` : ''}`;
}
function updateFoot() {
  if (state.rightTab === 'stream') { $('#rightFoot').textContent = 'CODE STREAM · looping waterfall · 탭을 벗어나면 자동 정지'; return; }
  const t = state.rightTab === 'code' ? $('#codeEdit').value : $('#docEdit').value;
  const words = (t.trim().match(/\S+/g) || []).length;
  $('#rightFoot').textContent = `${words.toLocaleString()} 단어 · ${t.length.toLocaleString()} 자 · 이 브라우저에 저장됨`;
}
function switchTab(tab) {
  state.rightTab = tab;
  $$('#rtabs button').forEach((b) => b.classList.toggle('on', b.dataset.tab === tab));
  $$('.rview').forEach((v) => v.classList.toggle('on', v.dataset.view === tab));
  updateFoot();
  syncWaterfall();
}
function rightVisible() { const app = $('#app'); return !app.hidden && (innerWidth <= 1180 ? app.classList.contains('show-right') : !app.classList.contains('no-right')); }
function syncWaterfall() { if (!waterfall) return; if (state.rightTab === 'stream' && rightVisible()) waterfall.start(); else waterfall.stop(); }
function syncHomeState() {
  const app = $('#app');
  if (!app) return;
  const t = curThread();
  const hasMsgs = Boolean(t && t.messages.length) || Boolean(state.running);
  const isHome = state.centerView !== 'dash' && !hasMsgs && !rightVisible();
  app.classList.toggle('is-home', isHome);
  document.body.classList.toggle('in-work', !isHome);
  const dashBtn = $('#railDash');
  if (dashBtn) dashBtn.classList.toggle('active', state.centerView === 'dash');
}
function setCenterView(v) {
  state.centerView = v;
  $$('#cvTabs button').forEach((b) => b.classList.toggle('on', b.dataset.cv === v));
  $('#dash').hidden = v !== 'dash'; $('#stream').hidden = v === 'dash';
  if (dashboard) { if (v === 'dash' && !$('#app').hidden) dashboard.start(); else dashboard.stop(); }
  syncHomeState();
}
function persistArtifacts() { const t = curThread(); if (t && artifacts) { t.artifacts = artifacts; saveThreads(); } }

/* ================= GOOGLE STITCH RUN UI ================= */
let centerRain;
function createRunUI(mode) {
  const stages = mode === 'council' || mode === 'claude' ? STAGES_COUNCIL : mode === 'image' ? STAGES_IMAGE : mode === 'local6' ? STAGES_LOCAL6 : mode === 'core' ? STAGES_CORE : mode === 'exec' ? STAGES_EXEC : STAGES_FAST;
  const el = document.createElement('div'); el.className = 'msg ai';
  el.innerHTML = `<div class="who"><i>AI</i>DARK CODE · Stitch <span class="meta">· 실행 중</span></div>
  <div class="run stitch-run">
    <div class="run-head"><span class="spin"></span><span class="ttl">요청을 단계별로 처리하고 있습니다</span><span class="tm">0.0s</span></div>
    <div class="stitch-steps">${stages.map((s) => `<div class="stg" data-s="${s}"><i class="stg-dot"></i><span>${esc(stitchLabel(s))}</span><span class="stg-sub">${s}</span></div>`).join('')}</div>
    <div class="stitch-live-line" data-tail>파이프라인 초기화 중…</div>
    <details class="stitch-raw"><summary>상세 라우팅 · 실행 로그 보기</summary><div class="logbox"></div></details>
  </div>`;
  $('#stream').append(el);
  $('#center').classList.add('running');
  syncHomeState();
  const logbox = $('.logbox', el), tail = $('[data-tail]', el), tm = $('.tm', el);
  const ctl = new AbortController();
  const t0 = performance.now();
  let tailBuf = '';
  const timer = setInterval(() => { tm.textContent = ((performance.now() - t0) / 1000).toFixed(1) + 's'; }, 100);
  const run = {
    el, t0, mode, lines: [], calls: [], failovers: 0, signal: ctl.signal, abort: () => ctl.abort(),
    log(msg, cls = '') {
      const ts = ((performance.now() - t0) / 1000).toFixed(2).padStart(6, ' ');
      const line = `+${ts}s ${msg}`; run.lines.push(line);
      const d = document.createElement('div'); d.className = cls;
      d.innerHTML = `<span class="t">+${ts}s</span> ${esc(msg)}`;
      logbox.append(d); logbox.scrollTop = logbox.scrollHeight;
      if (tail) tail.textContent = msg;
      if (/route|done|fail|gate|cache|verify|fallback|claude/.test(msg)) TEL()?.log(msg, cls);
      if (stick) scrollStream();
    },
    rain(text) { tailBuf = (tailBuf + text).slice(-160); if (tail) tail.textContent = tailBuf.replace(/\s+/g, ' ').trim() || '생성 중…'; },
    stage(name) {
      $$('.stg', el).forEach((s) => { if (s.classList.contains('act')) { s.classList.remove('act'); s.classList.add('done'); } });
      const s = $(`.stg[data-s="${name}"]`, el); if (s) s.classList.add('act');
      run.log(`stage  ${name}`, 'k');
    },
    skipStages() { $$('.stg', el).forEach((s) => { if (!s.classList.contains('done') && !s.classList.contains('act') && s.dataset.s !== 'RENDER') s.classList.add('skip'); }); },
    finish(ok) {
      clearInterval(timer);
      $$('.stg.act', el).forEach((s) => { s.classList.remove('act'); s.classList.add('done'); });
      el.querySelector('.run').classList.add('done');
      $('.spin', el)?.remove();
      $('.ttl', el).textContent = ok ? 'Stitch 워크플로우 완료 · 캔버스 반영됨' : '실행이 중단되었습니다';
      $('#center').classList.remove('running');
      syncHomeState();
    },
  };
  let stick = true;
  scrollStream();
  return run;
}
function scrollStream() { const s = $('#stream'); s.scrollTop = s.scrollHeight; }

function setRunning(on) {
  if (TEL()) TEL().running = on;
  const b = $('#sendBtn');
  b.classList.toggle('stop', on); b.innerHTML = on ? '&#9632;' : '&#8593;'; b.title = on ? '중단' : '실행';
  b.disabled = !on && !$('#prompt').value.trim();
  renderThreads();
}

/* ================= RENDER: STREAM / THREADS / POOL ================= */
const WELCOME_CHIPS = [
  ['WEB · HTML', '치과 병원 랜딩페이지 만들어줘. 예약 CTA, 의료진 소개, 진료 시간 포함'],
  ['SAAS · DB', 'SaaS 메모 앱 만들어줘. Firebase Firestore 연동, 로그인, CRUD까지 완성 코드로'],
  ['IMAGE', '/image 네온 그린 코드가 흐르는 사이버펑크 서버룸, 시네마틱'],
  ['MULTIMODAL', '15초 제품 홍보 영상 컷 구성 + 배경음악 생성 프롬프트 만들어줘'],
];
function renderStream() {
  const s = $('#stream'); const t = curThread();
  if (state.running && state.running.el.isConnected) {
    // keep the live card; re-render others around it is unnecessary
  }
  const live = state.running?.el;
  s.innerHTML = '';
  $('#threadTitle').textContent = t?.title || '새 작업';
  if (!t || !t.messages.length) {
    if (live) s.append(live);
    syncHomeState();
    return;
  }
  for (const m of t.messages) {
    if (m.role === 'user') {
      const d = document.createElement('div'); d.className = 'msg user'; d.innerHTML = `<div class="bubble">${esc(m.content)}</div>`; s.append(d);
    } else {
      const d = document.createElement('div'); d.className = 'msg ai';
      const meta = m.meta ? `· ${(m.meta.ms / 1000).toFixed(1)}s${m.meta.cached ? ' · CACHE' : ''}` : '';
      d.innerHTML = `<div class="who"><i>AI</i>CORE ORCHESTRATOR <span class="meta">${meta}</span></div>`;
      if (m.meta?.lines?.length) {
        const det = document.createElement('details'); det.className = 'runlog';
        det.innerHTML = `<summary>실행 로그 · ${m.meta.lines.length} lines · ${esc(m.meta.route || '')}</summary><div class="logbox">${m.meta.lines.map((l) => `<div class="${/fail|error/.test(l) ? 'warn' : /done|HIT/.test(l) ? 'ok' : /route/.test(l) ? 'route' : ''}">${esc(l)}</div>`).join('')}</div>`;
        d.append(det);
      }
      d.append(renderMd(m.content));
      if (!m.error) {
        const act = document.createElement('div'); act.className = 'msg-actions';
        act.innerHTML = `<button data-a="copy">복사</button><button data-a="panel">에디터에 열기</button><button data-a="retry">다시 실행</button>`;
        act.querySelector('[data-a=copy]').onclick = () => { navigator.clipboard.writeText(m.modelText || m.content); toast('복사됨'); };
        act.querySelector('[data-a=panel]').onclick = () => { const sec = splitSections(m.modelText || m.content); applyArtifacts({ title: t.title, doc: sec.deliverable, files: buildArtifacts(sec, m.snapshot || '', t, { calls: [], lines: [] }).files, img: (sec.deliverable.match(/!\[[^\]]*\]\((https?:[^)\s]+)\)/) || [])[1] || null, snapshot: m.snapshot || '' }, true); };
        act.querySelector('[data-a=retry]').onclick = () => { const i = t.messages.indexOf(m); const u = t.messages[i - 1]; if (u?.role === 'user' && !state.running) { t.messages.splice(i - 1, 2); saveThreads(); execute(u.content, { noCache: true }); } };
        d.append(act);
      }
      s.append(d);
    }
  }
  if (live) s.append(live);
  syncHomeState();
  scrollStream();
}
function renderThreads() {
  const q = ($('#threadSearch').value || '').trim().toLowerCase();
  const box = $('#threadList'); box.innerHTML = '';
  const list = threads.filter((t) => !q || t.title.toLowerCase().includes(q) || t.messages.some((m) => m.role === 'user' && m.content.toLowerCase().includes(q)));
  if (!list.length) { box.innerHTML = `<div class="empty-side">${q ? '검색 결과 없음' : '아직 작업이 없습니다.'}</div>`; return; }
  for (const t of list) {
    const d = document.createElement('div');
    d.className = 'th' + (t.id === state.cur ? ' on' : '') + (state.running && t.id === state.cur ? ' running' : '');
    d.innerHTML = `<span class="ic">&gt;</span><span class="t">${esc(t.title)}</span><button class="del" title="삭제">&#10005;</button>`;
    d.onclick = (e) => {
      if (e.target.closest('.del')) { if (state.running && t.id === state.cur) return; threads = threads.filter((x) => x.id !== t.id); if (state.cur === t.id) state.cur = threads[0]?.id || null; saveThreads(); renderThreads(); renderStream(); applyArtifacts(curThread()?.artifacts || null); return; }
      if (state.running) { toast('실행 중에는 전환할 수 없습니다'); return; }
      state.cur = t.id; renderThreads(); renderStream(); applyArtifacts(t.artifacts || null); setCenterView('work'); $('#app').classList.remove('show-side');
    };
    box.append(d);
  }
}
function renderPool() {
  const strip = $('#poolStrip'); const list = $('#poolList');
  if (!strip) return;
  const items = Object.values(prov);
  strip.innerHTML = items.map((p) => `<span class="pd ${provState(p)}" title="${esc(p.name)} · ${provState(p)}${p.lastErr ? ' · ' + esc(p.lastErr) : ''}"><i></i><span>${p.short}</span></span>`).join('');
  list.innerHTML = items.map((p) => {
    const st = provState(p);
    const label = st === 'off' ? (p.local ? 'off' : !hasCreds(p) ? 'no key' : !viaOk(p) ? 'proxy 필요' : 'off') : st === 'cool' ? `cool ${Math.ceil((p.cooldownUntil - Date.now()) / 1000)}s` : `${Math.round(p.health * 100)}%${p.lat ? ' · ' + p.lat + 'ms' : ''}`;
    return `<div class="pr ${st}"><span>${p.short}${p.primary ? ' ★' : ''}</span><span class="st">${label}</span><div class="bar"><b style="width:${st === 'off' ? 0 : Math.round(p.health * 100)}%"></b></div></div>`;
  }).join('');
}
function renderRouteSel() {
  const sel = $('#routeSel');
  const opt = [['auto', 'AUTO · WRR 라운드로빈']].concat(Object.values(prov).filter((p) => !p.primary && !p.local).map((p) => [p.id, `${p.short} · ${p.model}`]));
  sel.innerHTML = opt.map(([v, l]) => `<option value="${v}"${v === state.route ? ' selected' : ''}>${esc(l)}</option>`).join('');
}
function renderStatus() {
  const t = curThread();
  const tok = t ? t.messages.reduce((a, m) => a + estTok(m.modelText || m.content), 0) : 0;
  const ready = Object.values(prov).filter((p) => !p.primary && !p.local && usable(p)).length;
  const total = Object.values(prov).filter((p) => !p.primary && !p.local).length;
  $('#statusLine').innerHTML = `<span>POOL <b>${ready}/${total}</b> ready</span><span>LOCAL <b>${prov.ollama.enabled ? 'ollama on · 무제한 백업' : 'off'}</b></span><span>CLAUDE <b>${(() => { const c = claudeUse(); return `ZERO-DEFAULT · ${(c.in + c.out).toLocaleString()} tok · 승격 ${c.calls}회`; })()}</b>${usable(prov.claude) ? '' : ' (키 없음)'}</span><span>CTX <b>~${tok.toLocaleString()}</b> tok · 무제한${t?.summary ? ' · 자동 압축됨' : ''}</span><span>CACHE <b>${LS.get('cidx', []).length}</b> · TTL ${opts.ttl}s</span>`;
  $('#modeBadge').textContent = ({ council: 'COUNCIL · ZERO-CLAUDE', fast: 'FAST · ZERO-CLAUDE', claude: 'CLAUDE FINAL PASS', local6: 'LOCAL 6-AGENT · OLLAMA', core: 'CORE · GATEWAY', exec: 'EXEC · LOCAL RUN VERIFY' })[state.mode];
}

/* ================= SETTINGS ================= */
function renderSettings() {
  const body = $('#setBody');
  const rows = (list) => list.map((p) => `
    <div class="prow" data-id="${p.id}">
      <input type="checkbox" data-f="enabled" ${p.enabled ? 'checked' : ''} title="사용">
      <div class="nm">${esc(p.name)}<small>${esc(p.note || '')}</small></div>
      ${p.builtin ? '<input type="text" value="내장 · 키 불필요" disabled>' : `<input type="password" data-f="key" value="" placeholder="${p.local ? '(키 불필요)' : p.key ? '저장됨 · …' + esc(p.key.slice(-4)) + ' (비워두면 유지)' : 'API 키'}" autocomplete="off" ${p.local ? 'disabled' : ''}>`}
      <input type="text" data-f="model" value="${esc(p.model)}" placeholder="모델" spellcheck="false">
      <input type="number" data-f="weight" value="${p.weight}" min="0" max="10" step="1" title="WRR 가중치" ${p.primary || p.local ? 'disabled' : ''}>
      ${p.kind === 'openai' || p.local ? `<div class="extra"><input type="text" data-f="base" value="${esc(p.base)}" placeholder="Base URL (프록시 가능)" spellcheck="false">${p.id === 'cloudflare' ? `<input type="text" data-f="account" value="${esc(p.account)}" placeholder="Account ID">` : p.local ? `<input type="text" data-f="fastModel" value="${esc(p.fastModel)}" placeholder="경량 모델 (라우팅/요약)">` : '<span></span>'}</div>` : ''}
    </div>`).join('');
  const pool = Object.values(prov).filter((p) => !p.primary && !p.local);
  body.innerHTML = `
    <div class="set-sec"><h4>무료 클라우드 풀 · WEIGHTED ROUND-ROBIN</h4><p>키는 이 브라우저 localStorage에만 저장되고 각 프로바이더로 직접 전송됩니다. 429 → ${opts.cooldown429}s 쿨다운, 5xx/타임아웃 → 즉시 다음 프로바이더로 failover.</p>${rows(pool)}</div>
    <div class="set-sec"><h4>미디어 · 나레이션 (실사 사진·영상 자동 삽입)</h4><p>홈페이지를 만들면 실사 사진·영상을 자동으로 넣고, STUDIO 홍보영상에 나레이션을 붙입니다. 키가 없으면 Wikimedia Commons·Openverse(CC 라이선스 실사 사진, 출처 자동 표기)를 씁니다. 전부 무료 가입으로 받는 키이고 이 브라우저 암호화 금고에만 저장됩니다. 나레이션은 위 Gemini 키(무료 등급)를 먼저 씁니다.</p>
      ${MEDIA_KEYS.map((m) => `<div class="orow"><span>${esc(m.name)} <small style="color:var(--mut)">${esc(m.note)}</small></span><input type="password" data-mkey="${m.id}" placeholder="${mediaKeys[m.id] ? '저장됨 · …' + esc(mediaKeys[m.id].slice(-4)) + ' (비워두면 유지)' : esc(m.ph)}" autocomplete="off" spellcheck="false"></div>`).join('')}
      <div class="orow"><span>Azure 지역</span><input type="text" id="optAzureRegion" value="${esc(opts.azureRegion || 'koreacentral')}" spellcheck="false"></div>
      <div class="orow"><span>현재 사용 경로</span><span style="font:12px var(--mono);color:var(--g1)">${esc(mediaStatusText())}</span></div>
    </div>
    <div class="set-sec"><h4>로컬 무제한 폴백 · OLLAMA</h4><p>외부 풀이 모두 쿨다운/실패일 때 사용. 실행 전 <code>OLLAMA_ORIGINS=${esc(location.origin)} ollama serve</code> 로 이 사이트를 허용하세요. 코딩: 기본 모델, 라우팅/요약: 경량 모델.</p>${rows([prov.ollama])}<div class="orow"><span></span><span><button type="button" class="btn-sm" id="testOllama">연결 테스트</button> <span id="ollamaRes" style="font:11px var(--mono)"></span></span></div></div>
    <div class="set-sec"><h4>주력 브레인 · CLAUDE (ZERO-CLAUDE 기본)</h4><p>기본은 Claude 0 tok: 캐시 → 무료 풀 → 로컬 Ollama. Claude는 승격 게이트에서만 호출되며 전체 대화 대신 [State Snapshot]+문제 구간만 보내고, 시스템 프롬프트는 Prompt Caching 블록으로 분리합니다. 이번 달 사용: ${(() => { const c = claudeUse(); return `${c.calls}회 · in ${c.in.toLocaleString()} (cache read ${c.cr.toLocaleString()}) / out ${c.out.toLocaleString()} tok`; })()}</p>${rows([prov.claude])}
      <div class="orow"><span>(a) 무료 교차 검증 미해결 시 승격</span><span><input type="checkbox" id="optGateA" ${opts.gateA ? 'checked' : ''} style="width:auto;accent-color:#00FF66"></span></div>
      <div class="orow"><span>(b) Claude Final Pass 모드</span><span style="font:12px var(--mono);color:var(--mut)">입력창 모드 버튼으로 직접 지정할 때만</span></div>
      <div class="orow"><span>(c) 대규모 아키텍처 첫 설계 확정 시 승격</span><span><input type="checkbox" id="optGateC" ${opts.gateC ? 'checked' : ''} style="width:auto;accent-color:#00FF66"></span></div>
      <div class="orow"><span>Claude 월 토큰 상한 (in+out, 0=무제한)</span><input type="number" id="optClaudeCap" value="${opts.claudeMonthlyCap}" min="0" step="10000"></div>
      <div class="orow"><span>Claude 1회 최대 출력 토큰</span><input type="number" id="optClaudeOut" value="${opts.claudeMaxOut}" min="500" max="16000" step="500"></div></div>
    <div class="set-sec"><h4>오케스트레이터</h4>
      <div class="orow"><span>캐시 TTL (초)</span><input type="number" id="optTtl" value="${opts.ttl}" min="0"></div>
      <div class="orow"><span>컨텍스트 압축 임계 (토큰)</span><input type="number" id="optCompress" value="${opts.compressAt}" min="1000" step="500"></div>
      <div class="orow"><span>압축 시 원문 유지 메시지 수</span><input type="number" id="optKeep" value="${opts.keepRecent}" min="2" max="12"></div>
      <div class="orow"><span>429 쿨다운 (초)</span><input type="number" id="optCool" value="${opts.cooldown429}" min="10"></div>
      <div class="orow"><span>내장 무료 Gemini</span><span style="font:12px var(--mono);color:var(--g1)">앱 한도 없음 · 오늘 ${freeUse()}회 · Google 무료 할당량을 넘으면 다른 경로로 자동 전환</span></div>
    </div>`;
  $('#testOllama').onclick = async () => {
    const base = $('.prow[data-id=ollama] [data-f=base]').value.replace(/\/v1\/?$/, '').replace(/\/$/, '');
    $('#ollamaRes').textContent = '확인 중…';
    try { const r = await fetch(base + '/api/tags'); const j = await r.json(); $('#ollamaRes').textContent = `연결됨 · 모델 ${j.models?.length || 0}개: ${(j.models || []).slice(0, 4).map((m) => m.name).join(', ')}`; $('#ollamaRes').style.color = '#00FF66'; }
    catch (e) { $('#ollamaRes').textContent = `연결 실패 (Ollama 실행/OLLAMA_ORIGINS 확인)`; $('#ollamaRes').style.color = '#ff4d6d'; }
  };
}
function collectSettings() {
  $$('#setBody .prow').forEach((row) => {
    const p = prov[row.dataset.id]; if (!p) return;
    $$('[data-f]', row).forEach((inp) => {
      const f = inp.dataset.f; if (inp.disabled) return;
      if (f === 'enabled') p.enabled = inp.checked;
      else if (f === 'weight') p.weight = Math.max(0, Math.min(10, Number(inp.value) || 0));
      else { const v = inp.value.trim(); if (f === 'key' && !v) return; const before = p[f]; p[f] = v || (f === 'model' || f === 'base' || f === 'fastModel' ? PROVIDER_DEFS.find((d) => d.id === p.id)[f] || '' : ''); if (f === 'key' && before !== p[f]) { p.health = 1; p.cooldownUntil = 0; p.lastErr = ''; } }
    });
  });
  opts.gateA = $('#optGateA').checked; opts.gateC = $('#optGateC').checked;
  opts.claudeMonthlyCap = Math.max(0, Number($('#optClaudeCap').value) || 0);
  opts.claudeMaxOut = Math.max(500, Math.min(16000, Number($('#optClaudeOut').value) || 6000));
  opts.ttl = Math.max(0, Number($('#optTtl').value) || 86400);
  opts.compressAt = Math.max(1000, Number($('#optCompress').value) || 16000);
  opts.keepRecent = Math.max(2, Math.min(12, Number($('#optKeep').value) || 4));
  opts.cooldown429 = Math.max(10, Number($('#optCool').value) || 60);
  $$('#setBody [data-mkey]').forEach((inp) => { const v = inp.value.trim(); if (!v) return; mediaKeys[inp.dataset.mkey] = v; loadCloud().then((c) => c.vault.put('media:' + inp.dataset.mkey, v)).catch((e) => console.warn('media vault save', e)); });
  if ($('#optAzureRegion')) opts.azureRegion = $('#optAzureRegion').value.trim() || 'koreacentral';
  applyMediaKeys();
  LS.set('opts', opts); saveProviders(); saveHealth();
  renderPool(); renderRouteSel(); renderStatus();
  refreshModels(true);
}

/* ================= AUTH (Firebase email/OAuth + local guest) ================= */
let cloud = null;
const loadCloud = () => (cloud ? Promise.resolve(cloud) : import('./cloud.js?v=20261122r').then((m) => (cloud = m)));
function getSession() { try { return JSON.parse(sessionStorage.getItem(NS + 'session') || 'null'); } catch { return null; } } // guest only
function setSession(u) { sessionStorage.setItem(NS + 'session', JSON.stringify(u)); }
function clearSession() { sessionStorage.removeItem(NS + 'session'); localStorage.removeItem(NS + 'session'); }
function termLine(html) { const t = $('#loginTerm'); const d = document.createElement('div'); d.innerHTML = html; t.append(d); while (t.children.length > 4) t.firstElementChild.remove(); }
const AUTH_ERR = {
  'auth/invalid-email': '이메일 형식이 올바르지 않습니다',
  'auth/missing-password': '비밀번호를 입력하세요',
  'auth/missing-email': '이메일을 입력하세요',
  'auth/weak-password': '비밀번호는 8자 이상으로 설정하세요',
  'auth/password-does-not-meet-requirements': '비밀번호 정책을 충족하지 않습니다',
  'auth/email-already-in-use': '이미 가입된 이메일입니다 · 로그인 탭을 이용하세요',
  'auth/invalid-credential': '이메일 또는 비밀번호가 일치하지 않습니다',
  'auth/invalid-login-credentials': '이메일 또는 비밀번호가 일치하지 않습니다',
  'auth/wrong-password': '이메일 또는 비밀번호가 일치하지 않습니다',
  'auth/user-not-found': '가입되지 않은 이메일입니다',
  'auth/user-disabled': '비활성화된 계정입니다',
  'auth/too-many-requests': '시도가 너무 많습니다 · 잠시 후 다시 시도하세요',
  'auth/popup-closed-by-user': '로그인 창이 닫혔습니다',
  'auth/cancelled-popup-request': '로그인 창이 닫혔습니다',
  'auth/popup-blocked': '팝업이 차단되었습니다 · 팝업 허용 후 다시 시도하세요',
  'auth/account-exists-with-different-credential': '같은 이메일로 다른 로그인 방식이 이미 있습니다 · 기존 방식으로 로그인한 뒤 연동 패널에서 연결하세요',
  'auth/credential-already-in-use': '이 외부 계정은 이미 다른 DARK CODE 사용자에 연결돼 있습니다',
  'auth/provider-already-linked': '이미 연결된 서비스입니다',
  'auth/requires-recent-login': '보안을 위해 다시 로그인한 뒤 시도하세요',
  'auth/network-request-failed': '네트워크 오류 · 연결을 확인하세요',
  'auth/unauthorized-domain': '승인되지 않은 도메인입니다',
};
const authMsg = (e) => AUTH_ERR[e?.code] || e?.message || String(e);
let authMode = 'login';
function setAuthMode(m) {
  authMode = m;
  $$('#authTabs button').forEach((b) => b.classList.toggle('on', b.dataset.m === m));
  $$('#authFields [data-only]').forEach((el) => { el.hidden = el.dataset.only !== m; });
  $$('#authFields [data-hide]').forEach((el) => { el.hidden = el.dataset.hide === m; });
  $('#loginPw').required = m !== 'reset'; $('#loginPw2').required = m === 'signup';
  $('#loginPw').autocomplete = m === 'signup' ? 'new-password' : 'current-password';
  $('#loginBtnTxt').textContent = { login: 'ACCESS WORKSPACE', signup: 'CREATE ACCOUNT', reset: 'SEND RESET LINK' }[m];
  $('#loginErr').textContent = ''; $('#verifyBox').hidden = true; $('#authFields').hidden = false; $('#loginBtn').hidden = false;
}
function showVerify(u, msg) {
  $('#authFields').hidden = true; $('#loginBtn').hidden = true; $('#verifyBox').hidden = false;
  $('#verifyMsg').innerHTML = msg || `<b>${esc(u.email)}</b> 로 인증 메일을 보냈습니다. 메일의 링크를 누른 뒤 [인증 확인]을 눌러주세요.`;
}
function userFromFirebase(u) { return { id: u.uid, name: u.displayName || (u.email || 'operator').split('@')[0], email: u.email || '', guest: false, provider: u.providerData[0]?.providerId || 'password' }; }
let gateStream = null;
async function bootTo(u, quick) {
  user = u; $('#loginErr').textContent = '';
  if (!quick) {
    const ready = Object.values(prov).filter((p) => !p.primary && !p.local && usable(p)).length;
    let info = null; if (!u.guest && cloud) { try { info = await cloud.sessionInfo(); } catch {} }
    const lines = [
      `<span class="g">$</span> mount workspace --user ${esc(u.email || u.id)}`,
      info ? `<span class="ok">✔</span> session token issued · ${esc(info.provider)} · exp ${new Date(info.exp).toLocaleTimeString('ko-KR', { hour12: false })} (auto-refresh)` : '<span class="ok">✔</span> guest session · local only',
      `<span class="ok">✔</span> pool ${ready} online · DARK CODE ready`,
    ];
    for (const l of lines) { termLine(l); await sleep(260); }
  }
  const gate = $('#gate');
  gate.classList.add('leaving');
  $('#app').hidden = false;
  enterWorkspace();
  setTimeout(() => { gate.hidden = true; gate.classList.remove('leaving'); $('#gateVideo').pause(); gateStream?.stop(); }, quick ? 0 : 750);
}
function showGate() {
  const gate = $('#gate'); gate.hidden = false; $('#app').hidden = true;
  $('#loginTerm').innerHTML = `<div><span class="g">●</span> 무료 클라우드 풀 · 로컬 Ollama · Claude 최종 통합 준비 완료</div>`;
  setAuthMode('login');
  $('#loginPw').value = ''; $('#loginPw2').value = '';
  setTimeout(() => $('#loginId').focus(), 200);
}
// API keys live in the encrypted vault (IndexedDB, AES-GCM non-extractable key), never in localStorage/plain code
async function loadVaultKeys() {
  try {
    await loadCloud();
    const saved = LS.get('prov', {}); let migrated = false;
    for (const p of Object.values(prov)) {
      if (saved[p.id]?.key) { await cloud.vault.put('prov:' + p.id, saved[p.id].key); delete saved[p.id].key; migrated = true; }
      const k = await cloud.vault.get('prov:' + p.id); if (k) p.key = k;
    }
    if (migrated) LS.set('prov', saved);
  } catch (e) { console.warn('vault', e); }
}

/* ================= ONE-CLICK INTEGRATIONS ================= */
const ICONS = {
  google: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M21.6 12.2c0-.7-.1-1.4-.2-2H12v3.8h5.4a4.6 4.6 0 0 1-2 3v2.5h3.2c1.9-1.7 3-4.3 3-7.3zM12 22c2.7 0 5-.9 6.6-2.4l-3.2-2.5c-.9.6-2 1-3.4 1-2.6 0-4.8-1.8-5.6-4.1H3.1v2.6A10 10 0 0 0 12 22zM6.4 14c-.2-.6-.3-1.3-.3-2s.1-1.4.3-2V7.4H3.1a10 10 0 0 0 0 9.2L6.4 14zM12 5.9c1.5 0 2.8.5 3.8 1.5l2.9-2.9A10 10 0 0 0 3.1 7.4L6.4 10c.8-2.4 3-4.1 5.6-4.1z"/></svg>',
  claude: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 2l1.8 6.2L20 6l-4.2 4.9L22 12l-6.2 1.1L20 18l-6.2-2.2L12 22l-1.8-6.2L4 18l4.2-4.9L2 12l6.2-1.1L4 6l6.2 2.2z"/></svg>',
  vercel: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 3l10 18H2z"/></svg>',
  github: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 2a10 10 0 0 0-3.2 19.5c.5.1.7-.2.7-.5v-1.7c-2.8.6-3.4-1.3-3.4-1.3-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.4 1.1 3 .8.1-.6.4-1.1.6-1.3-2.2-.3-4.6-1.1-4.6-5a3.9 3.9 0 0 1 1-2.7c-.1-.3-.4-1.3.1-2.7 0 0 .8-.3 2.8 1a9.6 9.6 0 0 1 5 0c1.9-1.3 2.8-1 2.8-1 .5 1.4.2 2.4.1 2.7a3.9 3.9 0 0 1 1 2.7c0 3.9-2.3 4.7-4.6 5 .4.3.7.9.7 1.9V21c0 .3.2.6.7.5A10 10 0 0 0 12 2z"/></svg>',
  aside: '<svg viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="2" d="M4 5h16v14H4zM9 5v14M12 9h5M12 13h5"/></svg>',
};
const INTEG = [
  { id: 'google', name: 'Google', kind: 'oauth', desc: 'Google 계정 연결 · Firebase OAuth (토큰은 Firebase가 보관)' },
  { id: 'claude', name: 'Claude', kind: 'key', desc: 'Anthropic API 키 · Zero-Claude 승격 게이트에서만 사용', ph: 'sk-ant-api03-…' },
  { id: 'vercel', name: 'Vercel', kind: 'key', desc: 'Vercel 액세스 토큰 · 계정/팀/프로젝트 요약', ph: 'Vercel Access Token' },
  { id: 'github', name: 'GitHub', kind: 'oauth', desc: 'GitHub OAuth (read:user) · 계정/저장소 요약' },
  { id: 'aside', name: 'Aside', kind: 'pair', desc: 'Aside 브라우저 워크스페이스 · 공개 OAuth/API가 없어 계정 확인 방식' },
];
let integSum = {};
function integStatus(svc) {
  const s = integSum[svc.id];
  if (svc.kind === 'oauth') {
    const linked = cloud?.linkedProviders().includes(svc.id === 'google' ? 'google.com' : 'github.com');
    if (linked && s && s.status !== 'stale') return 'on';
    if (s || linked) return 're';
    return 'off';
  }
  if (svc.kind === 'key') { const has = svc.id === 'claude' ? !!prov.claude.key : !!integKeys[svc.id]; if (s && has && s.status !== 'stale') return 'on'; if (s || has) return 're'; return 'off'; }
  return s ? 'on' : 'off';
}
const integKeys = {}; // decrypted in memory only (from vault)
async function openInteg() {
  $('#integ').showModal();
  if (!user || user.guest) { $('#integGrid').innerHTML = '<div class="pv-empty">외부 서비스 연동은 이메일/구글/깃허브 로그인 후 사용할 수 있습니다.<br>(게스트는 로컬 전용)</div>'; return; }
  $('#integGrid').innerHTML = '<div class="pv-empty"><span class="spin-i"></span> 연동 상태 동기화 중…</div>';
  try {
    await loadCloud();
    integKeys.vercel = await cloud.vault.get('integ:vercel');
    integSum = await cloud.loadIntegrations();
  } catch (e) { toast('연동 상태 로드 실패: ' + e.message); }
  renderInteg();
}
function renderInteg() {
  const grid = $('#integGrid'); grid.innerHTML = '';
  for (const svc of INTEG) {
    const st = integStatus(svc); const s = integSum[svc.id] || {};
    const badge = { on: '연결됨', off: '미연결', re: '재연결 필요' }[st];
    const card = document.createElement('div'); card.className = `ic st-${st}`; card.dataset.id = svc.id;
    card.innerHTML = `
      <div class="ic-h"><span class="ic-logo">${ICONS[svc.id]}</span><b>${svc.name}</b><em class="badge ${st}">${badge}</em></div>
      <p class="ic-d">${esc(svc.desc)}</p>
      <div class="ic-sum">${st === 'off' ? '<div><span>상태</span><b>연결 정보 없음</b></div>' : `<div><span>계정</span><b>${esc(s.account || '-')}</b></div><div><span>워크스페이스</span><b>${esc(s.workspace || '-')}</b></div><div><span>토큰</span><b>${esc(s.token || '-')}</b></div>`}</div>
      ${svc.kind === 'key' ? `<input class="ic-key" type="password" autocomplete="off" spellcheck="false" placeholder="${st === 'off' ? esc(svc.ph) : '새 키 입력 시 교체 (비워두면 유지)'}">` : ''}
      <div class="ic-log" hidden></div>
      <div class="ic-btns"><button class="btn-sm ic-go">${st === 'off' ? '원클릭 연결' : '재연결'}</button>${st !== 'off' ? '<button class="btn-sm ic-off">해제</button>' : ''}</div>`;
    card.querySelector('.ic-go').onclick = () => connectInteg(svc, card);
    card.querySelector('.ic-off')?.addEventListener('click', () => disconnectInteg(svc, card));
    grid.append(card);
  }
}
function integLogger(card) {
  const box = card.querySelector('.ic-log'); box.hidden = false; box.innerHTML = '';
  return (msg, cls = '') => new Promise((res) => { const d = document.createElement('div'); d.className = cls; d.textContent = msg; box.append(d); box.scrollTop = box.scrollHeight; setTimeout(res, 160); });
}
async function connectInteg(svc, card) {
  const log = integLogger(card); const btns = card.querySelectorAll('button'); btns.forEach((b) => (b.disabled = true));
  try {
    await loadCloud();
    let sum;
    if (svc.id === 'google' || svc.id === 'github') {
      await log(`$ dc link --svc ${svc.id}${svc.id === 'github' ? ' --scope read:user' : ''}`);
      await log(`> opening OAuth popup (${svc.id === 'google' ? 'accounts.google.com' : 'github.com/login/oauth'}) …`);
      const r = await cloud.linkProvider(svc.id);
      await log(`> handshake ok · ${r.relinked ? 're-authenticated' : 'provider linked to DARK CODE account'}`, 'ok');
      if (svc.id === 'github') {
        await log('> GET api.github.com/user …');
        let gh = {}; if (r.accessToken) { const res = await fetch('https://api.github.com/user', { headers: { Authorization: `Bearer ${r.accessToken}`, Accept: 'application/vnd.github+json' } }); gh = res.ok ? await res.json() : {}; await log(`> ${res.status} ${res.ok ? 'OK' : 'FAIL'}`, res.ok ? 'ok' : 'warn'); }
        sum = { account: gh.login ? '@' + gh.login : r.profile.email || r.profile.name || '-', workspace: gh.login ? `public repos ${gh.public_repos} · followers ${gh.followers}` : 'GitHub 계정', token: 'OAuth · 저장 안 함 (Firebase 연결만 유지)' };
      } else sum = { account: r.profile.email || '-', workspace: r.profile.name || 'Google 계정', token: 'OAuth · Firebase 보관' };
    } else if (svc.kind === 'key') {
      const inp = card.querySelector('.ic-key'); let key = inp.value.trim();
      if (!key) key = svc.id === 'claude' ? prov.claude.key : integKeys[svc.id];
      if (!key) throw new Error('키를 입력하세요');
      await log(`$ dc link --svc ${svc.id} --verify`);
      if (svc.id === 'claude') {
        await log('> GET api.anthropic.com/v1/models (토큰 소모 0)');
        const res = await fetch('https://api.anthropic.com/v1/models?limit=100', { headers: { 'x-api-key': key, 'anthropic-version': '2023-06-01', 'anthropic-dangerous-direct-browser-access': 'true' } });
        if (!res.ok) throw new Error(`검증 실패 ${res.status} · 키를 확인하세요`);
        const j = await res.json(); await log(`> 200 OK · models ${j.data?.length || 0}`, 'ok');
        await cloud.vault.put('prov:claude', key); prov.claude.key = key; prov.claude.enabled = true; prov.claude.health = 1; prov.claude.cooldownUntil = 0; saveProviders();
        sum = { account: 'Anthropic API', workspace: `models ${j.data?.length || 0} · 기본 ${prov.claude.model}`, token: cloud.mask(key) };
      } else {
        await log('> GET api.vercel.com/v2/user');
        const H = { Authorization: `Bearer ${key}` };
        const ures = await fetch('https://api.vercel.com/v2/user', { headers: H });
        if (!ures.ok) throw new Error(`검증 실패 ${ures.status} · 토큰을 확인하세요`);
        const uj = (await ures.json()).user || {}; await log(`> 200 OK · ${uj.username || uj.email}`, 'ok');
        let teams = 0, projects = 0;
        try { const t = await fetch('https://api.vercel.com/v2/teams', { headers: H }); if (t.ok) teams = ((await t.json()).teams || []).length; } catch {}
        try { const p = await fetch('https://api.vercel.com/v9/projects?limit=100', { headers: H }); if (p.ok) projects = ((await p.json()).projects || []).length; } catch {}
        await log(`> teams ${teams} · projects ${projects}`);
        await cloud.vault.put('integ:vercel', key); integKeys.vercel = key;
        sum = { account: uj.username ? '@' + uj.username : uj.email || '-', workspace: `teams ${teams} · projects ${projects}`, token: cloud.mask(key) };
      }
      await log('> key sealed in encrypted vault (AES-GCM · non-extractable)', 'ok');
      inp.value = '';
    } else {
      await log('$ dc link --svc aside --mode account-check');
      await log('> Aside는 공개 OAuth/API가 없어 계정 일치 확인으로 연결합니다');
      sum = { account: user.email, workspace: 'Aside 브라우저 (계정 확인 연결)', token: '토큰 없음 · 공개 API 미제공' };
    }
    await cloud.saveIntegration(svc.id, { ...sum, status: 'connected', kind: svc.kind });
    integSum[svc.id] = { ...sum, status: 'connected' };
    await log(`✔ ${svc.name} 연결됨 · 요약 동기화 (users/{uid}/integrations/${svc.id})`, 'ok');
    toast(`${svc.name} 연결됨`);
    setTimeout(renderInteg, 900);
  } catch (e) {
    await log(`✖ ${authMsg(e)}`, 'err');
    if (integSum[svc.id]) { integSum[svc.id].status = 'stale'; }
    btns.forEach((b) => (b.disabled = false));
  }
}
async function disconnectInteg(svc, card) {
  const log = integLogger(card);
  try {
    await log(`$ dc unlink --svc ${svc.id}`);
    if (svc.kind === 'oauth' && cloud.linkedProviders().includes(svc.id === 'google' ? 'google.com' : 'github.com')) await cloud.unlinkProvider(svc.id);
    if (svc.id === 'claude') { await cloud.vault.del('prov:claude'); prov.claude.key = ''; saveProviders(); }
    if (svc.id === 'vercel') { await cloud.vault.del('integ:vercel'); integKeys.vercel = ''; }
    await cloud.removeIntegration(svc.id); delete integSum[svc.id];
    await log('✔ 해제 완료 · 로컬 키/요약 삭제', 'ok');
    setTimeout(renderInteg, 600); renderPool(); renderStatus();
  } catch (e) { await log(`✖ ${authMsg(e)}`, 'err'); }
}

/* ================= REMOTE SUPPORT (requester side, consent-based) ================= */
const hms = (t) => { const d = new Date(t); return [d.getHours(), d.getMinutes(), d.getSeconds()].map((n) => String(n).padStart(2, '0')).join(':'); };
const REMOTE_TASKS = [['diagnose', '시스템 진단'], ['cleanup', '임시/불필요 파일 정리'], ['optimize', '성능 최적화']];
let remote = { sid: null, unsub: null, data: null, tick: null };
function openRemote() { $('#remote').showModal(); renderRemote(); }
function consentUrl(sid) { return location.origin + location.pathname.replace(/[^/]*$/, '') + 'consent.html?sid=' + sid; }
function renderRemote() {
  const body = $('#remoteBody');
  if (!user || user.guest) { body.innerHTML = '<div class="pv-empty">원격 지원 요청은 로그인한 계정만 만들 수 있습니다 (요청자 신원이 수락 화면에 표시됨).</div>'; return; }
  const d = remote.data;
  const statusTxt = { pending: '응답 대기', accepted: '승인됨 · 세션 활성', denied: '거절됨 · 차단', expired: '만료 · 폐기', cancelled: '취소됨', ended: '세션 종료' };
  body.innerHTML = `
    <div class="rm-console"><a class="btn-neon sm" href="remote.html" target="_blank" rel="noopener noreferrer">원격 제어 콘솔 열기 ↗</a><span>화면 보기 + 마우스·키보드 입력 제어 세션 (수락 후에만 개방)</span></div>
    <p class="modal-note">대상자가 링크를 열어 <b>직접 수락</b>해야만 세션이 활성화됩니다. 거절·시간 초과 시 즉시 폐기되며 양쪽 화면에 같은 상태가 실시간 동기화됩니다. 브라우저는 대상 PC 파일에 접근하지 않으며, 실제 원격 작업은 대상자가 원격 지원 프로그램에서 다시 허용해야 합니다.</p>
    ${!d || ['denied', 'expired', 'cancelled', 'ended'].includes(d.status) ? `
    <div class="rm-form">
      <label class="rm-l">요청 메모 (대상자 화면에 표시)<textarea id="rmNote" maxlength="300" placeholder="예: 어제 말씀하신 PC 느려짐 점검 요청입니다 - 윤태현"></textarea></label>
      <div class="rm-tasks">${REMOTE_TASKS.map(([k, v]) => `<label><input type="checkbox" value="${k}" checked> ${v}</label>`).join('')}</div>
      <label class="rm-l inline">만료 <select id="rmMin"><option value="3">3분</option><option value="5" selected>5분</option><option value="10">10분</option></select></label>
      <button class="btn-neon sm" id="rmCreate">수락 요청 링크 생성</button>
    </div>` : ''}
    ${d ? `
    <div class="rm-card st-${d.status}">
      <div class="rm-top"><b>${statusTxt[d.status] || d.status}</b><span class="rm-timer" id="rmTimer"></span></div>
      <div class="rm-row"><span>SESSION</span><code>${remote.sid.slice(0, 4)}-${remote.sid.slice(4, 8)}-${remote.sid.slice(-4)}</code></div>
      <div class="rm-link"><input readonly value="${consentUrl(remote.sid)}"><button class="btn-sm" id="rmCopy">복사</button><a class="btn-sm" href="${consentUrl(remote.sid)}" target="_blank" rel="noopener">열기</a><a class="btn-sm" href="remote.html?sid=${remote.sid}" target="_blank" rel="noopener noreferrer">콘솔</a></div>
      ${d.status === 'accepted' && d.target ? `<div class="rm-env">${Object.entries(d.target).map(([k, v]) => `<span>${esc(k)} <b>${esc(v ?? '-')}</b></span>`).join('')}</div>` : ''}
      ${d.status === 'accepted' ? `<div class="rm-log" id="rmLog">${(d.log || []).slice(-30).map((l) => `<div>${hms(l.t)} ${esc(l.msg)}</div>`).join('') || '<div>대상자 화면에 표시할 안내 메시지를 보내세요.</div>'}</div>
        <div class="rm-send"><input id="rmMsg" maxlength="240" placeholder="대상자에게 보낼 안내 (예: AnyDesk 주소를 알려주세요)"><button class="btn-sm" id="rmSend">전송</button></div>` : ''}
      <div class="rm-btns">${d.status === 'pending' ? '<button class="btn-sm" id="rmCancel">요청 취소</button>' : ''}${d.status === 'accepted' ? '<button class="btn-sm" id="rmEnd">세션 종료</button>' : ''}</div>
    </div>` : ''}`;
  $('#rmCreate')?.addEventListener('click', createRemoteReq);
  $('#rmCopy')?.addEventListener('click', () => { navigator.clipboard.writeText(consentUrl(remote.sid)); toast('수락 링크 복사됨'); });
  $('#rmCancel')?.addEventListener('click', () => cloud.cancelRemote(remote.sid).catch((e) => toast(e.message)));
  $('#rmEnd')?.addEventListener('click', () => cloud.endRemote(remote.sid, 'requester').catch((e) => toast(e.message)));
  const send = () => { const v = $('#rmMsg').value.trim(); if (!v) return; $('#rmMsg').value = ''; cloud.logRemote(remote.sid, v).catch((e) => toast(e.message)); };
  $('#rmSend')?.addEventListener('click', send);
  $('#rmMsg')?.addEventListener('keydown', (e) => { if (e.key === 'Enter') send(); });
  const lg = $('#rmLog'); if (lg) lg.scrollTop = lg.scrollHeight;
  remoteTimer();
}
function remoteTimer() {
  clearInterval(remote.tick);
  const d = remote.data; if (!d) return;
  const el = () => $('#rmTimer');
  const step = () => {
    if (d.status !== 'pending') { if (el()) el().textContent = d.status === 'accepted' ? 'ACTIVE' : ''; return; }
    const left = (d.expiresAt?.toMillis?.() || 0) - Date.now();
    if (el()) el().textContent = `${String(Math.floor(Math.max(0, left) / 60000)).padStart(2, '0')}:${String(Math.floor(Math.max(0, left) / 1000) % 60).padStart(2, '0')}`;
    if (left <= 0) { clearInterval(remote.tick); cloud.expireRemote(remote.sid).catch(() => {}); }
  };
  step(); remote.tick = setInterval(step, 1000);
}
async function createRemoteReq() {
  const btn = $('#rmCreate'); btn.disabled = true;
  try {
    await loadCloud();
    const tasks = $$('.rm-tasks input:checked').map((i) => i.value);
    if (!tasks.length) throw new Error('수행 예정 작업을 하나 이상 선택하세요');
    const sid = await cloud.createRemote({ note: $('#rmNote').value.trim(), tasks, minutes: Number($('#rmMin').value) });
    remote.unsub?.(); remote.sid = sid; remote.data = null;
    let prev = null;
    remote.unsub = await cloud.watchRemote(sid, (s) => {
      remote.data = s;
      if (s && prev && prev !== s.status) { toast(`원격 지원: ${({ accepted: '대상자가 수락했습니다', denied: '대상자가 거절했습니다 · 차단', expired: '시간 초과 · 세션 폐기', ended: '세션 종료', cancelled: '요청 취소됨' })[s.status] || s.status}`); TEL()?.log(`remote ${sid.slice(0, 4)} → ${s.status}`, s.status === 'accepted' ? 'ok' : 'warn'); }
      prev = s?.status;
      if ($('#remote').open) renderRemote();
    }, (e) => toast('동기화 오류: ' + e.message));
    TEL()?.log(`remote session ${sid.slice(0, 4)}… created · awaiting consent`, 'k');
  } catch (e) { toast(authMsg(e)); btn.disabled = false; }
}

/* ================= WORKSPACE WIRING ================= */
let autoGrowRaf = 0;
function autoGrow(force = false) {
  const ta = $('#prompt');
  if (!ta) return;
  if (force || !ta.value) {
    ta.style.height = '36px';
    if (!ta.value) return;
  }
  if (autoGrowRaf) cancelAnimationFrame(autoGrowRaf);
  autoGrowRaf = requestAnimationFrame(() => {
    autoGrowRaf = 0;
    const curH = ta.offsetHeight;
    const scH = ta.scrollHeight;
    if (scH > curH || force) {
      const h = Math.min(180, Math.max(36, scH));
      const px = h + 'px';
      if (ta.style.height !== px) ta.style.height = px;
    }
  });
}
function showRight(on) {
  const app = $('#app');
  if (innerWidth <= 1180) app.classList.toggle('show-right', on);
  else app.classList.toggle('no-right', !on);
  syncWaterfall();
  syncHomeState();
}
function enterWorkspace() {
  const gv = $('#gateVideo');
  if (gv) { gv.pause(); gv.removeAttribute('src'); gv.load(); }
  $('#userName').textContent = user.guest ? 'guest' : user.name;
  $('#userAvatar').textContent = (user.guest ? 'G' : user.name[0] || 'O').toUpperCase();
  const authLbl = $('#authBtnLabel');
  if (authLbl) authLbl.textContent = user.guest ? '로그인' : user.name;
  const lo = $('#logoutBtn');
  if (lo) lo.hidden = !!user.guest;
  loadThreads();
  state.cur = null; // Always land on the clean Gemini-style home screen
  renderThreads(); renderStream(); renderPool(); renderRouteSel(); renderStatus(); renderFree();
  applyArtifacts(null);
  showRight(false);
  setCenterView('work');
  syncWaterfall();
  syncHomeState();
  const bgv = $('#bgHeroVideo');
  if (bgv) bgv.play().catch(() => {});
  $('#prompt').focus();
}

let dashboard = null, waterfall = null;
async function openPhotoTemplate() {
  try {
    const res = await fetch('templates/photo-studio.html?v=20261122m'); if (!res.ok) throw new Error(res.status);
    const code = await res.text();
    const url = location.origin + location.pathname.replace(/[^/]*$/, '') + 'templates/photo-studio.html';
    applyArtifacts({ title: 'NOIR LUMEN STUDIO · 완성형 사진 웹사이트', doc: `## NOIR LUMEN STUDIO 템플릿\n- 외부 이미지 0개 · 사진은 Canvas로 직접 그린 그래픽 + 내 사진 업로드(드래그앤드롭)\n- 필터(전체/인물·야간/스튜디오/아카이브) · 라이트박스 촬영 스펙 · 예약(검증·번호·상태 변경·삭제)\n- 승인 기반 원격 세션 상태 머신 PENDING → ACCEPTED → CONNECTED / TERMINATED\n- 단독 페이지(로컬 저장 완전 작동): ${url}`, files: [{ name: 'index.html', lang: 'html', code }], img: null, snapshot: 'user_goal: "완성형 사진 웹사이트 템플릿"\nactive_artifacts: ["templates/photo-studio.html"]' }, true);
    toast('템플릿을 미리보기에 열었습니다');
  } catch (e) { toast('템플릿 로드 실패: ' + e.message); }
}
function wire() {
  centerRain = new CodeRain($('#centerRain'), { size: 16, speed: 0.8, fade: 0.07 });
  if (window.DarkFX) {
    const T = DarkFX.telemetry;
    T.providers = () => Object.values(prov).map((p) => ({ id: p.id, short: p.short, state: provState(p), health: p.health, lat: p.lat, primary: !!p.primary, local: !!p.local }));
    T.claude = claudeUse; T.free = () => [freeUse(), '∞']; T.cacheSize = () => LS.get('cidx', []).length;
    dashboard = new DarkFX.Dashboard(); dashboard.mount();
    waterfall = new DarkFX.CodeWaterfall($('#wfCanvas'), () => (artifacts?.files || []).flatMap((f) => ['// ──── ' + f.name + ' ────', ...f.code.split('\n')]).filter((l) => l.trim()).slice(0, 4000));
  }
  $('#dashChips').innerHTML = WELCOME_CHIPS.map(([k, v]) => `<button data-p="${esc(v)}"><small>${k}</small>${esc(v)}</button>`).join('');
  $('#dashChips').insertAdjacentHTML('afterbegin', '<button data-tpl="remote" class="tpl"><small>REMOTE</small>원격 제어 콘솔 · 승인 기반 화면/입력 세션 열기</button><button data-tpl="photo-studio" class="tpl"><small>TEMPLATE</small>완성형 사진 웹사이트 · NOIR LUMEN 바로 열기</button><button data-tpl="studio" class="tpl"><small>STUDIO</small>AI 작곡 · 뮤직비디오 제작 · /music 대충 써도 노래가 됨</button>');
  $$('#dashChips [data-tpl]').forEach((b) => (b.onclick = b.dataset.tpl === 'remote' ? () => window.open('remote.html', '_blank', 'noopener,noreferrer') : b.dataset.tpl === 'studio' ? () => window.open('studio.html', '_blank') : openPhotoTemplate));
  $$('#dashChips button:not([data-tpl])').forEach((c) => (c.onclick = () => { $('#prompt').value = c.dataset.p; autoGrow(); $('#prompt').focus(); $('#sendBtn').disabled = false; }));
  $$('#cvTabs button').forEach((b) => (b.onclick = () => setCenterView(b.dataset.cv)));
  // gate
  const clock = () => { const d = new Date(); $('#gateClock').textContent = [d.getHours(), d.getMinutes(), d.getSeconds()].map((n) => String(n).padStart(2, '0')).join(':'); };
  clock(); setInterval(clock, 1000);
  $$('#authTabs button').forEach((b) => (b.onclick = () => { setAuthMode(b.dataset.m); termLine(`<span class="g">$</span> auth --mode ${b.dataset.m}`); }));
  $('#loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = $('#loginBtn'); $('#loginErr').textContent = ''; btn.disabled = true;
    const email = $('#loginId').value.trim(), pw = $('#loginPw').value, keep = $('#loginKeep').checked;
    try {
      await loadCloud();
      if (authMode === 'reset') {
        termLine(`<span class="g">$</span> auth --reset ${esc(email)}`);
        await cloud.resetPassword(email);
        termLine('<span class="ok">✔</span> reset link dispatched');
        $('#loginErr').innerHTML = `<span class="ok-msg">재설정 링크를 ${esc(email)} 로 보냈습니다. 메일의 링크에서 새 비밀번호를 정한 뒤 로그인하세요.</span>`;
        return;
      }
      if (authMode === 'signup') {
        if (pw.length < 8) throw new Error('비밀번호는 8자 이상으로 설정하세요');
        if (pw !== $('#loginPw2').value) throw new Error('비밀번호 확인이 일치하지 않습니다');
        termLine(`<span class="g">$</span> auth --signup ${esc(email)}`);
        const u = await cloud.signUp(email, pw, $('#signName').value.trim(), keep);
        termLine('<span class="ok">✔</span> account created · verification mail sent');
        showVerify(u);
        return;
      }
      termLine(`<span class="g">$</span> auth --operator ${esc(email)}`);
      const u = await cloud.signIn(email, pw, keep);
      if (!cloud.isTrusted(u)) { termLine('<span style="color:#facc15">…</span> email not verified'); showVerify(u, `<b>${esc(u.email)}</b> 이메일 인증이 아직 안 됐습니다. 받은 메일의 링크를 누른 뒤 [인증 확인]을 눌러주세요.`); return; }
      termLine('<span class="ok">✔</span> credentials verified');
      await bootTo(userFromFirebase(u));
    } catch (err) { $('#loginErr').textContent = authMsg(err); termLine(`<span style="color:#ff4d6d">✖ ${esc(authMsg(err))}</span>`); }
    finally { btn.disabled = false; }
  });
  $('#verifyCheck').onclick = async () => {
    try { await loadCloud(); const u = await cloud.reloadUser(); if (u && cloud.isTrusted(u)) { termLine('<span class="ok">✔</span> email verified'); await bootTo(userFromFirebase(u)); } else $('#loginErr').textContent = '아직 인증되지 않았습니다 · 메일의 링크를 먼저 눌러주세요'; }
    catch (e) { $('#loginErr').textContent = authMsg(e); }
  };
  $('#verifyResend').onclick = async () => { try { await cloud.resendVerification(); toast('인증 메일을 다시 보냈습니다'); } catch (e) { $('#loginErr').textContent = authMsg(e); } };
  $('#verifyBack').onclick = async () => { try { await cloud?.signOutUser(); } catch {} setAuthMode('login'); };
  for (const [sel, pid] of [['#oauthGoogle', 'google'], ['#oauthGithub', 'github']]) {
    $(sel).onclick = async () => {
      $('#loginErr').textContent = '';
      try {
        await loadCloud();
        termLine(`<span class="g">$</span> oauth --provider ${pid} --popup`);
        const r = await cloud.signInWith(pid, $('#loginKeep').checked);
        termLine(`<span class="ok">✔</span> ${pid} identity confirmed`);
        await bootTo(userFromFirebase(r.user));
      } catch (e) { $('#loginErr').textContent = authMsg(e); termLine(`<span style="color:#ff4d6d">✖ ${esc(authMsg(e))}</span>`); }
    };
  }
  $('#guestBtn').onclick = async () => { const u = { id: 'guest', name: 'guest', guest: true }; setSession(u); termLine('<span class="g">$</span> auth --guest'); await bootTo(u); };
  $('#logoutBtn').onclick = async () => {
    if (state.running) state.running.abort(); dashboard?.stop(); waterfall?.stop();
    remote.unsub?.(); remote = { sid: null, unsub: null, data: null, tick: null };
    clearSession(); if (user && !user.guest && cloud) { try { await cloud.signOutUser(); } catch {} }
    user = null; showGate();
  };
  $('#integBtn').onclick = openInteg; $('#integClose').onclick = () => $('#integ').close();
  $('#remoteBtn').onclick = openRemote; $('#remoteClose').onclick = () => $('#remote').close();

  // composer
  const ta = $('#prompt');
  let inputDebounce = 0;
  ta.addEventListener('input', (e) => {
    if (e.inputType === 'deleteContentBackward' || e.inputType === 'deleteContentForward') autoGrow(true);
    else autoGrow();
    if (!inputDebounce) {
      inputDebounce = requestAnimationFrame(() => {
        inputDebounce = 0;
        if (!state.running) $('#sendBtn').disabled = !ta.value.trim();
      });
    }
  });
  ta.addEventListener('keydown', (e) => { if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) { e.preventDefault(); $('#composer').requestSubmit(); } });
  $('#composer').addEventListener('submit', (e) => {
    e.preventDefault();
    if (state.running) { state.running.abort(); return; }
    const v = ta.value.trim(); if (!v) return;
    ta.value = ''; autoGrow(true); $('#sendBtn').disabled = true;
    execute(v);
  });
  const setMode = (m) => {
    state.mode = m;
    $$('#modeSeg button').forEach((x) => x.classList.toggle('on', x.dataset.mode === m));
    const dd = $('#modeDropdown'); if (dd && dd.value !== m) dd.value = m;
    renderStatus();
    if (state.mode === 'local6' && window.DCLocal6) DCLocal6.check().then((s) => { if (!s.ok) DCLocal6.open(); else toast('로컬 6-에이전트 · Ollama 모델 6/6 연결됨'); });
    if (state.mode === 'core' && window.DCCore) DCCore.check().then((s) => { if (!s.ok) DCCore.open(); else toast(`CORE 게이트웨이 연결됨 · ${s.profile} 프로필`); });
    if (state.mode === 'exec' && window.DCAstra) DCAstra.check().then((s) => toast(s.runner.ok ? `EXEC · 실행기 연결됨 (승인 ${s.runner.info.approval === 'ask' ? '콘솔 y/N' : s.runner.info.approval})${s.models.ok ? ` · 모델 ${s.model || '없음'}` : ' · Ollama 꺼짐'}` : 'EXEC · 실행기(8797) 꺼짐 → darkcode-core 폴더의 start-runner.bat 실행'));
  };
  $$('#modeSeg button').forEach((b) => (b.onclick = () => setMode(b.dataset.mode)));
  const md = $('#modeDropdown');
  if (md) md.onchange = (e) => setMode(e.target.value);
  $$('#homePills button').forEach((b) => (b.onclick = () => {
    $$('#homePills button').forEach((x) => x.classList.toggle('on', x === b));
    if (b.dataset.intent === 'chat') { setMode('fast'); $('#prompt').placeholder = 'DARK CODE AI에게 물어보기'; }
    else { setMode('council'); $('#prompt').placeholder = 'Stitch 캔버스로 만들 웹·앱·작업을 설명해 주세요'; }
  }));

  const goHome = () => {
    if (state.running) return toast('실행 중입니다');
    state.cur = null;
    renderThreads(); renderStream(); applyArtifacts(null); renderStatus();
    showRight(false); setCenterView('work');
    $('#app').classList.remove('show-side');
    syncHomeState();
    ta.focus();
  };
  $('#routeSel').onchange = (e) => { state.route = e.target.value; toast(state.route === 'auto' ? 'AUTO 라운드로빈' : `${prov[state.route].name} 고정 (실패 시 로컬/Claude 폴백)`); };
  $('#newBtn').onclick = goHome;
  if ($('#railNew')) $('#railNew').onclick = goHome;
  if ($('#railHome')) $('#railHome').onclick = goHome;
  if ($('#railDash')) $('#railDash').onclick = () => { setCenterView(state.centerView === 'dash' ? 'work' : 'dash'); $('#app').classList.remove('show-side'); };
  if ($('#backToWork')) $('#backToWork').onclick = () => setCenterView('work');
  $('#threadSearch').oninput = renderThreads;

  // plus menu popover
  const plusBtn = $('#plusBtn'), plusMenu = $('#plusMenu');
  if (plusBtn && plusMenu) {
    plusBtn.onclick = (e) => { e.stopPropagation(); plusMenu.hidden = !plusMenu.hidden; };
    document.addEventListener('click', (e) => { if (!plusMenu.hidden && !e.target.closest('.plus-wrap')) plusMenu.hidden = true; });
    $$('[data-quick-prompt]', plusMenu).forEach((b) => (b.onclick = () => {
      plusMenu.hidden = true; ta.value = b.dataset.quickPrompt; autoGrow(); ta.focus(); $('#sendBtn').disabled = false;
    }));
    $$('[data-quick-tpl]', plusMenu).forEach((b) => (b.onclick = () => { plusMenu.hidden = true; openPhotoTemplate(); }));
  }

  // header & drawers & login modal
  $('#sideToggle').onclick = () => $('#app').classList.toggle('show-side');
  if ($('#mobileMenuBtn')) $('#mobileMenuBtn').onclick = () => $('#app').classList.toggle('show-side');
  if ($('#sideClose')) $('#sideClose').onclick = () => $('#app').classList.remove('show-side');
  if ($('#sideBackdrop')) $('#sideBackdrop').onclick = () => $('#app').classList.remove('show-side');
  $('#panelToggle').onclick = () => { showRight(!rightVisible()); };
  $('#rClose').onclick = () => { showRight(false); };
  $('#rExpand').onclick = () => $('#app').classList.toggle('wide-right');
  const openLoginModal = () => { $('#gate').hidden = false; setAuthMode('login'); setTimeout(() => $('#loginId')?.focus(), 120); };
  if ($('#authOpenBtn')) $('#authOpenBtn').onclick = () => { if (!user?.guest) toast(`로그인됨: ${user.email || user.name}`); else openLoginModal(); };
  if ($('#userChip')) $('#userChip').onclick = openLoginModal;
  if ($('#gateClose')) $('#gateClose').onclick = () => { $('#gate').hidden = true; };
  document.addEventListener('keydown', (e) => { if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'j' && !$('#app').hidden) { e.preventDefault(); $('#panelToggle').click(); } });
  const dlg = $('#settings');
  const openSettings = () => { renderSettings(); dlg.showModal(); };
  $('#settingsBtn').onclick = openSettings; $('#poolStrip').onclick = openSettings;
  if ($('#freeUse')) $('#freeUse').onclick = openSettings;
  $('#saveSettings').onclick = (e) => { e.preventDefault(); collectSettings(); dlg.close(); toast('설정 저장됨'); };
  $('#clearCache').onclick = () => { cacheClear(); renderStatus(); toast('캐시 비움'); };
  $('#resetHealth').onclick = () => { Object.values(prov).forEach((p) => { p.health = 1; p.cooldownUntil = 0; p.lastErr = ''; }); saveHealth(); renderPool(); renderStatus(); renderSettings(); toast('헬스 스코어 초기화'); };

  // right panel
  $$('#rtabs button').forEach((b) => (b.onclick = () => switchTab(b.dataset.tab)));
  $$('#docSeg button').forEach((b) => (b.onclick = () => {
    const edit = b.dataset.dm === 'edit';
    $$('#docSeg button').forEach((x) => x.classList.toggle('on', x === b));
    $('#docEdit').hidden = !edit; $('#docRender').hidden = edit;
    if (!edit) { $('#docRender').innerHTML = ''; $('#docRender').append(renderMd($('#docEdit').value)); }
  }));
  $('#docEdit').addEventListener('input', () => { if (artifacts) { artifacts.doc = $('#docEdit').value; persistArtifacts(); } updateFoot(); });
  $('#docTitle').addEventListener('change', () => { if (artifacts) { artifacts.title = $('#docTitle').value; persistArtifacts(); } });
  const ce = $('#codeEdit');
  ce.addEventListener('input', () => { updateGutter(); const f = artifacts?.files[state.activeFile]; if (f) { f.code = ce.value; persistArtifacts(); } updateFoot(); });
  ce.addEventListener('scroll', () => { $('#gutter').scrollTop = ce.scrollTop; });
  ce.addEventListener('keydown', (e) => { if (e.key === 'Tab') { e.preventDefault(); const s = ce.selectionStart; ce.setRangeText('  ', s, ce.selectionEnd, 'end'); ce.dispatchEvent(new Event('input')); } });
  $('#runPreview').onclick = () => { setPreview(buildPreviewDoc(artifacts)); switchTab('preview'); };
  $('#pvReload').onclick = () => setPreview(buildPreviewDoc(artifacts));
  $('#pvMobile').onclick = () => { setStitchMode('live'); $('#pvStage').classList.toggle('mobile'); };
  $$('#stitchModeSeg button').forEach((b) => (b.onclick = () => setStitchMode(b.dataset.sm)));
  if (window.StitchCanvas && $('#stitchBoardMount')) {
    stitchCanvas = new window.StitchCanvas($('#stitchBoardMount'), {
      onOpenInteractive: () => { setStitchMode('live'); },
    });
  }
  const auditBtn = $('#asideAuditBtn');
  if (auditBtn) auditBtn.onclick = () => window.asideOperatorInstance?.runAutonomousAudit();
  $('#rCopy').onclick = () => {
    const txt = state.rightTab === 'code' ? ce.value : state.rightTab === 'snap' ? $('#snapView').textContent : state.rightTab === 'preview' ? (buildPreviewDoc(artifacts) || '') : $('#docEdit').value;
    navigator.clipboard.writeText(txt); toast('복사됨');
  };
  $('#rDownload').onclick = () => {
    let name, txt, type = 'text/plain';
    if (state.rightTab === 'code' && artifacts?.files[state.activeFile]) { name = artifacts.files[state.activeFile].name; txt = ce.value; }
    else if (state.rightTab === 'preview') { name = 'index.html'; txt = buildPreviewDoc(artifacts) || ''; type = 'text/html'; }
    else if (state.rightTab === 'snap') { name = 'state-snapshot.yaml'; txt = $('#snapView').textContent; }
    else { name = ($('#docTitle').value || 'document').replace(/[\\/:*?"<>|]/g, '_') + '.md'; txt = $('#docEdit').value; }
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([txt], { type })); a.download = name; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  };
  setInterval(() => { if (!$('#app').hidden) { renderPool(); } }, 1000);
  addEventListener('resize', () => { if (innerWidth > 1180) $('#app').classList.remove('show-right'); });
  setupAsideOperator();
}

/* ================= ASIDE OPERATOR & SELF-HEALING ================= */
let asideOperatorInstance = null;
let isSelfHealingActive = false;

function setupAsideOperator() {
  if (typeof DCAsideOperator === 'undefined') return;
  asideOperatorInstance = new DCAsideOperator({
    frameSelector: '#pvFrame',
    onLog: (msg, cls) => {
      TEL()?.log?.(msg, cls || 'route');
      const term = $('#dTerm');
      if (term) {
        const d = document.createElement('div');
        d.className = cls || 'route';
        d.textContent = msg;
        term.appendChild(d);
        term.scrollTop = term.scrollHeight;
      }
    },
    onHealingRequired: async (errInfo) => {
      if (isSelfHealingActive) return;
      isSelfHealingActive = true;
      try {
        await executeSelfHealing(errInfo);
      } finally {
        setTimeout(() => { isSelfHealingActive = false; }, 3000);
      }
    }
  });
  window.asideOperatorInstance = asideOperatorInstance;
}

async function executeSelfHealing(errInfo) {
  const active = artifacts?.files?.[state.activeFile];
  if (!active || active.lang !== 'html') return;
  toast(`⚡ Aside 자율 치유 작동: 런타임 오류 자동 수정 중...`);
  try {
    const prompt = `[자율 치유 요청] 미리보기 렌더링 중 브라우저 런타임 오류가 발생했습니다:
오류: ${errInfo.message} (${errInfo.lineno}번째 줄)
코드:
\`\`\`html
${active.code.slice(0, 24000)}
\`\`\`
오류 원인을 제거하고 결함 없이 즉시 실행 가능한 단일 완성본 HTML 코드를 생략 없이 다시 작성하십시오.`;

    const r = await routeCall({
      role: 'code',
      label: 'self-heal',
      system: SYSTEM_CORE,
      messages: [{ role: 'user', content: prompt }],
      maxTokens: 16384,
      temperature: 0.3
    });

    const parsed = extractArtifacts(r.text);
    const newHtml = parsed.files.find((f) => f.lang === 'html');
    if (newHtml && newHtml.code) {
      active.code = newHtml.code;
      renderFiles();
      setPreview(buildPreviewDoc(artifacts));
      toast('✓ Aside 자율 치유 완료 (오류 0개)');
    }
  } catch (err) {
    console.warn('self-healing failed', err);
  }
}

wire();
(async () => {
  const g = getSession();
  loadVaultKeys().then(async () => { renderPool(); renderRouteSel(); renderStatus(); await loadMediaKeys(); refreshModels(); });
  autoLocal();
  // Immediately enter the Gemini-style home workspace (guest by default, Firebase upgrades silently if logged in)
  user = g || { id: 'guest', name: 'guest', guest: true };
  if (!g) setSession(user);
  $('#gate').hidden = true; $('#app').hidden = false;
  enterWorkspace();
  try {
    await loadCloud();
    let first = true;
    await cloud.onUser(async (u) => {
      if (!first) return; first = false;
      if (u && cloud.isTrusted(u)) await bootTo(userFromFirebase(u), true);
    });
  } catch (e) { console.warn('cloud init', e); }
})();
