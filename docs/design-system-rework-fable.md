# NivaOps Design System — Three Directions (drafted with Fable, 2026-07-05)

The constraint stack, stated plainly: the green/red/amber status triad is sacred (it's the product's core information system), everything must survive a ₹8,000 Android screen at 50% brightness in direct sun (so: high contrast, no subtle grays doing important work), and the feeling should shift from "generic SaaS template" to "something with a point of view." All three directions below keep ink-on-light as the base — dark UI chrome is a non-starter for outdoor legibility — and differentiate on the *warmth layer* around the status colors.

---

## Direction 1: "Courtyard" — warm paper and terracotta

**Personality:** The app feels like a well-kept ledger book — familiar, warm, handled daily. A hostel owner opens it and it feels like *their* register, not a bank's software.

**Palette logic:** Shift the entire neutral axis from blue-gray to warm gray, and introduce terracotta as the brand accent. Terracotta (a desaturated red-orange) sits far enough from coral (a pure red) and amber (a yellow-orange) on the hue wheel to never be confused with a status — it reads as "brand," they read as "state."

- Background: `#FAF6F1` (warm paper, replaces mist)
- Cards: `#FFFFFF` with border `#E8E0D5` (warm sand border)
- Primary text: `#1C1917` (warm near-black, stone-950 territory)
- Secondary text: `#78716C` (warm stone gray, replaces slate2)
- Brand accent: `#C2542B` terracotta (buttons, active nav, links)
- Status colors barely move: paid `#15803D` (slightly deeper green to hold contrast on warm paper), overdue `#DC2626`, due-soon `#B45309` (deepened amber — critical, because amber on warm cream loses contrast fast; this keeps ~4.5:1)

**Typography:** Humanist and slightly rounded — open apertures, generous x-height, friendly numerals. Nothing geometric or cold; the numbers should feel handwritten-adjacent even in a clean typeface.

**Why it fits:** Terracotta, sandstone, and warm plaster are the literal material palette of Indian residential buildings — this makes the app feel like it belongs to the building it manages, not to a Bangalore startup office.

---

## Direction 2: "Signal" — confident indigo with high-voltage status

**Personality:** The app feels like a serious financial instrument that happens to be friendly — the vibe of a good UPI app. Opening it says "your money is handled."

**Palette logic:** Keep neutrals cool and crisp (close to today), but add a deep indigo brand color and *increase* the saturation and size of status colors so they become the personality rather than decoration. Indigo is the one strong hue that's maximally distant from all three status hues (green/red/amber) — zero collision risk, and it carries "trust/finance" associations Indians already have from banking and UPI apps.

- Background: `#F8F9FB` (near-white, cooler and brighter than mist — better in sunlight)
- Primary text: keep `#0F1117`
- Secondary: `#5B6472` (slightly darker than slate2 for outdoor contrast)
- Brand: `#3730A3` deep indigo (primary buttons, nav, headers); tint `#EEF0FF` for selected states
- Status: keep `#16A34A` / `#E5484D` / `#D97706` *exactly* — but promote them to filled chips and bold left-borders instead of subtle text tints. Status becomes loud on purpose.

**Typography:** Sharp, high-contrast, tabular — authoritative numerals with strong weight jumps (regular body, heavy money figures). Feels like a bank statement designed by someone who cares.

**Why it fits:** PG owners already trust the visual language of GPay/PhonePe with real money daily — borrowing that "deep blue + loud transactional color" grammar imports trust NivaOps hasn't earned yet on its own.

---

## Direction 3: "Verandah" — deep green heritage with brass warmth

**Personality:** Calm, established, a little proud — the app feels like a family-run lodge that's been running well for twenty years. Quiet confidence rather than energy.

**Palette logic:** The boldest move: make *green* the brand — but split the green axis. Brand green goes deep and blue-leaning (a forest/racing green, `#14532D`–`#1B4332` range), while status-paid green stays bright and yellow-leaning (`#16A34A`). Dark green and bright green never occupy the same role: brand green is always large surfaces/headers/buttons, status green is always small chips/text — the size+context difference plus the hue split keeps them legible as different things. Add a muted brass/gold (`#B8860B`-adjacent, e.g. `#A16207`) strictly for decorative moments (icons, dividers, empty states) — never for status, since it's amber's neighbor.

- Background: `#F6F5F0` (warm off-white with a green undertone)
- Primary text: `#122117` (green-black)
- Secondary: `#6B7268`
- Brand: `#1B4332` deep green; headers/hero sections use it as the "midnight" replacement on the landing page
- Status: paid `#16A34A`, overdue `#E5484D`, due-soon `#D97706` — unchanged

**Typography:** Warm and human with a touch of tradition — a serif or semi-serif for headings/landing (heritage, permanence), clean humanist sans for UI and numbers. The only direction with two typographic voices.

**Why it fits:** The lodge/PG business in India is a legacy, family-reputation business — deep green + brass reads as "established institution," which flatters owners who see themselves as proprietors, not app users.

**Honest risk:** brand-green vs. status-green requires discipline; it's the most distinctive direction but the only one where the status system needs guardrails.

---

## Recommendation

Fable's pick: **Courtyard** — it delivers the most warmth-per-unit-of-risk — the status triad stays untouched in role and nearly untouched in value, warm neutrals photograph beautifully on cheap AMOLED and LCD panels alike, terracotta is a genuinely ownable color no competing PG/property SaaS uses, and it's a mechanical Tailwind token swap a solo founder can ship in a weekend. That said, all three are viable: choose Signal if trust-borrowing from UPI apps matters most, or Verandah if you want the most distinctive brand and are willing to police the two-greens rule.
