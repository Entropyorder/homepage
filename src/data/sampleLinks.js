/**
 * 样例下载链接的加密存储与密码解锁。
 *
 * 安全设计：
 * - 明文链接与密码均不出现在源码中 —— 只存 AES-GCM 密文 + PBKDF2 盐
 * - PBKDF2-SHA256 200,000 次迭代派生密钥，暴力破解成本高
 * - 解锁成功后密钥只保存在 sessionStorage（关标签页即失效），不存密码本身
 * - 失败计数 + 指数退避；连续 10 次失败锁定 10 分钟
 */

const SALT_B64 = 'uSAXYZhw6i6tCpe2lmO6og==';
const IV_B64 = 'wLnN5oZyjLdSJUQ3';
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
