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

  const login = useCallback((username: string, password: string) => {
    const record = ADMIN_CREDENTIALS[username.trim().toLowerCase()];
    if (!record) return { ok: false, error: 'Unknown username.' };
    if (record.password !== password) return { ok: false, error: 'Incorrect password.' };
    const next: AdminSession = {
      username: username.trim().toLowerCase(),
      role: record.role,
      loginAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setSession(next);
    return { ok: true };
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
