import { useState } from 'react';
import { NivaLogo, NivaWordmark } from './components/NivaLogo';
import {
  ArrowRight,
  ArrowUpRight,
  BedDouble,
  Check,
  Menu,
  MessageCircle,
  Receipt,
  Wallet,
  X,
} from 'lucide-react';

const BOOK_DEMO_URL =
  'https://wa.me/919633310117?text=Hi%2C%20I%27d%20like%20to%20book%20a%20demo%20of%20NivaOps';

const features = [
  {
    icon: BedDouble,
    eyebrow: 'Rooms & beds',
    title: 'Know what is happening in every room.',
    body: 'Keep rooms, beds, occupancy, vacancies, and maintenance status organized in one place.',
  },
  {
    icon: Wallet,
    eyebrow: 'Rent',
    title: 'Know who has paid and who has not.',
    body: 'Track rent status tenant by tenant without checking notebooks, spreadsheets, or separate messages.',
  },
  {
    icon: MessageCircle,
    eyebrow: 'Follow-up',
    title: 'Make rent follow-up simpler.',
    body: 'Keep the amount, tenant, room, and payment context together so routine follow-up takes less effort.',
  },
  {
    icon: Receipt,
    eyebrow: 'Finance',
    title: 'Keep property money organized.',
    body: 'Record income and expenses against your properties and keep the financial picture easy to understand.',
  },
];

const workflow = [
  {
    number: '01',
    title: 'Set up your property',
    body: 'Add your property, rooms, and beds so the structure of the property is clear from the start.',
  },
  {
    number: '02',
    title: 'Add your tenants',
    body: 'Keep tenant information, room allocation, joining details, and related records together.',
  },
  {
    number: '03',
    title: 'Run the month',
    body: 'Track rent, follow up on pending payments, handle complaints, and record day-to-day expenses.',
  },
  {
    number: '04',
    title: 'Stay in control',
    body: 'Use one workspace to understand what needs attention across your property.',
  },
];

function scrollTo(id) {
  document.getElementById(id)?.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  });
}

function ActionButton({
  children,
  secondary = false,
  onClick,
  href,
}) {
  const className = secondary
    ? 'inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-white px-5 py-3 text-sm font-semibold text-charcoal transition-all hover:border-charcoal/20 hover:bg-light'
    : 'inline-flex items-center justify-center gap-2 rounded-xl bg-green px-5 py-3 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(22,163,74,0.20)] transition-all hover:bg-green-hover hover:-translate-y-0.5';

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {children}
      </a>
    );
  }

  return (
    <button type="button" onClick={onClick} className={className}>
      {children}
    </button>
  );
}

function SectionLabel({ children }) {
  return (
    <p className="text-xs font-bold uppercase tracking-[0.16em] text-green">
      {children}
    </p>
  );
}

export default function LandingPage({ onShowAuth }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <div className="min-h-screen bg-white text-charcoal">

      {/* NAVIGATION */}
      <nav className="fixed inset-x-0 top-0 z-50 border-b border-border bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">

          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-2.5"
            aria-label="NivaOps home"
          >
            <NivaLogo size={23} />
            <NivaWordmark size="base" />
          </button>

          <div className="hidden items-center gap-8 sm:flex">
            <button
              type="button"
              onClick={() => scrollTo('features')}
              className="text-sm font-medium text-slate transition-colors hover:text-charcoal"
            >
              Features
            </button>

            <button
              type="button"
              onClick={() => scrollTo('how-it-works')}
              className="text-sm font-medium text-slate transition-colors hover:text-charcoal"
            >
              How it works
            </button>

            <button
              type="button"
              onClick={() => scrollTo('pricing')}
              className="text-sm font-medium text-slate transition-colors hover:text-charcoal"
            >
              Pricing
            </button>
          </div>

          <div className="hidden items-center gap-3 sm:flex">
            <button
              type="button"
              onClick={onShowAuth}
              className="rounded-lg px-3 py-2 text-sm font-semibold text-slate transition-colors hover:text-charcoal"
            >
              Sign in
            </button>

            <ActionButton href={BOOK_DEMO_URL}>
              Get started
              <ArrowRight size={15} />
            </ActionButton>
          </div>

          <button
            type="button"
            aria-label="Toggle menu"
            className="rounded-lg p-2 text-slate sm:hidden"
            onClick={() => setMobileMenuOpen((open) => !open)}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="border-t border-border bg-white px-5 py-4 sm:hidden">
            <div className="grid gap-2">
              <button
                type="button"
                onClick={() => {
                  closeMenu();
                  scrollTo('features');
                }}
                className="rounded-lg px-3 py-3 text-left text-sm font-medium text-slate"
              >
                Features
              </button>

              <button
                type="button"
                onClick={() => {
                  closeMenu();
                  scrollTo('how-it-works');
                }}
                className="rounded-lg px-3 py-3 text-left text-sm font-medium text-slate"
              >
                How it works
              </button>

              <button
                type="button"
                onClick={() => {
                  closeMenu();
                  scrollTo('pricing');
                }}
                className="rounded-lg px-3 py-3 text-left text-sm font-medium text-slate"
              >
                Pricing
              </button>

              <button
                type="button"
                onClick={onShowAuth}
                className="mt-1 rounded-xl border border-border px-4 py-3 text-sm font-semibold text-charcoal"
              >
                Sign in
              </button>

              <ActionButton href={BOOK_DEMO_URL}>
                Get started
                <ArrowRight size={15} />
              </ActionButton>
            </div>
          </div>
        )}
      </nav>

      <main>

        {/* HERO */}
        <section className="relative overflow-hidden px-5 pb-20 pt-32 sm:px-8 sm:pb-28 sm:pt-40">
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-[520px]"
            aria-hidden="true"
          >
            <div
              className="absolute left-1/2 top-[-180px] h-[560px] w-[760px] -translate-x-1/2 rounded-full opacity-[0.09] blur-3xl"
              style={{
                background:
                  'radial-gradient(circle, #16A34A 0%, transparent 68%)',
              }}
            />
          </div>

          <div className="relative mx-auto max-w-5xl">

            <div className="max-w-3xl">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-green/20 bg-green-light px-3 py-1.5 text-xs font-bold text-green">
                <span className="h-1.5 w-1.5 rounded-full bg-green" />
                Built for PG operators
              </div>

              <h1 className="max-w-4xl text-[44px] font-bold leading-[1.02] tracking-[-2.8px] text-charcoal sm:text-[64px] lg:text-[76px]">
                Run your PG
                <br />
                without the
                <span className="text-green"> daily chaos.</span>
              </h1>

              <p className="mt-7 max-w-2xl text-[17px] leading-[1.7] text-slate sm:text-[19px]">
                NivaOps brings rooms, tenants, rent, complaints, and property
                finances into one practical workspace.
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <ActionButton href={BOOK_DEMO_URL}>
                  Get started
                  <ArrowRight size={16} />
                </ActionButton>

                <ActionButton secondary onClick={onShowAuth}>
                  Sign in to NivaOps
                </ActionButton>
              </div>

              <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium text-slate">
                {[
                  'Rooms & beds',
                  'Tenant records',
                  'Rent tracking',
                  'Property finances',
                ].map((item) => (
                  <span key={item} className="inline-flex items-center gap-2">
                    <Check size={15} className="text-green" />
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* SIMPLE PRODUCT PRINCIPLE — NOT A FAKE APP SCREEN */}
            <div className="mt-20 border-y border-border py-7 sm:mt-24">
              <div className="grid gap-7 sm:grid-cols-3 sm:gap-0">
                <div className="sm:border-r sm:border-border sm:pr-8">
                  <p className="text-sm font-semibold text-charcoal">
                    One property workspace
                  </p>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate">
                    Keep the important operational information together.
                  </p>
                </div>

                <div className="sm:border-r sm:border-border sm:px-8">
                  <p className="text-sm font-semibold text-charcoal">
                    Clear daily status
                  </p>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate">
                    Know what is paid, pending, vacant, occupied, or needs attention.
                  </p>
                </div>

                <div className="sm:pl-8">
                  <p className="text-sm font-semibold text-charcoal">
                    Less manual follow-up
                  </p>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate">
                    Spend less time moving information between different tools.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section
          id="features"
          className="scroll-mt-20 border-t border-border bg-light px-5 py-20 sm:px-8 sm:py-28"
        >
          <div className="mx-auto max-w-6xl">

            <div className="max-w-2xl">
              <SectionLabel>What NivaOps handles</SectionLabel>

              <h2 className="mt-4 text-[34px] font-bold leading-[1.1] tracking-[-1.5px] text-charcoal sm:text-[46px]">
                The work you deal with every day, in one place.
              </h2>

              <p className="mt-5 max-w-xl text-[16px] leading-[1.7] text-slate">
                NivaOps is built around the actual operating work behind a PG,
                not a collection of disconnected features.
              </p>
            </div>

            <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {features.map(({ icon: Icon, eyebrow, title, body }) => (
                <article
                  key={eyebrow}
                  className="rounded-2xl border border-border bg-white p-6 transition-all duration-200 hover:-translate-y-1 hover:border-green/30 hover:shadow-[0_16px_40px_rgba(15,23,42,0.07)]"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-light">
                    <Icon size={19} className="text-green" />
                  </div>

                  <p className="mt-7 text-[11px] font-bold uppercase tracking-[0.14em] text-muted">
                    {eyebrow}
                  </p>

                  <h3 className="mt-3 text-[17px] font-bold leading-snug text-charcoal">
                    {title}
                  </h3>

                  <p className="mt-3 text-sm leading-[1.65] text-slate">
                    {body}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* WORKFLOW */}
        <section
          id="how-it-works"
          className="scroll-mt-20 border-t border-border px-5 py-20 sm:px-8 sm:py-28"
        >
          <div className="mx-auto max-w-6xl">

            <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">

              <div>
                <SectionLabel>How it works</SectionLabel>

                <h2 className="mt-4 text-[34px] font-bold leading-[1.1] tracking-[-1.5px] text-charcoal sm:text-[46px]">
                  One operating flow.
                </h2>

                <p className="mt-5 max-w-md text-[16px] leading-[1.7] text-slate">
                  Instead of managing separate pieces of information,
                  NivaOps keeps the property workflow connected.
                </p>

                <div className="mt-8">
                  <ActionButton href={BOOK_DEMO_URL}>
                    See NivaOps in action
                    <ArrowUpRight size={15} />
                  </ActionButton>
                </div>
              </div>

              <div className="divide-y divide-border border-y border-border">
                {workflow.map(({ number, title, body }) => (
                  <div
                    key={number}
                    className="grid gap-4 py-7 sm:grid-cols-[64px_1fr] sm:gap-6"
                  >
                    <span className="text-xs font-bold tracking-[0.12em] text-green">
                      {number}
                    </span>

                    <div>
                      <h3 className="text-lg font-bold text-charcoal">
                        {title}
                      </h3>

                      <p className="mt-2 max-w-xl text-sm leading-[1.7] text-slate">
                        {body}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </section>

        {/* OPERATING PRINCIPLES */}
        <section className="border-y border-border bg-midnight px-5 py-20 text-white sm:px-8 sm:py-28">
          <div className="mx-auto max-w-6xl">

            <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24">

              <div>
                <SectionLabel>Built for operators</SectionLabel>

                <h2 className="mt-4 text-[34px] font-bold leading-[1.08] tracking-[-1.5px] sm:text-[46px]">
                  Simple enough for daily work.
                  <br />
                  Useful enough to keep open.
                </h2>
              </div>

              <div className="grid gap-8 sm:grid-cols-2">
                <div className="border-t border-white/10 pt-5">
                  <p className="text-base font-semibold text-white">
                    Less scattered information
                  </p>
                  <p className="mt-2 text-sm leading-[1.7] text-white/45">
                    Put operational information where the team can find it
                    instead of relying on memory and separate records.
                  </p>
                </div>

                <div className="border-t border-white/10 pt-5">
                  <p className="text-base font-semibold text-white">
                    Clearer decisions
                  </p>
                  <p className="mt-2 text-sm leading-[1.7] text-white/45">
                    Understand the state of rooms, tenants, payments, and
                    expenses without piecing the picture together manually.
                  </p>
                </div>

                <div className="border-t border-white/10 pt-5">
                  <p className="text-base font-semibold text-white">
                    Fewer repetitive tasks
                  </p>
                  <p className="mt-2 text-sm leading-[1.7] text-white/45">
                    Keep recurring operational work structured and easier to
                    follow through.
                  </p>
                </div>

                <div className="border-t border-white/10 pt-5">
                  <p className="text-base font-semibold text-white">
                    One source of truth
                  </p>
                  <p className="mt-2 text-sm leading-[1.7] text-white/45">
                    Your property information should not be spread across
                    notebooks, spreadsheets, and chat history.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* PRICING */}
        <section
          id="pricing"
          className="scroll-mt-20 bg-light px-5 py-20 sm:px-8 sm:py-28"
        >
          <div className="mx-auto max-w-4xl">

            <div className="text-center">
              <SectionLabel>Pricing</SectionLabel>

              <h2 className="mt-4 text-[34px] font-bold tracking-[-1.5px] text-charcoal sm:text-[44px]">
                Start small. Grow with your property.
              </h2>

              <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-slate">
                Straightforward plans for operators managing one property or
                multiple properties.
              </p>
            </div>

            <div className="mt-12 grid gap-5 sm:grid-cols-2">

              {/* STARTER */}
              <div className="flex h-full flex-col rounded-2xl border border-border bg-white p-7 sm:p-8">
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-muted">
                  Starter
                </p>

                <div className="mt-6 flex items-baseline gap-1.5">
                  <span className="text-[54px] font-bold leading-none tracking-[-2.5px] text-charcoal">
                    ₹799
                  </span>
                  <span className="text-sm text-muted">/mo</span>
                </div>

                <p className="mt-2 text-sm text-muted">
                  Up to 25 beds · 1 property
                </p>

                <div className="my-7 h-px bg-border" />

                <ul className="flex-1 space-y-3">
                  {[
                    'Bed & tenant management',
                    'Rent tracking',
                    'WhatsApp reminders + UPI',
                    'Expense tracking',
                    'Mobile PWA',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <Check
                        size={15}
                        className="mt-0.5 shrink-0 text-green"
                      />
                      <span className="text-sm text-slate">{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8">
                  <ActionButton secondary href={BOOK_DEMO_URL}>
                    Get started
                  </ActionButton>
                </div>
              </div>

              {/* PRO */}
              <div className="relative flex h-full flex-col rounded-2xl bg-midnight p-7 text-white shadow-[0_24px_56px_rgba(15,23,42,0.18)] sm:p-8">

                <span className="absolute right-7 top-6 rounded-full bg-green px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                  Most popular
                </span>

                <p className="text-xs font-bold uppercase tracking-[0.15em] text-white/40">
                  Pro
                </p>

                <div className="mt-6 flex items-baseline gap-1.5">
                  <span className="text-[54px] font-bold leading-none tracking-[-2.5px] text-white">
                    ₹1,499
                  </span>
                  <span className="text-sm text-white/40">/mo</span>
                </div>

                <p className="mt-2 text-sm text-white/40">
                  Up to 100 beds · Multiple properties
                </p>

                <div className="my-7 h-px bg-white/10" />

                <ul className="flex-1 space-y-3">
                  {[
                    'Everything in Starter',
                    'Multiple properties',
                    'Unlimited tenants',
                    'Finance & P&L overview',
                    'Priority support',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <Check
                        size={15}
                        className="mt-0.5 shrink-0 text-green"
                      />
                      <span className="text-sm text-white/65">{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8">
                  <ActionButton href={BOOK_DEMO_URL}>
                    Get started
                    <ArrowRight size={15} />
                  </ActionButton>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="relative overflow-hidden bg-white px-5 py-24 text-center sm:px-8 sm:py-32">

          <div
            className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[620px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.07] blur-3xl"
            style={{
              background:
                'radial-gradient(circle, #16A34A 0%, transparent 70%)',
            }}
            aria-hidden="true"
          />

          <div className="relative mx-auto max-w-2xl">

            <SectionLabel>Get started</SectionLabel>

            <h2 className="mt-4 text-[38px] font-bold leading-[1.08] tracking-[-1.7px] text-charcoal sm:text-[52px]">
              Your PG deserves
              <br />
              a better operating system.
            </h2>

            <p className="mx-auto mt-5 max-w-lg text-[16px] leading-[1.7] text-slate">
              See how NivaOps fits into the way you already run your property.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <ActionButton href={BOOK_DEMO_URL}>
                Book a demo
                <ArrowUpRight size={15} />
              </ActionButton>

              <ActionButton secondary onClick={onShowAuth}>
                Sign in
              </ActionButton>
            </div>
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="border-t border-border bg-midnight px-5 py-8 sm:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-7 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <div className="flex items-center gap-2">
              <NivaLogo size={20} />
              <span className="text-sm font-semibold text-white">
                NivaOps
              </span>
            </div>

            <p className="mt-1 text-xs text-white/30">
              Practical operations for Indian PGs.
            </p>
          </div>

          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={() => scrollTo('features')}
              className="text-sm text-white/40 transition-colors hover:text-white/70"
            >
              Features
            </button>

            <button
              type="button"
              onClick={() => scrollTo('how-it-works')}
              className="text-sm text-white/40 transition-colors hover:text-white/70"
            >
              How it works
            </button>

            <button
              type="button"
              onClick={() => scrollTo('pricing')}
              className="text-sm text-white/40 transition-colors hover:text-white/70"
            >
              Pricing
            </button>

            <a
              href={BOOK_DEMO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-white/40 transition-colors hover:text-white/70"
            >
              Contact
            </a>
          </div>

          <p className="text-xs text-white/25">
            © 2026 NivaOps
          </p>
        </div>
      </footer>
    </div>
  );
}