/**
 * 样例下载链接的加密存储与密码解锁。
 *
 * 安全设计：
 * - 明文链接与密码均不出现在源码中 —— 只存 AES-GCM 密文 + PBKDF2 盐
 * - PBKDF2-SHA256 200,000 次迭代派生密钥，暴力破解成本高
 * - 解锁成功后密钥只保存在 sessionStorage（关标签页即失效），不存密码本身
 * - 失败计数 + 指数退避；连续 10 次失败锁定 10 分钟
 */

const SALT_B64 = 'Of6/ehk41GeLc7BJ3V0kIA==';
const IV_B64 = 'dCjvPF+/yjFC9xb0';
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
