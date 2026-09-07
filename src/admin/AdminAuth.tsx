import { createContext, useCallback, useContext, useState } from 'react';

export interface AdminSession {
  username: string;
  role: string;
  loginAt: string;
}

interface AdminAuthContextValue {
  session: AdminSession | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => { ok: boolean; error?: string };
  logout: () => void;
}

// Demo credentials — replace with a real API call when a backend auth route exists.
const ADMIN_CREDENTIALS: Record<string, { password: string; role: string }> = {
  admin: { password: 'admin123', role: 'Super Admin' },
};

const STORAGE_KEY = 'soulmate_admin_session';

function readSession(): AdminSession | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AdminSession) : null;
  } catch {
    return null;
  }
}

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<AdminSession | null>(readSession);

  const login = useCallback(async (username: string, password: string) => {
    const email = username.trim().toLowerCase();
    try {
      const res = await fetch('/api/auth/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.user) {
        // Persist tokens + display session.
        localStorage.setItem('soulmate_admin_token', data.accessToken);
        localStorage.setItem('soulmate_admin_refresh', data.refreshToken);
        const next: AdminSession = {
          username: data.user.email ?? email,
          role: data.user.role === 'admin' ? 'Super Admin' : 'Admin',
          loginAt: new Date().toISOString(),
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        setSession(next);
        return { ok: true };
      }
      return { ok: false, error: data.error ?? 'Login failed.' };
    } catch {
      // Offline / API unavailable: fall back to the built-in demo account.
      const record = ADMIN_CREDENTIALS[email];
      if (record && record.password === password) {
        const next: AdminSession = {
          username: email,
          role: record.role,
          loginAt: new Date().toISOString(),
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        setSession(next);
        return { ok: true };
      }
      return { ok: false, error: 'Cannot reach the auth server. Check your connection.' };
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setSession(null);
  }, []);

  return (
    <AdminAuthContext.Provider
      value={{ session, isAuthenticated: session !== null, login, logout }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth(): AdminAuthContextValue {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdminAuth must be used inside <AdminAuthProvider>');
  return ctx;
}
