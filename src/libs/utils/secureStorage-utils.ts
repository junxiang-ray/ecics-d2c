const encoder = (s: string) => new TextEncoder().encode(s);
const decoder = (b: ArrayBuffer) => new TextDecoder().decode(b);

// base64 helpers
const toBase64 = (buf: ArrayBuffer) => {
  const arr = new Uint8Array(buf);
  let str = '';
  for (let i = 0; i < arr.length; i++) {
    str += String.fromCharCode(arr[i]);
  }
  return btoa(str);
};

const fromBase64 = (str: string) => {
  const bin = atob(str);
  const arr = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) {
    arr[i] = bin.charCodeAt(i);
  }
  return arr.buffer;
};

async function deriveKey(passphrase: string, salt: Uint8Array) {
  const baseKey = await crypto.subtle.importKey(
    'raw',
    encoder(passphrase),
    'PBKDF2',
    false,
    ['deriveKey'],
  );
  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: 120000,
      hash: 'SHA-256',
    },
    baseKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt'],
  );
}

export async function encryptValue(value: string, passphrase: string) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(passphrase, salt);
  const ct = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    encoder(value),
  );
  return `${toBase64(salt.buffer)}.${toBase64(iv.buffer)}.${toBase64(ct)}`;
}

export async function decryptValue(payload: string, passphrase: string) {
  try {
    const [saltB64, ivB64, ctB64] = payload.split('.');
    if (!saltB64 || !ivB64 || !ctB64) return null;
    const salt = new Uint8Array(fromBase64(saltB64));
    const iv = new Uint8Array(fromBase64(ivB64));
    const ct = fromBase64(ctB64);
    const key = await deriveKey(passphrase, salt);
    const plainBuffer = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      ct,
    );
    return decoder(plainBuffer);
  } catch (e) {
    console.warn('Decrypt failed:', e);
    return null;
  }
}

// URL validator — same-origin or whitelisted only
export function isSafeUrl(url: string | null, allowlist: string[] = []) {
  if (!url) return false;
  try {
    const parsed = new URL(url, window.location.origin);
    if (allowlist.length > 0) {
      for (let i = 0; i < allowlist.length; i++) {
        if (parsed.origin === allowlist[i]) return true;
      }
      return false;
    }
    return parsed.origin === window.location.origin;
  } catch {
    return false;
  }
}

export const removeNonLatinChar = (value: string): string => {
  if (!value) return value;

  let result = '';
  for (let i = 0; i < value.length; i++) {
    const code = value.charCodeAt(i);
    if (code >= 0x00 && code <= 0x7f) result += value[i];
  }

  return result;
};

export const encodeToBase64 = (str: string, isURLSafe?: boolean): string => {
  try {
    const encoded = btoa(removeNonLatinChar(str));

    if (!isURLSafe) return encoded;

    return encoded.replace(/\+/g, '-').replace(/\\/g, '-').replace(/=/g, '');
  } catch (err) {
    return '';
  }
};

export const decodeFromBase64 = (str: string): string | null => {
  try {
    if (!str) return null;

    return atob(str);
  } catch (err) {
    return null;
  }
};

export const stringifyJSON = <T>(value: T): string => {
  if (value == null) return '';

  return JSON.stringify(value);
};

export const parseJSON = <T>(value: string): T => {
  try {
    return JSON.parse(value) as unknown as T;
  } catch (e) {
    return value as unknown as T;
  }
};
