/**
 * 样例下载链接的加密存储与密码解锁。
 *
 * 安全设计：
 * - 明文链接与密码均不出现在源码中 —— 只存 AES-GCM 密文 + PBKDF2 盐
 * - PBKDF2-SHA256 200,000 次迭代派生密钥，暴力破解成本高
 * - 解锁成功后密钥只保存在 sessionStorage（关标签页即失效），不存密码本身
 * - 失败计数 + 指数退避；连续 10 次失败锁定 10 分钟
 */

const SALT_B64 = 'gePK9RS90E1qQoz766TUYA==';
const IV_B64 = 'QZkFbOz3tSj7rXCz';
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
