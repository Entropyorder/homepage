/**
 * 样例下载链接的加密存储与密码解锁。
 *
 * 安全设计：
 * - 明文链接与密码均不出现在源码中 —— 只存 AES-GCM 密文 + PBKDF2 盐
 * - PBKDF2-SHA256 200,000 次迭代派生密钥，暴力破解成本高
 * - 解锁成功后密钥只保存在 sessionStorage（关标签页即失效），不存密码本身
 * - 失败计数 + 指数退避；连续 10 次失败锁定 10 分钟
 */

const SALT_B64 = 'kwEUNlZ/Mf+X9XxwQNiAig==';
const IV_B64 = 'nkTcvUM9J0yJnZWE';
const PAYLOAD_B64 =
  'ylhgRF4oY8xBoOnxtqcDl9MX3+G2kz5Ykhuktw52CFbDruf2Do87CbsBodN4alQ2mOZAdu7Aa5WEp89/hYx2xbdVrZSD2zI8iq3tt3OT8g/AzccGoB27rjENmXObdUS9dUOXTbrcrQBeXvs5+UKb/2W8wk/86F6hFZYW4M5XUWjYsP5eijpXJojOq61bDiW07vQJcilS1C1DuyqsRKT4KcYIl1734aqdsZnTtrv5Hn4qv133zV4mYl8COSwELQl20GRYdRht5emuT33C12kHJ//EFJ7nIWNOnGyg9a9wFJJMPDEUtHlhe+GeT+q+V4jYcAYPX8Thwo9oU4WfVZNFCFBaNyegKM06PNQ8MpK2BaTE4EuyDBwGMWUI6EVLL/KN+eQpXCLjMbxOWiV7K4foTxAcszdWpOsLXGT3oGhCZt1DsaUPNKx2D1YISMnAvgbtVbHvgxFW/GSc+GurqGbEmPh7hp8P97AIi6nqqawt8danwr2/mJ6pC3rJI9fYEE02qSPLTJp8DYbG0PvSqx3Wdub2kide26Gfo1nTt6pK/+EfSg9GRQQq0zvVvaog1RsluzdOn+T49t4bh2ElmfO6R+GoIT1GDdCFoJQKl4u2W2yt7v+HfvUOpoYzOiQMZBRiB+RUy9wqBIrzyYaUH0JqXRNcL3IPFmT1BZLO9qlECFptbknYBKibGZQvx3+LXwwTFN4EyON3MuP7YsvFpYlK6Wx6GCAOUHvnOf67NrbRvH59lPa0YOlIsxOyxEMzFAd6MofwPhzCmxFS2/pP6MZzP+hGjVrf47UrZqOe1nf+WhaF8EyBNy3Mrl2Cm7rArnRFs627UdFoGR6eCdsojqkBQgb2xw81NSLa1A9SHxr2rQgCi18rqOfUrvGd+ncRg1NN2bUab5xKkgVtuMDLuMoIRHP55sC0rqbMfdUOQ5a6Wj8kKMBcwB8EqYWU5c+NzzroVC51nzCS18wQ4qH2i3jz3X/vre2Dr1Khq8apoMFnDgImqAHPr72aARUUSLNm1s2Aara0BZzyAlSN4JCLsyISidH7pG7HXyKUL+jc5Tz9fxDncirdN7Ox3z2XOCYgN/ZfUFq/Vxmk2a38PKn3I+JcAnK5o3WxXZPYHs00IYCNZawv+YJiKPshauSd7IXYYAu/nT4Xm9Guej78Q5H0Jd32sF6dP4HC+niDsgCr3fW7JH+onDpiVA5NTForqMjE6HdBgplvc+3jXaGbDU/eAcHjpf2ONa8zarz0KrdKS7+4ixocMkOuPM4GVQFYUuzMNWE4Kc2G/8R+KXJyBzwOu2THFE5BuJzVy5CsB5mBhT+Du63l+v9mCo3JpUfAnROtuecIQ26fBspDtN5ASt3RYUVlLawpi6ANNbPpuOyte0N9U7UfTRBva4hD8CtWNh96GhiYnPvcetqjSmJ1UIY7/p2fvD4/dFjxi5j/Y0IgLo5gyVA0CBbBes50JMKRTJqeLRUKUfwM9rp19C63+la66tgryVp3MFaIfdoHpwfDcvuUeDaUOyPl0cu+3gONMbswP+pzzUcevK4cWMMPdiOb1NE9VTFP4HrJB6TVlHww24lVWE2lRSQCad/OcQ2O9B7YofxnFHgYXKpOHElUG0COhWoPRH+3vfmUre5G13HOqJ1D/uSZUnZ39ZcpZsD3LGdAJAztAANHiTZCf31XxKGe+c+1NZiX4naoEVN8fMOzQlfxbHcD8dofvQdMOcCNdJER/QydNIcUvsCksZ/bG65dkXpMqS263cE1+AKbawsNFNgVkxbuURnELZ0WyUCXOo7dzjW+M9LjLE+YBSykE9CyhRG2i/3ATMBb9PcKT1UBPpuJm8/TQ4mYOGr6bLY0/iOGiZJHBsb4I5ii/RgrvCkIukKwX1BsQ1Y4yvdQH8MEr2chglqInoXLM9HL5I+tGzW7ho7kVCtJFhrFEsUsnvcecxB0J2aT0GOEJxq6wdIrm5gq38lbX3U6O9PjEVyakisfdEmUihFx5UIMkEpmL+xcjnN03WqlI2B5rUOYx4lLTBKpByFpHygqYblQKDmg/4LB34md2YhipZF6KBuBu6/f+3GSrF8lYsWDfzYnUQVv/qkR26gkvXuxrdFnoPV8oIq5Bs77roMGUXTnxFObWLGsYm8lHMClTGoWv6WClkCyj3KK7Fo4HyqAjodMOM9ZZGO7NCFQqhFRnPA5u4PQvM7VQXkiaIubnZakZU+AyzsODdsmbhN+gQKW2qzzZ0PL7p0S5AKVoZJMVB2F0vzyA3qBXRTl1gZFUQgPmjxP1W8g931AUf++1Lk8fxNZj44ElB8UKOK7U7RcxaQvQfoW1rK3t2Mel8xY5Gtkc+MFg8yvHm80v876H8yzKf4uDiwGWeQbFA7gOvYfzqRGhYjNMBMx/yKiN6ZmohHrwOseQdpPk76+Gp7suTKmoGDSILzzme5C3S/MiRCn7UNqGD+rC67LDRkxh3MuOGsLX3ZnCAQWUZH8qYC+u6bTIXKEe6yaS+mVnDf15a5vblyJof2k22fW5WBu+Xv4OT43HxCtJcYM2eTQKlks46oXNWDq9U5C0PAjN4baZDUQto9uEte1gOT/n6eO95KyVGPl4Uzryc5hlYmrXP8sKpqikbXMTle871xG4+4DYr9UfyuSZNeKgqzRrJJyDk3N16+3T+CNvp9idgYun+EKi/SfWySREk2+KZIQ7Fa9bIPEGB5rJkDa32tv/gtdqw7azfYKEXxICsWFps7zIt4d3oPCsVLsU7N7unpuSvoNg2M6eVWlrVP3Ne9jNJBDLiz+5hzP8keyJMkQPJm9/laYgwtTzDx/dIiMhlXSVv6TCxF2SiI1XTvJ52Zys8zz/UbT8qhWAfMCjQBrHXM++1S+Eg9Vx+96FYzroES/bvNaiSm8mtvxAr3YVxGY08ePJClbpUjzQ/NMNgYzHZW8acm2UnMKpmvgYUkk9pufDgPhwy5kJcvQe7lGfjqxrMwGi6YnRJ6Cr+6owMdfDeTX7tIYqBKUwuIvb/qZ2pRSd3QS++aFWDN+zT6E2jeUMcbf63JAQu3qfbM2x1DbSJHwtH5KsJZcsIac+U5g20EqPPRt2KwDSncABLm0g8uUba9cB7Aqn3C9WkvY4x/yr0XPzlIfMnKJ4QW1rr8r7PW0SV240Go2g7qGCZYnTsz2tIIXCb1gwpfrSlK6NRONqxALLWzm68C4RqF53l52+Q3ulZAwANaDIio9wGosazCvbLTOtpstZ/7jrCxH2DpHKGVQUZ17Wq7dSbSsG9bvwOD1ShXxzROi1TDigjxiCrEdLv0ogblb+a3YFvkyUVEVGs3eXXkCRemIkS68pdQL74o9XXHC8WOm5QDS/JTnXCDObglYxbPM2XWfCZZiET4vAA5N2bUzJTs1mPLYTfEOxkQAQBeCwNky02InuvDwt2bMOg637wvVLSb6jNZFPJoGkl+aQHt0LD6asYYbumDlfu0wCCAX+4GO/0VUsMCyaHaXetgSA3U5vKCLcR4BWvcdW2Qun9LQh3bRLW12rZbNH7Xzul+KURqNgtS/EHaY+976t60y+UCfXUPakam81kDaNoxSa2GOmKSjnJ3KQIZEh0eNbUG//XrjzhhYFj137gXR1i4X/YalLRW9FTk8iWKRo3ghi2gw8lIilxaK3jNnsWNf+xvTNwQVD+v2oT/rOpM2XejmgBubSwYpqKzyzxW0f7H7jleqMtNTO35A1t+xghC62TXX8CfMBYhwwkU76KSw09MIdUctVmT4ZZ/QvyFXSXyOTSFju3ByF80pfY0Rvt0ecf5coRu2kqEFaMj9skO43alr6b0VXeBq65w3Y0kjgOH9VqJ+y7Ljh4uNyznM06XOgTbitXyyuJEgvFD16iZD4wY8ldB6CPyJt0dSHvKka7h/OesLV7Bi22y92XXFe3ZKVQ8DB17f4sH5ltUw5/JjzAGY9uV/a+WPJjqVQ1uyWJOPRtsVJKvDADyPINkl5DEAIJwua2lFILIlyC+vI/EeOvy/cXrnWYar6sO5uV0BL+xF5g54DfVYpjlyuqfNuBJa88VhR0e9Q5fMPMVyK3E0UcpDBpEFqhb/xLYOYQcDTAExM+5b1En1qdt1PTmD8ZZke68WKZvaIvhHAi7aQckhrtjfIbkIp0SBQVS2LQqSrlwpiaCGgPCgkdIOaehUOgiSuVZj17SImOLCRJCoCdfPlCVYmS8rHOFbN09jqV1mLjb12f84jQ2DEhcI707dJYfL8wEnTfG9uA==';

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
