import { Router, Request, Response } from 'express';
import { RowDataPacket } from 'mysql2/promise';
import { query } from '../db/pool';
import { encryptField, decryptField } from '../db/crypto';
import {
  signAccessToken,
  createRefreshToken,
  hashToken,
  hashPassword,
  verifyPassword,
  REFRESH_TOKEN_TTL_DAYS,
  AccessPayload,
} from '../auth/tokens';
import { requireAuth, requireAdmin, AuthUser } from '../middleware/auth';

const router = Router();

interface UserRow extends RowDataPacket {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  role: 'user' | 'admin';
  is_active: number;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function issueTokens(user: { id: number; role: 'user' | 'admin'; name: string }) {
  const payload: AccessPayload = { sub: user.id, role: user.role, name: user.name };
  const accessToken = signAccessToken(payload);
  const { token, tokenHash } = createRefreshToken();
  await query(
    'INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL ? DAY))',
    [user.id, tokenHash, REFRESH_TOKEN_TTL_DAYS]
  );
  return { accessToken, refreshToken: token };
}

/* ---------------- Register ---------------- */
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { name, email, password, phone, gender, date_of_birth } = req.body ?? {};
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'name, email and password are required' });
    }
    if (!EMAIL_RE.test(String(email))) {
      return res.status(400).json({ error: 'Invalid email address' });
    }
    if (String(password).length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }

    const existing = await query<UserRow>(
      'SELECT id FROM users WHERE email = ? LIMIT 1',
      [String(email).toLowerCase()]
    );
    if (existing.length > 0) {
      return res.status(409).json({ error: 'An account with this email already exists' });
    }

    const passwordHash = await hashPassword(String(password));
    const result = await query<RowDataPacket>(
      'INSERT INTO users (name, email, phone, password_hash, role) VALUES (?, ?, ?, ?, ?)',
      [String(name).trim(), String(email).toLowerCase(), phone ?? null, passwordHash, 'user']
    );
    const userId = (result as unknown as { insertId: number }).insertId;

    if (gender && date_of_birth) {
      await query(
        'INSERT INTO profiles (user_id, full_name, gender, date_of_birth, contact_email, contact_phone) VALUES (?, ?, ?, ?, ?, ?)',
        [userId, String(name).trim(), gender, date_of_birth,
         encryptField(String(email).toLowerCase()), phone ? encryptField(String(phone)) : null]
      );
    }

    const user = { id: userId, role: 'user' as const, name: String(name).trim() };
    const tokens = await issueTokens(user);
    return res.status(201).json({ user, ...tokens });
  } catch (err) {
    console.error('register error:', err);
    return res.status(500).json({ error: 'Registration failed' });
  }
});

/* ---------------- Login (users & admins) ---------------- */
async function doLogin(req: Request, res: Response, requireRole?: 'admin') {
  try {
    const { email, password } = req.body ?? {};
    if (!email || !password) {
      return res.status(400).json({ error: 'email and password are required' });
    }
    const rows = await query<UserRow>(
      'SELECT id, name, email, password_hash, role, is_active FROM users WHERE email = ? LIMIT 1',
      [String(email).toLowerCase()]
    );
    const user = rows[0];
    // Uniform error message avoids user enumeration.
    if (!user || !(await verifyPassword(String(password), user.password_hash))) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    if (!user.is_active) {
      return res.status(403).json({ error: 'Account is disabled' });
    }
    if (requireRole && user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin privileges required' });
    }
    const tokens = await issueTokens({ id: user.id, role: user.role, name: user.name });
    return res.json({
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      ...tokens,
    });
  } catch (err) {
    console.error('login error:', err);
    return res.status(500).json({ error: 'Login failed' });
  }
}

router.post('/login', (req: Request, res: Response) => doLogin(req, res));
router.post('/admin/login', (req: Request, res: Response) => doLogin(req, res, 'admin'));

/* ---------------- Refresh (rotates the refresh token) ---------------- */
router.post('/refresh', async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body ?? {};
    if (!refreshToken) return res.status(400).json({ error: 'refreshToken is required' });
    const tokenHash = hashToken(String(refreshToken));
    const rows = await query<RowDataPacket & { user_id: number; expires_at: string; revoked: number }>(
      'SELECT user_id, expires_at, revoked FROM refresh_tokens WHERE token_hash = ? LIMIT 1',
      [tokenHash]
    );
    const row = rows[0];
    if (!row || row.revoked || new Date(row.expires_at) < new Date()) {
      return res.status(401).json({ error: 'Invalid or expired refresh token' });
    }
    const users = await query<UserRow>(
      'SELECT id, name, role, is_active FROM users WHERE id = ? LIMIT 1',
      [row.user_id]
    );
    const user = users[0];
    if (!user || !user.is_active) return res.status(401).json({ error: 'Account unavailable' });
    await query('UPDATE refresh_tokens SET revoked = 1 WHERE token_hash = ?', [tokenHash]);
    const tokens = await issueTokens({ id: user.id, role: user.role, name: user.name });
    return res.json(tokens);
  } catch (err) {
    console.error('refresh error:', err);
    return res.status(500).json({ error: 'Token refresh failed' });
  }
});

/* ---------------- Logout (revokes refresh token) ---------------- */
router.post('/logout', async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body ?? {};
    if (refreshToken) {
      await query('UPDATE refresh_tokens SET revoked = 1 WHERE token_hash = ?', [hashToken(String(refreshToken))]);
    }
    return res.json({ ok: true });
  } catch {
    return res.json({ ok: true });
  }
});

/* ---------------- Current user ---------------- */
router.get('/me', requireAuth, async (req: Request, res: Response) => {
  const user = req.user as AuthUser;
  const rows = await query<RowDataPacket & { email: string; created_at: string }>(
    'SELECT email, created_at FROM users WHERE id = ? LIMIT 1',
    [user.id]
  );
  return res.json({ user: { ...user, email: rows[0]?.email, created_at: rows[0]?.created_at } });
});

/* ---------------- Admin: list users ---------------- */
router.get('/admin/users', requireAuth, requireAdmin, async (_req: Request, res: Response) => {
  const rows = await query<RowDataPacket>(
    'SELECT id, name, email, role, is_active, created_at FROM users ORDER BY created_at DESC LIMIT 200'
  );
  return res.json({ users: rows });
});

/* ---------------- Admin: profile with decrypted PII ---------------- */
router.get('/admin/profiles/:userId', requireAuth, requireAdmin, async (req: Request, res: Response) => {
  const rows = await query<RowDataPacket & { contact_email: Buffer; contact_phone: Buffer }>(
    'SELECT * FROM profiles WHERE user_id = ? LIMIT 1',
    [req.params.userId]
  );
  const profile = rows[0];
  if (!profile) return res.status(404).json({ error: 'Profile not found' });
  return res.json({
    profile: {
      ...profile,
      contact_email: decryptField(profile.contact_email),
      contact_phone: decryptField(profile.contact_phone),
    },
  });
});

export default router;

