import { useState } from 'react';
import { signIn } from './services/authService';
import { NivaLogo, NivaWordmark } from './components/NivaLogo';
import {
  Home, Users, IndianRupee, BarChart3, Smartphone,
  Check, ArrowRight, Menu, X, Shield, Zap, MessageCircle, Loader2
} from 'lucide-react';

export default function LandingPage({ onShowAuth }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);
  const [demoError, setDemoError] = useState('');

  async function tryDemo() {
    setDemoLoading(true);
    setDemoError('');
    try {
      await signIn('demo@stayops.com', 'demo2026'); // demo account unchanged
    } catch {
      setDemoError('Demo unavailable right now. Try again in a moment.');
      setDemoLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white">

      {/* ── NAVBAR ── */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <NivaLogo size={28} />
            <NivaWordmark size="lg" />
          </div>
          {/* Desktop */}
          <div className="hidden sm:flex items-center gap-3">
            <button onClick={onShowAuth}
              className="text-slate hover:text-charcoal font-medium text-sm px-4 py-2 rounded-lg hover:bg-light transition-all duration-150">
              Sign in
            </button>
            <button onClick={onShowAuth}
              className="bg-green hover:bg-green-hover active:scale-[0.98] text-white font-semibold text-sm px-5 py-2.5 rounded-lg transition-all duration-150 flex items-center gap-1.5">
              Get started <ArrowRight size={14} />
            </button>
          </div>
          {/* Mobile hamburger */}
          <button className="sm:hidden p-2 text-slate hover:text-charcoal"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden bg-white border-t border-border px-4 pb-6 pt-4 space-y-3">
            <button onClick={onShowAuth}
              className="w-full text-center text-charcoal font-semibold py-3 rounded-lg border border-border hover:bg-light transition-colors">
              Sign in
            </button>
            <button onClick={onShowAuth}
              className="w-full text-center bg-green hover:bg-green-hover text-white font-semibold py-3 rounded-lg transition-all">
              Get started free
            </button>
          </div>
        )}
      </nav>

      {/* ── HERO ── */}
      <section className="bg-white pt-20 pb-24 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-green-light text-green border border-green/20 rounded-full text-xs font-semibold px-4 py-1.5 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-green inline-block" />
            Built for Indian PG &amp; hostel operators
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-bold text-charcoal tracking-tight leading-[1.1] mb-6 max-w-3xl mx-auto">
            The operating system<br className="hidden sm:block" /> for rental properties.
          </h1>
          <p className="text-lg sm:text-xl text-slate max-w-xl mx-auto mb-10 leading-relaxed">
            Manage beds, collect rent, track tenants, and run your property — from your phone.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
            <button onClick={tryDemo} disabled={demoLoading}
              className="w-full sm:w-auto bg-green hover:bg-green-hover active:scale-[0.98] text-white font-semibold px-8 py-3.5 rounded-lg text-base transition-all duration-150 flex items-center justify-center gap-2 disabled:opacity-60">
              {demoLoading ? <Loader2 size={16} className="animate-spin" /> : null}
              Start free today <ArrowRight size={16} />
            </button>
            <button onClick={onShowAuth}
              className="w-full sm:w-auto bg-white hover:bg-light border border-border text-charcoal font-semibold px-8 py-3.5 rounded-lg text-base transition-all duration-150">
              Sign in
            </button>
          </div>
          {demoError && <p className="text-error text-sm mb-4">{demoError}</p>}
          <p className="text-muted text-sm font-medium tracking-wide">
            50+ operators · 2,000+ beds managed · ₹40L+ rent collected
          </p>
        </div>
      </section>

      {/* ── PROBLEM ── */}
      <section className="bg-light py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-charcoal tracking-tight mb-4">
              Most PG operators still run<br />on WhatsApp and notebooks.
            </h2>
            <p className="text-slate text-lg">That was fine for 10 beds. Not for 50.</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-5">
            {[
              { icon: <MessageCircle size={20} className="text-error" />, title: 'Chasing rent manually', desc: 'Every month, hours spent sending individual reminders. No record. No system.' },
              { icon: <Home size={20} className="text-warning" />, title: 'No view of occupancy', desc: "Which beds are vacant? Who's leaving next month? Nobody knows until it's too late." },
              { icon: <BarChart3 size={20} className="text-error" />, title: 'Expenses are guesswork', desc: 'No clear income vs expense picture. No idea if the property is actually profitable.' },
            ].map((p, i) => (
              <div key={i} className="bg-white rounded-xl border border-border p-6 shadow-sm">
                <div className="w-10 h-10 rounded-lg bg-light flex items-center justify-center mb-4">{p.icon}</div>
                <h3 className="font-semibold text-charcoal mb-2">{p.title}</h3>
                <p className="text-slate text-sm leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WORKFLOWS ── */}
      <section className="bg-white py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-green text-xs font-semibold uppercase tracking-widest mb-3">WHAT NIVAOPS DOES</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-charcoal tracking-tight">
              One system. Everything your property needs.
            </h2>
          </div>
          <div className="space-y-20">
            {[
              { icon: <Home size={24} className="text-green" />, title: 'Run your hostel from one place', desc: 'Total revenue, occupancy rate, active tenants, pending payments — visible the moment you open NivaOps.', flip: false },
              { icon: <Users size={24} className="text-green" />, title: "Know exactly who's in every bed", desc: 'See occupied, vacant, and available beds at a glance. Move tenants, update rooms, track joining dates.', flip: true },
              { icon: <IndianRupee size={24} className="text-green" />, title: 'Collect rent without the chase', desc: 'Send UPI payment links over WhatsApp in one tap. Track paid, pending, and overdue automatically.', flip: false },
              { icon: <BarChart3 size={24} className="text-green" />, title: 'Understand your money', desc: 'Track every expense. See monthly P&L. Know if your property is growing or bleeding.', flip: true },
              { icon: <Smartphone size={24} className="text-green" />, title: 'Works from your pocket', desc: 'Install NivaOps like a native app on any phone. Android or iPhone. No app store needed.', flip: false },
            ].map((w, i) => (
              <div key={i} className={`flex flex-col ${w.flip ? 'sm:flex-row-reverse' : 'sm:flex-row'} gap-12 items-center`}>
                <div className="flex-1">
                  <div className="w-12 h-12 rounded-xl bg-green-light flex items-center justify-center mb-5">{w.icon}</div>
                  <h3 className="text-2xl font-bold text-charcoal mb-3 tracking-tight">{w.title}</h3>
                  <p className="text-slate text-base leading-relaxed max-w-sm">{w.desc}</p>
                </div>
                <div className="flex-1 bg-light rounded-2xl border border-border h-56 flex items-center justify-center">
                  <span className="text-muted text-sm">App preview</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRUST ── */}
      <section className="bg-light py-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto grid sm:grid-cols-3 gap-5">
          {[
            { icon: <Zap size={20} className="text-green" />, title: 'Built from real operations', desc: 'Born inside StayB hostel. Every feature comes from a real operator problem.' },
            { icon: <IndianRupee size={20} className="text-green" />, title: 'Designed for Indian workflows', desc: 'UPI payments. WhatsApp reminders. ₹-denominated reporting. Built for India.' },
            { icon: <Shield size={20} className="text-green" />, title: 'Priced for the market', desc: '₹799/month. Not ₹10,899. Tools that operators can actually afford to use.' },
          ].map((t, i) => (
            <div key={i} className="bg-white rounded-xl border border-border p-6 shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-green-light flex items-center justify-center mb-4">{t.icon}</div>
              <h3 className="font-semibold text-charcoal mb-2">{t.title}</h3>
              <p className="text-slate text-sm leading-relaxed">{t.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES GRID ── */}
      <section className="bg-white py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-charcoal tracking-tight mb-3">Everything your property needs.</h2>
            <p className="text-slate text-lg">Organized around how you actually work.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { title: 'Operations', items: ['Bed & room management','Tenant profiles & history','Occupancy tracking','Check-in / check-out'] },
              { title: 'Finance', items: ['Rent collection tracking','Expense management','Income vs expense P&L','Deposit tracking'] },
              { title: 'Communication', items: ['WhatsApp rent reminders','UPI payment links','Automated follow-ups','Tenant notifications'] },
              { title: 'Intelligence', items: ['Occupancy rate trends','Revenue by month','Overdue payment alerts','Property performance'] },
            ].map((col, i) => (
              <div key={i} className="bg-light rounded-xl border border-border p-5">
                <h4 className="font-semibold text-charcoal text-sm mb-4">{col.title}</h4>
                <ul className="space-y-3">
                  {col.items.map((item, j) => (
                    <li key={j} className="flex items-start gap-2.5 text-sm text-slate">
                      <Check size={14} className="text-green mt-0.5 shrink-0" />{item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section className="bg-light py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-charcoal tracking-tight mb-3">Simple, honest pricing.</h2>
            <p className="text-slate text-lg mb-2">5–6× cheaper than alternatives. No lock-in.</p>
            <p className="text-muted text-sm">Others charge ₹4,599–₹10,899/month. We charge ₹799.</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-5 max-w-2xl mx-auto">
            {/* Starter */}
            <div className="bg-white rounded-2xl border border-border p-8 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-widest text-slate mb-5">STARTER</p>
              <div className="flex items-end gap-1 mb-1">
                <span className="text-4xl font-bold text-charcoal">₹799</span>
                <span className="text-slate text-sm mb-1.5">/month</span>
              </div>
              <p className="text-slate text-sm mb-6">Up to 25 beds · 1 property</p>
              <ul className="space-y-3 mb-8">
                {['Tenant management','Rent collection','WhatsApp reminders','Expense tracking','Mobile PWA'].map((f,i) => (
                  <li key={i} className="flex items-center gap-2.5 text-sm text-charcoal">
                    <Check size={14} className="text-green shrink-0" />{f}
                  </li>
                ))}
              </ul>
              <button onClick={onShowAuth}
                className="w-full bg-white hover:bg-light border border-border text-charcoal font-semibold py-3 rounded-lg transition-all duration-150">
                Get started
              </button>
            </div>
            {/* Growth/Pro */}
            <div className="bg-midnight rounded-2xl p-8 shadow-xl relative overflow-hidden">
              <span className="absolute top-5 right-5 bg-green text-white text-xs font-bold px-3 py-1 rounded-full">POPULAR</span>
              <p className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-5">GROWTH</p>
              <div className="flex items-end gap-1 mb-1">
                <span className="text-4xl font-bold text-white">₹1,499</span>
                <span className="text-white/50 text-sm mb-1.5">/month</span>
              </div>
              <p className="text-white/60 text-sm mb-6">Up to 100 beds · Multiple properties</p>
              <ul className="space-y-3 mb-8">
                {['Everything in Starter','Multiple properties','Advanced reports','Admin panel access','Priority support'].map((f,i) => (
                  <li key={i} className="flex items-center gap-2.5 text-sm text-white">
                    <Check size={14} className="text-green shrink-0" />{f}
                  </li>
                ))}
              </ul>
              <button onClick={onShowAuth}
                className="w-full bg-green hover:bg-green-hover text-white font-semibold py-3 rounded-lg transition-all duration-150">
                Get started
              </button>
            </div>
          </div>
          <p className="text-center text-muted text-sm mt-6">
            More than 100 beds?{' '}
            <a href="mailto:hello@nivaops.com" className="text-green font-medium cursor-pointer hover:underline underline-offset-4">Talk to us</a>
            {' '}for a custom plan.
          </p>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="bg-midnight py-24 px-4 sm:px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4">
            Ready to run your property smarter?
          </h2>
          <p className="text-white/60 text-lg mb-10">
            Join operators across India who've moved from notebooks to NivaOps.
          </p>
          <button onClick={onShowAuth}
            className="bg-green hover:bg-green-hover active:scale-[0.98] text-white font-semibold px-10 py-4 rounded-xl text-lg transition-all duration-150 inline-flex items-center gap-2 mx-auto">
            Get started free <ArrowRight size={18} />
          </button>
          <p className="text-white/30 text-sm mt-5">No credit card required · Setup in 3 minutes</p>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-midnight border-t border-white/10 pt-16 pb-8 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between gap-10 mb-12">
            <div className="max-w-xs">
              <div className="flex items-center gap-2.5 mb-4">
                <NivaLogo size={24} />
                <span className="font-bold text-white text-base">NivaOps</span>
              </div>
              <p className="text-white/40 text-sm leading-relaxed">
                Run properties smarter. Delight residents. Grow with confidence.
              </p>
            </div>
            <div className="flex gap-12 sm:gap-16 flex-wrap">
              {[
                { title: 'Product', links: ['Features','Pricing','Demo'] },
                { title: 'Company', links: ['About','Contact','Blog'] },
                { title: 'Legal', links: ['Privacy Policy','Terms'] },
              ].map((col, i) => (
                <div key={i}>
                  <p className="text-white/30 text-xs font-semibold uppercase tracking-widest mb-4">{col.title}</p>
                  <ul className="space-y-3">
                    {col.links.map((l, j) => (
                      <li key={j}><a href="#" className="text-white/60 hover:text-white text-sm transition-colors">{l}</a></li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
            <p className="text-white/30 text-sm">© 2025 NivaOps. Built for PG operators in India.</p>
            <p className="text-white/30 text-sm">nivaops.com</p>
          </div>
        </div>
      </footer>

    </div>
  );
}
