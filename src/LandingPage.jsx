import { useEffect, useRef, useState } from 'react';
import { NivaLogo, NivaWordmark } from './components/NivaLogo';
import { Check, Menu, X, Wallet, MessageCircle, BedDouble, Receipt, ArrowUpRight } from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// SCROLL REVEAL
// ─────────────────────────────────────────────────────────────────────────────

function useInView() {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setInView(true); obs.disconnect(); }
    }, { threshold: 0.15 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
}

function Reveal({ children, delay = 0, className = '' }) {
  const [ref, inView] = useInView();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(28px)',
        transition: `opacity 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}s, transform 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
        willChange: 'opacity, transform',
      }}
    >
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MOUSE-TILT WRAPPER
// ─────────────────────────────────────────────────────────────────────────────

function TiltWrapper({ children }) {
  const ref = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  function handleMove(e) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: py * -8, y: px * 10 });
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      style={{
        transform: `perspective(1200px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: 'transform 0.35s cubic-bezier(0.16,1,0.3,1)',
      }}
    >
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PHONE MOCKUP
// ─────────────────────────────────────────────────────────────────────────────

function PhoneMockup() {
  const rows = [
    { n: 'Arjun Mehta',     r: 'Room 204', s: 'overdue' },
    { n: 'Sneha Iyer',      r: 'Room 101', s: 'paid'    },
    { n: 'Rohit Singh',     r: 'Room 305', s: 'pending' },
    { n: 'Priya Nair',      r: 'Room 202', s: 'paid'    },
    { n: 'Mohammed Salim',  r: 'Room 108', s: 'paid'    },
  ];
  const chip = s => ({
    bg:    s === 'paid' ? '#DCFCE7'  : s === 'overdue' ? '#FEF2F2'  : '#FFFBEB',
    color: s === 'paid' ? '#16A34A'  : s === 'overdue' ? '#EF4444'  : '#D97706',
  });

  return (
    <div style={{ position: 'relative', width: 300, height: 610, margin: '0 auto' }}>
      {/* frame */}
      <div style={{
        position: 'absolute', inset: 0, borderRadius: 54,
        background: '#0d1117',
        boxShadow: '0 48px 96px rgba(0,0,0,0.36), 0 0 0 1px rgba(255,255,255,0.07)',
      }}>
        <div style={{
          position: 'absolute', inset: 3, borderRadius: 52,
          overflow: 'hidden', background: '#F8FAFC',
          display: 'flex', flexDirection: 'column',
        }}>
          {/* status */}
          <div style={{ height: 44, background: '#111827', display: 'flex', alignItems: 'flex-end', padding: '0 22px 9px', flexShrink: 0, position: 'relative' }}>
            <span style={{ color: 'rgba(255,255,255,0.38)', fontSize: 10, fontWeight: 500 }}>9:41</span>
            <div style={{ position: 'absolute', top: 8, left: '50%', transform: 'translateX(-50%)', width: 72, height: 24, background: '#0d1117', borderRadius: 15 }} />
            <div style={{ marginLeft: 'auto', width: 14, height: 10, borderRadius: 2, background: 'rgba(255,255,255,0.28)' }} />
          </div>
          {/* header */}
          <div style={{ background: '#111827', padding: '14px 22px 22px', flexShrink: 0 }}>
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 600 }}>Dashboard</p>
            <p style={{ color: '#fff', fontSize: 22, fontWeight: 700, marginTop: 3, letterSpacing: '-0.03em' }}>Today</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 16 }}>
              {[
                { l: 'Occupancy', v: '91%',       bg: 'rgba(255,255,255,0.06)', vc: '#fff',     lc: 'rgba(255,255,255,0.32)' },
                { l: 'Revenue',   v: '₹2,45,800', bg: 'rgba(22,163,74,0.18)',   vc: '#86efac',  lc: 'rgba(134,239,172,0.55)' },
                { l: 'Active',    v: '38',         bg: 'rgba(255,255,255,0.06)', vc: '#fff',     lc: 'rgba(255,255,255,0.32)' },
                { l: 'Pending',   v: '6',          bg: 'rgba(251,191,36,0.11)',  vc: '#fbbf24',  lc: 'rgba(251,191,36,0.55)'  },
              ].map(s => (
                <div key={s.l} style={{ background: s.bg, borderRadius: 13, padding: '11px 13px' }}>
                  <p style={{ color: s.lc, fontSize: 9.5, marginBottom: 5 }}>{s.l}</p>
                  <p style={{ color: s.vc, fontSize: 18, fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1 }}>{s.v}</p>
                </div>
              ))}
            </div>
          </div>
          {/* list */}
          <div style={{ flex: 1, padding: '18px 18px 0', overflow: 'hidden' }}>
            <p style={{ fontSize: 10, fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>Due Today</p>
            {rows.map((t, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '9px 0', borderBottom: '1px solid #E2E8F0' }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ color: '#16A34A', fontSize: 10, fontWeight: 700 }}>{t.n[0]}</span>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 11, fontWeight: 600, color: '#0F172A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.n}</p>
                  <p style={{ fontSize: 9.5, color: '#94A3B8', marginTop: 1 }}>{t.r}</p>
                </div>
                <span style={{ fontSize: 9, fontWeight: 700, padding: '3px 9px', borderRadius: 99, background: chip(t.s).bg, color: chip(t.s).color }}>
                  {t.s}
                </span>
              </div>
            ))}
          </div>
          {/* nav */}
          <div style={{ height: 56, background: '#111827', display: 'flex', alignItems: 'center', justifyContent: 'space-around', padding: '0 32px', flexShrink: 0 }}>
            {[
              { d: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', active: true },
              { d: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z', active: false },
              { d: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z', active: false },
              { d: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', active: false },
            ].map((n, i) => (
              <svg key={i} width="19" height="19" viewBox="0 0 24 24" fill="none"
                stroke={n.active ? '#16A34A' : 'rgba(255,255,255,0.2)'}
                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d={n.d} />
              </svg>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// BROWSER MOCKUP
// ─────────────────────────────────────────────────────────────────────────────

function BrowserMockup() {
  const names = ['Arjun Mehta','Sneha Iyer','Rohit Singh','Priya Nair','Mohammed Salim','Ananya Das','Karthik Reddy','Divya Menon'];
  const rents = ['₹6,500','₹7,500','₹8,500','₹9,000'];
  const statuses = ['paid','paid','pending','overdue','paid','paid','pending','paid'];

  const beds = [
    ...['101A','101B','101C','101D','101E'].map((id,i) => ({ id, occ:true, maint:false, name:names[i%8],     rent:rents[i%4],     st:statuses[i%8] })),
    { id:'101F', occ:false, maint:false },
    ...['102A','102B','102C','102D','102E'].map((id,i) => ({ id, occ:true, maint:false, name:names[(i+3)%8], rent:rents[(i+1)%4], st:statuses[(i+3)%8] })),
    { id:'102F', occ:false, maint:false },
    ...['201A','201B','201C','201D'].map((id,i)        => ({ id, occ:true, maint:false, name:names[(i+5)%8], rent:rents[(i+2)%4], st:statuses[(i+5)%8] })),
    { id:'201E', occ:false, maint:true  },
    { id:'201F', occ:false, maint:true  },
    ...['202A','202B','202C','202D','202E'].map((id,i) => ({ id, occ:true, maint:false, name:names[(i+1)%8], rent:rents[(i+3)%4], st:statuses[(i+1)%8] })),
    { id:'202F', occ:false, maint:false },
    ...['301A','301B','301C','301D','301E'].map((id,i) => ({ id, occ:true, maint:false, name:names[(i+4)%8], rent:rents[i%4],     st:statuses[(i+4)%8] })),
    { id:'301F', occ:false, maint:false },
    ...['302A','302B','302C','302D'].map((id,i)        => ({ id, occ:true, maint:false, name:names[(i+2)%8], rent:rents[(i+1)%4], st:statuses[(i+2)%8] })),
    { id:'302E', occ:false, maint:false },
    { id:'302F', occ:false, maint:false },
  ];

  const nav = ['Dashboard','Properties','Rooms','Tenants','Payments','Reports','Settings'];

  return (
    <div style={{ borderRadius: 16, overflow: 'hidden', border: '1px solid #E2E8F0', boxShadow: '0 24px 64px rgba(15,23,42,0.10)', background: '#fff' }}>
      {/* chrome */}
      <div style={{ background: '#111827', padding: '11px 18px', display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ display: 'flex', gap: 7, flexShrink: 0 }}>
          {['#ff5f57','#febc2e','#28c840'].map(c => <div key={c} style={{ width: 12, height: 12, borderRadius: '50%', background: c }} />)}
        </div>
        <div style={{ flex: 1, background: 'rgba(255,255,255,0.07)', borderRadius: 7, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ color: 'rgba(255,255,255,0.22)', fontSize: 10.5 }}>app.nivaops.com</span>
        </div>
      </div>
      {/* panels */}
      <div style={{ display: 'flex', height: 420 }}>

        {/* sidebar */}
        <div style={{ width: 168, background: '#111827', padding: '16px 0', flexShrink: 0, display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 16px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', marginBottom: 8 }}>
            <img src="/favicon.svg" width="19" height="19" alt="" style={{ borderRadius: 5, flexShrink: 0 }} />
            <span style={{ color: '#fff', fontSize: 12.5, fontWeight: 700 }}>NivaOps</span>
          </div>
          {nav.map(label => {
            const active = label === 'Rooms';
            return (
              <div key={label} style={{
                padding: '7px 14px', margin: '1px 8px', borderRadius: 8,
                background: active ? 'rgba(22,163,74,0.14)' : 'transparent',
              }}>
                <span style={{ fontSize: 11.5, fontWeight: active ? 600 : 400, color: active ? '#16A34A' : 'rgba(255,255,255,0.36)' }}>{label}</span>
              </div>
            );
          })}
        </div>

        {/* centre */}
        <div style={{ flex: 1, background: '#F8FAFC', padding: '18px', overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div>
              <p style={{ fontSize: 15, fontWeight: 700, color: '#0F172A' }}>Rooms</p>
              <p style={{ fontSize: 11.5, color: '#94A3B8', marginTop: 2 }}>42 beds · 38 occupied</p>
            </div>
            <div style={{ display: 'flex', gap: 7 }}>
              <span style={{ fontSize: 10, fontWeight: 600, padding: '3.5px 10px', borderRadius: 99, background: '#DCFCE7', color: '#16A34A' }}>38 Occupied</span>
              <span style={{ fontSize: 10, fontWeight: 600, padding: '3.5px 10px', borderRadius: 99, background: '#F1F5F9', color: '#475569' }}>4 Vacant</span>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 7 }}>
            {beds.map(b => (
              <div key={b.id} style={{
                borderRadius: 9, padding: '8px 9px',
                background: b.maint ? 'rgba(217,119,6,0.07)' : b.occ ? '#111827' : '#fff',
                border: b.occ ? 'none' : b.maint ? '1px solid rgba(217,119,6,0.18)' : '1px solid #E2E8F0',
              }}>
                <p style={{ fontSize: 9, fontWeight: 700, lineHeight: 1, color: b.occ ? '#fff' : b.maint ? '#D97706' : '#94A3B8' }}>{b.id}</p>
                {b.occ   && <><p style={{ fontSize: 8, color: 'rgba(255,255,255,0.48)', marginTop: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b.name.split(' ')[0]}</p><p style={{ fontSize: 7.5, color: '#16A34A', marginTop: 2 }}>{b.rent}</p></>}
                {!b.occ && !b.maint && <p style={{ fontSize: 8, color: '#CBD5E1', marginTop: 4 }}>Vacant</p>}
                {b.maint && <p style={{ fontSize: 8, color: '#D97706', marginTop: 4 }}>Maint.</p>}
              </div>
            ))}
          </div>
        </div>

        {/* right panel */}
        <div style={{ width: 232, background: '#fff', borderLeft: '1px solid #E2E8F0', padding: '18px', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
          <p style={{ fontSize: 10, fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>Tenant Details</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, padding: '10px', background: '#F8FAFC', borderRadius: 11, border: '1px solid #E2E8F0' }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#16A34A' }}>AM</span>
            </div>
            <div>
              <p style={{ fontSize: 12, fontWeight: 600, color: '#0F172A' }}>Arjun Mehta</p>
              <p style={{ fontSize: 10, color: '#94A3B8', marginTop: 1 }}>Room 204 · Bed B</p>
            </div>
          </div>
          {[
            { l:'Rent',    v:'₹8,500/month', badge:null    },
            { l:'Status',  v:null,           badge:'Paid'  },
            { l:'Joined',  v:'12 Jan 2025',  badge:null    },
            { l:'Phone',   v:'+91 98800 00001', badge:null },
            { l:'Deposit', v:'₹17,000',      badge:null    },
          ].map(row => (
            <div key={row.l} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #F1F5F9' }}>
              <span style={{ fontSize: 10, color: '#94A3B8' }}>{row.l}</span>
              {row.badge
                ? <span style={{ fontSize: 9.5, fontWeight: 700, padding: '2.5px 9px', borderRadius: 99, background: '#DCFCE7', color: '#16A34A' }}>{row.badge}</span>
                : <span style={{ fontSize: 10, fontWeight: 500, color: '#0F172A' }}>{row.v}</span>
              }
            </div>
          ))}
          <div style={{ marginTop: 'auto', paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <button style={{ width: '100%', padding: '8px', borderRadius: 9, border: '1.5px solid #E2E8F0', background: 'transparent', fontSize: 11.5, fontWeight: 600, color: '#475569', cursor: 'pointer' }}>
              Send Reminder
            </button>
            <button style={{ width: '100%', padding: '8px', borderRadius: 9, border: 'none', background: '#16A34A', fontSize: 11.5, fontWeight: 700, color: '#fff', cursor: 'pointer' }}>
              Collect Rent
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────────────────────

function scrollTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
}

const BOOK_DEMO_URL = 'https://wa.me/919633310117?text=Hi%2C%20I%27d%20like%20to%20book%20a%20demo%20of%20NivaOps';

export default function LandingPage({ onShowAuth }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white">

      {/* NAV */}
      <nav className={`fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur-xl border-b transition-shadow duration-300 ${scrolled ? 'border-border shadow-[0_4px_24px_rgba(15,23,42,0.05)]' : 'border-transparent'}`}
        style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}>
        <div className="max-w-5xl mx-auto px-6 h-14 grid grid-cols-[1fr_auto_1fr] items-center">
          <div className="flex items-center gap-2.5">
            <NivaLogo size={22} />
            <NivaWordmark size="base" />
          </div>

          <div className="hidden sm:flex items-center gap-8">
            <button onClick={() => scrollTo('features')} className="text-sm text-slate font-medium hover:text-charcoal transition-colors">
              Features
            </button>
            <button onClick={() => scrollTo('pricing')} className="text-sm text-slate font-medium hover:text-charcoal transition-colors">
              Pricing
            </button>
          </div>

          <div className="hidden sm:flex items-center justify-end gap-5">
            <button onClick={onShowAuth} className="text-sm text-muted font-medium hover:text-slate transition-colors">
              Sign In
            </button>
            <a href={BOOK_DEMO_URL} target="_blank" rel="noopener noreferrer"
              className="text-sm text-white font-semibold px-4 py-2 rounded-lg bg-green hover:bg-green-hover transition-colors">
              Book Demo
            </a>
          </div>

          <button className="sm:hidden col-start-3 justify-self-end p-2 text-muted" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
        {mobileMenuOpen && (
          <div className="sm:hidden bg-white border-t border-border px-5 pb-5 pt-3 space-y-2">
            <button onClick={() => { setMobileMenuOpen(false); scrollTo('features'); }} className="w-full text-left py-2 text-sm font-medium text-slate">Features</button>
            <button onClick={() => { setMobileMenuOpen(false); scrollTo('pricing'); }} className="w-full text-left py-2 text-sm font-medium text-slate">Pricing</button>
            <button onClick={onShowAuth} className="w-full py-2.5 border border-border rounded-lg text-sm font-semibold text-charcoal">Sign In</button>
            <a href={BOOK_DEMO_URL} target="_blank" rel="noopener noreferrer"
              className="block w-full py-2.5 bg-green hover:bg-green-hover rounded-lg text-sm font-semibold text-white text-center transition-colors">Book Demo</a>
          </div>
        )}
      </nav>

      {/* ── 1. HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative pt-36 pb-24 px-6 bg-white overflow-hidden">
        {/* soft ambient backdrop */}
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute left-1/2 top-[-160px] -translate-x-1/2 w-[880px] h-[600px] rounded-full opacity-[0.12] blur-3xl animate-drift"
            style={{ background: 'radial-gradient(circle, #16A34A 0%, transparent 70%)' }} />
          <div className="absolute inset-0"
            style={{
              backgroundImage: 'linear-gradient(#0F172A 1px, transparent 1px), linear-gradient(90deg, #0F172A 1px, transparent 1px)',
              backgroundSize: '56px 56px',
              opacity: 0.025,
              maskImage: 'radial-gradient(ellipse 60% 50% at 50% 0%, black 40%, transparent 100%)',
              WebkitMaskImage: 'radial-gradient(ellipse 60% 50% at 50% 0%, black 40%, transparent 100%)',
            }} />
        </div>

        <div className="relative max-w-3xl mx-auto text-center">

          <Reveal>
            <h1 className="text-[42px] sm:text-[58px] lg:text-[64px] font-bold text-charcoal tracking-[-2.5px] leading-[1.08] mb-5">
              Run your entire PG<br /> from <span className="text-green">one app</span>.
            </h1>
          </Reveal>

          <Reveal delay={0.08}>
            <p className="text-[17px] sm:text-[18px] text-slate leading-[1.7] max-w-sm mx-auto mb-8">
              Manage beds, tenants, rent collection and expenses without juggling WhatsApp, Excel and notebooks.
            </p>
          </Reveal>

          <Reveal delay={0.16}>
            <a href={BOOK_DEMO_URL} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 bg-green hover:bg-green-hover text-white font-semibold text-sm px-6 py-3 rounded-lg transition-all duration-150 shadow-[0_8px_24px_rgba(22,163,74,0.28)] hover:shadow-[0_12px_32px_rgba(22,163,74,0.36)] hover:-translate-y-0.5">
              Book Demo <ArrowUpRight size={15} />
            </a>

            <p className="mt-5 text-xs text-muted">
              Not a demo — <span className="font-semibold text-slate">StayB in Kochi</span> runs its day-to-day on this, today.
            </p>
          </Reveal>

          <Reveal delay={0.24} className="relative mt-16 flex justify-center">
            <TiltWrapper>
              <PhoneMockup />
            </TiltWrapper>

            {/* floating annotation cards — desktop only */}
            <div className="hidden lg:flex items-center gap-2.5 absolute left-[-40px] top-[120px] bg-white rounded-xl border border-border shadow-[0_12px_32px_rgba(15,23,42,0.10)] px-3.5 py-2.5 animate-float-slow">
              <div className="w-7 h-7 rounded-full bg-green-light flex items-center justify-center shrink-0">
                <Wallet size={13} className="text-green" />
              </div>
              <div className="text-left">
                <p className="text-[11.5px] font-semibold text-charcoal leading-none">7 days overdue</p>
                <p className="text-[10px] text-muted mt-1">Flagged the moment rent's late — no calls</p>
              </div>
            </div>
            <div className="hidden lg:flex items-center gap-2.5 absolute right-[-44px] bottom-[140px] bg-white rounded-xl border border-border shadow-[0_12px_32px_rgba(15,23,42,0.10)] px-3.5 py-2.5 animate-float-slow" style={{ animationDelay: '1.4s' }}>
              <div className="w-7 h-7 rounded-full bg-green-light flex items-center justify-center shrink-0">
                <MessageCircle size={13} className="text-green" />
              </div>
              <div className="text-left">
                <p className="text-[11.5px] font-semibold text-charcoal leading-none">One tap</p>
                <p className="text-[10px] text-muted mt-1">WhatsApp + UPI link, sent</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── 2. WHAT IT DOES ─────────────────────────────────────────────────── */}
      <section id="features" className="py-24 px-6 border-t border-border">
        <div className="max-w-2xl mx-auto">

          <Reveal>
            <p className="text-xs font-semibold text-muted uppercase tracking-[1.5px] mb-10">What NivaOps does</p>
          </Reveal>

          <div className="grid sm:grid-cols-2 gap-5">
            {[
              {
                icon: Wallet,
                title: 'Know who paid — without calling anyone',
                body: 'Every tenant\'s rent status is visible the moment you open the app. Overdue, pending, paid — no chasing needed.',
              },
              {
                icon: MessageCircle,
                title: 'Send a reminder with UPI link in one tap',
                body: 'WhatsApp message with the amount, room number, and your UPI ID — ready to send. Tenants pay, you mark it done.',
              },
              {
                icon: BedDouble,
                title: 'Every bed and tenant in one view',
                body: 'See which beds are occupied, vacant, or under maintenance. Joining dates, deposits, ID photos — all stored.',
              },
              {
                icon: Receipt,
                title: 'See where every rupee went',
                body: 'Log maintenance, electricity, and staff costs against each property. Income and expenses side by side.',
              },
            ].map(({ icon: Icon, title, body }, i) => (
              <Reveal key={title} delay={i * 0.08}>
                <div className="group bg-white border border-border rounded-2xl p-6 h-full transition-all duration-300 hover:border-green/30 hover:shadow-[0_16px_40px_rgba(15,23,42,0.07)] hover:-translate-y-1">
                  <div className="w-10 h-10 rounded-xl bg-green-light flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                    <Icon size={18} className="text-green" />
                  </div>
                  <h3 className="text-[15px] font-semibold text-charcoal mb-1.5 leading-snug">{title}</h3>
                  <p className="text-[14px] text-slate leading-[1.65]">{body}</p>
                </div>
              </Reveal>
            ))}
          </div>

        </div>
      </section>

      {/* ── PROOF ───────────────────────────────────────────────────────────── */}
      <section className="hidden lg:block py-24 px-6 border-t border-border bg-light overflow-hidden">
        <div className="max-w-4xl mx-auto text-center">
          <Reveal>
            <p className="text-xs font-semibold text-muted uppercase tracking-[1.5px] mb-4">On desktop too</p>
            <h2 className="text-[28px] font-bold text-charcoal tracking-[-1px] leading-tight mb-12 max-w-md mx-auto">
              Every room, every tenant, every rupee — one screen.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <TiltWrapper>
              <BrowserMockup />
            </TiltWrapper>
          </Reveal>
        </div>
      </section>

      {/* ── 3. PRICING ──────────────────────────────────────────────────────── */}
      <section id="pricing" className="py-24 px-6 bg-light border-t border-border">
        <div className="max-w-3xl mx-auto">

          <Reveal>
            <div className="text-center mb-12">
              <h2 className="text-[32px] sm:text-[40px] font-bold text-charcoal tracking-[-1px] leading-[1.08] mb-2">
                Pricing
              </h2>
              <p className="text-[15px] text-muted">Other hostel software charges ₹4,599–₹10,899/month for the same thing.</p>
            </div>
          </Reveal>

          <div className="grid sm:grid-cols-2 gap-5">

            {/* Starter */}
            <Reveal>
              <div className="bg-white border border-border rounded-2xl p-8 flex flex-col h-full transition-all duration-300 hover:shadow-[0_20px_48px_rgba(15,23,42,0.08)] hover:-translate-y-1">
                <p className="text-xs font-semibold text-muted uppercase tracking-[1.5px] mb-6">Starter</p>
                <div className="flex items-baseline gap-1.5 mb-1">
                  <span className="text-[58px] font-bold text-charcoal leading-none tracking-[-2.5px]">₹799</span>
                  <span className="text-base text-muted font-normal">/mo</span>
                </div>
                <p className="text-sm text-muted mb-8">Up to 25 beds · 1 property</p>
                <ul className="space-y-3 flex-1">
                  {['Bed & tenant management','Rent tracking','WhatsApp reminders + UPI','Expense tracking','Mobile PWA'].map(f => (
                    <li key={f} className="flex items-start gap-2.5">
                      <Check size={14} className="text-green shrink-0 mt-0.5" />
                      <span className="text-sm text-slate">{f}</span>
                    </li>
                  ))}
                </ul>
                <a href={BOOK_DEMO_URL} target="_blank" rel="noopener noreferrer"
                  className="mt-8 w-full py-3 border border-border rounded-xl text-sm font-semibold text-charcoal hover:bg-surface transition-colors text-center block">
                  Book Demo
                </a>
              </div>
            </Reveal>

            {/* Pro */}
            <Reveal delay={0.1}>
              <div className="relative bg-midnight rounded-2xl p-8 flex flex-col h-full shadow-[0_24px_56px_rgba(15,23,42,0.22)] transition-transform duration-300 hover:-translate-y-1">
                <span className="absolute -top-3 right-8 bg-green text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                  Most popular
                </span>
                <p className="text-xs font-semibold text-white/40 uppercase tracking-[1.5px] mb-6">Pro</p>
                <div className="flex items-baseline gap-1.5 mb-1">
                  <span className="text-[58px] font-bold text-white leading-none tracking-[-2.5px]">₹1,499</span>
                  <span className="text-base text-white/40 font-normal">/mo</span>
                </div>
                <p className="text-sm text-white/40 mb-8">Up to 100 beds · Multiple properties</p>
                <ul className="space-y-3 flex-1">
                  {['Everything in Starter','Multiple properties','Unlimited tenants','Finance & P&L overview','Priority support'].map((f, i) => (
                    <li key={f} className="flex items-start gap-2.5">
                      <Check size={14} className="text-green shrink-0 mt-0.5" />
                      <span className={`text-sm ${i === 0 ? 'text-white/35' : 'text-white/70'}`}>{f}</span>
                    </li>
                  ))}
                </ul>
                <a href={BOOK_DEMO_URL} target="_blank" rel="noopener noreferrer"
                  className="mt-8 w-full py-3 bg-green hover:bg-green-hover rounded-xl text-sm font-semibold text-white transition-colors text-center block">
                  Book Demo
                </a>
              </div>
            </Reveal>

          </div>
        </div>
      </section>

      {/* ── FINAL CTA ───────────────────────────────────────────────────────── */}
      <section className="py-24 px-6 bg-midnight text-center overflow-hidden relative">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full opacity-[0.10] blur-3xl"
            style={{ background: 'radial-gradient(circle, #16A34A 0%, transparent 70%)' }} />
        </div>
        <Reveal className="relative max-w-lg mx-auto">
          <h2 className="text-[32px] sm:text-[42px] font-bold text-white tracking-[-1.5px] leading-[1.1] mb-5">
            Ready to stop chasing rent on WhatsApp?
          </h2>
          <p className="text-white/50 text-[15px] mb-8">
            15 minutes on a call. See it running your own rooms and tenants before you decide anything.
          </p>
          <a href={BOOK_DEMO_URL} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 bg-green hover:bg-green-hover text-white font-semibold text-sm px-7 py-3.5 rounded-lg transition-all duration-150 shadow-[0_8px_24px_rgba(22,163,74,0.3)] hover:shadow-[0_12px_32px_rgba(22,163,74,0.4)] hover:-translate-y-0.5">
            Book Demo <ArrowUpRight size={15} />
          </a>
        </Reveal>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────────────────── */}
      <footer className="bg-midnight border-t border-white/[0.06] py-8 px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <NivaLogo size={20} />
              <span className="text-white font-semibold text-sm">NivaOps</span>
            </div>
            <p className="text-white/25 text-xs">Run properties smarter.</p>
          </div>
          <div className="flex items-center gap-8">
            <button onClick={() => scrollTo('features')} className="text-sm text-white/35 hover:text-white/65 transition-colors">Features</button>
            <button onClick={() => scrollTo('pricing')} className="text-sm text-white/35 hover:text-white/65 transition-colors">Pricing</button>
            <a href={BOOK_DEMO_URL} target="_blank" rel="noopener noreferrer" className="text-sm text-white/35 hover:text-white/65 transition-colors">Contact</a>
          </div>
          <p className="text-xs text-white/25">© 2026 NivaOps</p>
        </div>
      </footer>

    </div>
  );
}
