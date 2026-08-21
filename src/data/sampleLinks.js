/**
 * 样例下载链接的加密存储与密码解锁。
 *
 * 安全设计：
 * - 明文链接与密码均不出现在源码中 —— 只存 AES-GCM 密文 + PBKDF2 盐
 * - PBKDF2-SHA256 200,000 次迭代派生密钥，暴力破解成本高
 * - 解锁成功后密钥只保存在 sessionStorage（关标签页即失效），不存密码本身
 * - 失败计数 + 指数退避；连续 10 次失败锁定 10 分钟
 */

const SALT_B64 = 'aFdud79bACeLn4oELoG3BA==';
const IV_B64 = 'iPCk6O+ncnHXPBXU';
const PAYLOAD_B64 =
  'ZToAswiBZcaC6R0TFmgOKkAnQpLXE4nDIRvNOLvc2QAvgK1a8XjloolX/Bh2fagmg+QWxNYuHzu5iBrONsp8X2xe0g6mGkM+Cgw7FmCQER22Zw/iezKHxH3ARsBG6/bKKDvUmsJ4ibrVcxL+P2K3sDfirMVqoR3kcv8KsH/dpG3L4QlzYfSA7GhulZOm8cO+UnD73owVd1T5/Rmrqjs2ZudbxbC8jMaEtbahnMUGnP/178/s1ysKl75gYtUcXnNY/MHWWsicb2sceCOZfBB/V6+aVxNj0pSMWzXqc0cqyyxBxTExQPxZLoY+YCzLc0jxqmC6pNiMK8SuGOON7CQjeWGgubqFx3HyImpH0nlEHTsjtubwmgfIbJh41BYFnodUDkpHtSrGGUF4NJdUX3R+3A19Rt5x/yXcOnObB6YsQCEHYbYH8uvXRTHyJfrr+xLjfGa9BXN8dGEiUiIM3NbV2dl1MX63hoOzQQy/B5UVb+/HSk7rbYIH6kicsbrzvkPZaU0z/beTdD+Y+Oq8v5ncR9vGlmeQq/VEwHaK8EWAKbFVheuL9ICDre+a8iZzeVj5WWGiwHqDhjeaogXExjuZKMpOjoe/4ZQMAfHHqRfaGAr0bOHKpw9Y2DWkQXcu4XuHVqfpQPWFl342G4oi+3HO4YMsf3toEN6XdnbXVGNU/Z+VpiFT0xqadr2bIDDGBhfiFIkDPxf2zKYdjVHVRixnn6/hpaq3+3B3Wxnjt6GLEzOrL4a/1i4fgPIe95YPhYMttyEF7KpicxEz0xFlSqxnpskId1aohXLvhbXY+BfgPViSFgtGuZWes9qV7tPUARYU71PlMihJpc2tMXFwKFfMNZAjYOIVTiFz8+DIKsYvtocswly2YFGRJ3VFC4vdk6rB/NPAaBZjxFo2pDMyWH2q9SBUfm2V514Vtb65CvMxKQ5CJu73CQn+qTSQe0Gx3jsz/c/cJTY0VrHY8tTeAYkhp7RxEWj7+/tT8Ag8cN3A4DruWFzwnXM1GuraND9IV28CKvbA9pLlnjNfIkThXizk0ymixg3O1/mx9uJ20LhF7FauUWT/RcE65KTln1sRoFDMj0u2mFZHmUvffzflnqlYYQf49tnWXAdHBiS0gV3BJFhWCEekg3oza2sVeECAnB7QBWQeLVAVpr3V/Jw94+sdkPfOH1WeLkqOIDszeqSvuOSQNbqnhrIN6bXHLr+6KmS4K2n9+XaGgjJMSn/3cpp9ERltTHsrFxaCIctyHZjhlpYQFw1/gKbV8sqIFp8dZdQRTSEQLvt5Rg88JV+4FSjDiBmme0FhEogdKnLUSEiMNp7S3IIasczI7ai2R1CCBsP/PrN2keJkGJmt7sXhrq1fdo2cmVK7ezmm+ReIM4VgbfJI7Sic2AkWWo/k+xrNvRlTWlbGlSJZIvQljFT9+LPE0xl2HVYdkjXHwNyEor9ogtrDwI46/MEkGJk838H5liXa3jYyKbN8HFHkslfO5h60pkW5pq+EM6gS6mSW/M4Thak8W18ixHkrUFUqnsyUM12ipJ+rSw0tDLYjjLOXmTxBUZkWmRjgnLslubYFNHAbmW2YSLXHuBlCvmUtosC+hibmyBYcZo7VtH/Q9Ier2WEtz2kOOxPIultT9KuPeGSgAfLZhBBzQosIzOvFfKDEBh7Mth9KAoiLgJAqp0upsE2eJ6aBN8syUN7EoQ1pJWwLirPPGwR7M6TTzua6DyDsNPe0cJRLwwkN8kqSq8dOGXne5L2iSXlKhPZlk0gBPYioKIGHVC1q71EUjpbzNiLBBA9SZOoVxiQdzDv5A3zc6azkBZ5ylmOWv4JTdAc1gYEwjFLrBsafY8G7+9N9E6DBcTnbK/hDGuOmMGZz12slsh6pmEjdpcHabEgazM/6rLesWP1P2hNraH5acL+jtoVdNWyDquKsR+0t5FhR6I60margm8AVE3iWpgJfpczv//XOOUQTvQq04RvXacO5yZ6nlt2EO2Fq5tnVsMYByOr5FpZuQQASBUzVu/lIsMyBkmk9C7OeCv6kAFxc8NaMFYn3SNv1tbl9ITVuA71hvabKu8p1s26BH3lp/UfVlAq3+lG3MS/pE2ncIam5oKygXHB1FSFq75gJoDZ2j2Jj1cHehlot/GFC70kbbJfvt1yU94XQNIciiKDaMZCz65uhrGVLvHYB8sUGK90c3zCNKKBzV068hFlp86PltLSfMwXEJxPp135RlKZhJQTeHYcIOvKRBxKnxsbQdEFEXQX8s1U2iVdayD967REe+7GSyYUrwWE361ShVIUluyUW7h3gt2jcVSmT6nTvYscOSFS1NjTqNrVbC+55DKrbuWpTslrDxZtFDXJW9tGpLcz2mROviWADntNq4iUx8Wbi/hmccfx5T+DY7zMq9eljYzK9XBGJBXOrogNn68RA+F1Yod8m9UdZGZySmGtYC/hdpWZmqt1fYncjkCSYCtMfcQD4EDuCnFcBvk9TnLFUKvzFH2YRIseRzs18n2G9LMyVThj7oCA9UV6lb7I2qv533Cb9VrKKdEMSq/VhvXG2/7701hBYGb2gFYUnxG7WwG9GWDS7VrrxzabZD3beTzbs5a9GQ2bNg2yTd7pW8ItgPlCKi20ed37C25/kyLzurX6ok8KcpHu7reNTd4Oltzre9uXSWSKAmR0b5Ih1LxLnkBbgivljd9O23c1YDmkIggcByXAZ7ulK4rVlZ2U6dmTRpsU5LMywipKYsvxQb5wz/U9TeEQzrOKfF0AFC+PxjRc7demJv4JZdUqYnk5sVLGA4l03hwMRBZeqwNSOeF8YuX2iqIE9BXv2syCP4t0M4io7A0/cRSeFUXfzcVLbl6rwtpph/ADXkQlCs4DC3pLjA5y81F5Qbh2tkMh1cNdIgPFOaHfDQtxKFotbLqnpkH2H+80mWSBWBmYGLw/AH9oxhMEX3Umkk3AT/pgDIkWGfAlSuXMbooXW/QaVACsQVHy7fVM9/QFCY/ie6B4Bs3rik3NjQTphv3Xfe9DWLwWCB8rsfGAgcS+swfhgJih6bw63a3Bb8AGSosue1ewqWgIXT/ZRWsZG6iQM0w6AeVfgilCyCkVxNpLZKn35xATAcPREzRLay0G0SCk7ckQO8I/IzxXjlaT42hAzJJp4mTN21mOwpeO5Kcmc2C90pBgMflioIvVh1HsW8120MXIrFRZTnve0CiAFzi/mW3YdsvFVxLtL2SEN6HxuSpOx6IkafZyx0kSIL2mg+WGqzxv5AyOF2YtWwMTz45SmY1FhvBfjfKbMoIs4GHh9/gY1/mmccvSmwKTJn2yK8xNsVzsr5Kw4lHNFOnrMF/E7vFoBcmdFD7yKMT8DKMjydy2bJ5CzopOJ2Uclh+QqGhBDrFXIM2XlYDyWzlfOSBqNAJnyt76QyWfOaXM+UL0QBzpvSK3wOa8H7mCM3JC0oCOQ2StZvytc0c7tl//dTG+qoPDNJnr9JzQtxApBtvaHrMFLp7bgBdEF5/3CN3Zgbxx00kGcYjA/nYzuV2LCH0Q6KBMFFFXGU4Eum6d3DUwEbcnjMekKudXo+0wIEJ6GscAJH7nSp62dk7QE53TdcA6pkpxj21OS6+H43NnvxnBBsXxzbZDimHZPT2RZ9U+tfgXjqLnPepqJTouCwsCkCL79zIsiZO02OrYvkz7n9VTZMuHb1MVXPun8t2zJy6AZDrgTOa7QcswKpiGDRcNx/r4CUfFQZGNJtX2jrgdxug9CrYjcyUDDas9Q5sRhpI1wrAvevgl+wBpHv1qjMcKleQo8oNIEDOa9saXwCvoDNgKQ5WphAeT+sB7PYp7zQNuOornsfeEBjdM1cR+XFZLGPy0/42z9YqWANSNAOJU2oSNRdsCUuVqdTtecbfDYV8BOVrpMXWQSwi+EqihXKhhduAXgZG9ev7kvAVq91iRsr8+lG5U1Hgu32ZsGsZbLRgpeQdahWI7RPBBCrkyp88rcslFt9kW+P7+113zVXLhfFsvw+u5Yx03gCujvu7fjiPssUKrd2xcFcRKWQ8c6MMskvCSd0x9NGkIA+yVq77FJGj1UM4a2neAJRZK5Gpxh2eU=';

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
