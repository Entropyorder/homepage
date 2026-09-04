/**
 * 样例下载链接的加密存储与密码解锁。
 *
 * 安全设计：
 * - 明文链接与密码均不出现在源码中 —— 只存 AES-GCM 密文 + PBKDF2 盐
 * - PBKDF2-SHA256 200,000 次迭代派生密钥，暴力破解成本高
 * - 解锁成功后密钥只保存在 sessionStorage（关标签页即失效），不存密码本身
 * - 失败计数 + 指数退避；连续 10 次失败锁定 10 分钟
 */

const SALT_B64 = 'QX/RhCvmcg4p5YOx1pklNA==';
const IV_B64 = 'BXSCDPe9VAdCtdfy';
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
