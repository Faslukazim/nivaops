import { useState } from 'react';
import { NivaLogo, NivaWordmark } from './components/NivaLogo';
import {
  ArrowRight,
  BedDouble,
  Check,
  CheckCircle2,
  ChevronDown,
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

// ─── Slender Apple-Style Flagship iPhone Mockup ──────────────────────────────
// Authentic 19.5:9 smartphone silhouette (eliminates wide/squat "tablet/tab" look)
function PhoneMockup({ onTryDemo, demoLoading }) {
  const [samplePaid, setSamplePaid] = useState(false);

  return (
    <div className="relative mx-auto flex justify-center py-2">
      {/* Soft Apple ambient background glow */}
      <div className="absolute inset-0 max-w-[320px] mx-auto bg-gradient-to-b from-leaf/10 to-transparent blur-3xl opacity-60 pointer-events-none" />

      {/* Flagship iPhone Silhouette (Slender 1:2.05 aspect ratio) */}
      <div className="relative w-[285px] sm:w-[310px] h-[590px] sm:h-[625px] rounded-[52px] border-[3.5px] border-[#2A2A2E] bg-[#FBFBFC] shadow-[0_25px_70px_-15px_rgba(0,0,0,0.18)] ring-1 ring-black/10 flex flex-col overflow-hidden select-none">
        
        {/* Apple Dynamic Island */}
        <div className="absolute top-2.5 left-1/2 -translate-x-1/2 z-30 h-[22px] w-[88px] rounded-full bg-black flex items-center justify-between px-2.5">
          <div className="h-2.5 w-2.5 rounded-full bg-[#111113]" />
          <div className="h-2 w-2 rounded-full bg-[#16A34A] animate-pulse" />
        </div>

        {/* iOS Status Bar */}
        <div className="relative z-20 flex items-center justify-between px-7 pt-3.5 pb-1 text-[11px] font-semibold text-[#1D1D1F]">
          <span>9:41</span>
          <div className="flex items-center gap-1.5 text-[10px]">
            <span>5G</span>
            <div className="w-4 h-2 rounded-[2px] border border-[#1D1D1F] p-0.5">
              <div className="h-full w-full bg-[#1D1D1F] rounded-2xs" />
            </div>
          </div>
        </div>

        {/* In-App Screen Content */}
        <div className="flex-1 flex flex-col px-3.5 pt-2 pb-2 overflow-hidden">
          
          {/* Hostel Header */}
          <div className="rounded-xl bg-white border border-black/[0.06] p-3 shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <NivaLogo size={20} />
              <div>
                <p className="text-xs font-bold text-[#1D1D1F] leading-tight">StayB Hostel</p>
                <p className="text-[10px] text-[#86868B] leading-none mt-0.5">32 Beds · Main Branch</p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-leaf/10 px-2 py-0.5 text-[9px] font-bold text-leaf">
              <span className="h-1.5 w-1.5 rounded-full bg-leaf animate-pulse" />
              Live
            </span>
          </div>

          {/* Quick Stats Pill */}
          <div className="grid grid-cols-3 gap-1 mt-2.5 rounded-xl border border-black/[0.06] bg-white p-2 text-center shadow-xs">
            <div>
              <p className="text-[9px] font-semibold uppercase text-[#86868B]">Occupied</p>
              <p className="text-sm font-bold text-[#1D1D1F] tabular-nums">28</p>
            </div>
            <div className="border-x border-black/[0.06]">
              <p className="text-[9px] font-semibold uppercase text-[#86868B]">Vacant</p>
              <p className="text-sm font-bold text-[#D97706] tabular-nums">4 beds</p>
            </div>
            <div>
              <p className="text-[9px] font-semibold uppercase text-[#86868B]">Unpaid</p>
              <p className="text-sm font-bold text-[#E5484D] tabular-nums">₹15.5k</p>
            </div>
          </div>

          {/* Attention Required Card */}
          <div className="mt-2.5 rounded-xl border border-black/[0.06] bg-white shadow-xs overflow-hidden">
            <div className="flex items-center justify-between bg-red-50/60 border-b border-red-100/80 px-3 py-1.5">
              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[#E5484D] animate-ping" />
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#1D1D1F]">Attention Required</p>
              </div>
              <span className="text-[9px] font-bold text-[#E5484D] bg-white rounded px-1.5 py-0.5 border border-red-200">
                2 Overdue
              </span>
            </div>

            <div className="p-3">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-bold text-[#1D1D1F]">Rahul Sharma</p>
                  <p className="text-[10px] text-[#86868B] mt-0.5">Room 102 · Bed 2 · <span className="font-semibold text-[#1D1D1F]">₹7,500</span></p>
                </div>
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded transition-colors ${
                  samplePaid ? 'bg-leaf/10 text-leaf' : 'bg-red-50 text-[#E5484D]'
                }`}>
                  {samplePaid ? 'Paid' : '3d overdue'}
                </span>
              </div>

              {/* 1-Tap WhatsApp Button */}
              <div className="mt-2.5 flex items-center gap-1.5">
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hi Rahul, rent reminder for Room 102. Monthly rent ₹7,500 is unpaid. Please pay via UPI: stayb@okicici")}`}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => trackEvent('Contact', { type: 'mockup_wa_sample' })}
                  className="flex-1 flex items-center justify-center gap-1 rounded-lg bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/30 py-1.5 text-[10px] font-bold text-[#15803D] transition-all"
                >
                  <MessageCircle className="h-3.5 w-3.5 text-[#25D366]" />
                  <span>WhatsApp Reminder</span>
                </a>

                <button
                  type="button"
                  onClick={() => setSamplePaid(v => !v)}
                  className={`rounded-lg px-2 py-1.5 text-[10px] font-bold transition-all ${
                    samplePaid
                      ? 'bg-leaf text-white'
                      : 'bg-[#F5F5F7] text-[#1D1D1F] border border-black/[0.08]'
                  }`}
                >
                  {samplePaid ? '✓' : 'Mark'}
                </button>
              </div>
            </div>
          </div>

          {/* Vacant Bed Quick Grid */}
          <div className="mt-2.5 rounded-xl border border-black/[0.06] bg-white p-2.5 shadow-xs">
            <div className="flex items-center justify-between mb-1.5">
              <p className="text-[10px] font-bold text-[#86868B] uppercase tracking-wider">Vacant Beds (4)</p>
              <span className="text-[9px] font-semibold text-leaf">Ready to fill</span>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              <div className="rounded-lg bg-[#F5F5F7] p-1.5 border border-black/[0.04]">
                <p className="text-[9px] text-[#86868B]">Room 101</p>
                <p className="text-[11px] font-bold text-[#1D1D1F]">Bed 2 · ₹7.5k</p>
              </div>
              <div className="rounded-lg bg-[#F5F5F7] p-1.5 border border-black/[0.04]">
                <p className="text-[9px] text-[#86868B]">Room 104</p>
                <p className="text-[11px] font-bold text-[#1D1D1F]">Bed 1 · ₹8.0k</p>
              </div>
            </div>
          </div>

          {/* Test Live Demo Bar */}
          {onTryDemo && (
            <div className="mt-auto pt-2">
              <button
                type="button"
                onClick={onTryDemo}
                disabled={demoLoading}
                className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-[#1D1D1F] text-white py-2 text-[11px] font-semibold hover:bg-black transition-all active:scale-95 shadow-sm"
              >
                {demoLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3 text-leaf" />}
                <span>Try interactive demo live</span>
              </button>
            </div>
          )}

        </div>

        {/* iOS Home Indicator Bar */}
        <div className="h-4 flex items-center justify-center shrink-0">
          <div className="h-1 w-28 rounded-full bg-black/20" />
        </div>

      </div>
    </div>
  );
}

export default function LandingPage({ onShowAuth, onTryDemo, demoLoading }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);

  function handleWhatsAppClick(source) {
    trackEvent('Lead', { source, destination: 'WhatsApp' });
    window.open(BOOK_DEMO_URL, '_blank');
  }

  function handleDemoClick() {
    trackEvent('ViewContent', { content_name: 'Interactive Demo' });
    onTryDemo?.();
  }

  const faqs = [
    {
      q: 'Do my tenants need to download any app?',
      a: 'No. Tenants receive clear WhatsApp reminders with your name, room number, amount due, and direct UPI link. They do not need to install anything or create an account.',
    },
    {
      q: 'How does the UPI payment work? Do you take a commission?',
      a: 'Zero commission. The reminder contains your own GPay, PhonePe, or BHIM UPI ID. When tenants pay, the money transfers directly from their bank to yours instantly.',
    },
    {
      q: 'Will this work on my phone without downloading from the App Store?',
      a: 'Yes. NivaOps is a Progressive Web App (PWA). You can install it straight from Safari or Chrome to your home screen with one tap. It opens full screen with zero lag.',
    },
    {
      q: 'Can my hostel manager or caretaker use it too?',
      a: 'Yes. On the Pro plan, you can invite caretakers or managers with restricted access so they can mark rent paid and assign rooms without seeing your overall financials.',
    },
    {
      q: 'How do I get my rooms and tenants added?',
      a: 'You can add them yourself in 5 minutes, or simply send a photo of your register or Excel file on WhatsApp. Our concierge team will set up your entire property for free.',
    },
  ];

  return (
    <div className="min-h-screen bg-white text-[#1D1D1F] font-sans antialiased selection:bg-leaf/20">

      {/* ─── STICKY HEADER (Apple Frosted Glass) ─────────────────────────────── */}
      <header
        className="fixed inset-x-0 top-0 z-50 border-b border-black/[0.06] bg-white/80 backdrop-blur-xl transition-all"
        style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
      >
        <div className="mx-auto flex h-14 sm:h-16 max-w-6xl items-center justify-between px-4 sm:px-8">
          
          {/* Logo */}
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-2.5 text-left"
            aria-label="NivaOps home"
          >
            <NivaLogo size={24} />
            <NivaWordmark size="base" />
          </button>

          {/* Desktop Nav Links */}
          <nav className="hidden items-center gap-8 md:flex">
            <button type="button" onClick={() => scrollTo('features')} className="text-[13px] font-medium text-[#1D1D1F]/70 hover:text-[#1D1D1F] transition-colors">
              Features
            </button>
            <button type="button" onClick={() => scrollTo('comparison')} className="text-[13px] font-medium text-[#1D1D1F]/70 hover:text-[#1D1D1F] transition-colors">
              Why NivaOps
            </button>
            <button type="button" onClick={() => scrollTo('pricing')} className="text-[13px] font-medium text-[#1D1D1F]/70 hover:text-[#1D1D1F] transition-colors">
              Pricing
            </button>
            <button type="button" onClick={() => scrollTo('faq')} className="text-[13px] font-medium text-[#1D1D1F]/70 hover:text-[#1D1D1F] transition-colors">
              FAQ
            </button>
          </nav>

          {/* Header Action Buttons (Apple Pill Style) */}
          <div className="hidden items-center gap-3 sm:flex">
            <button
              type="button"
              onClick={onShowAuth}
              className="px-3 py-1.5 text-xs font-semibold text-[#86868B] hover:text-[#1D1D1F] transition-colors"
            >
              Sign in
            </button>

            {onTryDemo && (
              <button
                type="button"
                onClick={handleDemoClick}
                disabled={demoLoading}
                className="inline-flex items-center gap-1.5 rounded-full border border-black/[0.1] bg-white px-4 py-1.5 text-xs font-semibold text-[#1D1D1F] hover:bg-[#F5F5F7] transition-all active:scale-95"
              >
                {demoLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3 text-leaf" />}
                Live Demo
              </button>
            )}

            <button
              type="button"
              onClick={() => handleWhatsAppClick('header')}
              className="inline-flex items-center gap-1.5 rounded-full bg-[#1D1D1F] hover:bg-black px-4 py-1.5 text-xs font-semibold text-white shadow-xs transition-all active:scale-95"
            >
              <MessageCircle className="h-3.5 w-3.5 text-leaf" />
              Chat on WhatsApp
            </button>
          </div>

          {/* Mobile Hamburger */}
          <button
            type="button"
            aria-label="Toggle menu"
            className="rounded-full p-2 text-[#1D1D1F]/70 hover:bg-[#F5F5F7] md:hidden transition-colors"
            onClick={() => setMobileMenuOpen(open => !open)}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Dropdown Nav */}
        {mobileMenuOpen && (
          <div className="border-t border-black/[0.06] bg-white px-5 py-4 md:hidden animate-fade-in shadow-xl">
            <div className="flex flex-col gap-2.5">
              <button
                type="button"
                onClick={() => { setMobileMenuOpen(false); scrollTo('features'); }}
                className="py-2 text-left text-sm font-semibold text-[#1D1D1F]/70 hover:text-[#1D1D1F]"
              >
                Features
              </button>
              <button
                type="button"
                onClick={() => { setMobileMenuOpen(false); scrollTo('comparison'); }}
                className="py-2 text-left text-sm font-semibold text-[#1D1D1F]/70 hover:text-[#1D1D1F]"
              >
                Why NivaOps
              </button>
              <button
                type="button"
                onClick={() => { setMobileMenuOpen(false); scrollTo('pricing'); }}
                className="py-2 text-left text-sm font-semibold text-[#1D1D1F]/70 hover:text-[#1D1D1F]"
              >
                Pricing (from ₹799/mo)
              </button>
              <button
                type="button"
                onClick={() => { setMobileMenuOpen(false); scrollTo('faq'); }}
                className="py-2 text-left text-sm font-semibold text-[#1D1D1F]/70 hover:text-[#1D1D1F]"
              >
                FAQ
              </button>
              <hr className="border-black/[0.06] my-1" />
              <button
                type="button"
                onClick={() => { setMobileMenuOpen(false); handleDemoClick(); }}
                className="w-full flex items-center justify-center gap-2 rounded-full border border-black/[0.1] bg-[#F5F5F7] py-2.5 text-xs font-semibold text-[#1D1D1F]"
              >
                <Sparkles className="h-3.5 w-3.5 text-leaf" />
                Explore Live Demo
              </button>
              <button
                type="button"
                onClick={() => { setMobileMenuOpen(false); handleWhatsAppClick('mobile_menu'); }}
                className="w-full flex items-center justify-center gap-2 rounded-full bg-[#1D1D1F] py-2.5 text-xs font-semibold text-white shadow-sm"
              >
                <MessageCircle className="h-3.5 w-3.5 text-leaf" />
                Chat on WhatsApp
              </button>
              <button
                type="button"
                onClick={() => { setMobileMenuOpen(false); onShowAuth(); }}
                className="py-2 text-center text-xs font-semibold text-[#86868B]"
              >
                Already have an account? <span className="text-[#1D1D1F] underline">Sign in</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* ─── HERO SECTION (Apple Minimalist Layout) ──────────────────────────── */}
      <section
        className="relative overflow-hidden pb-16 sm:pb-24"
        style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 6.5rem)' }}
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-8">
            
            {/* Left Column: Value Prop & CTAs */}
            <div className="text-center lg:text-left lg:col-span-7">
              
              {/* Eyebrow Pill */}
              <div className="inline-flex items-center gap-2 rounded-full border border-black/[0.06] bg-[#F5F5F7] px-3.5 py-1 text-xs font-medium text-[#1D1D1F] shadow-2xs">
                <span className="h-1.5 w-1.5 rounded-full bg-leaf animate-pulse" />
                <span>Built for Indian PG &amp; Hostel Owners</span>
              </div>

              {/* Main Headline */}
              <h1 className="mt-5 text-4xl font-semibold tracking-[-0.03em] text-[#1D1D1F] sm:text-5xl lg:text-[56px] leading-[1.08]">
                Run your PG without the{' '}
                <span className="text-leaf">rent-day headache.</span>
              </h1>

              {/* Subheadline */}
              <p className="mt-5 text-base sm:text-lg text-[#86868B] max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Who’s paid, who’s overdue, and which beds are free — in one glance. Send 1-tap WhatsApp rent reminders with your GPay/UPI ID.
              </p>

              {/* Primary Call to Actions (Apple Pill Buttons) */}
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
                <button
                  type="button"
                  onClick={() => handleWhatsAppClick('hero_cta')}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-leaf px-7 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-leaf/90 transition-all active:scale-95"
                >
                  <MessageCircle className="h-4 w-4" />
                  Get Started on WhatsApp
                  <ArrowRight className="h-4 w-4" />
                </button>

                {onTryDemo && (
                  <button
                    type="button"
                    onClick={handleDemoClick}
                    disabled={demoLoading}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-black/[0.1] bg-[#F5F5F7] hover:bg-[#E8E8ED] px-6 py-3.5 text-sm font-semibold text-[#1D1D1F] transition-all active:scale-95"
                  >
                    {demoLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4 text-leaf" />}
                    Explore Live Demo
                  </button>
                )}
              </div>

              {/* Trust Indicators */}
              <div className="mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-2 text-xs text-[#86868B]">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-leaf" />
                  <span>Free WhatsApp Setup</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-leaf" />
                  <span>Direct UPI Payments</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-leaf" />
                  <span>Zero Commission</span>
                </div>
              </div>

            </div>

            {/* Right Column: Slender iPhone 16 Pro Mockup */}
            <div className="lg:col-span-5 flex justify-center">
              <PhoneMockup onTryDemo={handleDemoClick} demoLoading={demoLoading} />
            </div>

          </div>

          {/* Metric Bar (Apple Canvas Strip) */}
          <div className="mt-16 sm:mt-24 grid grid-cols-2 gap-3 sm:grid-cols-4 rounded-[28px] bg-[#F5F5F7] p-4 sm:p-6 text-center border border-black/[0.04]">
            <div className="p-3">
              <p className="text-2xl sm:text-3xl font-bold text-[#1D1D1F] tabular-nums">1-Tap</p>
              <p className="text-xs font-medium text-[#86868B] mt-1">WhatsApp rent reminders</p>
            </div>
            <div className="p-3">
              <p className="text-2xl sm:text-3xl font-bold text-leaf tabular-nums">100%</p>
              <p className="text-xs font-medium text-[#86868B] mt-1">Direct to your bank / UPI</p>
            </div>
            <div className="p-3">
              <p className="text-2xl sm:text-3xl font-bold text-[#1D1D1F] tabular-nums">0</p>
              <p className="text-xs font-medium text-[#86868B] mt-1">Messy Excel sheets</p>
            </div>
            <div className="p-3">
              <p className="text-2xl sm:text-3xl font-bold text-leaf tabular-nums">&lt; 5 min</p>
              <p className="text-xs font-medium text-[#86868B] mt-1">Setup time for your PG</p>
            </div>
          </div>

        </div>
      </section>

      {/* ─── BEFORE VS AFTER COMPARISON (Apple Clean Layout) ─────────────────── */}
      <section id="comparison" className="py-20 sm:py-28 bg-white border-t border-black/[0.04]">
        <div className="mx-auto max-w-5xl px-4 sm:px-8">
          
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#86868B]">Why Operators Switch</p>
            <h2 className="mt-3 text-3xl sm:text-4xl font-semibold text-[#1D1D1F] tracking-tight">
              Stop running your business on notebooks and memory.
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#86868B]">
              See what changes the moment you move your hostel to NivaOps.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            
            {/* The Old Way */}
            <div className="rounded-[28px] border border-red-100 bg-[#FFFBFB] p-6 sm:p-8">
              <div className="flex items-center gap-2 text-[#E5484D] font-semibold text-xs uppercase tracking-wider mb-5">
                <span className="h-2 w-2 rounded-full bg-[#E5484D]" />
                The Old Way (Notebooks &amp; Bank SMS)
              </div>
              <ul className="space-y-4 text-sm text-[#64748B]">
                <li className="flex items-start gap-3">
                  <span className="text-[#E5484D] font-bold shrink-0 mt-0.5">✕</span>
                  <span><strong>Guessing who paid:</strong> Scrolling through 30 bank SMS and phone screenshots on the 5th of every month.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#E5484D] font-bold shrink-0 mt-0.5">✕</span>
                  <span><strong>Awkward follow-ups:</strong> Making uncomfortable phone calls or typing out "Bhaiya rent kab doge?" 40 times.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#E5484D] font-bold shrink-0 mt-0.5">✕</span>
                  <span><strong>Move-out deposit disputes:</strong> "I paid ₹10,000 deposit" vs "No you paid ₹5,000"—arguments with no signed record.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#E5484D] font-bold shrink-0 mt-0.5">✕</span>
                  <span><strong>Untracked vacancies:</strong> Beds sitting empty for weeks because you forgot which room had a free bed.</span>
                </li>
              </ul>
            </div>

            {/* With NivaOps */}
            <div className="rounded-[28px] border border-black/[0.06] bg-[#F5F5F7] p-6 sm:p-8 shadow-xs">
              <div className="flex items-center gap-2 text-leaf font-semibold text-xs uppercase tracking-wider mb-5">
                <span className="h-2 w-2 rounded-full bg-leaf" />
                With NivaOps (Your PG in your pocket)
              </div>
              <ul className="space-y-4 text-sm text-[#1D1D1F]">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-leaf shrink-0 mt-0.5" />
                  <span><strong>One-screen visibility:</strong> Paid (Green), Due Today (Amber), Overdue (Red). Know your collections in 2 seconds.</span>
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
                  <span><strong>Live room &amp; bed grid:</strong> See exactly which beds are occupied, vacant, or on notice period right on your phone.</span>
                </li>
              </ul>
            </div>

          </div>

          <div className="mt-8 text-center">
            <button
              type="button"
              onClick={() => handleWhatsAppClick('comparison_bottom')}
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-leaf hover:underline"
            >
              See how easy it is to switch → Talk to our team on WhatsApp
            </button>
          </div>

        </div>
      </section>

      {/* ─── CORE FEATURES (Apple Bento Grid) ─────────────────────────────────── */}
      <section id="features" className="py-20 sm:py-28 bg-[#F5F5F7]">
        <div className="mx-auto max-w-6xl px-4 sm:px-8">
          
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#86868B]">Features</p>
            <h2 className="mt-3 text-3xl sm:text-4xl font-semibold text-[#1D1D1F] tracking-tight">
              Built around how you actually run your property.
            </h2>
            <p className="mt-3 text-sm text-[#86868B]">
              Every feature solves an everyday task that currently wastes your time.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            
            {/* Feature 1 */}
            <div className="rounded-[24px] border border-black/[0.04] bg-white p-7 shadow-xs hover:shadow-sm transition-shadow">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-leaf/10 text-leaf mb-4">
                <MessageCircle className="h-5 w-5" />
              </div>
              <h3 className="text-base font-semibold text-[#1D1D1F]">1-Tap WhatsApp Reminders</h3>
              <p className="mt-2 text-xs sm:text-sm text-[#86868B] leading-relaxed font-normal">
                Tapping "Remind" opens WhatsApp with the exact tenant name, room number, amount due, and your GPay/UPI link.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="rounded-[24px] border border-black/[0.04] bg-white p-7 shadow-xs hover:shadow-sm transition-shadow">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-leaf/10 text-leaf mb-4">
                <BedDouble className="h-5 w-5" />
              </div>
              <h3 className="text-base font-semibold text-[#1D1D1F]">Bed-Level Occupancy Grid</h3>
              <p className="mt-2 text-xs sm:text-sm text-[#86868B] leading-relaxed font-normal">
                Organize rooms by floor (Ground, 1st, 2nd). See vacant beds instantly so you can answer incoming calls right away.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="rounded-[24px] border border-black/[0.04] bg-white p-7 shadow-xs hover:shadow-sm transition-shadow">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-leaf/10 text-leaf mb-4">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="text-base font-semibold text-[#1D1D1F]">Security Deposit Settlement</h3>
              <p className="mt-2 text-xs sm:text-sm text-[#86868B] leading-relaxed font-normal">
                Track held deposits, record move-out notice dates, and log deductions with clear explanations for zero checkout disputes.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="rounded-[24px] border border-black/[0.04] bg-white p-7 shadow-xs hover:shadow-sm transition-shadow">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-leaf/10 text-leaf mb-4">
                <UserCheck className="h-5 w-5" />
              </div>
              <h3 className="text-base font-semibold text-[#1D1D1F]">Day Guests with ID Camera</h3>
              <p className="mt-2 text-xs sm:text-sm text-[#86868B] leading-relaxed font-normal">
                Capture high-margin daily guests with day rates and days count. Snap and save their Aadhaar ID photo straight from your phone.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="rounded-[24px] border border-black/[0.04] bg-white p-7 shadow-xs hover:shadow-sm transition-shadow">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-leaf/10 text-leaf mb-4">
                <TrendingUp className="h-5 w-5" />
              </div>
              <h3 className="text-base font-semibold text-[#1D1D1F]">Real Profit &amp; Loss (P&amp;L)</h3>
              <p className="mt-2 text-xs sm:text-sm text-[#86868B] leading-relaxed font-normal">
                Know what your hostel actually earned. Deducts building rent, electricity, cook salaries, and repairs from collected income.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="rounded-[24px] border border-black/[0.04] bg-white p-7 shadow-xs hover:shadow-sm transition-shadow">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-leaf/10 text-leaf mb-4">
                <Smartphone className="h-5 w-5" />
              </div>
              <h3 className="text-base font-semibold text-[#1D1D1F]">Installs on Home Screen</h3>
              <p className="mt-2 text-xs sm:text-sm text-[#86868B] leading-relaxed font-normal">
                Progressive Web App (PWA) with zero App Store downloads. Opens instantly from your home screen just like a native app.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ─── PRICING (Apple Style) ───────────────────────────────────────────── */}
      <section id="pricing" className="py-20 sm:py-28 bg-white border-t border-black/[0.04]">
        <div className="mx-auto max-w-5xl px-4 sm:px-8">
          
          <div className="text-center max-w-xl mx-auto">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#86868B]">Pricing</p>
            <h2 className="mt-3 text-3xl sm:text-4xl font-semibold text-[#1D1D1F] tracking-tight">
              Less than the rent of half a bed.
            </h2>
            <p className="mt-3 text-sm text-[#86868B]">
              No setup fees. No long-term lock-in. Cancel anytime.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 max-w-4xl mx-auto">
            
            {/* Starter Plan */}
            <div className="rounded-[28px] border border-black/[0.06] bg-[#F5F5F7] p-8 flex flex-col justify-between shadow-xs">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#86868B]">Starter</p>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl sm:text-5xl font-bold text-[#1D1D1F] tabular-nums">₹799</span>
                  <span className="text-sm text-[#86868B] font-medium">/month</span>
                </div>
                <p className="mt-2 text-xs text-[#86868B]">Best for single-building hostels &amp; PGs.</p>

                <hr className="my-6 border-black/[0.06]" />

                <ul className="space-y-3 text-xs sm:text-sm text-[#1D1D1F]">
                  <li className="flex items-center gap-2.5">
                    <Check className="h-4 w-4 text-leaf shrink-0" />
                    <span>Up to 25 beds · 1 property</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="h-4 w-4 text-leaf shrink-0" />
                    <span>Unlimited tenant &amp; bed tracking</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="h-4 w-4 text-leaf shrink-0" />
                    <span>1-Tap WhatsApp reminders with UPI</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="h-4 w-4 text-leaf shrink-0" />
                    <span>Security deposits &amp; expense tracking</span>
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
                  className="w-full rounded-full border border-black/[0.1] bg-white hover:bg-[#E8E8ED] py-3 text-xs font-semibold text-[#1D1D1F] transition-all active:scale-95 shadow-2xs"
                >
                  Start 14-Day Free Trial
                </button>
              </div>
            </div>

            {/* Pro Plan */}
            <div className="relative rounded-[28px] bg-[#1D1D1F] text-white p-8 flex flex-col justify-between shadow-lg">
              <span className="absolute -top-3 right-8 rounded-full bg-leaf px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-xs">
                Most Popular
              </span>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-white/50">Pro</p>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl sm:text-5xl font-bold text-white tabular-nums">₹1,499</span>
                  <span className="text-sm text-white/50 font-medium">/month</span>
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
                    <span>Full Profit &amp; Loss (P&amp;L) &amp; Cashflow ledger</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="h-4 w-4 text-leaf shrink-0" />
                    <span>Staff logins (Manager &amp; Caretaker access)</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="h-4 w-4 text-leaf shrink-0" />
                    <span>Razorpay instant payment link integration</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="h-4 w-4 text-leaf shrink-0" />
                    <span>Priority WhatsApp support &amp; data import</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8">
                <button
                  type="button"
                  onClick={() => handleWhatsAppClick('pricing_pro')}
                  className="w-full flex items-center justify-center gap-2 rounded-full bg-leaf hover:bg-leaf/90 py-3 text-xs font-semibold text-white shadow-sm transition-all active:scale-95"
                >
                  <MessageCircle className="h-4 w-4" />
                  Get Pro via WhatsApp
                </button>
              </div>
            </div>

          </div>

          {/* Concierge Setup Callout */}
          <div className="mt-10 rounded-[24px] bg-[#F5F5F7] border border-black/[0.04] p-6 text-center max-w-2xl mx-auto">
            <p className="text-sm font-semibold text-[#1D1D1F]">🤝 Free WhatsApp Concierge Setup</p>
            <p className="text-xs text-[#86868B] mt-1 leading-relaxed">
              Too busy to enter all your rooms and beds? Just send a photo of your register or Excel file on WhatsApp. We'll set up your property for you before you start.
            </p>
          </div>

        </div>
      </section>

      {/* ─── FAQ SECTION (Apple Accordion) ───────────────────────────────────── */}
      <section id="faq" className="py-20 sm:py-28 bg-[#F5F5F7] border-t border-black/[0.04]">
        <div className="mx-auto max-w-3xl px-4 sm:px-8">
          
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#86868B]">Questions &amp; Answers</p>
            <h2 className="mt-3 text-3xl font-semibold text-[#1D1D1F] tracking-tight">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="mt-10 space-y-2.5">
            {faqs.map((faq, index) => {
              const isOpen = activeFaq === index;
              return (
                <div key={index} className="rounded-[20px] border border-black/[0.04] bg-white overflow-hidden shadow-2xs">
                  <button
                    type="button"
                    onClick={() => setActiveFaq(isOpen ? null : index)}
                    className="w-full flex items-center justify-between p-4 sm:p-5 text-left font-semibold text-sm text-[#1D1D1F] hover:text-leaf transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`h-4 w-4 text-[#86868B] transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-5 sm:px-5 text-xs sm:text-sm text-[#86868B] leading-relaxed border-t border-black/[0.04] pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ─── FINAL CTA SECTION (Apple Clean Dark) ────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#1D1D1F] py-20 sm:py-28 text-center text-white">
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-15 blur-3xl"
          style={{ background: 'radial-gradient(circle, #16A34A 0%, transparent 70%)' }}
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-2xl px-4 sm:px-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-leaf">Start Today</p>
          <h2 className="mt-3 text-3xl sm:text-4xl font-semibold tracking-tight">
            Stop losing rent. Start collecting on time.
          </h2>
          <p className="mt-4 text-sm sm:text-base text-white/60 max-w-lg mx-auto leading-relaxed">
            Join operators across India who manage their PG in under 5 minutes a day.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => handleWhatsAppClick('final_cta')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-leaf px-7 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-leaf/90 transition-all active:scale-95"
            >
              <MessageCircle className="h-4 w-4" />
              Chat on WhatsApp to Start
            </button>

            {onTryDemo && (
              <button
                type="button"
                onClick={handleDemoClick}
                disabled={demoLoading}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 hover:bg-white/20 px-6 py-3.5 text-sm font-semibold text-white transition-all active:scale-95"
              >
                {demoLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4 text-leaf" />}
                Explore Live Demo
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ─── FOOTER (Apple Minimalist) ───────────────────────────────────────── */}
      <footer
        className="border-t border-black/[0.06] bg-[#F5F5F7] pt-8 text-[#86868B] text-xs"
        style={{ paddingBottom: 'calc(max(env(safe-area-inset-bottom, 0px), 16px) + 5rem)' }}
      >
        <div className="mx-auto flex max-w-6xl flex-col sm:flex-row items-center justify-between gap-4 px-4 sm:px-8">
          <div className="flex items-center gap-2">
            <NivaLogo size={18} />
            <span className="font-semibold text-[#1D1D1F]">NivaOps</span>
            <span className="text-[#86868B]">· The PG Management System</span>
          </div>

          <p className="text-center sm:text-right text-[#86868B]">
            © {new Date().getFullYear()} NivaOps. Built for Indian PG &amp; Hostel Operators.
          </p>
        </div>
      </footer>

      {/* ─── FLOATING MOBILE QUICK ACTION BAR (Frosted Pill) ─────────────────── */}
      <div
        className="fixed bottom-0 inset-x-0 z-40 sm:hidden border-t border-black/[0.06] bg-white/80 backdrop-blur-xl px-4 pt-2.5 flex items-center gap-2 shadow-lg"
        style={{ paddingBottom: 'calc(max(env(safe-area-inset-bottom, 0px), 10px) + 0.5rem)' }}
      >
        <button
          type="button"
          onClick={() => handleWhatsAppClick('mobile_sticky_bar')}
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-leaf py-2.5 text-xs font-semibold text-white shadow-xs active:scale-95 transition-all"
        >
          <MessageCircle className="h-4 w-4" />
          Chat on WhatsApp
        </button>
        {onTryDemo && (
          <button
            type="button"
            onClick={handleDemoClick}
            disabled={demoLoading}
            className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-full border border-black/[0.1] bg-[#F5F5F7] py-2.5 text-xs font-semibold text-[#1D1D1F] active:scale-95 transition-all"
          >
            {demoLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5 text-leaf" />}
            Live Demo
          </button>
        )}
      </div>

    </div>
  );
}