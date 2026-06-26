import { useState } from 'react';
import { signIn } from './services/authService';
import { NivaLogo, NivaWordmark } from './components/NivaLogo';
import { Home, Users, DollarSign, BarChart3, Check, ArrowRight, Menu, X, Loader2 } from 'lucide-react';

export default function LandingPage({ onShowAuth }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);
  const [demoError, setDemoError] = useState('');

  async function tryDemo() {
    setDemoLoading(true);
    setDemoError('');
    try {
      await signIn('demo@stayops.com', 'demo2026');
    } catch {
      setDemoError('Demo unavailable right now. Try again in a moment.');
      setDemoLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white">

      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-border">
        <div className="max-w-5xl mx-auto px-5 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <NivaLogo size={26} />
            <NivaWordmark size="lg" />
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <button onClick={onShowAuth}
              className="text-slate hover:text-charcoal font-medium text-sm px-4 py-2 rounded-lg hover:bg-light transition-all duration-150">
              Sign in
            </button>
            <button onClick={onShowAuth}
              className="bg-green hover:bg-green-hover active:scale-[0.98] text-white font-semibold text-sm px-4 py-2 rounded-lg transition-all duration-150">
              Get started
            </button>
          </div>
          <button className="sm:hidden p-2 text-slate" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
        {mobileMenuOpen && (
          <div className="sm:hidden bg-white border-t border-border px-5 pb-5 pt-4 space-y-2">
            <button onClick={onShowAuth} className="w-full text-center text-charcoal font-medium py-2.5 rounded-lg border border-border hover:bg-light text-sm transition-colors">Sign in</button>
            <button onClick={onShowAuth} className="w-full text-center bg-green hover:bg-green-hover text-white font-semibold py-2.5 rounded-lg text-sm transition-all">Get started</button>
          </div>
        )}
      </nav>

      {/* HERO */}
      <section className="px-5 pt-24 pb-20">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-green text-xs font-semibold uppercase tracking-widest mb-6">For PG &amp; hostel operators</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-charcoal tracking-tight leading-[1.1] mb-5">
            Run your rental property from your phone.
          </h1>
          <p className="text-lg text-slate leading-relaxed mb-10">
            Beds, rent, tenants, and finances — one simple app for property operators worldwide.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button onClick={tryDemo} disabled={demoLoading}
              className="w-full sm:w-auto bg-green hover:bg-green-hover active:scale-[0.98] text-white font-semibold px-7 py-3 rounded-lg text-sm transition-all duration-150 flex items-center justify-center gap-2 disabled:opacity-60">
              {demoLoading && <Loader2 size={14} className="animate-spin" />}
              Try live demo <ArrowRight size={14} />
            </button>
            <button onClick={onShowAuth}
              className="w-full sm:w-auto border border-border text-charcoal hover:bg-light font-medium px-7 py-3 rounded-lg text-sm transition-all duration-150">
              Sign in
            </button>
          </div>
          {demoError && <p className="text-error text-sm mt-4">{demoError}</p>}
          <p className="text-muted text-xs mt-6 tracking-wide">No account needed · No credit card</p>
        </div>
      </section>

      {/* FEATURES */}
      <section className="px-5 py-16 bg-light">
        <div className="max-w-4xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-border rounded-xl overflow-hidden">
            {[
              { icon: <Home size={18} className="text-green" />, title: 'Beds & rooms', desc: 'See every bed, track occupancy, assign tenants.' },
              { icon: <DollarSign size={18} className="text-green" />, title: 'Rent collection', desc: 'Send reminders, track paid and overdue, collect faster.' },
              { icon: <Users size={18} className="text-green" />, title: 'Tenant records', desc: 'Profiles, ID photos, join dates, deposit history.' },
              { icon: <BarChart3 size={18} className="text-green" />, title: 'Finance', desc: 'Monthly P&L, expenses, and cash flow in one view.' },
            ].map((f, i) => (
              <div key={i} className="bg-white p-6">
                <div className="w-8 h-8 rounded-lg bg-green-light flex items-center justify-center mb-4">{f.icon}</div>
                <p className="font-semibold text-charcoal text-sm mb-1.5">{f.title}</p>
                <p className="text-slate text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="px-5 py-20">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-charcoal tracking-tight mb-2">Simple pricing.</h2>
            <p className="text-slate">Straightforward pricing. No lock-in.</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl border border-border p-7">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-4">STARTER</p>
              <div className="flex items-end gap-1 mb-1">
                <span className="text-3xl font-bold text-charcoal">$9</span>
                <span className="text-slate text-sm mb-1">/month</span>
              </div>
              <p className="text-muted text-xs mb-6">Up to 25 beds · 1 property</p>
              <ul className="space-y-2.5 mb-7">
                {['Tenant management','Rent collection','Payment reminders','Expense tracking','Mobile PWA'].map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-charcoal">
                    <Check size={13} className="text-green shrink-0" />{f}
                  </li>
                ))}
              </ul>
              <button onClick={onShowAuth} className="w-full border border-border text-charcoal hover:bg-light font-semibold py-2.5 rounded-lg text-sm transition-all">Get started</button>
            </div>
            <div className="bg-midnight rounded-2xl p-7 relative overflow-hidden">
              <span className="absolute top-4 right-4 bg-green text-white text-xs font-bold px-2.5 py-0.5 rounded-full">POPULAR</span>
              <p className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-4">GROWTH</p>
              <div className="flex items-end gap-1 mb-1">
                <span className="text-3xl font-bold text-white">$19</span>
                <span className="text-white/50 text-sm mb-1">/month</span>
              </div>
              <p className="text-white/40 text-xs mb-6">Up to 100 beds · Multiple properties</p>
              <ul className="space-y-2.5 mb-7">
                {['Everything in Starter','Multiple properties','Advanced reports','Admin panel','Priority support'].map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-white">
                    <Check size={13} className="text-green shrink-0" />{f}
                  </li>
                ))}
              </ul>
              <button onClick={onShowAuth} className="w-full bg-green hover:bg-green-hover text-white font-semibold py-2.5 rounded-lg text-sm transition-all">Get started</button>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-midnight px-5 py-10">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <NivaLogo size={20} />
            <span className="font-semibold text-white text-sm">NivaOps</span>
          </div>
          <p className="text-white/30 text-xs">© 2025 NivaOps · Property management, simplified.</p>
          <button onClick={onShowAuth} className="text-white/50 hover:text-white text-sm transition-colors">Sign in →</button>
        </div>
      </footer>

    </div>
  );
}
