/* DARK CODE · cloud module (ES module)
 * Firebase Auth (email/password, Google, GitHub) · Firestore (integration summaries, consent-based remote sessions)
 * Encrypted local vault (WebCrypto AES-GCM, non-extractable key in IndexedDB) for API keys/tokens.
 * Only public web config lives here; OAuth client secrets stay in Firebase (server side).
 */
const V = '13.4.0';
const CFG = {
  apiKey: 'AIzaSyD1G6lSAy_eZc1OSmWH3O_LdTHsoqYL61s',
  authDomain: 'gen-lang-client-0643590356.firebaseapp.com',
  projectId: 'gen-lang-client-0643590356',
  appId: '1:471038977855:web:69f94a97a5d92421a0558a',
};
let A, F, app, auth, db, ready;
export function init() {
  if (ready) return ready;
  ready = (async () => {
    const [appMod, authMod, fsMod] = await Promise.all([
      import(`https://www.gstatic.com/firebasejs/${V}/firebase-app.js`),
      import(`https://www.gstatic.com/firebasejs/${V}/firebase-auth.js`),
      import(`https://www.gstatic.com/firebasejs/${V}/firebase-firestore.js`),
    ]);
    A = authMod; F = fsMod;
    app = appMod.getApps()[0] || appMod.initializeApp(CFG);
    auth = A.getAuth(app); auth.languageCode = 'ko';
    db = F.getFirestore(app);
    return { auth, db };
  })();
  return ready;
}
const home = () => location.origin + location.pathname.replace(/[^/]*$/, '');

/* ---------------- auth ---------------- */
export async function onUser(cb) { await init(); return A.onAuthStateChanged(auth, cb); }
export function currentUser() { return auth?.currentUser || null; }
export function isTrusted(u) { return !!u && (u.emailVerified || u.providerData.some((p) => ['google.com', 'github.com'].includes(p.providerId))); }
async function persist(keep) { await A.setPersistence(auth, keep ? A.browserLocalPersistence : A.browserSessionPersistence); }
export async function signUp(email, pw, name, keep) {
  await init(); await persist(keep);
  const cred = await A.createUserWithEmailAndPassword(auth, email, pw);
  if (name) await A.updateProfile(cred.user, { displayName: name });
  await A.sendEmailVerification(cred.user, { url: home() });
  return cred.user;
}
export async function signIn(email, pw, keep) { await init(); await persist(keep); return (await A.signInWithEmailAndPassword(auth, email, pw)).user; }
export async function resetPassword(email) { await init(); await A.sendPasswordResetEmail(auth, email, { url: home() }); }
export async function resendVerification() { await init(); if (auth.currentUser) await A.sendEmailVerification(auth.currentUser, { url: home() }); }
export async function reloadUser() { await init(); if (auth.currentUser) await A.reload(auth.currentUser); return auth.currentUser; }
export async function signOutUser() { await init(); await A.signOut(auth); }
export async function sessionInfo() {
  await init(); const u = auth.currentUser; if (!u) return null;
  const r = await A.getIdTokenResult(u); // token itself is never displayed or stored by the app
  return { exp: r.expirationTime, issued: r.issuedAtTime, provider: r.signInProvider, uid: u.uid };
}
function provider(id) {
  if (id === 'google') { const p = new A.GoogleAuthProvider(); p.setCustomParameters({ prompt: 'select_account' }); return p; }
  const p = new A.GithubAuthProvider(); p.addScope('read:user'); return p;
}
function tokenFrom(id, res) { const C = id === 'google' ? A.GoogleAuthProvider : A.GithubAuthProvider; return C.credentialFromResult(res)?.accessToken || null; }
export async function signInWith(id, keep) { await init(); await persist(keep); const res = await A.signInWithPopup(auth, provider(id)); return { user: res.user, accessToken: tokenFrom(id, res) }; }
// one-click integration: link provider to the current account (or re-auth if already linked)
export async function linkProvider(id) {
  await init(); const u = auth.currentUser; if (!u) throw new Error('로그인이 필요합니다');
  const pid = id === 'google' ? 'google.com' : 'github.com';
  const linked = u.providerData.some((p) => p.providerId === pid);
  const res = linked ? await A.reauthenticateWithPopup(u, provider(id)) : await A.linkWithPopup(u, provider(id));
  const info = res.user.providerData.find((p) => p.providerId === pid) || {};
  return { accessToken: tokenFrom(id, res), profile: { email: info.email, name: info.displayName, photo: info.photoURL, uid: info.uid }, relinked: linked };
}
export async function unlinkProvider(id) { await init(); const u = auth.currentUser; const pid = id === 'google' ? 'google.com' : 'github.com'; if (u.providerData.length <= 1) throw new Error('유일한 로그인 수단은 해제할 수 없습니다'); await A.unlink(u, pid); }
export function linkedProviders() { return (auth?.currentUser?.providerData || []).map((p) => p.providerId); }

/* ---------------- integration summaries (no secrets) ---------------- */
export async function saveIntegration(svc, data) { await init(); const u = auth.currentUser; if (!u) return; await F.setDoc(F.doc(db, 'users', u.uid, 'integrations', svc), { ...data, updatedAt: F.serverTimestamp() }); }
export async function removeIntegration(svc) { await init(); const u = auth.currentUser; if (!u) return; await F.deleteDoc(F.doc(db, 'users', u.uid, 'integrations', svc)); }
export async function loadIntegrations() {
  await init(); const u = auth.currentUser; if (!u) return {};
  const snap = await F.getDocs(F.collection(db, 'users', u.uid, 'integrations'));
  const out = {}; snap.forEach((d) => { out[d.id] = d.data(); }); return out;
}

/* ---------------- remote support sessions (consent-based) ---------------- */
const SID_CH = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';
function newSid() { const a = new Uint8Array(28); crypto.getRandomValues(a); return [...a].map((b) => SID_CH[b % SID_CH.length]).join(''); }
export async function createRemote({ note, tasks, minutes, scope, targetLabel }) {
  await init(); const u = auth.currentUser; if (!u) throw new Error('로그인이 필요합니다');
  const sid = newSid();
  const mins = Math.max(1, Math.min(14, minutes | 0 || 5));
  await F.setDoc(F.doc(db, 'remoteSessions', sid), {
    requesterUid: u.uid, requesterName: u.displayName || u.email.split('@')[0], requesterEmail: u.email || '',
    note: String(note || '').slice(0, 300), tasks: (tasks || []).slice(0, 6), status: 'pending',
    createdAt: F.serverTimestamp(), expiresAt: F.Timestamp.fromMillis(Date.now() + mins * 60000), log: [],
    ...(scope ? { scope: { view: !!scope.view, input: !!scope.input } } : {}), ...(targetLabel ? { targetLabel: String(targetLabel).slice(0, 40) } : {}),
  });
  return sid;
}
export async function watchRemote(sid, cb, onErr) { await init(); return F.onSnapshot(F.doc(db, 'remoteSessions', sid), (s) => cb(s.exists() ? { id: s.id, ...s.data() } : null), onErr); }
export async function respondRemote(sid, status, target) { await init(); await F.updateDoc(F.doc(db, 'remoteSessions', sid), { status, respondedAt: F.serverTimestamp(), ...(target ? { target } : {}) }); }
export async function expireRemote(sid) { await init(); await F.updateDoc(F.doc(db, 'remoteSessions', sid), { status: 'expired' }); }
export async function endRemote(sid, by) { await init(); await F.updateDoc(F.doc(db, 'remoteSessions', sid), { status: by === 'target' ? 'ended' : 'ended', endedAt: F.serverTimestamp(), endedBy: by }); }
export async function cancelRemote(sid) { await init(); await F.updateDoc(F.doc(db, 'remoteSessions', sid), { status: 'cancelled', endedAt: F.serverTimestamp(), endedBy: 'requester' }); }
export async function logRemote(sid, msg) { await init(); await F.updateDoc(F.doc(db, 'remoteSessions', sid), { log: F.arrayUnion({ t: Date.now(), msg: String(msg).slice(0, 240) }) }); }
// WebRTC signaling (rules: only while status == 'accepted'; target writes offer/tice_*, requester writes answer/rice_*)
export async function putSignal(sid, id, data) { await init(); await F.setDoc(F.doc(db, 'remoteSessions', sid, 'signal', id), data); }
export async function watchSignals(sid, cb, onErr) { await init(); return F.onSnapshot(F.collection(db, 'remoteSessions', sid, 'signal'), (s) => s.docChanges().forEach((ch) => { if (ch.type !== 'removed') cb(ch.doc.id, ch.doc.data()); }), onErr); }
export async function deleteRemote(sid) { await init(); await F.deleteDoc(F.doc(db, 'remoteSessions', sid)); }
export async function listMyRemotes() {
  await init(); const u = auth.currentUser; if (!u) return [];
  const q = F.query(F.collection(db, 'remoteSessions'), F.where('requesterUid', '==', u.uid), F.limit(20));
  const s = await F.getDocs(q); const out = []; s.forEach((d) => out.push({ id: d.id, ...d.data() }));
  return out.sort((a, b) => (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0));
}

/* ---------------- encrypted local vault ---------------- */
const DBN = 'darkcode-vault';
function idb() {
  return new Promise((res, rej) => {
    const r = indexedDB.open(DBN, 1);
    r.onupgradeneeded = () => { r.result.createObjectStore('keys'); r.result.createObjectStore('secrets'); };
    r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error);
  });
}
function tx(store, mode, fn) { return idb().then((d) => new Promise((res, rej) => { const t = d.transaction(store, mode); const s = t.objectStore(store); const r = fn(s); t.oncomplete = () => res(r?.result); t.onerror = () => rej(t.error); })); }
let masterKey;
async function key() {
  if (masterKey) return masterKey;
  let k = await tx('keys', 'readonly', (s) => s.get('master'));
  if (!k) { k = await crypto.subtle.generateKey({ name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']); await tx('keys', 'readwrite', (s) => s.put(k, 'master')); }
  return (masterKey = k);
}
export const vault = {
  async put(name, value) {
    if (!value) return vault.del(name);
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const ct = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, await key(), new TextEncoder().encode(value));
    await tx('secrets', 'readwrite', (s) => s.put({ iv, ct }, name));
  },
  async get(name) {
    const rec = await tx('secrets', 'readonly', (s) => s.get(name)); if (!rec) return '';
    try { return new TextDecoder().decode(await crypto.subtle.decrypt({ name: 'AES-GCM', iv: rec.iv }, await key(), rec.ct)); } catch { return ''; }
  },
  async del(name) { await tx('secrets', 'readwrite', (s) => s.delete(name)); },
};
export const mask = (s) => (s ? `${s.slice(0, 6)}…${s.slice(-4)}` : '');
