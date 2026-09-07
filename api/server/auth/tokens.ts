import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

/**
 * JWT + password token utilities.
 * - Access token: short-lived JWT (HS256), sent as `Authorization: Bearer <token>`
 * - Refresh token: opaque random string, stored hashed (sha256) in MySQL
 * - Passwords: bcrypt with 12 salt rounds
 */

export const ACCESS_TOKEN_TTL = '15m';
export const REFRESH_TOKEN_TTL_DAYS = 7;
const BCRYPT_ROUNDS = 12;

function jwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is not configured');
  return secret;
}

export interface AccessPayload {
  sub: number;      // user id
  role: 'user' | 'admin';
  name: string;
}

export function signAccessToken(payload: AccessPayload): string {
  return jwt.sign(payload, jwtSecret(), { expiresIn: ACCESS_TOKEN_TTL, algorithm: 'HS256' });
}

export function verifyAccessToken(token: string): AccessPayload {
  return jwt.verify(token, jwtSecret(), { algorithms: ['HS256'] }) as unknown as AccessPayload;
}

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, BCRYPT_ROUNDS);
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

/** Opaque refresh token + its sha256 hash for storage. */
export function createRefreshToken(): { token: string; tokenHash: string } {
  const token = crypto.randomBytes(48).toString('hex');
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
  return { token, tokenHash };
}

export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}
