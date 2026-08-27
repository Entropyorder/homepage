/**
 * 样例下载链接的加密存储与密码解锁。
 *
 * 安全设计：
 * - 明文链接与密码均不出现在源码中 —— 只存 AES-GCM 密文 + PBKDF2 盐
 * - PBKDF2-SHA256 200,000 次迭代派生密钥，暴力破解成本高
 * - 解锁成功后密钥只保存在 sessionStorage（关标签页即失效），不存密码本身
 * - 失败计数 + 指数退避；连续 10 次失败锁定 10 分钟
 */

const SALT_B64 = 'adfFFGfSKKYyVdZtqoaPHA==';
const IV_B64 = 'hUokLPc9wEILrkDe';
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
