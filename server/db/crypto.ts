import crypto from 'crypto';

/**
 * AES-256-GCM field-level encryption for sensitive PII stored in MySQL
 * (contact email / phone). Key is derived from APP_SECRET.
 */

const ALGO = 'aes-256-gcm';

function getKey(): Buffer {
  const secret = process.env.APP_SECRET || process.env.JWT_SECRET || '';
  if (!secret) throw new Error('APP_SECRET or JWT_SECRET must be set for field encryption');
  return crypto.createHash('sha256').update(secret).digest();
}

/** Encrypt a UTF-8 string → base64 payload "iv.tag.ciphertext". */
export function encryptField(plain: string): Buffer {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGO, getKey(), iv);
  const enc = Buffer.concat([cipher.update(plain, 'utf8'), cipher.final()]);
  return Buffer.concat([iv, cipher.getAuthTag(), enc]);
}

/** Decrypt a payload produced by encryptField. Returns '' on failure. */
export function decryptField(blob: Buffer | string | null): string {
  if (!blob) return '';
  try {
    const buf = typeof blob === 'string' ? Buffer.from(blob, 'base64') : blob;
    const iv = buf.subarray(0, 12);
    const tag = buf.subarray(12, 28);
    const enc = buf.subarray(28);
    const decipher = crypto.createDecipheriv(ALGO, getKey(), iv);
    decipher.setAuthTag(tag);
    return Buffer.concat([decipher.update(enc), decipher.final()]).toString('utf8');
  } catch {
    return '';
  }
}
