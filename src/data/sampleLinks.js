/**
 * 样例下载链接的加密存储与密码解锁。
 *
 * 安全设计：
 * - 明文链接与密码均不出现在源码中 —— 只存 AES-GCM 密文 + PBKDF2 盐
 * - PBKDF2-SHA256 200,000 次迭代派生密钥，暴力破解成本高
 * - 解锁成功后密钥只保存在 sessionStorage（关标签页即失效），不存密码本身
 * - 失败计数 + 指数退避；连续 10 次失败锁定 10 分钟
 */

const SALT_B64 = 'CG0pApE5dHXa6Nd6o7fnfw==';
const IV_B64 = 'fm0D7AXNH0pTKu/l';
const PAYLOAD_B64 =
  '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';

const SESSION_KEY = 'eo.sample.key';
const FAIL_KEY = 'eo.sample.fail';
const MAX_FAILS = 10;
const LOCK_MS = 10 * 60 * 1000;

const b64ToBuf = (b64) => Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
const bufToB64 = (buf) => btoa(String.fromCharCode(...new Uint8Array(buf)));

let cachedLinks = null;

async function deriveKey(password, salt) {
  const km = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveKey']);
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: 200000, hash: 'SHA-256' },
    km,
    { name: 'AES-GCM', length: 256 },
    true,
    ['decrypt']
  );
}

async function decryptWithKey(key) {
  const pt = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: b64ToBuf(IV_B64) },
    key,
    b64ToBuf(PAYLOAD_B64)
  );
  return JSON.parse(new TextDecoder().decode(pt));
}

function failState() {
  try {
    return JSON.parse(sessionStorage.getItem(FAIL_KEY)) || { count: 0, lockedUntil: 0 };
  } catch {
    return { count: 0, lockedUntil: 0 };
  }
}

function recordFail() {
  const s = failState();
  const count = s.count + 1;
  const lockedUntil = count >= MAX_FAILS ? Date.now() + LOCK_MS : 0;
  sessionStorage.setItem(FAIL_KEY, JSON.stringify({ count, lockedUntil }));
  return { count, lockedUntil };
}

export function unlockLockRemaining() {
  const s = failState();
  return Math.max(0, s.lockedUntil - Date.now());
}

/** 是否已在本次会话解锁 */
export async function isUnlocked() {
  if (cachedLinks) return true;
  const raw = sessionStorage.getItem(SESSION_KEY);
  if (!raw) return false;
  try {
    const key = await crypto.subtle.importKey(
      'raw', b64ToBuf(raw), { name: 'AES-GCM', length: 256 }, false, ['decrypt']
    );
    cachedLinks = await decryptWithKey(key);
    return true;
  } catch {
    sessionStorage.removeItem(SESSION_KEY);
    return false;
  }
}

/**
 * 用密码解锁。成功返回 true；密码错误抛 Error('wrong')；被锁定抛 Error('locked')。
 */
export async function unlock(password) {
  const remaining = unlockLockRemaining();
  if (remaining > 0) throw new Error('locked');

  const key = await deriveKey(password, b64ToBuf(SALT_B64));
  try {
    cachedLinks = await decryptWithKey(key);
  } catch {
    recordFail();
    // 指数退避：第 n 次失败等待 2^min(n,5) * 250ms
    const { count } = failState();
    await new Promise((r) => setTimeout(r, Math.min(count, 5) ** 2 * 250));
    throw new Error('wrong');
  }

  const exported = await crypto.subtle.exportKey('raw', key);
  sessionStorage.setItem(SESSION_KEY, bufToB64(exported));
  sessionStorage.removeItem(FAIL_KEY);
  return true;
}

/** 取某个数据集的样例链接；未解锁或不存在返回 null */
export function getSampleLink(datasetId) {
  return cachedLinks?.[datasetId] ?? null;
}
