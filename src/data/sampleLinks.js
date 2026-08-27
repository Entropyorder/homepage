/**
 * 样例下载链接的加密存储与密码解锁。
 *
 * 安全设计：
 * - 明文链接与密码均不出现在源码中 —— 只存 AES-GCM 密文 + PBKDF2 盐
 * - PBKDF2-SHA256 200,000 次迭代派生密钥，暴力破解成本高
 * - 解锁成功后密钥只保存在 sessionStorage（关标签页即失效），不存密码本身
 * - 失败计数 + 指数退避；连续 10 次失败锁定 10 分钟
 */

const SALT_B64 = 'j76LE3qArRYP6xv59/v7+g==';
const IV_B64 = '/qLoQmu3pzLbvqhF';
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
