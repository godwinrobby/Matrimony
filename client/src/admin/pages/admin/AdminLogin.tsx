import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Heart, Eye, EyeOff, Loader2, ShieldCheck } from 'lucide-react';
import { Button } from '@/admin/components/ui/button';
import { Input } from '@/admin/components/ui/input';
import { Label } from '@/admin/components/ui/label';
import { useAdminAuth } from '../../AdminAuth';

export default function AdminLogin() {
  const { login } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? '/admin';

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const result = await login(username, password);
      setBusy(false);
      if (result.ok) {
        navigate(from, { replace: true });
      } else {
        setError(result.error ?? 'Login failed.');
      }
    } catch {
      setBusy(false);
      setError('Unexpected error. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      {/* Decorative gradient blobs */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-gradient-romantic opacity-20 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-gradient-sunset opacity-20 blur-3xl" />
      </div>

      <div className="w-full max-w-md rounded-2xl border border-border bg-card shadow-elegant overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-romantic p-6 text-center text-primary-foreground">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur">
            <Heart className="h-6 w-6 fill-current" />
          </div>
          <h1 className="text-xl font-bold">SoulMate Admin</h1>
          <p className="text-sm text-primary-foreground/80">Matrimony Control Panel</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5 p-6">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              autoComplete="username"
              placeholder="admin"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {error && (
            <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          )}

          <Button type="submit" className="w-full bg-gradient-romantic text-white shadow-soft" disabled={busy}>
            {busy ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Signing in…
              </>
            ) : (
              <>
                <ShieldCheck className="h-4 w-4" /> Sign in to Dashboard
              </>
            )}
          </Button>

          <p className="rounded-md bg-muted px-3 py-2 text-center text-xs text-muted-foreground">
            Demo credentials — user: <b>admin</b> · password: <b>admin123</b>
          </p>
        </form>
      </div>
    </div>
  );
}
