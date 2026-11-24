// DARK CODE · EXEC 모드 연결부 (window.DCAstra)
// AstraUnifiedEngine v2 (같은 폴더 astra-unified-engine.js) + 로컬 실행기(기본 127.0.0.1:8797) + Ollama(로컬 6-에이전트와 같은 주소)
// VERIFIED 판정은 엔진만 한다. 이 파일은 연결 확인, 모델 호출, 중단 처리, 결과 문서화만 담당한다.
// 원장(runs/committed)은 실행 콘솔(astra.html)과 같은 저장소 키를 써서 양쪽에서 같이 보인다.
import { AstraUnifiedEngine } from './astra-unified-engine.js?v=20261124e3';

const LS_RUNNER = 'dc-astra-runner';   // 실행기 주소 바꿀 때만 (기본 http://127.0.0.1:8797)
const LS_MODEL = 'dc-astra-model';     // 모델 고정할 때만 (기본 자동 선택)
const MODEL_TIMEOUT_MS = 180000;
const UNV = '[UNVERIFIED_NEEDS_LOCAL_RUN]';

const runnerBase = () => (localStorage.getItem(LS_RUNNER) || 'http://127.0.0.1:8797').trim().replace(/\/+$/, '');
const ollamaHost = () => String((window.DCLocal6 && window.DCLocal6.host && window.DCLocal6.host()) || localStorage.getItem('dc-l6-host') || 'http://localhost:11434').trim().replace(/\/+$/, '');

const STOP_INFO = {
  OK: '실행기 실측 exit 0 + 표준 출력 확인',
  RUNNER_UNREACHABLE: '실행기(8797)에 연결 안 됨 → darkcode-core 폴더의 start-runner.bat 실행, 브라우저의 로컬 접근 허용 확인',
  RUNNER_HTTP_403: '실행기가 이 사이트 주소를 거부함 (허용 Origin/Host 확인)',
  RUNNER_HTTP_404: '실행기 주소에 /run 이 없음 (8787은 게이트웨이, 실행기는 8797)',
  RUNNER_HTTP_409: '실행기가 다른 코드를 실행 중',
  RUNNER_HTTP_413: '코드가 실행기 한도보다 큼',
  RUNNER_BAD_RESPONSE: '실행기 응답이 JSON이 아님 (주소 확인)',
  APPROVAL_DENIED: '실행기 창에서 거부했거나 60초 안에 승인하지 않음',
  SPAWN_ERROR: '실행기가 프로세스를 띄우지 못함 (Node 설치 확인)',
  ABORTED: '사용자가 중단함',
  NO_NEW_PATCH: '모델이 같은 코드를 다시 냄 → 요청을 더 구체적으로',
  TESTS_FAILED: '요구사항 테스트를 끝까지 통과하지 못함 → 요청을 더 구체적으로 또는 다른 모델',
  REPEATED_ERROR: '같은 에러가 반복됨 → 요청 수정 또는 다른 모델',
  MODEL_FAILED_ON_RETRY: '재시도 중 모델 호출 실패',
  FALLBACK_ONLY: '모델 호출 실패 → 0원 스텁만 실행됨 (실행기 경로 확인용, 확정 불가)',
  MAX_RETRIES: '최대 재시도까지 실패',
  SINGLE_TARGET_LOCKED: '다른 탭(실행 콘솔 등)에서 작업 진행 중 (단일 타겟 잠금)',
};
const stopText = (s) => STOP_INFO[s] || (String(s || '').startsWith('RUNNER_HTTP_') ? `실행기 HTTP 오류 (${String(s).slice(12)})` : (s || '-'));

// ---------- 연결 확인 ----------
async function runnerHealth() {
  try {
    const r = await fetch(runnerBase() + '/health', { cache: 'no-store', signal: AbortSignal.timeout(4000) });
    const d = await r.json().catch(() => null);
    if (d && d.name === 'darkcode-runner') return { ok: true, info: d };
    return { ok: false, state: d && d.name === 'darkcode-core' ? 'gateway' : 'other', info: null };
  } catch {
    return { ok: false, state: 'off', info: null };
  }
}

async function ollamaModels() {
  try {
    const r = await fetch(ollamaHost() + '/api/tags', { cache: 'no-store', signal: AbortSignal.timeout(5000) });
    if (!r.ok) return { ok: false, state: `http_${r.status}`, names: [] };
    const j = await r.json();
    return { ok: true, names: (j.models || []).map((m) => String(m.name)) };
  } catch {
    return { ok: false, state: 'off', names: [] };
  }
}

function pickModel(names) {
  const has = (n) => names.includes(n) || names.includes(n + ':latest');
  const saved = localStorage.getItem(LS_MODEL);
  if (saved && has(saved)) return saved;
  const p = names.find((n) => /^ai-dev(:latest)?$/.test(n)) || names.find((n) => /coder/i.test(n)) || names.find((n) => n === 'qwen3:8b') || names[0];
  return p ? p.replace(/:latest$/, '') : '';
}

async function check() {
  const [runner, models] = await Promise.all([runnerHealth(), ollamaModels()]);
  const model = models.ok ? pickModel(models.names) : '';
  return { ok: Boolean(runner.ok && models.ok && model), runner, models, model, runnerUrl: runnerBase(), ollama: ollamaHost() };
}

// ---------- 모델 호출 (Ollama /api/chat 스트리밍) ----------
function anySignal(list) {
  const sigs = list.filter(Boolean);
  if (AbortSignal.any) return AbortSignal.any(sigs);
  const c = new AbortController();
  sigs.forEach((s) => { if (s.aborted) c.abort(s.reason); else s.addEventListener('abort', () => c.abort(s.reason), { once: true }); });
  return c.signal;
}
const stripThink = (t) => String(t || '').replace(/<think>[\s\S]*?<\/think>/gi, '').replace(/^[\s\S]*?<\/think>/i, '').trim();

async function callOllama(prompt, model, { signal, onToken, think = false, temperature } = {}) {
  const url = ollamaHost() + '/api/chat';
  const body = { model, messages: [{ role: 'user', content: prompt }], stream: true, think: Boolean(think), ...(typeof temperature === 'number' ? { options: { temperature } } : {}) };
  const sig = anySignal([signal, AbortSignal.timeout(MODEL_TIMEOUT_MS)]);
  const post = () => fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body), signal: sig });
  let res = await post();
  if (!res.ok) {
    let t = await res.text().catch(() => '');
    if (/think/i.test(t)) { delete body.think; res = await post(); if (!res.ok) t = await res.text().catch(() => t); } // think 옵션 미지원 모델
    if (!res.ok) throw new Error(`MODEL_HTTP_${res.status}: ${String(t).slice(0, 160)}`);
  }
  const reader = res.body.getReader();
  const dec = new TextDecoder();
  let buf = '';
  let out = '';
  const eat = (line) => {
    const s = line.trim();
    if (!s) return;
    let j; try { j = JSON.parse(s); } catch { return; }
    if (j.error) throw new Error(`MODEL_ERROR: ${String(j.error).slice(0, 160)}`);
    const piece = (j.message && j.message.content) || '';
    if (piece) { out += piece; if (onToken) onToken(piece); }
  };
  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    buf += dec.decode(value, { stream: true });
    let i;
    while ((i = buf.indexOf('\n')) >= 0) { eat(buf.slice(0, i)); buf = buf.slice(i + 1); }
  }
  eat(buf);
  const text = stripThink(out);
  if (!text) throw new Error('MODEL_EMPTY_RESPONSE');
  return text;
}

// ---------- 엔진 (중단 신호 지원만 덧붙임 · 판정 로직은 원본 그대로) ----------
const ABORTED = () => ({ executed: false, exitCode: null, output: '', stderr: 'ABORTED: 사용자 중단', reason: 'aborted', runnerLevel: true, httpStatus: 0 });
class ExecEngine extends AstraUnifiedEngine {
  _race(call, wrap) {
    const sig = this.abortSignal;
    if (sig && sig.aborted) return Promise.resolve(wrap(ABORTED()));
    if (!sig) return call;
    return Promise.race([call, new Promise((resolve) => sig.addEventListener('abort', () => resolve(wrap(ABORTED())), { once: true }))]);
  }
  runOnLocal(targetModule, code, command, opts) { return this._race(super.runOnLocal(targetModule, code, command, opts), (x) => x); }
  runJobs(targetModule, jobs, opts) { return this._race(super.runJobs(targetModule, jobs, opts), (x) => ({ runnerFailure: x })); }
}
let engine = null;
function getEngine() {
  if (!engine) engine = new ExecEngine({ runnerUrl: runnerBase() + '/run', candidates: 2, testsFirst: true });
  engine.runnerUrl = runnerBase() + '/run';
  return engine;
}

function targetFrom(prompt) {
  const ascii = String(prompt).toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '').slice(0, 28);
  return 'exec_' + (ascii || 'task');
}

// onEvent(type, data): token · model · model_done · model_fail · progress(엔진 onProgress 그대로)
async function run(prompt, { signal, model, onEvent = () => {} } = {}) {
  const eng = getEngine();
  eng.abortSignal = signal || null;
  try {
    return await eng.runTask({
      targetModule: targetFrom(prompt),
      userPrompt: prompt,
      callModelFn: async (p, ctx) => {
        if (signal && signal.aborted) throw new Error('ABORTED');
        if (!model) throw new Error('MODEL_UNAVAILABLE: Ollama 에 쓸 수 있는 모델 없음');
        onEvent('model', { attempt: ctx.attempt, model, role: ctx.role, candidate: ctx.candidate, deep: Boolean(ctx.deep) });
        const t0 = performance.now();
        try {
          // 재시도·추가 후보는 생각 모드(think) 켜기 · 테스트/첫 후보는 빠르게
          const text = await callOllama(p, model, { signal, think: Boolean(ctx.deep), temperature: ctx.temperature, onToken: (t) => onEvent('token', { text: t }) });
          onEvent('model_done', { attempt: ctx.attempt, model, role: ctx.role, candidate: ctx.candidate, chars: text.length, ms: performance.now() - t0 });
          return text;
        } catch (e) {
          const msg = e && e.name === 'TimeoutError' ? `MODEL_TIMEOUT (${MODEL_TIMEOUT_MS / 1000}초)` : (signal && signal.aborted) ? 'ABORTED' : (e && e.message) || String(e);
          onEvent('model_fail', { attempt: ctx.attempt, model, error: msg });
          throw new Error(msg);
        }
      },
      onProgress: (ev) => onEvent('progress', ev),
    });
  } finally {
    eng.abortSignal = null;
  }
}

// ---------- 결과 문서 (DARK CODE 답변 형식: 합의 요약 / 산출물 / 스냅샷) ----------
const isVerified = (r) => Boolean(r && r.verified === true && r.status === 'VERIFIED' && r.exitCode === 0 && r.source === 'model' && !r.fallbackUsed);
const testsLine = (r) => (r && r.tests ? `테스트 ${r.tests.passed}/${r.tests.total} 통과${r.tests.disputed && r.tests.disputed.length ? ` (분쟁 테스트 ${r.tests.disputed.length}개 제외)` : ''}` : (r && r.verification === 'output-only' ? '테스트 없음 · 실행 출력으로 확인' : ''));
const indent = (s) => String(s ?? '').split('\n').map((l) => '    ' + l).join('\n');

function toMarkdown(prompt, res, st) {
  const ok = isVerified(res);
  const stop = res.stopReason || res.status || '-';
  const rinfo = st.runner && st.runner.info;
  const runnerTxt = rinfo ? `${st.runnerUrl} · 승인 ${rinfo.approval === 'ask' ? '콘솔 y/N' : rinfo.approval} · 격리 ${rinfo.permissionModel || '없음'}` : `${st.runnerUrl} (응답 없음)`;
  const consensus = [
    `- **진실 게이트**: ${ok ? `VERIFIED (${res.verification === 'tests' ? '테스트 통과 + ' : ''}내 PC 실행기 실측 exit 0${res.verification === 'tests' ? '' : ' + 표준 출력 확인'})` : `${UNV} · ${stop} · ${stopText(stop)}`}`,
    `- **검증**: ${testsLine(res) || '-'}${res.candidatesTried > 1 ? ` · 후보 ${res.candidatesTried}개 중 ${Number(res.chosenCandidate || 0) + 1}번 선택` : ''}`,
    `- **실행 루프**: 시도 ${res.attempts || 0}회 · 수정 ${Math.max(0, (res.attempts || 1) - 1)}회 · 모델 ${res.source === 'model' ? (st.model || '-') : (res.source || '-')} · 실행기 ${runnerTxt}`,
    `- **원장**: ${res.committed ? 'committed 반영' : 'committed 미반영'}${res.runId ? ` · ${res.runId}` : ''} · 전체 기록은 [실행 콘솔](astra.html)${res.ledgerWarning ? ` · ${res.ledgerWarning}` : ''}`,
  ].join('\n');
  let body = '';
  if (ok) {
    body += `### 진실 게이트 · VERIFIED\n${res.verification === 'tests' ? `요구사항으로 먼저 만든 테스트를 내 PC 실행기에서 돌려 ${testsLine(res)}, 프로그램도 exit 0 으로 끝났습니다.` : '내 PC 실행기에서 실제로 실행해 exit 0 과 표준 출력을 확인했습니다.'}\n\n**관측 출력 (stdout · 실행기 실측)**\n\n${indent(res.observedOutput)}\n\n`;
  } else {
    body += `### 진실 게이트 · ${UNV}\n멈춘 이유: \`${stop}\` · ${stopText(stop)}\n\n`;
    const err = String(res.lastError || res.error || '').trim();
    if (err) body += `**마지막 에러**\n\n${indent(err.slice(0, 1500))}\n\n`;
  }
  if (res.code) {
    const title = ok ? `### 실행 코드 (main.mjs · hash ${res.codeHash})`
      : res.fallbackUsed ? `### ${UNV} 0원 스텁 (모델 코드 아님 · 확정 불가)`
      : res.executed ? `### ${UNV} 마지막 시도 코드 (실행됐지만 실패 · exit ${res.exitCode})`
      : `### ${UNV} 생성된 코드 (실행 안 됨)`;
    body += `${title}\n\`\`\`javascript\n${res.code}\n\`\`\`\n`;
  }
  if (res.testCode) body += `### ${ok ? '' : UNV + ' '}테스트 코드 (test.mjs · 요구사항 기준)\n\`\`\`mjs\n${res.testCode}\n\`\`\`\n`;
  const q = (s) => String(s || '').replace(/"/g, "'").replace(/\n/g, ' ');
  return `## [라우팅 및 합의 요약]
${consensus}

## [자율 실행 산출물]
${body}
## [세션 상태 스냅샷 (State Snapshot)]
\`\`\`yaml
user_goal: "${q(prompt.slice(0, 80))}"
engine: astra-unified-engine
status: ${ok ? 'VERIFIED' : 'UNVERIFIED_NEEDS_LOCAL_RUN'}
verification: ${res.verification || '-'}
tests: "${res.tests ? `${res.tests.passed}/${res.tests.total}` : '-'}"
candidates: ${res.candidatesTried || 1}
stop_reason: ${stop}
run_id: ${res.runId || '-'}
attempts: ${res.attempts || 0}
code_hash: ${res.codeHash || '-'}
committed: ${Boolean(res.committed)}
runner: ${st.runnerUrl}
model: ${st.model || '-'}
\`\`\`
`;
}

window.DCAstra = { check, run, toMarkdown, stopText, isVerified, runnerBase, ollamaHost, consoleUrl: 'astra.html', UNV };
