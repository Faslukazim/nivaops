import { useState } from 'react';
import { Loader2, Mail, Lock, ArrowRight, ArrowLeft } from 'lucide-react';
import { signIn, signInWithGoogle } from './services/authService';
import { Btn } from './components/ui';
import { NivaLogo } from './components/NivaLogo';

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
      <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
  );
}

function NivaOpsMark() {
  return (
    <div className="flex flex-col items-center gap-2">
      <NivaLogo size={56} className="rounded-xl" />
      <span className="text-lg font-bold tracking-tight text-ink">NivaOps</span>
    </div>
  );
}

export default function AuthPage({ onAuthed, onBack }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function handleGoogle() {
    setError('');
    setBusy(true);
    try {
      await signInWithGoogle();
      // OAuth redirect — page will reload on return
    } catch (err) {
      setError(err.message || 'Google sign-in failed.');
      setBusy(false);
    }
  }

  const inputCls = 'w-full rounded-lg border border-border bg-white pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green/30 focus:border-green';

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const session = await signIn(email, password);
      onAuthed?.(session);
    } catch (err) {
      setError(err.message || 'Incorrect email or password.');
    } finally {
      setBusy(false);
    }
  }

  async function tryDemo() {
    setError('');
    setBusy(true);
    try {
      const session = await signIn('demo@stayops.com', 'demo2026');
      onAuthed?.(session);
    } catch {
      setError('Demo unavailable right now.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-mist flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm">

        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="mb-6 inline-flex items-center gap-1.5 text-sm text-slate2 hover:text-ink transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back
          </button>
        )}

        <div className="mb-8 flex justify-center">
          <NivaOpsMark />
        </div>

        <div className="rounded-2xl bg-white border border-border shadow-md p-8">
          <h1 className="text-lg font-bold text-ink text-center">Welcome back</h1>
          <p className="mt-1 text-sm text-slate2 text-center">Sign in to your NivaOps workspace.</p>

          {error && (
            <div className="mt-4 rounded-lg border border-coral/30 bg-coral/5 px-3 py-2.5 text-sm text-coral">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-3">
            <label className="block">
              <span className="text-2xs font-semibold uppercase tracking-widest text-slate2">Email</span>
              <div className="relative mt-1.5">
                <Mail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate2" />
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className={inputCls}
                  placeholder="you@example.com"
                />
              </div>
            </label>

            <label className="block">
              <span className="text-2xs font-semibold uppercase tracking-widest text-slate2">Password</span>
              <div className="relative mt-1.5">
                <Lock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate2" />
                <input
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className={inputCls}
                  placeholder="Your password"
                />
              </div>
            </label>

            <Btn variant="primary" className="w-full justify-center py-3 mt-1" disabled={busy} {...{ type: 'submit' }}>
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
              Sign in
            </Btn>
          </form>

          <div className="mt-4 space-y-2 border-t border-border pt-4">
            <button
              type="button"
              onClick={handleGoogle}
              disabled={busy}
              className="w-full flex items-center justify-center gap-2.5 rounded-lg border border-border bg-white px-3 py-2.5 text-sm font-semibold text-ink hover:bg-mist transition-colors disabled:opacity-50"
            >
              <GoogleIcon />
              Continue with Google
            </button>
            <button
              type="button"
              onClick={tryDemo}
              disabled={busy}
              className="w-full rounded-lg border border-border bg-mist px-3 py-2.5 text-sm font-semibold text-slate2 hover:bg-border hover:text-ink transition-colors disabled:opacity-50"
            >
              Try live demo instead
            </button>
          </div>
        </div>

        <p className="mt-5 text-center text-sm text-slate2">
          Don't have access?{' '}
          <a
            href="https://wa.me/919633310117?text=Hi%2C%20I%27d%20like%20to%20get%20access%20to%20NivaOps"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-ink hover:underline"
          >
            Request access →
          </a>
        </p>
      </div>
    </div>
  );
}
