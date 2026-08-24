/**
 * 样例下载链接的加密存储与密码解锁。
 *
 * 安全设计：
 * - 明文链接与密码均不出现在源码中 —— 只存 AES-GCM 密文 + PBKDF2 盐
 * - PBKDF2-SHA256 200,000 次迭代派生密钥，暴力破解成本高
 * - 解锁成功后密钥只保存在 sessionStorage（关标签页即失效），不存密码本身
 * - 失败计数 + 指数退避；连续 10 次失败锁定 10 分钟
 */

const SALT_B64 = 'knS+sQe8Sm8wDH2FGVk9WQ==';
const IV_B64 = 'GE/9fxZ9cP/l622R';
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
