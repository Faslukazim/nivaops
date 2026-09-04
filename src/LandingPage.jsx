import { useState } from 'react';
import { NivaLogo, NivaWordmark } from './components/NivaLogo';
import {
  ArrowRight,
  ArrowUpRight,
  BedDouble,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock,
  Loader2,
  Menu,
  MessageCircle,
  ShieldCheck,
  Smartphone,
  Sparkles,
  TrendingUp,
  UserCheck,
  X,
  Zap,
} from 'lucide-react';

const WHATSAPP_NUMBER = '919633310117';
const BOOK_DEMO_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  "Hi, I saw NivaOps and want to try it for my PG / hostel."
)}`;

function trackEvent(name, params = {}) {
  try {
    if (typeof window !== 'undefined' && window.trackMetaEvent) {
      window.trackMetaEvent(name, params);
    }
  } catch (err) {
    console.warn('Meta event error', err);
  }
}

function scrollTo(id) {
  document.getElementById(id)?.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  });
}

// ─── Hero Mobile Phone Mockup Component ──────────────────────────────────────
function PhoneMockup({ onTryDemo, demoLoading }) {
  const [samplePaid, setSamplePaid] = useState(false);

  return (
    <div className="relative mx-auto w-full max-w-[340px] sm:max-w-[370px]">
      {/* Outer Phone Hardware Frame */}
      <div className="relative overflow-hidden rounded-[38px] border-[7px] border-[#0F172A] bg-[#F8FAFC] shadow-[0_25px_60px_-15px_rgba(15,23,42,0.25)] ring-1 ring-black/5">
        
        {/* Dynamic Island / Speaker Notch */}
        <div className="absolute left-1/2 top-2.5 z-30 h-4 w-24 -translate-x-1/2 rounded-full bg-[#0F172A]" />

        {/* Status Bar */}
        <div className="relative flex items-center justify-between px-6 pt-3 pb-1 text-[11px] font-semibold text-slate-700 select-none">
          <span>9:41</span>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px]">5G</span>
            <div className="h-2.5 w-4 rounded-sm border border-slate-700/80 p-0.5">
              <div className="h-full w-full bg-slate-700 rounded-2xs" />
            </div>
          </div>
        </div>

        {/* In-App Header */}
        <div className="border-b border-border bg-white px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <NivaLogo size={22} />
              <div>
                <p className="text-xs font-bold text-ink leading-none">StayB Hostel</p>
                <p className="text-[10px] text-slate2 mt-0.5 leading-none">Main Building · 32 Beds</p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-leaf/10 px-2 py-0.5 text-[10px] font-bold text-leaf">
              <span className="h-1.5 w-1.5 rounded-full bg-leaf animate-pulse" />
              Live
            </span>
          </div>
        </div>

        {/* In-App Body */}
        <div className="p-3.5 space-y-3 bg-[#F8FAFC]">
          
          {/* Quick Stats Pill */}
          <div className="grid grid-cols-3 gap-1.5 rounded-xl border border-border bg-white p-2.5 text-center shadow-sm">
            <div>
              <p className="text-[10px] font-semibold uppercase text-slate2">Occupied</p>
              <p className="text-base font-bold text-ink tabular-nums">28</p>
            </div>
            <div className="border-x border-border">
              <p className="text-[10px] font-semibold uppercase text-slate2">Vacant</p>
              <p className="text-base font-bold text-amber tabular-nums">4 beds</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase text-slate2">Unpaid</p>
              <p className="text-base font-bold text-coral tabular-nums">₹15.5k</p>
            </div>
          </div>

          {/* Attention Required Card (The Hook) */}
          <div className="rounded-xl border border-border bg-white shadow-sm overflow-hidden">
            <div className="flex items-center justify-between border-b border-border bg-slate-50 px-3 py-2">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-coral animate-ping" />
                <p className="text-[11px] font-bold uppercase tracking-wider text-ink">Attention Required</p>
              </div>
              <span className="text-[10px] font-bold text-coral bg-coral/10 rounded px-1.5 py-0.5">2 Overdue</span>
            </div>

            {/* Tenant Row 1: Overdue */}
            <div className="p-3 border-b border-border">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs font-bold text-ink">Rahul Sharma</p>
                    <span className="rounded bg-coral/10 px-1 py-0.2 text-[9px] font-bold text-coral">3d overdue</span>
                  </div>
                  <p className="text-[11px] text-slate2 mt-0.5">Room 102 · Bed 2 · <span className="font-semibold text-ink">₹7,500</span></p>
                </div>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded transition-colors ${samplePaid ? 'bg-leaf/10 text-leaf' : 'bg-coral/10 text-coral'}`}>
                  {samplePaid ? 'Paid' : 'Unpaid'}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="mt-2.5 flex items-center gap-1.5">
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hi Rahul, rent reminder for Room 102. Monthly rent ₹7,500 is unpaid. Please pay via UPI: stayb@okicici")}`}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => trackEvent('Contact', { type: 'mockup_wa_sample' })}
                  className="flex-1 flex items-center justify-center gap-1 rounded-lg bg-[#25D366]/10 hover:bg-[#25D366]/20 py-1.5 text-[11px] font-bold text-[#15803D] transition-colors"
                >
                  <MessageCircle className="h-3.5 w-3.5 text-[#25D366]" />
                  <span>WhatsApp Reminder</span>
                </a>

                <button
                  type="button"
                  onClick={() => setSamplePaid(v => !v)}
                  className={`rounded-lg px-2.5 py-1.5 text-[11px] font-bold transition-all active:scale-95 ${
                    samplePaid
                      ? 'bg-leaf text-white shadow-sm'
                      : 'border border-border bg-white text-slate2 hover:text-ink hover:bg-slate-50'
                  }`}
                  title="Click to test marking paid"
                >
                  {samplePaid ? '✓ Marked Paid' : 'Mark Paid'}
                </button>
              </div>
            </div>

            {/* Tenant Row 2: Due Today */}
            <div className="p-3 bg-white">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs font-bold text-ink">Ananya Iyer</p>
                    <span className="rounded bg-amber/10 px-1 py-0.2 text-[9px] font-bold text-amber">Due today</span>
                  </div>
                  <p className="text-[11px] text-slate2 mt-0.5">Room 204 · Bed 1 · <span className="font-semibold text-ink">₹8,000</span></p>
                </div>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber/10 text-amber">
                  Due today
                </span>
              </div>
            </div>
          </div>

          {/* Quick demo teaser pill inside mockup */}
          <div className="rounded-xl border border-dashed border-leaf/40 bg-leaf/5 p-2.5 text-center">
            <p className="text-[11px] font-semibold text-leaf leading-snug">
              ⚡ Test with pre-loaded demo hostel data
            </p>
            <button
              type="button"
              onClick={onTryDemo}
              disabled={demoLoading}
              className="mt-1.5 inline-flex items-center gap-1.5 text-[11px] font-bold text-ink underline hover:text-leaf"
            >
              {demoLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3 text-leaf" />}
              Launch interactive app demo →
            </button>
          </div>
        </div>

        {/* Bottom Home Indicator */}
        <div className="flex justify-center pb-2 pt-1 bg-[#F8FAFC]">
          <div className="h-1 w-28 rounded-full bg-slate-400" />
        </div>
      </div>

      {/* Floating Badge Behind Mockup */}
      <div className="absolute -bottom-4 -left-4 sm:-left-6 rounded-2xl border border-border bg-white/95 p-3 shadow-xl backdrop-blur-md hidden sm:flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-leaf/10 text-leaf">
          <CheckCircle2 className="h-5 w-5" />
        </div>
        <div className="text-left">
          <p className="text-xs font-bold text-ink">UPI ID Auto-Attached</p>
          <p className="text-[11px] text-slate2">GPay / PhonePe / Paytm</p>
        </div>
      </div>

      <div className="absolute -top-3 -right-4 rounded-2xl border border-border bg-white/95 px-3 py-2 shadow-lg backdrop-blur-md hidden sm:flex items-center gap-2">
        <span className="flex h-2 w-2 rounded-full bg-leaf animate-pulse" />
        <p className="text-[11px] font-bold text-ink">Zero Excel Spreadsheets</p>
      </div>
    </div>
  );
}

// ─── Main Landing Page ───────────────────────────────────────────────────────
export default function LandingPage({ onShowAuth, onTryDemo, demoLoading }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);

  function handleWhatsAppClick(location = 'hero') {
    trackEvent('Lead', { source: location });
    window.open(BOOK_DEMO_URL, '_blank', 'noopener,noreferrer');
  }

  function handleDemoClick() {
    trackEvent('ViewContent', { content_name: 'Interactive Demo' });
    onTryDemo?.();
  }

  const faqs = [
    {
      q: 'Do my tenants need to download an app?',
      a: 'No, not at all. Tenants receive normal WhatsApp messages or SMS reminders with payment details and your UPI ID. Only you and your staff use the NivaOps app.',
    },
    {
      q: 'How does rent collection work with UPI?',
      a: 'You add your GPay, PhonePe, or BHIM UPI ID once in settings. When you tap "WhatsApp Reminder", NivaOps instantly composes a message with the tenant\'s exact name, room number, rent amount, and your UPI ID ready to send.',
    },
    {
      q: 'Will this work on my phone without downloading from the App Store?',
      a: 'Yes! NivaOps is a Progressive Web App (PWA). You open it in Chrome or Safari, tap "Add to Home Screen", and it functions just like an app—fast, lightweight, and saves offline without hogging storage.',
    },
    {
      q: 'Can my hostel manager or caretaker use it too?',
      a: 'Yes. On the Pro plan, you can add staff or manager logins. They can mark rent paid, assign rooms, and log complaints without seeing your personal profit margins or sensitive settings.',
    },
    {
      q: 'How do I get my rooms and tenants added?',
      a: 'You can add them yourself in 5 minutes, or simply send your tenant list/register to us on WhatsApp. Our team will set up your entire property for free during your trial!',
    },
  ];

  return (
    <div className="min-h-screen bg-white text-ink font-sans antialiased selection:bg-leaf/20">

      {/* ─── STICKY HEADER ───────────────────────────────────────────────────── */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-border bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-8">
          
          {/* Logo */}
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-2.5 text-left"
            aria-label="NivaOps home"
          >
            <NivaLogo size={26} />
            <NivaWordmark size="base" />
          </button>

          {/* Desktop Nav Links */}
          <nav className="hidden items-center gap-8 md:flex">
            <button type="button" onClick={() => scrollTo('features')} className="text-sm font-medium text-slate2 hover:text-ink transition-colors">
              Features
            </button>
            <button type="button" onClick={() => scrollTo('comparison')} className="text-sm font-medium text-slate2 hover:text-ink transition-colors">
              Why NivaOps
            </button>
            <button type="button" onClick={() => scrollTo('pricing')} className="text-sm font-medium text-slate2 hover:text-ink transition-colors">
              Pricing
            </button>
            <button type="button" onClick={() => scrollTo('faq')} className="text-sm font-medium text-slate2 hover:text-ink transition-colors">
              FAQ
            </button>
          </nav>

          {/* Header Action Buttons */}
          <div className="hidden items-center gap-3 sm:flex">
            <button
              type="button"
              onClick={onShowAuth}
              className="rounded-lg px-3 py-2 text-sm font-semibold text-slate2 hover:text-ink transition-colors"
            >
              Sign in
            </button>

            {onTryDemo && (
              <button
                type="button"
                onClick={handleDemoClick}
                disabled={demoLoading}
                className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-white px-3.5 py-2 text-xs font-bold text-ink hover:bg-mist transition-all active:scale-95"
              >
                {demoLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5 text-leaf" />}
                Live Demo
              </button>
            )}

            <button
              type="button"
              onClick={() => handleWhatsAppClick('header')}
              className="inline-flex items-center gap-1.5 rounded-xl bg-leaf px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-leaf/90 transition-all active:scale-95"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              Chat on WhatsApp
            </button>
          </div>

          {/* Mobile Hamburger */}
          <button
            type="button"
            aria-label="Toggle menu"
            className="rounded-lg p-2 text-slate2 md:hidden"
            onClick={() => setMobileMenuOpen(open => !open)}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Dropdown Nav */}
        {mobileMenuOpen && (
          <div className="border-t border-border bg-white px-5 py-4 md:hidden animate-fade-in shadow-xl">
            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={() => { setMobileMenuOpen(false); scrollTo('features'); }}
                className="py-2 text-left text-sm font-semibold text-slate2 hover:text-ink"
              >
                Features
              </button>
              <button
                type="button"
                onClick={() => { setMobileMenuOpen(false); scrollTo('comparison'); }}
                className="py-2 text-left text-sm font-semibold text-slate2 hover:text-ink"
              >
                Why NivaOps
              </button>
              <button
                type="button"
                onClick={() => { setMobileMenuOpen(false); scrollTo('pricing'); }}
                className="py-2 text-left text-sm font-semibold text-slate2 hover:text-ink"
              >
                Pricing (₹799/mo)
              </button>
              <button
                type="button"
                onClick={() => { setMobileMenuOpen(false); scrollTo('faq'); }}
                className="py-2 text-left text-sm font-semibold text-slate2 hover:text-ink"
              >
                FAQ
              </button>
              <hr className="border-border my-1" />
              <button
                type="button"
                onClick={() => { setMobileMenuOpen(false); handleDemoClick(); }}
                className="w-full flex items-center justify-center gap-2 rounded-xl border border-border bg-mist py-3 text-sm font-bold text-ink"
              >
                <Sparkles className="h-4 w-4 text-leaf" />
                Explore Live Demo
              </button>
              <button
                type="button"
                onClick={() => { setMobileMenuOpen(false); handleWhatsAppClick('mobile_menu'); }}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-leaf py-3 text-sm font-bold text-white shadow-md"
              >
                <MessageCircle className="h-4 w-4" />
                Get Started on WhatsApp
              </button>
              <button
                type="button"
                onClick={() => { setMobileMenuOpen(false); onShowAuth(); }}
                className="py-2 text-center text-xs font-semibold text-slate2"
              >
                Already have an account? <span className="text-ink underline">Sign in</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* ─── HERO SECTION ────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-28 pb-16 sm:pt-36 sm:pb-24">
        {/* Subtle Ambient Radial Glow */}
        <div
          className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full opacity-10 blur-3xl"
          style={{ background: 'radial-gradient(circle, #16A34A 0%, #111827 80%, transparent 100%)' }}
          aria-hidden="true"
        />

        <div className="mx-auto max-w-6xl px-4 sm:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
            
            {/* Left Column: Value Prop & CTAs */}
            <div className="text-center lg:text-left lg:col-span-7">
              
              {/* Badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-leaf/30 bg-leaf/10 px-3.5 py-1.5 text-xs font-bold text-leaf shadow-sm">
                <Zap className="h-3.5 w-3.5 fill-current" />
                Built for Indian PG & Hostel Owners
              </div>

              {/* Main Headline */}
              <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-ink sm:text-5xl lg:text-[54px] leading-[1.1]">
                Run your PG without the{' '}
                <span className="relative inline-block text-leaf">
                  rent-day headache.
                  <svg className="absolute -bottom-1 left-0 w-full text-leaf/30 h-2" viewBox="0 0 100 20" preserveAspectRatio="none">
                    <path d="M0 15 Q50 0 100 15" stroke="currentColor" strokeWidth="4" fill="none" />
                  </svg>
                </span>
              </h1>

              {/* Subheadline */}
              <p className="mt-5 text-base sm:text-lg text-slate2 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Who’s paid, who’s overdue, and which beds are free—in one glance. Send 1-tap WhatsApp rent reminders with your GPay/UPI ID.
              </p>

              {/* Primary Call to Actions */}
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4">
                <button
                  type="button"
                  onClick={() => handleWhatsAppClick('hero_cta')}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-xl bg-leaf px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-leaf/25 hover:bg-leaf/90 transition-all active:scale-95"
                >
                  <MessageCircle className="h-5 w-5 fill-current" />
                  Get Started on WhatsApp
                  <ArrowRight className="h-4 w-4" />
                </button>

                {onTryDemo && (
                  <button
                    type="button"
                    onClick={handleDemoClick}
                    disabled={demoLoading}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-white px-6 py-3.5 text-sm font-bold text-ink shadow-sm hover:bg-mist transition-all active:scale-95"
                  >
                    {demoLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4 text-leaf" />}
                    Explore Live Demo
                  </button>
                )}
              </div>

              {/* Trust Micro-Pills */}
              <div className="mt-7 flex flex-wrap items-center justify-center lg:justify-start gap-x-5 gap-y-2 text-xs font-semibold text-slate2">
                <span className="inline-flex items-center gap-1.5">
                  <Check className="h-4 w-4 text-leaf" /> No card required
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Check className="h-4 w-4 text-leaf" /> Free setup on WhatsApp
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Check className="h-4 w-4 text-leaf" /> Works on any Android/iPhone
                </span>
              </div>

              {/* Operational Reality Anchor */}
              <div className="mt-8 pt-6 border-t border-border flex items-center justify-center lg:justify-start gap-3 text-left">
                <div className="flex -space-x-2 overflow-hidden">
                  <div className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-slate-200 text-slate-600 font-bold text-[10px] flex items-center justify-center">SB</div>
                  <div className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-leaf/20 text-leaf font-bold text-[10px] flex items-center justify-center">BLR</div>
                  <div className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-amber/20 text-amber font-bold text-[10px] flex items-center justify-center">KL</div>
                </div>
                <p className="text-xs text-slate2">
                  Tested daily with real operators at <strong className="text-ink">StayB Hostels</strong> and properties across India.
                </p>
              </div>

            </div>

            {/* Right Column: Visual Proof (Phone Mockup) */}
            <div className="lg:col-span-5 flex justify-center">
              <PhoneMockup onTryDemo={handleDemoClick} demoLoading={demoLoading} />
            </div>

          </div>
        </div>
      </section>

      {/* ─── TRUST & STATS BAR ───────────────────────────────────────────────── */}
      <section className="border-y border-border bg-mist py-8">
        <div className="mx-auto max-w-6xl px-4 sm:px-8">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 text-center">
            <div className="p-3">
              <p className="text-2xl sm:text-3xl font-extrabold text-ink tabular-nums">1-Tap</p>
              <p className="text-xs font-medium text-slate2 mt-1">WhatsApp rent reminders</p>
            </div>
            <div className="p-3">
              <p className="text-2xl sm:text-3xl font-extrabold text-leaf tabular-nums">100%</p>
              <p className="text-xs font-medium text-slate2 mt-1">Direct to your bank/UPI</p>
            </div>
            <div className="p-3">
              <p className="text-2xl sm:text-3xl font-extrabold text-ink tabular-nums">0</p>
              <p className="text-xs font-medium text-slate2 mt-1">Messy Excel sheets</p>
            </div>
            <div className="p-3">
              <p className="text-2xl sm:text-3xl font-extrabold text-leaf tabular-nums">&lt; 5 min</p>
              <p className="text-xs font-medium text-slate2 mt-1">Setup time for your PG</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── BEFORE VS AFTER COMPARISON ──────────────────────────────────────── */}
      <section id="comparison" className="py-20 sm:py-28 bg-white">
        <div className="mx-auto max-w-5xl px-4 sm:px-8">
          
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-xs font-bold uppercase tracking-widest text-leaf">Why Operators Switch</p>
            <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-ink tracking-tight">
              Stop running your business on notebooks and memory.
            </h2>
            <p className="mt-3 text-sm text-slate2">
              See what changes the moment you move your hostel to NivaOps.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            
            {/* The Old Way */}
            <div className="rounded-2xl border border-coral/30 bg-coral/[0.03] p-6 sm:p-8">
              <div className="flex items-center gap-2 text-coral font-bold text-sm uppercase tracking-wider mb-4">
                <span className="h-2 w-2 rounded-full bg-coral" />
                The Old Way (Notebooks & WhatsApp)
              </div>
              <ul className="space-y-4 text-sm text-slate2">
                <li className="flex items-start gap-3">
                  <span className="text-coral font-bold shrink-0">✕</span>
                  <span><strong>Guessing who paid:</strong> Scrolling through 30 bank SMS and phone gallery screenshots every 5th of the month.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-coral font-bold shrink-0">✕</span>
                  <span><strong>Awkward follow-ups:</strong> Making uncomfortable phone calls or typing out "Bhaiya rent kab doge?" 40 times.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-coral font-bold shrink-0">✕</span>
                  <span><strong>Move-out deposit disputes:</strong> "I paid ₹10,000 deposit" vs "No you paid ₹5,000"—arguments with no signed record.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-coral font-bold shrink-0">✕</span>
                  <span><strong>Untracked vacancies:</strong> Beds sitting empty for weeks because you forgot which room had a free bed.</span>
                </li>
              </ul>
            </div>

            {/* With NivaOps */}
            <div className="rounded-2xl border border-leaf/40 bg-leaf/[0.03] p-6 sm:p-8 shadow-sm">
              <div className="flex items-center gap-2 text-leaf font-bold text-sm uppercase tracking-wider mb-4">
                <span className="h-2 w-2 rounded-full bg-leaf" />
                With NivaOps (Your PG in your pocket)
              </div>
              <ul className="space-y-4 text-sm text-ink">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-leaf shrink-0 mt-0.5" />
                  <span><strong>One-screen visibility:</strong> Paid (Green), Due Today (Amber), Overdue (Red). Know your total collections in 2 seconds.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-leaf shrink-0 mt-0.5" />
                  <span><strong>1-tap WhatsApp reminders:</strong> Pre-filled tenant name, room number, rent amount, and your UPI ID sent in one click.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-leaf shrink-0 mt-0.5" />
                  <span><strong>Clear deposit ledger:</strong> Deposits logged on join date, with clear return/forfeit settlements upon checkout.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-leaf shrink-0 mt-0.5" />
                  <span><strong>Live room & bed grid:</strong> See exactly which beds are occupied, vacant, or on notice period right on your phone.</span>
                </li>
              </ul>
            </div>

          </div>

          <div className="mt-8 text-center">
            <button
              type="button"
              onClick={() => handleWhatsAppClick('comparison_bottom')}
              className="inline-flex items-center gap-2 text-sm font-bold text-leaf hover:underline"
            >
              See how easy it is to switch → Talk to our team
            </button>
          </div>

        </div>
      </section>

      {/* ─── CORE FEATURES ───────────────────────────────────────────────────── */}
      <section id="features" className="py-20 sm:py-28 bg-mist border-y border-border">
        <div className="mx-auto max-w-6xl px-4 sm:px-8">
          
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-widest text-leaf">Core Features</p>
            <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-ink tracking-tight">
              Built around how you actually run your property.
            </h2>
            <p className="mt-3 text-sm text-slate2">
              Every feature solves an everyday task that currently wastes your time.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            
            {/* Feature 1 */}
            <div className="rounded-2xl border border-border bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-leaf/10 text-leaf mb-4">
                <MessageCircle className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-ink">1-Tap WhatsApp Reminders</h3>
              <p className="mt-2 text-xs sm:text-sm text-slate2 leading-relaxed">
                Tapping "Remind" opens WhatsApp with the exact tenant name, room number, amount due, and your GPay/UPI link. No manual copy-pasting.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="rounded-2xl border border-border bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-leaf/10 text-leaf mb-4">
                <BedDouble className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-ink">Bed-Level Occupancy Grid</h3>
              <p className="mt-2 text-xs sm:text-sm text-slate2 leading-relaxed">
                Organize rooms by floor (Ground, 1st, 2nd). See bed-level vacancy dots so you can place inquiries into available beds instantly.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="rounded-2xl border border-border bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-leaf/10 text-leaf mb-4">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-ink">Security Deposit Settlement</h3>
              <p className="mt-2 text-xs sm:text-sm text-slate2 leading-relaxed">
                Track held deposits, record move-out notice dates, and log deductions with explanations (e.g. food adjustments or painting repairs).
              </p>
            </div>

            {/* Feature 4 */}
            <div className="rounded-2xl border border-border bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-leaf/10 text-leaf mb-4">
                <UserCheck className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-ink">Day Guests with ID Camera</h3>
              <p className="mt-2 text-xs sm:text-sm text-slate2 leading-relaxed">
                Capture high-margin daily guests with day rate and total days. Snap and save their Aadhaar/ID photo directly from your phone camera.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="rounded-2xl border border-border bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-leaf/10 text-leaf mb-4">
                <TrendingUp className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-ink">Real Profit & Loss (P&L)</h3>
              <p className="mt-2 text-xs sm:text-sm text-slate2 leading-relaxed">
                Know what your hostel actually earned this month. Deducts building rent, electricity, cook salaries, and repairs from real collected income.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="rounded-2xl border border-border bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-leaf/10 text-leaf mb-4">
                <Smartphone className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-ink">Installs on Home Screen</h3>
              <p className="mt-2 text-xs sm:text-sm text-slate2 leading-relaxed">
                Works like a native app on iOS and Android. No App Store clutter, ultra-fast load times, and minimal mobile data usage.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ─── PRICING ─────────────────────────────────────────────────────────── */}
      <section id="pricing" className="py-20 sm:py-28 bg-white">
        <div className="mx-auto max-w-5xl px-4 sm:px-8">
          
          <div className="text-center max-w-xl mx-auto">
            <p className="text-xs font-bold uppercase tracking-widest text-leaf">Transparent Pricing</p>
            <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-ink tracking-tight">
              Less than the rent of half a bed.
            </h2>
            <p className="mt-3 text-sm text-slate2">
              No setup fees. No long-term lock-in. Cancel anytime.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 max-w-4xl mx-auto">
            
            {/* Starter Plan */}
            <div className="rounded-3xl border border-border bg-white p-8 flex flex-col justify-between shadow-sm">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate2">Starter</p>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl sm:text-5xl font-extrabold text-ink tabular-nums">₹799</span>
                  <span className="text-sm text-slate2 font-semibold">/month</span>
                </div>
                <p className="mt-2 text-xs text-slate2">Best for single-building hostels & PGs.</p>

                <hr className="my-6 border-border" />

                <ul className="space-y-3 text-xs sm:text-sm text-ink">
                  <li className="flex items-center gap-2.5">
                    <Check className="h-4 w-4 text-leaf shrink-0" />
                    <span>Up to 25 beds · 1 property</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="h-4 w-4 text-leaf shrink-0" />
                    <span>Unlimited tenant & bed tracking</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="h-4 w-4 text-leaf shrink-0" />
                    <span>1-Tap WhatsApp reminders with UPI</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="h-4 w-4 text-leaf shrink-0" />
                    <span>Security deposits & expense tracking</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="h-4 w-4 text-leaf shrink-0" />
                    <span>Free WhatsApp property setup assistance</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8">
                <button
                  type="button"
                  onClick={() => handleWhatsAppClick('pricing_starter')}
                  className="w-full rounded-xl border border-border bg-mist hover:bg-border py-3 text-sm font-bold text-ink transition-all active:scale-95"
                >
                  Start 14-Day Free Trial
                </button>
              </div>
            </div>

            {/* Pro Plan */}
            <div className="relative rounded-3xl bg-[#0F172A] text-white p-8 flex flex-col justify-between shadow-xl ring-2 ring-leaf">
              <span className="absolute -top-3 right-8 rounded-full bg-leaf px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-white shadow-md">
                Most Popular
              </span>

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-white/50">Pro</p>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl sm:text-5xl font-extrabold text-white tabular-nums">₹1,499</span>
                  <span className="text-sm text-white/50 font-semibold">/month</span>
                </div>
                <p className="mt-2 text-xs text-white/60">For growing operators and multi-branch PGs.</p>

                <hr className="my-6 border-white/10" />

                <ul className="space-y-3 text-xs sm:text-sm text-white/90">
                  <li className="flex items-center gap-2.5">
                    <Check className="h-4 w-4 text-leaf shrink-0" />
                    <span><strong>Up to 100 beds</strong> · Multiple properties</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="h-4 w-4 text-leaf shrink-0" />
                    <span>Full Profit & Loss (P&L) & Cashflow ledger</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="h-4 w-4 text-leaf shrink-0" />
                    <span>Staff logins (Manager & Caretaker access)</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="h-4 w-4 text-leaf shrink-0" />
                    <span>Razorpay instant payment link integration</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="h-4 w-4 text-leaf shrink-0" />
                    <span>Priority WhatsApp support & data import</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8">
                <button
                  type="button"
                  onClick={() => handleWhatsAppClick('pricing_pro')}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-leaf hover:bg-leaf/90 py-3 text-sm font-bold text-white shadow-md transition-all active:scale-95"
                >
                  <MessageCircle className="h-4 w-4" />
                  Get Pro via WhatsApp
                </button>
              </div>
            </div>

          </div>

          {/* Concierge Setup Callout */}
          <div className="mt-10 rounded-2xl bg-mist border border-border p-6 text-center max-w-2xl mx-auto">
            <p className="text-sm font-bold text-ink">🤝 Free WhatsApp Concierge Setup</p>
            <p className="text-xs text-slate2 mt-1">
              Too busy to enter all your rooms and beds? Just send us a photo of your register or Excel file on WhatsApp. We'll set up your property for you before you start.
            </p>
          </div>

        </div>
      </section>

      {/* ─── FAQ SECTION ─────────────────────────────────────────────────────── */}
      <section id="faq" className="py-20 sm:py-28 bg-mist border-t border-border">
        <div className="mx-auto max-w-3xl px-4 sm:px-8">
          
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-leaf">Questions & Answers</p>
            <h2 className="mt-3 text-3xl font-extrabold text-ink tracking-tight">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="mt-10 space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = activeFaq === index;
              return (
                <div key={index} className="rounded-xl border border-border bg-white overflow-hidden shadow-sm">
                  <button
                    type="button"
                    onClick={() => setActiveFaq(isOpen ? null : index)}
                    className="w-full flex items-center justify-between p-4 sm:p-5 text-left font-bold text-sm text-ink hover:text-leaf transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`h-4 w-4 text-slate2 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-5 sm:px-5 text-xs sm:text-sm text-slate2 leading-relaxed border-t border-border pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ─── FINAL CTA SECTION ───────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#0F172A] py-20 sm:py-28 text-center text-white">
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-15 blur-3xl"
          style={{ background: 'radial-gradient(circle, #16A34A 0%, transparent 70%)' }}
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-2xl px-4 sm:px-8">
          <p className="text-xs font-bold uppercase tracking-widest text-leaf">Start Today</p>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight">
            Stop losing rent. Start collecting on time.
          </h2>
          <p className="mt-4 text-sm sm:text-base text-white/60 max-w-lg mx-auto leading-relaxed">
            Join operators across India who manage their PG in under 5 minutes a day.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => handleWhatsAppClick('final_cta')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-leaf px-7 py-3.5 text-sm font-bold text-white shadow-lg hover:bg-leaf/90 transition-all active:scale-95"
            >
              <MessageCircle className="h-5 w-5" />
              Chat on WhatsApp to Start
            </button>

            {onTryDemo && (
              <button
                type="button"
                onClick={handleDemoClick}
                disabled={demoLoading}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 hover:bg-white/20 px-6 py-3.5 text-sm font-bold text-white transition-all active:scale-95"
              >
                {demoLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4 text-leaf" />}
                Explore Live Demo
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ─── FOOTER ──────────────────────────────────────────────────────────── */}
      <footer className="border-t border-border bg-[#0B0F19] py-8 text-white/60 text-xs">
        <div className="mx-auto flex max-w-6xl flex-col sm:flex-row items-center justify-between gap-4 px-4 sm:px-8">
          <div className="flex items-center gap-2">
            <NivaLogo size={20} />
            <span className="font-bold text-white">NivaOps</span>
            <span className="text-white/40">· The PG Management System</span>
          </div>

          <p className="text-center sm:text-right text-white/40">
            © {new Date().getFullYear()} NivaOps. Built for Indian PG & Hostel Operators.
          </p>
        </div>
      </footer>

      {/* ─── FLOATING MOBILE QUICK ACTION BAR ─────────────────────────────────── */}
      <div className="fixed bottom-0 inset-x-0 z-40 sm:hidden border-t border-border bg-white/95 backdrop-blur-md p-2.5 px-4 flex items-center gap-2 shadow-2xl">
        <button
          type="button"
          onClick={() => handleWhatsAppClick('mobile_sticky_bar')}
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-leaf py-3 text-xs font-bold text-white shadow-md active:scale-95 transition-all"
        >
          <MessageCircle className="h-4 w-4" />
          Chat on WhatsApp
        </button>
        {onTryDemo && (
          <button
            type="button"
            onClick={handleDemoClick}
            disabled={demoLoading}
            className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-border bg-mist py-3 text-xs font-bold text-ink active:scale-95 transition-all"
          >
            {demoLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5 text-leaf" />}
            Live Demo
          </button>
        )}
      </div>

    </div>
  );
}