/**
 * 样例下载链接的加密存储与密码解锁。
 *
 * 安全设计：
 * - 明文链接与密码均不出现在源码中 —— 只存 AES-GCM 密文 + PBKDF2 盐
 * - PBKDF2-SHA256 200,000 次迭代派生密钥，暴力破解成本高
 * - 解锁成功后密钥只保存在 sessionStorage（关标签页即失效），不存密码本身
 * - 失败计数 + 指数退避；连续 10 次失败锁定 10 分钟
 */

const SALT_B64 = '02q/c6qmQehpemCX3eHJTw==';
const IV_B64 = 'exMEnTdnHHdQUG40';
const PAYLOAD_B64 =
  'vtaU79dhP2PdGgIiB1KvQodiYFgSNrJ5JcHp1/uGI9pckzE8QtcBu/mnEpCw0Z3Rzs58krT7+nRwUWWDTA3pj5AphqFOGsRricVYASHt09ftjxseqrbF9i8gn+utRhy9EvIMuU8hCsvQAZyX4mo+AtfMYiPu4tHgcQHEVpLv1TtsnwlsUKFOVX8bAQMTGZifFmTaZ0g8zYiqndwRtTyNwopZQUuF4yekOEMpF5A3DLzefZJZBIyJrqP9hlDuJ4CIqQQZvkulTpdnxlZsmnURIZtxyYn1TvAtjDwbl72locJr1rMFYEg1mETiejhfvKmEa/SXs0AZM/jWiMvV4HvVVhciaWUAR6VoWU4u7TnX6yw+CF7uWbxzsgBoQXfLT2JHzo2i5lrs80NXFzoNc5x8Oi1YODmRQAEad703MbJgNr9ltRWH9AZnrukFPLszEMEs/XWYGTCDFyvNQbBgQEtiQma6tCX91I9iibJo4dQVL/yO3yGbAp5UrGEPkAxY5q/HNLNrYRZ017iD6StBxWm+a309BuaHsdKMSIRYZdOLwOqGrkYjcE5iBlUld7/P/tPXmSskJlIkE1RkJSnFZD4ZoCSeAy1Wp49bsKWxBcBgEFR2lpMtLnocwjPp3nMzImxD4YM6dlX4k5QrV6yiCHH3liTmLwA2XVpF1rv6xCPZTp1vxhzutinctosbWtpxfJfkIDdq3i5rdXW0IhHZQFBp2WKOWNLyEKIB1SAe26ubJULgfPW1R/tNQR20/uW/mxhmpaNV39P7wumlvLvGUiuPVsAY+aw+eN5XyIX4ixU+G5EAOKbpzoIfb5TZOEx3r/CSca0pk+OrOR6Ew+pTLpv7G28ftsjACCFPOlMDeoTpFq9A0G4HtAcj30rwOcQA1v0F2AO+8JpIrDx+ZYD7/HGm+qFrVw+/Ac9Fp7u3MG+Xmyz9zVPj4QsBNAIbLE9DzyuRryp+YRXvbynNGUAmntWH4EfwBTwxJRkjI37p9CkhOAV8fNRUeGP7eRkQ6/kVF779zzaJ9kcXm/ik8KCm2HjCRVKCKJxMLMZxW5FJohzoByRuIm0ngbUnb5psTzlTiwYRGf6FUy7We1TfP54DzP3SEXOD5ao7i3qcWIqIwVohu5Ew3Mb9bOEhKcMle1pU+/4ep5aZcGgWsTewfslL/7GZuAmuXqbA2oxl80nhml8+1ruY0rzmgZZAY7byVGr+pHemZ/p0CNQ4/zHFmbVubxgM1g+OZ/kx8ET+GY2POc8vqgLvoechXddTm6NOjSG95WE2X8V/XlTHmlUmSjUiftfJotMHKZA2rPcpMcgcM0ePmo+MBUrbGmOaEVcQ6gGK8gjQ50V/QLHYVWTpMMkQGtfZXRGVphJuIzJ74DQog1EdgfsxQyGpFg0JA07RX5aHD6JSKnot57bAzhWif9eCzoni1Mq7y7T91p8TZaf2dCm4KhMnNk72OfXDFfpXrKJZY7P9eZOQxpJgvsTD1UOSvwT3Iv3bVgVbFYedoydqUUAl8AUhM2C45AF/O4tjjYTkcJYpPgzVk7BRR8eFcfMW8DiAcRPnoAdMJJ3xykvcBmThqdeTMNzBirTofywxAuknTy2k3hQ3eCZO3xi/hQ6fOGB6CuGyyDaPOZlRmD0uQTojKCuVihzhUhF+njLZ7EdbQQBFXpdWtWg8NcAPlhLWwYmEdth+JAZTE/uzNF8wTL0hxtpNBVZedZF1b2SmagXWSUIc3JzwNPm5B4qiu5yMz76NY9O7WSoIqIGA6ov7Iqx1Wali5QMv8k5YSaZaWbcdAKVi1D3OdWg75QNBqEpWJvgZfSwkoNWzzsaAVVofQn3W/yuZwbGQPZYnjmrLjpVaOFZ+CwTPolFZ+vcj7ccTZkxDNa+SOB73uIAwADDjlv7gkjIauO74eHtSo91lLy1I0P2sAHOmIqwwUhSVMGIUmf+iCePqa6GJZxkn2HF6Fi2s9IYicziGbwJqeRD86g6zNlmpu21n367iAK883iXuAbg43CPeQ9vmLqhXiuXmq21uKY/d92bv684eh1g9LQp1k6jyXpqnwkq4ESRX0AgRKE9QPkomqLIUZq830qPvtVnveZwu1qasMXsuA2dwJo11e+eilC29N/7cA1T6bnDpJ+uvNRkha5uYiMZqtf1G2+QBLw79p/MiViG9mwE7l5t0YCRDzUkFggjdMVVaGbg3Y13+cMZhwHD9rdNmFXsZ0ZGV/TtyrfdqTfL7SUMygF+hOWux67gCLXSuiX1SD7Yq29VgYteYMXKfI/1kix0NLlHc2i6fhOuyYDEdRTSchiD99ZjnHbfXOXLkW+eTkeuvyJ3XkXM4yj79DKK6m0iz9PvRy+6WcaWtB9fJVxA+pxDsIUrz9VA0ACHEMsHQvqyzqRQ0cS1sQ4VhmJ1oFavrTG5GVIIoZkfOptsLgFBgCrr/xGYiuKv7lDe6i48zoc/5Q1QWDBDdwjJM57rAQHapLf1TJzKxhAdXAQcQKxYnqYJjQaqcLIPzms30r+eH2U+21tDZjfVD47yLfVogwytwZT7Y8gxWNoMDQSvNaj/VKO+O3zB7IAsHE1eGlL7CfGY5rC2ctbCnRIT08kLdP/U0Vt3eC4DIz4C+dmK2T5dPRwCOFMwVMu5G08zgEW5ua3fYksZ06cWMAk811XP8AD+y++Nijeg84yMbTIci6aDU9hKypqXfiwZ0PE27iPcwT1bh4ucG3GF3Syq2PNHGvfr+4EvTJg7D56F4fQMgb5owkq6FCP9JQHPjxUZ12P/L/8MmadMYIkzJ45jcIiCzOibMnwc3YmVy0vxXkBPKJbNTvDlGyjJzKdrlsTGZfE1swgQzeF/e41allZrcKpwAqUKUvge6dkZa/1/l1O14ETQG32hao7g9ujSCImJ7HBjHY3xs+daFgd2iPfVRZ8il3VHQb0IhsLg9QHkv7ERR9digSt2UUIQY/PPkWjyos3xNhJ5k/8bPsg5AkXVQctYneWys0WSoHZeoVUyuMd14vlZo05NhVwn75Gju1kFCXIycpFeukfjoJb3Lt7EGKrC4S3cfGjQPiMw4Tk1QrHtG35CzGtk0gcNF57Ii2skm+czGNK0yo8w4HvuU57rYrSD99GZ6q3CWhfZ8gaPxdWsSfSWz+GwgyYGm1VFm6MwaYWDFQQLNJ5KJl4dYRTONnGYE7oGgoGCe5aSrMnTLPBgpgYALh76K2bAgnFgd4gT7erWA6EfB+AyVT/KUr78mcnWuGdk8u9O2ZTx5vZVJcYwMlAKbdznEX8mwrWDIw81vR92QZngOllxcVuZu2P0om+J8UJ2/neL5hKEeyH09zhK4JRnvYjVmZY3smKANLaIqOSahfS6OsXi5zXYOjC5GNkD2eSgFnSO9WKUAkGv4Qcfp9Ls36RE4yyYN4Bw11FUL3RQSfmougN8HbaW7pFITYHt9awawUoBss26vwZfLNxUB7e8iV+HkNUS4HZ0GfOj74YfECnU8OULeUWfO0tmu5ruSic3ZfJ2gqiMzRhfyCi1hhMRK/Afu012usj0+B8GT/oa2Eb1CknwFK31mfomEIeXhaV13A11nTtZI8xn/gu86HJcEizMi9xRrklfGjqU7T0ZFo9CR0FcC5VFqC6P4kY0R+2bvPlQiDFuh/qMfm5XPzEjDI/nbDR0sKwGf4Z+f1bOY4Jmn3HI/6i/Pdw4dWPih6Vg+srVbKCuEG6GZeR9T4Kbt40ZcTYETPcM3mGdBfqKB9uLqW04FZLASKeWcp/DndpaWwOSM48di6/WGLOBBUoeK8qlIr+lL3kSdBT3xecHgjtnHy79hJMzJVHkiihqL9BXrpgi0DdOgTvLWVgomTw4boQKeNV2m35sR+FGfvIqq1ONHGm2lIaDilO66A/+6B0iwrHE556mY8CYK5ustPdDAHzMzbCtFBsjdp2QBSlbldzR5V6i5WUmlLKHLW/yAqxy/MFROpxZfr/mGNkCsnPJasFTWrq+jYegBtQxP31c1rG6B3hU4xIAMe0qtr7p1aTo04zKCwywDTXXqplWvmudiUuR6fEYI2OYeRQWb9juHzTKdjQtSwCx7OLkW5l5bcn32qm6HZHGEnsalfoICV15VPO/A3FuMDRfxBZFDwk4BakY70MotlyAS6KyXrAa9qTfLcjYedAHyfDaLJdc5hhb1cIy7hyE8wy/HXopu6mWdJRXL2WmJYFdfzoi2INrmn/A34g5D0CLaYm2LRWXoID/akO4IDW0wZj0OFw==';

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
