# NivaOps Brand Kit v1.1 (drafted with Fable, 2026-07-05)

Refines the v1.0 brand kit by resolving the Emerald-vs-Success green collision and re-grounding the kit in the founder's actual vision and existing shipped codebase.

---

## 1. The Green Collision: Resolved

**Decision: unify. There is one green — Niva Green `#16A34A` — and it is retired from ordinary UI as a "brand accent."**

Splitting the two greens (say, teal-shifting the brand accent) would fail the actual test: a mid-range AMOLED panel at 40% brightness in direct sun crushes hue differences that look obvious on a designer's monitor. Two "unmistakably different" greens indoors are the same green outdoors. So we don't compete — we give green a single, sacred meaning: **money received.** Paid status, income totals, deposit-returned — nothing else. The logo's folded corner already uses this green; that's fine, because the logo isn't an interactive status signal.

What loses its green: primary buttons, links, active tabs, brand highlights. Those become **Midnight `#111827`** — the navy of the "n" itself. Primary CTA = solid navy button, white text. This is quietly right for the brand story too: the tool *is* the doorway (navy n), and green appears only when operations flow through it — exactly the founder's "folded corner = continuous operations" metaphor, made functional.

Ambiguity backup for status (sunlight + colorblind insurance): status is never color-alone. Paid = filled green pill with ✓, Overdue = filled red pill with amount, Due soon = amber **outline** pill. Fill-vs-outline reads even in grayscale.

## 2. Palette

| Role | Name | Hex | Notes |
|---|---|---|---|
| Primary / brand / CTA | Midnight | `#111827` | Buttons, active nav, headings, links |
| Paid | Niva Green | `#16A34A` | Money-in only. Drop `#00C853` entirely — it's the flashier, less trustworthy green |
| Overdue | Brick | `#DC2626` | Filled pill + rupee amount |
| Due soon | Turmeric | `#D97706` | Warmer than `#F59E0B`; outline pill. Matches existing `amber` token |
| Background | Chalk | `#F7F7F5` | Warm off-white (keep the existing `mist`) — the one degree of warmth that separates this from cold slate-gray SaaS |
| Surface / card | White | `#FFFFFF` | Cards sit on Chalk |
| Border | Hairline | `#E2E8F0` | |
| Text primary | Ink | `#0F1117` | |
| Text secondary | Slate | `#64748B` | 4.5:1 on white — keep `#64748B` per codebase |
| Decorative / supporting | Terrace | `#C2703D` | Muted clay-brown. Empty states, onboarding illustrations, tiny warmth touches. Never on data. Nods to Indian building material without going full terracotta-cliché |

Note this is nearly the shipped codebase palette — deliberately. The product already got it right; the brand kit v1.0 drifted from it. Brand should follow the pilot, not fight it.

## 3. Typography: Replace Geist

Geist is Vercel's font — literally the typeface of developer-tool SaaS, the opposite of "their tool, not a template." More practically: it's tuned for dense technical UI, and this audience needs bigger, rounder, unmistakable numerals.

**Use IBM Plex Sans + IBM Plex Sans Devanagari.** Reasons, in order: (1) tabular figures with excellent numeral legibility — this app is 70% rupee amounts and dates; (2) a matched Devanagari companion means Hindi support later costs nothing and looks native, which no trendy geometric sans offers; (3) it has genuine character (humanist warmth, slightly engineered) without being a "personality font"; (4) open license, ships from the app bundle, renders well on low-DPI Android. Weights: SemiBold 600 headings, Medium 500 labels/pills, Regular 400 body. Minimum body size 16px — non-negotiable for this audience.

## 4. Voice & Tagline

"Built around spaces. Designed for operations." is a problem — it's B2B wallpaper. No PG owner has ever said "operations." The founder's real pitch is: you shouldn't need Excel and memory to know who's paid.

**Tagline: "Your PG, in your pocket."**
Fallback/secondary line for the landing page: *"Who's paid, who's due, which beds are free — one glance."*

**Voice: Plain, Certain, On their side.** Concretely: short sentences; rupees and names, never jargon ("3 tenants overdue — ₹21,000" not "outstanding receivables"); always say what to do next; WhatsApp-message register, because that's where these owners already live. Never: "leverage," "streamline," "seamless," exclamation marks.

## 5. Why this doesn't read as AI-template

The one ownable choice: **navy does the talking, green does exactly one job.** Every AI-generated SaaS kit spends its accent color everywhere — gradient hero, buttons, icons, highlights — so color means nothing. NivaOps inverts that: the interface is calm warm-white and navy (the doorway), and green appears *only* when rent has actually arrived — so over weeks of daily use, the owner's eye is trained that green = money in the bank, a Pavlovian association no template has because templates don't have a point of view about what their accent color *means*. Paired with Plex's Devanagari-ready pragmatism, Turmeric instead of stock amber, a clay decorative tone used sparingly, and a tagline in the customer's own register, the kit reads as a tool grown out of one real hostel's daily 8 a.m. rent-check — which is exactly what it is.
