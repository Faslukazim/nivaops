-- Some deposits were collected years before this software existed and the
-- money was already distributed as profit between partners in those months'
-- accounts. The tenant still owes nothing further and is still legally owed
-- their deposit back on move-out — but that cash is not sitting in a bank
-- account waiting to be refunded, so it shouldn't count toward the "Deposits
-- Held" dashboard liability figure. This flag lets us mark those specific
-- historical deposits without touching the actual refund workflow.

alter table public.occupancies
  add column if not exists deposit_pre_accounted boolean not null default false;

comment on column public.occupancies.deposit_pre_accounted is
  'True for deposits collected before this software was in use, where the cash was already recognized as profit in a prior accounting period. Excluded from the "Deposits Held" liability total, but does not affect refund eligibility on vacate.';

-- One-time backfill: mark all currently-held deposits for StayB Hostel
-- (the 2-year-old pre-existing property) as pre-accounted.
update public.occupancies o
set deposit_pre_accounted = true
from public.properties p
where o.property_id = p.id
  and p.organization_id = 'd58a3cb8-9b68-4947-b743-0da9f0e27a41'  -- StayB Hostel
  and o.status = 'active'
  and o.deposit_status = 'held'
  and o.deposit_amount > 0;
