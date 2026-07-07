# NivaOps — Project Context

PG (paying guest) / hostel management SaaS for Indian operators. Built for StayB as the primary real-world user and pilot customer. Goal: become the default operations tool for small-to-mid Indian PG/hostel owners (10-100 beds) — currently running on WhatsApp + Excel or nothing.

## Product Vision & Roadmap

**Where we are:** solid operations core (tenant/room/bed management, rent tracking, deposits, expenses, P&L) plus a working multi-tenant payment layer (Razorpay payment links, auto-reminders, webhook-driven paid status). One real paying customer (StayB) using it daily.

**Positioning:** the closest real comparison is hostel/small-hotel PMS tools (Cloudbeds, eZee) — not big enterprise property management (Yardi, AppFolio, which assume whole-unit leases, not bed-level occupancy). The India-specific PG-management SaaS niche is genuinely thin — that's the opportunity, not a gap to worry about.

**Roadmap horizons (deliberate, not urgent — timeline is months, not days):**
- **Near-term:** staff/manager logins with limited permissions (schema already supports `role` on `memberships`, not yet surfaced in UI); compliance layer (police tenant verification, rental agreement generation — India-specific pain point, we already store ID photos as a foundation)
- **Mid-term (the real differentiator):** a public discovery/listings page (e.g. `nivaops.com/pg/bangalore`) surfacing live vacant beds across connected hostels — flips the pitch from "manage your PG" to "we bring you tenants." Only makes sense once there are ~20-30 connected properties; an empty search page helps no one.
- **Long-term:** vendor marketplace (laundry, food, maintenance — commission revenue), rent benchmarking against local market data (we already collect the data, just don't surface it).

**Explicit tension to resolve deliberately, not accidentally:** a discovery/listings layer edges toward tenant-facing surfaces, which conflicts with the "no tenant portal" rule below. That's fine to revisit later — just don't drift into it without a real decision.

## Stack

- **React 18 + Vite** — no router. Page switching via CSS `hidden` + a `mountedPages` Set (keeps pages mounted after first visit)
- **Tailwind CSS** — utility classes only, no component library
- **Supabase** — PostgreSQL + Auth + Storage + Edge Functions + Vault (project ID: `drlkmfhpthhkvnljuprm`)
- **Deployed on Vercel** — auto-deploys from `main` branch
- **Razorpay** — payment links, per-organization connected accounts (see Payment Architecture)
- **PWA** — installable on Android (native prompt) and iOS (manual guide)

## Design Tokens

| Token | Value | Usage |
|---|---|---|
| `ink` | `#0F1117` | Primary text |
| `slate2` | `#64748B` | Secondary text, labels |
| `mist` | `#F7F7F5` | Page background, cards |
| `border` | `#E2E8F0` | All borders |
| `leaf` | `#16A34A` | Success, paid, income |
| `coral` | `#E5484D` | Error, overdue, expenses |
| `amber` | `#D97706` | Warning, due soon, pending |

These are the **shipped, real** tokens — do not change without an explicit decision. Design exploration drafts (brand kit proposals, Fable-generated direction docs) live in `docs/` for reference only and are **not adopted** unless/until explicitly implemented.

Z-index layers: bottom nav `z-50` → overlays/drawers `z-[60]` → modals `z-[70]` → toasts `z-[200]`.

## File Map

```
src/
  App.jsx              — root state, all page components (TenantsPage, DashboardPage, Header, etc.)
  FinancePage.jsx      — Finance tab: Rent | Income | Expenses | P&L | Cashflow sub-tabs + Payment Gateway settings
  RoomsPage.jsx        — Rooms tab with bed-level detail, bookings
  TenantProfile.jsx    — Slide-up tenant detail drawer (inline edit, payment history)
  AuthPage.jsx         — Login / signup
  OnboardingPage.jsx   — First-run property setup
  Root.jsx             — Auth gate, session management, PWA install banner
  LandingPage.jsx      — Marketing site
  AdminPage.jsx        — Super-admin panel (org approval, user management) — admin UID gated
  components/ui.jsx    — Shared UI primitives: Card, Btn, Label, WhatsAppLink, PaymentLinkBtn, SignOutBtn, toast-aware components
  lib/toast.jsx        — ToastProvider + useToast — mounted once at main.jsx root
  services/
    tenantService.js    — CRUD for tenants + occupancies, fetchVacatedTenants
    propertyService.js  — fetchProperties (org_id, upi_id), rooms/beds CRUD
    paymentService.js   — payment records, mark paid/unpaid, fetchCurrentMonthPaymentRecord (used by PaymentLinkBtn)
    paymentLinkService.js — createPaymentLink (calls edge function), saveRazorpayCredentials, fetchRazorpayStatus
    bookingService.js   — bed booking/reservation flow (createBooking, convertBooking, cancelBooking)
    financeService.js   — expenses, cashflow items, budget tracking (localStorage)
    incomeService.js    — income_records (extra charges + day guests), ID photo upload/signed URL
    activityService.js  — activity log (localStorage-backed)
    authService.js       — Supabase auth helpers
    seedService.js       — demo seed / clear workspace
  utils/paymentStatus.js — STATUS enum, computeTenantStatus, tenantDaysOverdue

supabase/
  functions/
    create-payment-link/    — generates Razorpay payment link, resolves per-org credentials
    razorpay-webhook/        — verifies signature (per-org secret), marks payment_records + occupancies paid
    send-rent-reminders/     — daily cron, generates links + SMS for due/overdue tenants
    admin-create-user/, admin-reset-password/ — admin-only, service-role
  migrations/  — chronological, apply via Supabase MCP `apply_migration`, mirrored here for history
```

## Database Schema (key tables)

- `organizations` — multi-tenant root. Also holds `razorpay_key_id` (plain), `razorpay_key_secret_id` / `razorpay_webhook_secret_id` (Vault references — see Payment Architecture)
- `memberships` — user ↔ org link, `role` ('owner'|'manager'|'staff') — role beyond owner not yet enforced in UI
- `properties` — has `organization_id`, `upi_id`, `status`
- `rooms` — belongs to property
- `beds` — belongs to room, `status` ('available'|'reserved'|'occupied') — derived from tenant/booking presence in most read paths, but this column is the write-path source of truth; keep both in sync (see the booking/convert bug history below)
- `tenants` — has `id_photo_url`
- `occupancies` — links tenant+bed, holds `monthly_rent`, `deposit_amount`, `deposit_status`, `deposit_pre_accounted` (legacy deposits excluded from liability reporting), `deposit_settled_at`, `status` ('active'|'ended'), `end_date`, `payment_status` (synced from payment_records — this is what Tenants tab/Dashboard read)
- `payment_records` — monthly rent tracking per occupancy, `payment_link` / `payment_link_id` (Razorpay), `status`
- `bookings` — pending bed reservations, `advance_amount` (must be carried into TenantForm on conversion — see Key Patterns)
- `expenses` — property-scoped expenses
- `income_records` — type: `'extra_charge'` | `'day_guest'`, holds `category`, `amount`, `daily_rate`, `days`, `name`, `phone`, `id_photo_url`
- `cash_flow_items` — recurring obligations (building rent, EMIs)

RLS: all tables use `is_org_member(organization_id)` / `is_property_member(property_id)` helper functions.

## Payment Architecture (multi-tenant Razorpay)

**Model: each organization connects its own Razorpay account.** NivaOps never pools payments — rent goes straight from tenant to the hostel owner's own bank account. This is deliberate: pooling multiple merchants' payments through one account triggers RBI Payment Aggregator licensing in India. This is the same "Connect" pattern Shopify/Stripe Connect/Razorpay Route formalize, just the simpler "bring your own account" variant (no fund holding, no platform cut).

**Storage:** `organizations.razorpay_key_id` is plain text (not sensitive). `razorpay_key_secret_id` / `razorpay_webhook_secret_id` are UUID references into Supabase Vault (`vault.secrets`) — the actual secret values are never in a plain column.

**RPCs:**
- `set_org_razorpay_credentials(org_id, key_id, key_secret, webhook_secret)` — security-definer, only callable by the org owner (`is_org_owner` check). Client calls this directly via `supabase.rpc()`.
- `get_org_razorpay_status(org_id)` — returns connection status (key_id + booleans), never the secrets. Used by the Settings UI.
- `get_org_razorpay_credentials(org_id)` — **service-role only** (revoked from authenticated/anon), returns decrypted secrets. Used exclusively by edge functions.

**Edge function credential resolution:** all three payment edge functions resolve the specific organization's credentials at request time (via property_id → organization_id), falling back to the platform's own global secrets (`RAZORPAY_KEY_ID`/`SECRET` in Supabase Edge Function secrets) for orgs that haven't connected their own yet. This is how StayB keeps working unchanged while new orgs can bring their own account.

**Webhook signature verification is per-org:** each connected Razorpay account has its own webhook secret. `razorpay-webhook` reads `payment_link_id` from the (not-yet-trusted) payload to look up which org it belongs to, resolves *that* org's webhook secret, then verifies. Fails closed (500) if no secret resolves — never skips verification.

**Webhook must sync two tables:** on `payment_link.paid`, update both `payment_records.status` AND `occupancies.payment_status` (+ `payment_date`). Missing the second one was a real shipped bug — the Rent tab showed "Paid" correctly but Tenants tab/Dashboard silently disagreed since they read `occupancies`, not `payment_records`.

**`PaymentLinkBtn`** (`components/ui.jsx`) is the universal payment-link component — drop in anywhere with `propertyId`/`tenantId`/`phone`/`name`, it resolves its own current-month payment record on demand via `fetchCurrentMonthPaymentRecord`. Used in Rooms, Tenants, Dashboard, TenantProfile, Finance.

**iOS Safari clipboard gotcha:** `navigator.clipboard.writeText()` silently fails if called after any `await` — iOS drops clipboard permission once a promise resolves. `PaymentLinkBtn` never copies on the same click that generates the link; copying only happens on a later, fresh (synchronous) click once the link is already known. Don't reintroduce copy-immediately-after-async-generate.

## Communication / Reminders

- **Manual WhatsApp** (`WhatsAppLink` in `components/ui.jsx`) — `wa.me` deep links, works only via human tap (cannot be triggered server-side)
- **Automated SMS** (`send-rent-reminders` edge function, daily cron via `pg_cron`) — Fast2SMS, fires on/after due day (not yet before — T-1 day reminder was discussed but not built)
- **Razorpay's own SMS** — fires automatically when a payment link is first created with a phone attached (`notify.sms: true`), but only once per link — reusing an existing link does not re-trigger it
- **True automated WhatsApp** (server-initiated, no human tap) requires WhatsApp Business API via a BSP (AiSensy recommended for this stage — cheapest entry, real support desk; Gupshup/Twilio/direct Meta API are viable later at higher volume) — not yet built, needs template pre-approval before use

## Key Patterns

**Page switching** — `mountedPages` Set keeps pages alive. `hidden` class hides inactive pages. Never unmount a page after first visit.

**Property scoping** — `selectedPropertyId` is the root filter. All queries filter by it. `organizationId` is derived from `properties.find(p => p.id === selectedPropertyId)?.organization_id`.

**UPI ID** — stored per-property in `properties.upi_id`. Synced to App state as `upiId` on property change. Prop-drilled to every `WhatsAppLink`.

**Tenant UI object** — `toUiTenant(occupancy)` in tenantService maps DB snake_case → camelCase for the UI. Key fields: `id`, `occupancyId`, `propertyId`, `roomId`, `bedId`, `name`, `phone`, `roomNumber`, `bedNumber`, `monthlyRent`, `joinDate`, `rentDueDay`, `paymentStatus`, `depositAmount`, `depositStatus`, `depositPreAccounted`, `admissionFee`, `id_photo_url`.

**Floor sort** — G→F→S→T using `FLOOR_ORDER` map in propertyService.js.

**Bed status must match derived truth** — `beds.status` is a hand-maintained column that must be kept in sync with actual occupancy/booking state. Every event that changes occupancy (assign, vacate, move, cancel booking, **convert booking to tenant**) must update it. A shipped bug: `convertBooking` marked the booking `converted` but left the bed `reserved` forever if the tenant form was abandoned — always reset to `available` on convert, let `createTenant` set it `occupied` when actually saved.

**Booking advance must carry through conversion** — `booking.advance_amount` (money already collected) must flow into the TenantForm as `prefill.advanceAmount` and net out of the auto-calculated move-in collection total, with a visible note. Silently dropping it caused a real accounting mismatch.

**Destructive/rare actions get an overflow menu, not equal billing** — Rename/Delete property live behind a "⋮" menu next to the property switcher, not as always-visible icons at the same weight as the switcher itself. Same principle for any future rare/destructive action.

**Modals must render via `createPortal(..., document.body)`** — any modal triggered from inside a component with a CSS `transform` (e.g. the swipe-to-reveal wrapper on `TenantCard`) will render squeezed inside that ancestor's box instead of covering the viewport, because a transform creates a new containing block for `position: fixed` descendants. `VacateModal` hit this; fixed via portal. Default to portal-rendering any new modal to avoid rediscovering this.

**Toast positioning must clear the mobile bottom nav** — `Toaster` sits at `bottom-[calc(4.75rem+env(safe-area-inset-bottom,0px))] sm:bottom-4`, not a flat `bottom-4`, since the fixed `BottomNav` bar occupies that space on mobile.

**Mobile hamburger menu is a real overlay, not an accordion** — the Header's mobile menu renders via portal with a dimmed/blurred backdrop and a floating drawer panel, not an inline expand-in-place that pushes page content down.

**Toast feedback required for every async user action** — silent failures (swallowed catch blocks, icon-only buttons with no state change) read as broken even when they work. Every `PaymentLinkBtn`/form submit surfaces a toast on success and failure, not just a subtle color change.

**Confirm before undo/destructive rent actions** — "Undo" on a paid rent record needs an inline Yes/No confirm (it clears `amount_collected`/`deduction_reason` too), matching the pattern already used for mark-unpaid elsewhere.

## Demo Account

- Email: `demo@stayops.com` / Password: `demo2026`
- Seeded via `seedSampleWorkspace()` in seedService — real StayB tenant names
- Seed/clear buttons visible on Dashboard for demo org

## What NOT to build (still holds, reconsider deliberately if it changes)

Do not add: authentication changes beyond what exists, pricing pages, dark mode, multi-currency, CSV export, PDF generation, push notifications, tenant-facing portal or login.

**Now built, no longer on this list:** org-level settings (Razorpay connection), analytics/reporting (P&L, Financial Health widgets), RBAC groundwork (`memberships.role` column exists, not yet enforced in UI — building UI enforcement is in scope, the column already isn't new ground).

**Deliberately deferred, not forbidden:** staff/manager permission enforcement in UI, maintenance tracking, tenant-facing surfaces (see Product Vision — the discovery-layer idea reopens this question later, on purpose, not by accident).

## Git / Deploy

- Always use local `git` commands — GitHub MCP `push_files` returns 403
- `main` branch auto-deploys to Vercel
- Force pushes need explicit user confirmation
- Migrations go in `supabase/migrations/` and must also be applied via Supabase MCP `apply_migration`
- Edge function changes must be deployed via Supabase MCP `deploy_edge_function` — editing the file in the repo alone does not update the live function
