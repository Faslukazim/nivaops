import { useEffect, useState, useCallback } from 'react';
import {
  Loader2, CheckCircle2, Trash2, RefreshCw, LayoutDashboard,
  Plus, X, Eye, EyeOff, ChevronDown, ChevronUp,
  Ban, ShieldCheck, KeyRound, Building2, Users, BedDouble,
  Clock, AlertCircle, Sparkles, Mail, TrendingUp,
} from 'lucide-react';
import { supabase } from './lib/supabase';
import { SignOutBtn } from './components/ui';
import { NivaLogo } from './components/NivaLogo';

const RESET_URL = 'https://drlkmfhpthhkvnljuprm.supabase.co/functions/v1/admin-reset-password';
const CREATE_URL = 'https://drlkmfhpthhkvnljuprm.supabase.co/functions/v1/admin-create-user';

function genPassword() {
  const chars = 'abcdefghjkmnpqrstuvwxyz23456789';
  return Array.from({ length: 10 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

function timeAgo(ts) {
  if (!ts) return 'Never';
  const s = Math.floor((Date.now() - new Date(ts)) / 1000);
  if (s < 60)      return 'Just now';
  if (s < 3600)    return `${Math.floor(s / 60)}m ago`;
  if (s < 86400)   return `${Math.floor(s / 3600)}h ago`;
  if (s < 2592000) return `${Math.floor(s / 86400)}d ago`;
  return new Date(ts).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

async function getToken() {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token;
}

function toMsg(err) {
  if (!err) return 'Something went wrong';
  if (typeof err === 'string') return err;
  return err.message || err.details || JSON.stringify(err);
}

// ── Toast ─────────────────────────────────────────────────────────────────────

function ToastItem({ toast, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 3000); return () => clearTimeout(t); }, [onDone]);
  return (
    <div className={`flex items-center gap-2.5 rounded-2xl px-4 py-3 shadow-lg text-sm font-semibold text-white ${toast.type === 'error' ? 'bg-coral' : 'bg-leaf'}`}>
      {toast.type === 'error' ? <AlertCircle className="h-4 w-4 shrink-0" /> : <CheckCircle2 className="h-4 w-4 shrink-0" />}
      {toast.message}
    </div>
  );
}

function ToastStack({ toasts, onDismiss }) {
  if (!toasts.length) return null;
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 items-center pointer-events-none">
      {toasts.map(t => <ToastItem key={t.id} toast={t} onDone={() => onDismiss(t.id)} />)}
    </div>
  );
}

// ── Google badge ──────────────────────────────────────────────────────────────

function GoogleBadge() {
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate2 bg-border rounded-full px-2 py-0.5">
      <svg width="10" height="10" viewBox="0 0 18 18" fill="none">
        <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
        <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
        <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
        <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
      </svg>
      Google
    </span>
  );
}

// ── ResetPasswordPanel ────────────────────────────────────────────────────────

function ResetPasswordPanel({ userId, ownerEmail, onClose, onToast }) {
  const [password, setPassword] = useState('');
  const [show, setShow]         = useState(false);
  const [busy, setBusy]         = useState(false);
  const [error, setError]       = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    if (password.length < 6) { setError('Minimum 6 characters'); return; }
    setBusy(true); setError('');
    try {
      const token = await getToken();
      const res = await fetch(RESET_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ user_id: userId, new_password: password }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || `Error ${res.status}`);
      onToast({ message: `Password updated for ${ownerEmail}`, type: 'success' });
      onClose();
    } catch (err) { setError(toMsg(err)); }
    finally { setBusy(false); }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-mist p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold text-ink uppercase tracking-wide">Reset password</p>
        <button type="button" onClick={onClose} className="text-slate2 hover:text-ink"><X className="h-3.5 w-3.5" /></button>
      </div>
      {error && <p className="text-xs text-coral">{error}</p>}
      <div className="relative">
        <input autoFocus type={show ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
          placeholder="New password" className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm font-mono pr-9 focus:outline-none focus:ring-2 focus:ring-green/30" />
        <button type="button" onClick={() => setShow(v => !v)} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate2 hover:text-ink">
          {show ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
        </button>
      </div>
      <button type="button" onClick={() => { setPassword(genPassword()); setShow(true); }} className="text-xs text-slate2 hover:text-ink text-left">
        Generate random password
      </button>
      <button type="submit" disabled={busy}
        className="inline-flex items-center justify-center gap-2 rounded-lg bg-ink text-white py-2 text-xs font-bold hover:bg-ink/80 disabled:opacity-60">
        {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <KeyRound className="h-3.5 w-3.5" />}
        Set password
      </button>
    </form>
  );
}

// ── EmailChangePanel ──────────────────────────────────────────────────────────

function EmailChangePanel({ userId, currentEmail, onClose, onEmailChanged, onToast }) {
  const [email, setEmail] = useState('');
  const [busy, setBusy]   = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || trimmed === currentEmail) { setError('Enter a different email'); return; }
    setBusy(true); setError('');
    try {
      const { error: err } = await supabase.rpc('admin_update_user_email', { p_user_id: userId, p_email: trimmed });
      if (err) {
        const msg = toMsg(err);
        throw new Error(msg.includes('unique') || msg.includes('already') ? 'Email already used by another account' : msg);
      }
      onEmailChanged(trimmed);
      onToast({ message: `Email updated to ${trimmed}`, type: 'success' });
      onClose();
    } catch (err) { setError(toMsg(err)); }
    finally { setBusy(false); }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-mist p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold text-ink uppercase tracking-wide">Change email</p>
        <button type="button" onClick={onClose} className="text-slate2 hover:text-ink"><X className="h-3.5 w-3.5" /></button>
      </div>
      <p className="text-xs text-slate2">Current: <span className="font-semibold text-ink">{currentEmail}</span></p>
      {error && <p className="text-xs text-coral">{error}</p>}
      <input autoFocus type="text" inputMode="email" value={email} onChange={e => setEmail(e.target.value)}
        placeholder="New email address"
        className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green/30" />
      <button type="submit" disabled={busy}
        className="inline-flex items-center justify-center gap-2 rounded-lg bg-ink text-white py-2 text-xs font-bold hover:bg-ink/80 disabled:opacity-60">
        {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Mail className="h-3.5 w-3.5" />}
        Update email
      </button>
    </form>
  );
}

// ── OrgCard ───────────────────────────────────────────────────────────────────

function OrgCard({ org, onApprove, onReject, onBan, onPlanChange, busy, onToast }) {
  const [open, setOpen]           = useState(false);
  const [panel, setPanel]         = useState(null); // 'reset' | 'email' | 'plan' | 'ban' | 'delete'
  const [approvePlan, setApprovePlan] = useState('starter');
  const [ownerEmail, setOwnerEmail]   = useState(org.owner_email);

  const isPending    = !org.approved;
  const isBusy       = busy === org.org_id;
  const isGoogle     = org.auth_provider === 'google';

  function togglePanel(name) {
    setPanel(p => p === name ? null : name);
  }

  const planLabel = org.plan === 'pro'
    ? <span className="text-[10px] font-bold text-green bg-green/10 rounded-full px-2 py-0.5">Pro</span>
    : <span className="text-[10px] font-bold text-slate2 bg-border rounded-full px-2 py-0.5">Starter</span>;

  return (
    <div className={`rounded-2xl border overflow-hidden transition-all ${
      org.banned ? 'border-coral/30 bg-coral/5'
      : isPending ? 'border-amber/30 bg-amber/5'
      : 'border-border bg-white'
    }`}>
      {/* Card header */}
      <div className="px-4 py-4 flex items-start gap-3">
        <div className={`h-9 w-9 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 ${
          org.banned ? 'bg-coral/15 text-coral'
          : isPending ? 'bg-amber/15 text-amber'
          : 'bg-ink/8 text-ink'
        }`}>
          {org.org_name.charAt(0).toUpperCase()}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <p className="text-sm font-bold text-ink">{org.org_name}</p>
            {org.banned && <span className="text-[10px] font-bold text-coral bg-coral/10 rounded-full px-2 py-0.5">Suspended</span>}
            {isPending  && <span className="text-[10px] font-bold text-amber bg-amber/10 rounded-full px-2 py-0.5">Pending</span>}
            {!isPending && planLabel}
            {isGoogle && <GoogleBadge />}
          </div>
          <p className="text-xs text-slate2 mt-0.5 truncate">{ownerEmail}</p>
          <div className="flex items-center gap-3 mt-1.5 flex-wrap">
            <span className="inline-flex items-center gap-1 text-xs text-slate2">
              <Building2 className="h-3 w-3" />{org.property_count}
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-slate2">
              <Users className="h-3 w-3" />{org.tenant_count}
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-slate2">
              <BedDouble className="h-3 w-3" />{org.bed_count}
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-slate2">
              <Clock className="h-3 w-3" />{timeAgo(org.last_login)}
            </span>
          </div>
        </div>

        {!isPending && (
          <button onClick={() => { setOpen(v => !v); setPanel(null); }}
            className="text-slate2 hover:text-ink transition-colors shrink-0 mt-0.5">
            {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        )}
      </div>

      {/* Pending: plan picker + approve/reject */}
      {isPending && (
        <div className="border-t border-amber/20 px-4 py-3 flex flex-col gap-3 bg-white/50">
          <div className="grid grid-cols-2 gap-2">
            {[
              { value: 'starter', label: 'Starter', sub: '₹799/mo · 1 property' },
              { value: 'pro',     label: 'Pro',     sub: '₹1,499/mo · Multi-property' },
            ].map(p => (
              <button key={p.value} type="button" onClick={() => setApprovePlan(p.value)}
                className={`rounded-xl border px-3 py-2 text-left transition-colors ${
                  approvePlan === p.value ? 'border-leaf bg-leaf/5' : 'border-border bg-white text-slate2 hover:border-slate2/30'
                }`}>
                <p className="text-xs font-bold text-ink">{p.label}</p>
                <p className="text-[11px] text-slate2">{p.sub}</p>
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button onClick={() => onReject(org.org_id, org.org_name)} disabled={isBusy}
              className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-white px-3 py-1.5 text-xs font-semibold text-slate2 hover:border-coral hover:text-coral transition-colors disabled:opacity-40">
              {isBusy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
              Reject
            </button>
            <button onClick={() => onApprove(org.org_id, approvePlan)} disabled={isBusy}
              className="ml-auto inline-flex items-center gap-1.5 rounded-xl bg-leaf text-white px-4 py-1.5 text-xs font-bold hover:bg-leaf/90 transition-colors disabled:opacity-40">
              {isBusy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
              Approve as {approvePlan === 'pro' ? 'Pro' : 'Starter'}
            </button>
          </div>
        </div>
      )}

      {/* Expanded actions */}
      {!isPending && open && (
        <div className="border-t border-border">
          <div className="flex items-center gap-1.5 px-4 py-2.5 bg-mist/60 flex-wrap">
            {!isGoogle && (
              <button onClick={() => togglePanel('reset')}
                className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-colors ${panel === 'reset' ? 'bg-ink text-white' : 'bg-white border border-border text-ink hover:bg-mist'}`}>
                <KeyRound className="h-3.5 w-3.5" /> Reset password
              </button>
            )}
            <button onClick={() => togglePanel('email')}
              className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-colors ${panel === 'email' ? 'bg-ink text-white' : 'bg-white border border-border text-ink hover:bg-mist'}`}>
              <Mail className="h-3.5 w-3.5" /> Change email
            </button>
            <button onClick={() => togglePanel('plan')}
              className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-colors ${panel === 'plan' ? 'bg-ink text-white' : 'bg-white border border-border text-slate2 hover:bg-mist'}`}>
              <Sparkles className="h-3.5 w-3.5" />
              {org.plan === 'pro' ? 'Downgrade' : 'Upgrade'}
            </button>
            <button onClick={() => togglePanel('ban')}
              className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-colors ${
                panel === 'ban' ? 'bg-amber text-white'
                : org.banned ? 'bg-white border border-leaf/30 text-leaf hover:bg-leaf/5'
                : 'bg-white border border-border text-slate2 hover:border-amber/40 hover:text-amber'
              }`}>
              {org.banned ? <ShieldCheck className="h-3.5 w-3.5" /> : <Ban className="h-3.5 w-3.5" />}
              {org.banned ? 'Unsuspend' : 'Suspend'}
            </button>
            <div className="flex-1" />
            <button onClick={() => togglePanel('delete')}
              className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-colors ${panel === 'delete' ? 'bg-coral text-white' : 'border border-coral/30 text-coral hover:bg-coral/5'}`}>
              <Trash2 className="h-3.5 w-3.5" /> Delete
            </button>
          </div>

          <div className="px-4 pb-4 pt-1 flex flex-col gap-3">
            {panel === 'reset' && !isGoogle && (
              <ResetPasswordPanel userId={org.owner_id} ownerEmail={ownerEmail} onClose={() => setPanel(null)} onToast={onToast} />
            )}

            {panel === 'email' && (
              <EmailChangePanel userId={org.owner_id} currentEmail={ownerEmail}
                onClose={() => setPanel(null)} onEmailChanged={e => setOwnerEmail(e)} onToast={onToast} />
            )}

            {panel === 'plan' && (
              <div className="rounded-xl border border-border bg-mist p-4 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-ink uppercase tracking-wide">
                    {org.plan === 'pro' ? 'Downgrade to Starter' : 'Upgrade to Pro'}
                  </p>
                  <button onClick={() => setPanel(null)} className="text-slate2 hover:text-ink"><X className="h-3.5 w-3.5" /></button>
                </div>
                <p className="text-xs text-slate2">
                  {org.plan === 'pro'
                    ? 'Limited to 1 property. Existing data is preserved.'
                    : 'Unlocks multiple properties for this account.'}
                </p>
                <div className="flex gap-2">
                  <button onClick={() => { setPanel(null); onPlanChange(org.org_id, org.plan === 'pro' ? 'starter' : 'pro'); }}
                    disabled={isBusy}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-ink text-white px-3 py-1.5 text-xs font-bold hover:bg-ink/80 disabled:opacity-60">
                    {isBusy && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                    Confirm
                  </button>
                  <button onClick={() => setPanel(null)} className="rounded-lg border border-border bg-white px-3 py-1.5 text-xs font-semibold text-slate2 hover:bg-mist">
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {panel === 'ban' && (
              <div className="rounded-xl border border-amber/30 bg-amber/5 p-4 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-ink uppercase tracking-wide">
                    {org.banned ? 'Unsuspend account?' : 'Suspend account?'}
                  </p>
                  <button onClick={() => setPanel(null)} className="text-slate2 hover:text-ink"><X className="h-3.5 w-3.5" /></button>
                </div>
                <p className="text-xs text-slate2">
                  {org.banned ? 'User will be able to sign in again immediately.' : 'User will be locked out. Data is preserved.'}
                </p>
                <div className="flex gap-2">
                  <button onClick={() => { setPanel(null); onBan(org.owner_id, !org.banned); }}
                    disabled={isBusy}
                    className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold text-white disabled:opacity-60 ${org.banned ? 'bg-leaf hover:bg-leaf/90' : 'bg-amber hover:bg-amber/90'}`}>
                    {isBusy && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                    {org.banned ? 'Yes, unsuspend' : 'Yes, suspend'}
                  </button>
                  <button onClick={() => setPanel(null)} className="rounded-lg border border-border bg-white px-3 py-1.5 text-xs font-semibold text-slate2 hover:bg-mist">
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {panel === 'delete' && (
              <div className="rounded-xl border border-coral/30 bg-coral/5 p-4 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-ink uppercase tracking-wide">Delete "{org.org_name}"?</p>
                  <button onClick={() => setPanel(null)} className="text-slate2 hover:text-ink"><X className="h-3.5 w-3.5" /></button>
                </div>
                <p className="text-xs text-slate2">Permanently deletes all data. Cannot be undone.</p>
                <div className="flex gap-2">
                  <button onClick={() => { setPanel(null); onReject(org.org_id, org.org_name); }}
                    disabled={isBusy}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-coral text-white px-3 py-1.5 text-xs font-bold hover:bg-coral/90 disabled:opacity-60">
                    {isBusy && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                    Delete permanently
                  </button>
                  <button onClick={() => setPanel(null)} className="rounded-lg border border-border bg-white px-3 py-1.5 text-xs font-semibold text-slate2 hover:bg-mist">
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {!panel && (
              <p className="text-xs text-slate2">
                Joined {new Date(org.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ── CreateAccountForm ─────────────────────────────────────────────────────────

function CreateAccountForm({ onCreated, onClose, onToast }) {
  const [orgName, setOrgName]   = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [plan, setPlan]         = useState('starter');
  const [showPass, setShowPass] = useState(false);
  const [busy, setBusy]         = useState(false);
  const [error, setError]       = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    if (password.length < 6) { setError('Minimum 6 characters'); return; }
    setBusy(true); setError('');
    try {
      const token = await getToken();
      const res = await fetch(CREATE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ email: email.trim(), password, org_name: orgName.trim(), plan }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || `Error ${res.status}`);
      onToast({ message: `Account created for ${email.trim()}`, type: 'success' });
      onCreated();
    } catch (err) { setError(toMsg(err)); }
    finally { setBusy(false); }
  }

  const cls = 'w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green/30 focus:border-green';

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl bg-white border border-border p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-bold text-ink">New client account</p>
        <button type="button" onClick={onClose} className="text-slate2 hover:text-ink"><X className="h-4 w-4" /></button>
      </div>
      {error && <p className="text-xs text-coral bg-coral/5 border border-coral/20 rounded-lg px-3 py-2">{error}</p>}

      <div>
        <label className="block text-xs font-semibold text-slate2 mb-1.5">Business name <span className="text-coral">*</span></label>
        <input required value={orgName} onChange={e => setOrgName(e.target.value)} className={cls} placeholder="e.g. Sunrise Hostel" />
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate2 mb-1.5">Login email <span className="text-coral">*</span></label>
        <input required type="text" inputMode="email" value={email} onChange={e => setEmail(e.target.value)} className={cls} placeholder="owner@example.com" />
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate2 mb-1.5">Password <span className="text-coral">*</span></label>
        <div className="relative">
          <input required type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
            placeholder="Enter or generate" className={`${cls} pr-10 font-mono`} />
          <button type="button" onClick={() => setShowPass(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate2 hover:text-ink">
            {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        <button type="button" onClick={() => { setPassword(genPassword()); setShowPass(true); }}
          className="mt-1.5 text-xs text-slate2 hover:text-ink">Generate password</button>
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate2 mb-2">Plan <span className="text-coral">*</span></label>
        <div className="grid grid-cols-2 gap-2">
          {[
            { value: 'starter', label: 'Starter', sub: '₹799/mo · 1 property' },
            { value: 'pro',     label: 'Pro',     sub: '₹1,499/mo · Multi-property' },
          ].map(p => (
            <button key={p.value} type="button" onClick={() => setPlan(p.value)}
              className={`rounded-xl border px-3 py-2.5 text-left transition-colors ${plan === p.value ? 'border-green bg-green/5' : 'border-border bg-white text-slate2 hover:border-slate2/40'}`}>
              <p className="text-xs font-bold text-ink">{p.label}</p>
              <p className="text-[11px] text-slate2">{p.sub}</p>
            </button>
          ))}
        </div>
      </div>
      <button type="submit" disabled={busy}
        className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-green text-white py-3 text-sm font-bold hover:bg-green-hover disabled:opacity-60">
        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
        Create account
      </button>
    </form>
  );
}

// ── AdminPage ─────────────────────────────────────────────────────────────────

export default function AdminPage({ onSignOut, onOpenApp }) {
  const [orgs, setOrgs]             = useState([]);
  const [loading, setLoading]       = useState(true);
  const [busy, setBusy]             = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [toasts, setToasts]         = useState([]);

  function toast(t) { setToasts(prev => [...prev, { id: Date.now(), ...t }]); }
  function dismissToast(id) { setToasts(prev => prev.filter(t => t.id !== id)); }

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.rpc('admin_list_orgs');
    setOrgs(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    const ch = supabase.channel('admin-watch')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'memberships' }, () => {
        load();
        toast({ message: 'New signup!', type: 'success' });
      })
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [load]);

  async function approve(org_id, plan = 'starter') {
    setBusy(org_id);
    await supabase.rpc('admin_approve_org', { p_org_id: org_id, p_plan: plan });
    await load();
    setBusy(null);
    toast({ message: `Approved as ${plan === 'pro' ? 'Pro' : 'Starter'}`, type: 'success' });
  }

  async function reject(org_id, org_name) {
    setBusy(org_id);
    await supabase.rpc('admin_reject_org', { p_org_id: org_id });
    await load();
    setBusy(null);
    toast({ message: `"${org_name}" removed`, type: 'success' });
  }

  async function ban(user_id, banned) {
    const org = orgs.find(o => o.owner_id === user_id);
    setBusy(org?.org_id);
    await supabase.rpc('admin_set_banned', { p_user_id: user_id, p_banned: banned });
    await load();
    setBusy(null);
    toast({ message: banned ? 'Account suspended' : 'Account unsuspended', type: 'success' });
  }

  async function changePlan(org_id, newPlan) {
    setBusy(org_id);
    const { error } = await supabase.rpc('admin_set_plan', { p_org_id: org_id, p_plan: newPlan });
    if (error) toast({ message: toMsg(error), type: 'error' });
    else toast({ message: `Plan → ${newPlan === 'pro' ? 'Pro' : 'Starter'}`, type: 'success' });
    await load();
    setBusy(null);
  }

  const pending  = orgs.filter(o => !o.approved);
  const approved = orgs.filter(o => o.approved);

  // Summary stats
  const totalTenants  = approved.reduce((s, o) => s + Number(o.tenant_count), 0);
  const totalBeds     = approved.reduce((s, o) => s + Number(o.bed_count), 0);
  const proCount      = approved.filter(o => o.plan === 'pro').length;

  return (
    <div className="min-h-screen bg-mist">
      <ToastStack toasts={toasts} onDismiss={dismissToast} />

      {/* Header */}
      <header className="bg-white border-b border-border px-5 flex items-center justify-between sticky top-0 z-40"
        style={{ paddingTop: 'calc(env(safe-area-inset-top,0px) + 1rem)', paddingBottom: '1rem' }}>
        <div className="flex items-center gap-2.5">
          <NivaLogo size={28} />
          <span className="text-sm font-bold text-ink">Admin</span>
          {pending.length > 0 && (
            <span className="rounded-full bg-amber text-white text-[10px] font-bold px-1.5 py-0.5">{pending.length}</span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <button onClick={load} className="text-slate2 hover:text-ink" title="Refresh">
            <RefreshCw className="h-4 w-4" />
          </button>
          <button onClick={onOpenApp} className="flex items-center gap-1.5 text-xs font-semibold text-slate2 hover:text-ink">
            <LayoutDashboard className="h-3.5 w-3.5" /> My workspace
          </button>
          <SignOutBtn onSignOut={onSignOut} />
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-6 flex flex-col gap-6">

        {/* Stats bar */}
        {!loading && approved.length > 0 && (
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Accounts', value: approved.length, icon: Building2 },
              { label: 'Tenants',  value: totalTenants,    icon: Users },
              { label: 'Pro',      value: proCount,        icon: TrendingUp },
            ].map(s => (
              <div key={s.label} className="rounded-2xl bg-white border border-border px-4 py-3 flex flex-col gap-1">
                <s.icon className="h-3.5 w-3.5 text-slate2" />
                <p className="text-xl font-bold text-ink">{s.value}</p>
                <p className="text-xs text-slate2">{s.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Pending approvals */}
        {(loading || pending.length > 0) && (
          <section>
            <div className="flex items-center gap-2 mb-3">
              <h2 className="text-sm font-bold text-ink">Pending approval</h2>
              {pending.length > 0 && (
                <span className="rounded-full bg-amber/15 text-amber text-xs font-bold px-2 py-0.5">{pending.length}</span>
              )}
            </div>
            {loading
              ? <div className="flex justify-center py-8"><Loader2 className="h-5 w-5 animate-spin text-slate2" /></div>
              : <div className="flex flex-col gap-2">
                  {pending.map(o => <OrgCard key={o.org_id} org={o} busy={busy} onApprove={approve} onReject={reject} onBan={ban} onPlanChange={changePlan} onToast={toast} />)}
                </div>
            }
          </section>
        )}

        {/* Active accounts */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-ink">
              Active <span className="font-normal text-slate2">({approved.length})</span>
            </h2>
            <button onClick={() => setShowCreate(v => !v)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-green text-white px-3 py-1.5 text-xs font-bold hover:bg-green-hover transition-colors">
              {showCreate ? <X className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
              {showCreate ? 'Cancel' : 'New account'}
            </button>
          </div>

          {showCreate && (
            <div className="mb-3">
              <CreateAccountForm onCreated={() => { setShowCreate(false); load(); }} onClose={() => setShowCreate(false)} onToast={toast} />
            </div>
          )}

          {loading
            ? <div className="flex justify-center py-8"><Loader2 className="h-5 w-5 animate-spin text-slate2" /></div>
            : approved.length === 0
              ? <div className="rounded-2xl bg-white border border-border px-5 py-8 text-center text-sm text-slate2">No active accounts yet</div>
              : <div className="flex flex-col gap-2">
                  {approved.map(o => <OrgCard key={o.org_id} org={o} busy={busy} onApprove={approve} onReject={reject} onBan={ban} onPlanChange={changePlan} onToast={toast} />)}
                </div>
          }
        </section>

      </div>
    </div>
  );
}
