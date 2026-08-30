-- Reservations are property-scoped and may reserve one bed at a time.

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  property_id uuid not null references public.properties(id) on delete cascade,
  room_id uuid not null references public.rooms(id) on delete restrict,
  bed_id uuid not null references public.beds(id) on delete restrict,
  name text not null,
  phone text not null default '',
  advance_amount numeric(12,2) not null default 0 check (advance_amount >= 0),
  expected_join_date date,
  status text not null default 'pending' check (status in ('pending', 'cancelled', 'converted')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists bookings_one_pending_per_bed_idx
  on public.bookings (bed_id) where status = 'pending';
create index if not exists bookings_property_status_idx on public.bookings (property_id, status, created_at desc);

drop trigger if exists set_bookings_updated_at on public.bookings;
create trigger set_bookings_updated_at before update on public.bookings
for each row execute function public.set_updated_at();

alter table public.bookings enable row level security;
drop policy if exists booking_select on public.bookings;
drop policy if exists booking_insert on public.bookings;
drop policy if exists booking_update on public.bookings;
drop policy if exists booking_delete on public.bookings;
create policy booking_select on public.bookings for select using (public.is_org_member(organization_id));
create policy booking_insert on public.bookings for insert with check (public.is_org_member(organization_id));
create policy booking_update on public.bookings for update using (public.is_org_member(organization_id)) with check (public.is_org_member(organization_id));
create policy booking_delete on public.bookings for delete using (public.is_org_member(organization_id));
