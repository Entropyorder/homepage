/**
 * 样例下载链接的加密存储与密码解锁。
 *
 * 安全设计：
 * - 明文链接与密码均不出现在源码中 —— 只存 AES-GCM 密文 + PBKDF2 盐
 * - PBKDF2-SHA256 200,000 次迭代派生密钥，暴力破解成本高
 * - 解锁成功后密钥只保存在 sessionStorage（关标签页即失效），不存密码本身
 * - 失败计数 + 指数退避；连续 10 次失败锁定 10 分钟
 */

const SALT_B64 = 'mYty6/YO4xYZoauUSMyLbg==';
const IV_B64 = 'O1yMl+Ga/1v5y5Et';
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
