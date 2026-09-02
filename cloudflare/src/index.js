const JSON_HEADERS = { 'content-type': 'application/json; charset=utf-8' };
const SESSION_DAYS = 180;
const OTP_MINUTES = 10;
const PASSWORD_ITERATIONS = 100000;
const ASSISTANT_MODEL = 'openai/gpt-oss-20b';

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || 'null';
    const cors = corsHeaders(origin, env);
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
    if (!originAllowed(origin, env)) return json({ error: 'Origin is not allowed.' }, 403, cors);

    try {
      const url = new URL(request.url);
      const path = url.pathname.replace(/\/+$/, '') || '/';
      if (path === '/health' && request.method === 'GET') {
        return json({ ok: true, service: 'rhine-lab-api', version: '1' }, 200, cors);
      }

      if (path === '/api/auth/register/request' && request.method === 'POST') return registerRequest(request, env, cors);
      if (path === '/api/auth/register/verify' && request.method === 'POST') return registerVerify(request, env, cors);
      if (path === '/api/auth/login/password' && request.method === 'POST') return passwordLogin(request, env, cors);
      if (path === '/api/auth/login/code/request' && request.method === 'POST') return loginCodeRequest(request, env, cors);
      if (path === '/api/auth/login/code/verify' && request.method === 'POST') return loginCodeVerify(request, env, cors);
      if (path === '/api/assistant' && request.method === 'POST') return await assistantChat(request, env, cors);

      const auth = await authenticate(request, env);
      if (!auth) return json({ error: 'Authentication required.' }, 401, cors);

      if (path === '/api/auth/session' && request.method === 'GET') return json({ user: publicUser(auth.user) }, 200, cors);
      if (path === '/api/auth/logout' && request.method === 'POST') return logout(auth, env, cors);
      if (path === '/api/workspace' && request.method === 'GET') return getWorkspace(auth, env, cors);
      if (path === '/api/workspace' && request.method === 'PUT') return putWorkspace(request, auth, env, cors);
      if (path === '/api/labs' && request.method === 'GET') return listLabs(auth, env, cors);
      if (path === '/api/labs' && request.method === 'POST') return createLab(request, auth, env, cors);
      if (path === '/api/labs/join' && request.method === 'POST') return joinLab(request, auth, env, cors);
      if (path === '/api/attachments' && request.method === 'PUT') return putAttachment(request, url, auth, env, cors);
      if (path === '/api/attachments' && request.method === 'GET') return getAttachment(url, auth, env, cors);

      const keyMatch = path.match(/^\/api\/labs\/([^/]+)\/key$/);
      if (keyMatch && request.method === 'PUT') return setLabKey(request, decodeURIComponent(keyMatch[1]), auth, env, cors);
      const memberMatch = path.match(/^\/api\/labs\/([^/]+)\/members$/);
      if (memberMatch && request.method === 'GET') return listLabMembers(decodeURIComponent(memberMatch[1]), auth, env, cors);
      const publicationMatch = path.match(/^\/api\/labs\/([^/]+)\/publications$/);
      if (publicationMatch && request.method === 'GET') return listPublications(decodeURIComponent(publicationMatch[1]), auth, env, cors);
      const ownPublicationMatch = path.match(/^\/api\/labs\/([^/]+)\/publications\/me$/);
      if (ownPublicationMatch && request.method === 'PUT') return putPublication(request, decodeURIComponent(ownPublicationMatch[1]), auth, env, cors);

      return json({ error: 'Not found.' }, 404, cors);
    } catch (error) {
      console.error(error);
      const status = error instanceof HttpError ? error.status : 500;
      return json({ error: error && error.message ? error.message : 'Internal error.' }, status, cors);
    }
  }
};

function corsHeaders(origin, env) {
  const allowed = originAllowed(origin, env) ? origin : 'null';
  return {
    'access-control-allow-origin': allowed,
    'access-control-allow-headers': 'authorization, content-type, x-rhine-device',
    'access-control-allow-methods': 'GET, POST, PUT, OPTIONS',
    'access-control-max-age': '86400',
    'vary': 'Origin'
  };
}

function originAllowed(origin, env) {
  if (origin === 'null' || /^https?:\/\/(?:localhost|127\.0\.0\.1)(?::\d+)?$/i.test(origin) || /^https:\/\/localhost$/i.test(origin) || /^capacitor:\/\/localhost$/i.test(origin)) return true;
  const configured = String(env.ALLOWED_ORIGINS || '').split(',').map((item) => item.trim()).filter(Boolean);
  return configured.includes(origin);
}

function json(value, status = 200, extra = {}) {
  return new Response(JSON.stringify(value), { status, headers: { ...JSON_HEADERS, 'cache-control': 'no-store', ...extra } });
}

async function readJson(request, maxBytes = 2_000_000) {
  const length = Number(request.headers.get('content-length') || 0);
  if (length > maxBytes) throw new HttpError(413, 'Request is too large.');
  const text = await request.text();
  if (text.length > maxBytes) throw new HttpError(413, 'Request is too large.');
  try { return text ? JSON.parse(text) : {}; } catch (_) { throw new HttpError(400, 'Invalid JSON.'); }
}

async function assistantChat(request, env, cors) {
  if (!env.GROQ_API_KEY) throw new HttpError(503, 'AI service is not configured.');
  const device = String(request.headers.get('x-rhine-device') || '').trim();
  const ip = String(request.headers.get('cf-connecting-ip') || 'unknown');
  const key = await sha256(ip + ':' + (/^[a-z0-9-]{16,80}$/i.test(device) ? device : 'anonymous'));
  const rate = await env.ASSISTANT_RATE_LIMITER.limit({ key });
  if (!rate.success) throw new HttpError(429, 'Please wait before sending another message.');

  const body = await readJson(request, 30_000);
  const message = String(body.message || '').trim();
  if (!message) throw new HttpError(400, 'Message is required.');
  if (message.length > 4000) throw new HttpError(413, 'Message is too long.');
  const quota = await consumeAssistantDailyQuota(env, device, ip);
  if (!quota.allowed) return json({ error: 'This device has used today’s AI quota.', quota }, 429, cors);
  const english = /^en(?:-|$)/i.test(String(body.locale || ''));
  const system = english
    ? 'You are Kristen, the Rhine Lab in-app assistant. Only help users read, organize, draft, or automate records inside Rhine Lab. You have no permission or tools to browse the web, control a device, run code, contact people, or perform external actions; refuse unrelated requests. App data is searched locally and is not included in this request. Never invent records, citations, or sources. Any mutation must remain an editable draft until the user explicitly confirms it in the app.'
    : '你是 Rhine Lab 的应用内助理克里斯滕。只能帮助用户读取、整理、起草或自动化 Rhine Lab 内部记录；你无权且没有工具浏览网页、控制设备、运行代码、联系他人或执行任何外部操作，遇到无关请求应拒绝。应用数据只在设备本地检索，不包含在本请求中。不得虚构记录、文献或来源；任何修改都必须保持为可编辑草稿，直到用户在应用内明确确认。';
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { authorization: 'Bearer ' + env.GROQ_API_KEY, 'content-type': 'application/json' },
    body: JSON.stringify({
      model: ASSISTANT_MODEL,
      messages: [{ role: 'system', content: system }, { role: 'user', content: message }],
      temperature: 0.3,
      max_completion_tokens: 512
    })
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new HttpError(response.status === 429 ? 429 : 502, response.status === 429 ? 'AI quota is temporarily exhausted.' : 'AI service is unavailable.');
  const content = data && data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
  if (!content) throw new HttpError(502, 'AI service returned an empty response.');
  return json({ content: String(content), model: ASSISTANT_MODEL, quota }, 200, cors);
}

async function consumeAssistantDailyQuota(env, device, ip) {
  if (!env.DB) throw new HttpError(503, 'AI quota storage is unavailable.');
  const limit = Math.max(1, Math.min(500, Math.floor(Number(env.ASSISTANT_DAILY_LIMIT) || 30)));
  const usageDate = new Date().toISOString().slice(0, 10);
  const identity = /^[a-z0-9-]{16,80}$/i.test(device) ? device : 'anonymous:' + ip;
  const deviceHash = await sha256('assistant-device:' + identity);
  const updatedAt = nowIso();
  const statement = 'INSERT INTO assistant_device_usage (device_hash, usage_date, requests, updated_at) VALUES (?, ?, 1, ?) ON CONFLICT(device_hash, usage_date) DO UPDATE SET requests = requests + 1, updated_at = excluded.updated_at WHERE assistant_device_usage.requests < ? RETURNING requests';
  const row = await env.DB.prepare(statement).bind(deviceHash, usageDate, updatedAt, limit).first();
  const current = row || await env.DB.prepare('SELECT requests FROM assistant_device_usage WHERE device_hash = ? AND usage_date = ?').bind(deviceHash, usageDate).first();
  const used = Math.max(0, Number(current && current.requests || 0));
  const reset = new Date(usageDate + 'T00:00:00.000Z'); reset.setUTCDate(reset.getUTCDate() + 1);
  return { allowed: Boolean(row), limit, remaining: Math.max(0, limit - used), resetsAt: reset.toISOString() };
}

class HttpError extends Error {
  constructor(status, message) { super(message); this.status = status; }
}

function validEncryptedEnvelope(value, purpose) {
  return Boolean(value
    && typeof value === 'object'
    && value.v === 1
    && value.alg === 'A256GCM'
    && value.purpose === purpose
    && typeof value.iv === 'string' && value.iv.length >= 16
    && typeof value.ciphertext === 'string' && value.ciphertext.length >= 16);
}

function normalizeEmail(value) { return String(value || '').trim().toLowerCase(); }
function normalizeLabName(value) { return String(value || '').trim().replace(/\s+/g, ' '); }
function nowIso() { return new Date().toISOString(); }
function futureIso(milliseconds) { return new Date(Date.now() + milliseconds).toISOString(); }
function uuid() { return crypto.randomUUID(); }

function bytesToBase64(bytes) {
  let binary = '';
  for (let i = 0; i < bytes.length; i += 1) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

function base64ToBytes(value) {
  const binary = atob(value);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

function base64Url(bytes) { return bytesToBase64(bytes).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, ''); }

async function sha256(value) {
  const bytes = typeof value === 'string' ? new TextEncoder().encode(value) : value;
  return base64Url(new Uint8Array(await crypto.subtle.digest('SHA-256', bytes)));
}

async function derivePassword(password, salt, iterations = PASSWORD_ITERATIONS, pepper = '') {
  const secret = String(password) + '\u0000' + String(pepper || '');
  const material = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt, iterations }, material, 256);
  return new Uint8Array(bits);
}

async function passwordRecord(password, env) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  return { salt: bytesToBase64(salt), hash: bytesToBase64(await derivePassword(password, salt, PASSWORD_ITERATIONS, env.AUTH_PEPPER || '')), iterations: PASSWORD_ITERATIONS };
}

async function passwordMatchesWithPepper(password, saltValue, hashValue, iterations, pepper) {
  const actual = await derivePassword(password, base64ToBytes(saltValue), Number(iterations || PASSWORD_ITERATIONS), pepper);
  const expected = base64ToBytes(hashValue);
  if (actual.length !== expected.length) return false;
  let difference = 0;
  for (let i = 0; i < actual.length; i += 1) difference |= actual[i] ^ expected[i];
  return difference === 0;
}

async function verifyPassword(password, user, env) {
  const current = String(env.AUTH_PEPPER || '');
  const candidates = [current]
    .concat(String(env.AUTH_PEPPER_PREVIOUS || '').split(',').map((value) => value.trim()).filter(Boolean))
    .concat([''])
    .filter((value, index, values) => values.indexOf(value) === index);
  for (const pepper of candidates) {
    if (await passwordMatchesWithPepper(password, user.password_salt, user.password_hash, user.password_iterations, pepper)) {
      return { matched: true, needsUpgrade: pepper !== current || Number(user.password_iterations) !== PASSWORD_ITERATIONS };
    }
  }
  return { matched: false, needsUpgrade: false };
}

async function passwordMatches(password, saltValue, hashValue, iterations, env) {
  return (await verifyPassword(password, { password_salt: saltValue, password_hash: hashValue, password_iterations: iterations }, env)).matched;
}

function randomOtp() {
  const maximum = 0x100000000 - (0x100000000 % 100000000);
  const values = new Uint32Array(1);
  do crypto.getRandomValues(values); while (values[0] >= maximum);
  return String(values[0] % 100000000).padStart(8, '0');
}

function randomToken() { return base64Url(crypto.getRandomValues(new Uint8Array(32))); }

async function sendOtp(env, email, code, purpose) {
  if (!env.BREVO_API_KEY) throw new HttpError(503, 'Email service is not configured.');
  const subject = purpose === 'register' ? 'Verify your Rhine Lab account' : 'Your Rhine Lab sign-in code';
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  let response;
  try {
    response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'api-key': env.BREVO_API_KEY },
      body: JSON.stringify({
        sender: { email: env.MAIL_FROM_EMAIL || 'noreply@rh1nelab.com', name: env.MAIL_FROM_NAME || 'Rhine Lab' },
        to: [{ email }],
        subject,
        htmlContent: `<div style="font-family:Arial,Helvetica,sans-serif;color:#17201d"><h2>Rhine Lab</h2><p>Your verification code is:</p><p style="font-size:28px;font-weight:700;letter-spacing:.18em">${code}</p><p>This code expires in ${OTP_MINUTES} minutes. If you did not request it, ignore this email.</p></div>`
      }),
      signal: controller.signal
    });
  } catch (error) {
    if (error && error.name === 'AbortError') throw new HttpError(504, 'Email service timed out. Please try again.');
    throw error;
  } finally {
    clearTimeout(timeout);
  }
  if (!response.ok) {
    const detail = await response.text();
    console.error('Brevo error', response.status, detail);
    throw new HttpError(502, 'Unable to send verification email.');
  }
}

async function enforceOtpRateLimit(env, email, request) {
  const minuteAgo = new Date(Date.now() - 60_000).toISOString();
  const hourAgo = new Date(Date.now() - 3_600_000).toISOString();
  const recent = await env.DB.prepare('SELECT created_at FROM auth_codes WHERE email = ? AND created_at > ? ORDER BY created_at DESC LIMIT 1').bind(email, minuteAgo).first();
  if (recent) throw new HttpError(429, 'Please wait before requesting another code.');
  const hourly = await env.DB.prepare('SELECT COUNT(*) AS total FROM auth_codes WHERE email = ? AND created_at > ?').bind(email, hourAgo).first();
  if (Number(hourly && hourly.total || 0) >= 5) throw new HttpError(429, 'Too many verification requests. Try again later.');
  const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
  const ipHash = await sha256(`${ip}|${env.AUTH_PEPPER || 'rhine-lab'}`);
  const ipHourly = await env.DB.prepare('SELECT COUNT(*) AS total FROM auth_codes WHERE request_ip_hash = ? AND created_at > ?').bind(ipHash, hourAgo).first();
  if (Number(ipHourly && ipHourly.total || 0) >= 20) throw new HttpError(429, 'Too many verification requests. Try again later.');
  return ipHash;
}

async function enforcePasswordRateLimit(env, email, request) {
  const windowStart = new Date(Date.now() - 15 * 60_000).toISOString();
  const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
  const ipHash = await sha256(`${ip}|${env.AUTH_PEPPER || 'rhine-lab'}`);
  const emailFailures = await env.DB.prepare('SELECT COUNT(*) AS total FROM login_attempts WHERE email = ? AND created_at > ?').bind(email, windowStart).first();
  const ipFailures = await env.DB.prepare('SELECT COUNT(*) AS total FROM login_attempts WHERE request_ip_hash = ? AND created_at > ?').bind(ipHash, windowStart).first();
  if (Number(emailFailures && emailFailures.total || 0) >= 8 || Number(ipFailures && ipFailures.total || 0) >= 30) {
    throw new HttpError(429, 'Too many login attempts. Try again later.');
  }
  return ipHash;
}

async function recordPasswordFailure(env, email, ipHash) {
  await env.DB.prepare('INSERT INTO login_attempts (id, email, request_ip_hash, created_at) VALUES (?, ?, ?, ?)').bind(uuid(), email, ipHash, nowIso()).run();
  const cutoff = new Date(Date.now() - 24 * 3_600_000).toISOString();
  await env.DB.prepare('DELETE FROM login_attempts WHERE created_at < ?').bind(cutoff).run();
}

async function createOtp(env, request, email, purpose) {
  const ipHash = await enforceOtpRateLimit(env, email, request);
  const code = randomOtp();
  const hash = await sha256(`${purpose}|${email}|${code}|${env.AUTH_PEPPER || ''}`);
  await env.DB.prepare('DELETE FROM auth_codes WHERE email = ? AND purpose = ?').bind(email, purpose).run();
  const codeId = uuid();
  await env.DB.prepare('INSERT INTO auth_codes (id, email, purpose, code_hash, request_ip_hash, expires_at, attempts, created_at) VALUES (?, ?, ?, ?, ?, ?, 0, ?)')
    .bind(codeId, email, purpose, hash, ipHash, futureIso(OTP_MINUTES * 60_000), nowIso()).run();
  try {
    await sendOtp(env, email, code, purpose);
  } catch (error) {
    await env.DB.prepare('DELETE FROM auth_codes WHERE id = ?').bind(codeId).run();
    throw error;
  }
}

async function consumeOtp(env, email, purpose, code) {
  const row = await env.DB.prepare('SELECT id, code_hash, expires_at, attempts FROM auth_codes WHERE email = ? AND purpose = ? ORDER BY created_at DESC LIMIT 1').bind(email, purpose).first();
  if (!row || row.expires_at < nowIso() || Number(row.attempts) >= 5) return false;
  const actual = await sha256(`${purpose}|${email}|${code}|${env.AUTH_PEPPER || ''}`);
  if (actual !== row.code_hash) {
    await env.DB.prepare('UPDATE auth_codes SET attempts = attempts + 1 WHERE id = ?').bind(row.id).run();
    return false;
  }
  await env.DB.prepare('DELETE FROM auth_codes WHERE id = ?').bind(row.id).run();
  return true;
}

async function registerRequest(request, env, cors) {
  try {
    const body = await readJson(request, 50_000);
    const email = normalizeEmail(body.email);
    const password = String(body.password || '');
    if (!/^\S+@\S+\.\S+$/.test(email)) throw new HttpError(400, 'Enter a valid email address.');
    if (password.length < 10) throw new HttpError(400, 'Password must contain at least 10 characters.');
    const existing = await env.DB.prepare('SELECT id FROM users WHERE email = ?').bind(email).first();
    if (existing) throw new HttpError(409, 'Account already exists.');
    const record = await passwordRecord(password, env);
    await env.DB.prepare('INSERT INTO pending_registrations (email, password_salt, password_hash, password_iterations, expires_at, created_at) VALUES (?, ?, ?, ?, ?, ?) ON CONFLICT(email) DO UPDATE SET password_salt=excluded.password_salt, password_hash=excluded.password_hash, password_iterations=excluded.password_iterations, expires_at=excluded.expires_at, created_at=excluded.created_at')
      .bind(email, record.salt, record.hash, record.iterations, futureIso(30 * 60_000), nowIso()).run();
    await createOtp(env, request, email, 'register');
    return json({ ok: true }, 200, cors);
  } catch (error) { return errorResponse(error, cors); }
}

async function registerVerify(request, env, cors) {
  try {
    const body = await readJson(request, 20_000);
    const email = normalizeEmail(body.email);
    const code = String(body.code || '').replace(/\s+/g, '');
    if (!(await consumeOtp(env, email, 'register', code))) throw new HttpError(400, 'Verification code is invalid or expired.');
    const pending = await env.DB.prepare('SELECT * FROM pending_registrations WHERE email = ? AND expires_at > ?').bind(email, nowIso()).first();
    if (!pending) throw new HttpError(400, 'Registration has expired.');
    const userId = uuid();
    await env.DB.batch([
      env.DB.prepare('INSERT INTO users (id, email, password_salt, password_hash, password_iterations, email_verified, created_at, updated_at) VALUES (?, ?, ?, ?, ?, 1, ?, ?)').bind(userId, email, pending.password_salt, pending.password_hash, pending.password_iterations, nowIso(), nowIso()),
      env.DB.prepare('DELETE FROM pending_registrations WHERE email = ?').bind(email)
    ]);
    return createSessionResponse(userId, env, cors);
  } catch (error) { return errorResponse(error, cors); }
}

async function passwordLogin(request, env, cors) {
  try {
    const body = await readJson(request, 50_000);
    const email = normalizeEmail(body.email);
    const password = String(body.password || '');
    const ipHash = await enforcePasswordRateLimit(env, email, request);
    const user = await env.DB.prepare('SELECT * FROM users WHERE email = ? AND email_verified = 1').bind(email).first();
    const verification = user ? await verifyPassword(password, user, env) : { matched: false, needsUpgrade: false };
    if (!verification.matched) {
      await recordPasswordFailure(env, email, ipHash);
      throw new HttpError(401, 'Email or password is incorrect.');
    }
    if (verification.needsUpgrade) {
      const upgraded = await passwordRecord(password, env);
      await env.DB.prepare('UPDATE users SET password_salt = ?, password_hash = ?, password_iterations = ?, updated_at = ? WHERE id = ?').bind(upgraded.salt, upgraded.hash, upgraded.iterations, nowIso(), user.id).run();
    }
    await env.DB.prepare('DELETE FROM login_attempts WHERE email = ?').bind(email).run();
    return createSessionResponse(user.id, env, cors);
  } catch (error) { return errorResponse(error, cors); }
}
async function loginCodeRequest(request, env, cors) {
  try {
    const body = await readJson(request, 20_000);
    const email = normalizeEmail(body.email);
    const user = await env.DB.prepare('SELECT id FROM users WHERE email = ? AND email_verified = 1').bind(email).first();
    if (user) await createOtp(env, request, email, 'login');
    return json({ ok: true }, 200, cors);
  } catch (error) { return errorResponse(error, cors); }
}

async function loginCodeVerify(request, env, cors) {
  try {
    const body = await readJson(request, 20_000);
    const email = normalizeEmail(body.email);
    const code = String(body.code || '').replace(/\s+/g, '');
    const user = await env.DB.prepare('SELECT id FROM users WHERE email = ? AND email_verified = 1').bind(email).first();
    if (!user || !(await consumeOtp(env, email, 'login', code))) throw new HttpError(400, 'Verification code is invalid or expired.');
    return createSessionResponse(user.id, env, cors);
  } catch (error) { return errorResponse(error, cors); }
}

async function createSessionResponse(userId, env, cors) {
  await env.DB.prepare('DELETE FROM sessions WHERE expires_at < ?').bind(nowIso()).run();
  await env.DB.prepare('DELETE FROM sessions WHERE user_id = ? AND id NOT IN (SELECT id FROM sessions WHERE user_id = ? ORDER BY created_at DESC LIMIT 19)').bind(userId, userId).run();
  const token = randomToken();
  const tokenHash = await sha256(token);
  const sessionId = uuid();
  await env.DB.prepare('INSERT INTO sessions (id, user_id, token_hash, expires_at, created_at, last_seen_at) VALUES (?, ?, ?, ?, ?, ?)')
    .bind(sessionId, userId, tokenHash, futureIso(SESSION_DAYS * 86_400_000), nowIso(), nowIso()).run();
  const user = await env.DB.prepare('SELECT id, email, email_verified, created_at FROM users WHERE id = ?').bind(userId).first();
  return json({ token, user: publicUser(user) }, 200, cors);
}

function publicUser(user) { return { id: user.id, email: user.email, email_verified: Boolean(user.email_verified), created_at: user.created_at }; }

async function authenticate(request, env) {
  const header = request.headers.get('Authorization') || '';
  const token = header.startsWith('Bearer ') ? header.slice(7).trim() : '';
  if (!token) return null;
  const tokenHash = await sha256(token);
  const row = await env.DB.prepare('SELECT sessions.id AS session_id, sessions.expires_at, users.id, users.email, users.email_verified, users.created_at FROM sessions JOIN users ON users.id = sessions.user_id WHERE sessions.token_hash = ?').bind(tokenHash).first();
  if (!row || row.expires_at < nowIso()) {
    if (row) await env.DB.prepare('DELETE FROM sessions WHERE id = ?').bind(row.session_id).run();
    return null;
  }
  if (Math.random() < 0.05) await env.DB.prepare('UPDATE sessions SET last_seen_at = ? WHERE id = ?').bind(nowIso(), row.session_id).run();
  return { sessionId: row.session_id, user: row };
}

async function logout(auth, env, cors) {
  await env.DB.prepare('DELETE FROM sessions WHERE id = ?').bind(auth.sessionId).run();
  return json({ ok: true }, 200, cors);
}

async function getWorkspace(auth, env, cors) {
  const row = await env.DB.prepare('SELECT workspace_key, object_key, revision, updated_at FROM workspace_snapshots WHERE owner_id = ?').bind(auth.user.id).first();
  if (!row) return json({ data: null }, 200, cors);
  const object = await env.ATTACHMENTS.get(row.object_key);
  if (!object) return json({ data: null }, 200, cors);
  return json({ data: { workspace_key: row.workspace_key, payload: JSON.parse(await object.text()), revision: row.revision, updated_at: row.updated_at } }, 200, cors);
}

async function putWorkspace(request, auth, env, cors) {
  try {
    const body = await readJson(request, 8_000_000);
    if (!validEncryptedEnvelope(body.payload, 'account-workspace')) throw new HttpError(400, 'A valid encrypted workspace envelope is required.');
    const serialized = JSON.stringify(body.payload);
    const objectKey = `workspaces/user/${auth.user.id}.json`;
    await env.ATTACHMENTS.put(objectKey, serialized, { httpMetadata: { contentType: 'application/json' }, customMetadata: { encrypted: 'A256GCM' } });
    const updatedAt = nowIso();
    await env.DB.prepare('INSERT INTO workspace_snapshots (workspace_key, owner_id, object_key, revision, payload_sha256, payload_bytes, updated_at) VALUES (?, ?, ?, 1, ?, ?, ?) ON CONFLICT(owner_id) DO UPDATE SET object_key=excluded.object_key, revision=workspace_snapshots.revision+1, payload_sha256=excluded.payload_sha256, payload_bytes=excluded.payload_bytes, updated_at=excluded.updated_at')
      .bind(`user:${auth.user.id}`, auth.user.id, objectKey, await sha256(serialized), new TextEncoder().encode(serialized).length, updatedAt).run();
    const saved = await env.DB.prepare('SELECT revision, updated_at FROM workspace_snapshots WHERE owner_id = ?').bind(auth.user.id).first();
    return json({ data: saved }, 200, cors);
  } catch (error) { return errorResponse(error, cors); }
}

async function listLabs(auth, env, cors) {
  const result = await env.DB.prepare('SELECT lm.lab_id, lm.role, lm.created_at, l.name FROM lab_members lm JOIN labs l ON l.id = lm.lab_id WHERE lm.user_id = ? ORDER BY lm.created_at ASC').bind(auth.user.id).all();
  return json({ data: (result.results || []).map((row) => ({ lab_id: row.lab_id, role: row.role, created_at: row.created_at, labs: { name: row.name } })) }, 200, cors);
}

async function createLab(request, auth, env, cors) {
  try {
    const body = await readJson(request, 50_000);
    const name = normalizeLabName(body.name || 'Rhine Lab');
    const password = String(body.password || '');
    if (!name) throw new HttpError(400, 'LAB name is required.');
    if (password.length < 10) throw new HttpError(400, 'LAB password must contain at least 10 characters.');
    const record = await passwordRecord(password, env);
    const labId = uuid();
    try {
      await env.DB.batch([
        env.DB.prepare('INSERT INTO labs (id, name, name_key, owner_id, password_salt, password_hash, password_iterations, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)').bind(labId, name, name.toLowerCase(), auth.user.id, record.salt, record.hash, record.iterations, nowIso(), nowIso()),
        env.DB.prepare("INSERT INTO lab_members (lab_id, user_id, role, created_at) VALUES (?, ?, 'owner', ?)").bind(labId, auth.user.id, nowIso())
      ]);
    } catch (error) {
      if (String(error.message || '').includes('UNIQUE')) throw new HttpError(409, 'A LAB with this name already exists.');
      throw error;
    }
    return json({ data: labId }, 200, cors);
  } catch (error) { return errorResponse(error, cors); }
}

async function setLabKey(request, labId, auth, env, cors) {
  try {
    const body = await readJson(request, 200_000);
    const lab = await env.DB.prepare('SELECT * FROM labs WHERE id = ? AND owner_id = ?').bind(labId, auth.user.id).first();
    if (!lab || !(await passwordMatches(String(body.password || ''), lab.password_salt, lab.password_hash, lab.password_iterations, env))) throw new HttpError(403, 'LAB credentials are invalid.');
    if (!validEncryptedEnvelope(body.key_envelope, 'lab-key-wrap')) throw new HttpError(400, 'A valid encrypted LAB key envelope is required.');
    const serialized = JSON.stringify(body.key_envelope);
    await env.DB.prepare('UPDATE labs SET key_envelope = ?, updated_at = ? WHERE id = ?').bind(serialized, nowIso(), labId).run();
    return json({ data: body.key_envelope }, 200, cors);
  } catch (error) { return errorResponse(error, cors); }
}

async function joinLab(request, auth, env, cors) {
  try {
    const body = await readJson(request, 50_000);
    const name = normalizeLabName(body.name);
    const password = String(body.password || '');
    const lab = await env.DB.prepare('SELECT * FROM labs WHERE name_key = ?').bind(name.toLowerCase()).first();
    if (!lab || !(await passwordMatches(password, lab.password_salt, lab.password_hash, lab.password_iterations, env))) throw new HttpError(401, 'LAB name or password is incorrect.');
    if (!lab.key_envelope) throw new HttpError(409, 'LAB encryption key is not ready.');
    await env.DB.prepare("INSERT INTO lab_members (lab_id, user_id, role, created_at) VALUES (?, ?, 'member', ?) ON CONFLICT(lab_id, user_id) DO NOTHING").bind(lab.id, auth.user.id, nowIso()).run();
    return json({ data: [{ lab_id: lab.id, key_envelope: JSON.parse(lab.key_envelope) }] }, 200, cors);
  } catch (error) { return errorResponse(error, cors); }
}

async function ensureLabMember(env, labId, userId) {
  return env.DB.prepare('SELECT role FROM lab_members WHERE lab_id = ? AND user_id = ?').bind(labId, userId).first();
}

async function listLabMembers(labId, auth, env, cors) {
  const membership = await ensureLabMember(env, labId, auth.user.id);
  if (!membership) return json({ error: 'LAB membership required.' }, 403, cors);
  const result = await env.DB.prepare('SELECT u.email, lm.role, lm.created_at FROM lab_members lm JOIN users u ON u.id = lm.user_id WHERE lm.lab_id = ? ORDER BY lm.created_at ASC').bind(labId).all();
  return json({ data: result.results || [] }, 200, cors);
}

async function putPublication(request, labId, auth, env, cors) {
  try {
    if (!(await ensureLabMember(env, labId, auth.user.id))) throw new HttpError(403, 'LAB membership required.');
    const body = await readJson(request, 8_000_000);
    if (!validEncryptedEnvelope(body.encrypted_payload, 'lab-publication')) throw new HttpError(400, 'A valid encrypted LAB publication is required.');
    const serialized = JSON.stringify(body.encrypted_payload);
    const objectKey = `labs/${labId}/publications/${auth.user.id}.json`;
    await env.ATTACHMENTS.put(objectKey, serialized, { httpMetadata: { contentType: 'application/json' }, customMetadata: { encrypted: 'A256GCM' } });
    await env.DB.prepare('INSERT INTO lab_member_publications (lab_id, user_id, object_key, revision, payload_sha256, payload_bytes, updated_at) VALUES (?, ?, ?, 1, ?, ?, ?) ON CONFLICT(lab_id, user_id) DO UPDATE SET object_key=excluded.object_key, revision=lab_member_publications.revision+1, payload_sha256=excluded.payload_sha256, payload_bytes=excluded.payload_bytes, updated_at=excluded.updated_at')
      .bind(labId, auth.user.id, objectKey, await sha256(serialized), new TextEncoder().encode(serialized).length, nowIso()).run();
    return json({ data: { ok: true } }, 200, cors);
  } catch (error) { return errorResponse(error, cors); }
}

async function listPublications(labId, auth, env, cors) {
  if (!(await ensureLabMember(env, labId, auth.user.id))) return json({ error: 'LAB membership required.' }, 403, cors);
  const result = await env.DB.prepare('SELECT user_id, object_key, updated_at FROM lab_member_publications WHERE lab_id = ? ORDER BY updated_at ASC').bind(labId).all();
  const data = [];
  for (const row of result.results || []) {
    const object = await env.ATTACHMENTS.get(row.object_key);
    if (object) data.push({ user_id: row.user_id, encrypted_payload: JSON.parse(await object.text()), updated_at: row.updated_at });
  }
  return json({ data }, 200, cors);
}

function validAttachmentPath(path, userId) {
  return /^user\/[0-9a-f-]{36}\/encrypted\/[a-f0-9]{64}\.bin$/i.test(path) && path.startsWith(`user/${userId}/`);
}

async function putAttachment(request, url, auth, env, cors) {
  try {
    const path = String(url.searchParams.get('path') || '');
    if (!validAttachmentPath(path, auth.user.id)) throw new HttpError(403, 'Invalid attachment path.');
    const payload = await request.arrayBuffer();
    if (payload.byteLength > 25 * 1024 * 1024) throw new HttpError(413, 'Attachment is too large.');
    await env.ATTACHMENTS.put(path, payload, { httpMetadata: { contentType: 'application/octet-stream' }, customMetadata: { owner: auth.user.id, encrypted: 'A256GCM' } });
    return json({ data: { path } }, 200, cors);
  } catch (error) { return errorResponse(error, cors); }
}

async function canReadAttachment(env, path, userId) {
  const match = path.match(/^user\/([0-9a-f-]{36})\/encrypted\//i);
  if (!match) return false;
  const ownerId = match[1];
  if (ownerId === userId) return true;
  const shared = await env.DB.prepare('SELECT 1 AS allowed FROM lab_members mine JOIN lab_members theirs ON theirs.lab_id = mine.lab_id WHERE mine.user_id = ? AND theirs.user_id = ? LIMIT 1').bind(userId, ownerId).first();
  return Boolean(shared);
}

async function getAttachment(url, auth, env, cors) {
  const path = String(url.searchParams.get('path') || '');
  if (!(await canReadAttachment(env, path, auth.user.id))) return json({ error: 'Attachment access denied.' }, 403, cors);
  const object = await env.ATTACHMENTS.get(path);
  if (!object) return json({ error: 'Attachment not found.' }, 404, cors);
  return new Response(object.body, { headers: { ...cors, 'content-type': 'application/octet-stream', 'cache-control': 'private, no-store', etag: object.httpEtag } });
}

function errorResponse(error, cors) {
  const status = error instanceof HttpError ? error.status : 500;
  if (status >= 500) console.error(error);
  return json({ error: error && error.message ? error.message : 'Request failed.' }, status, cors);
}
