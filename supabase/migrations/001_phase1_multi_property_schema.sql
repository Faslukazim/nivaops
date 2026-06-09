create extension if not exists "pgcrypto";

do $$
begin
  if to_regclass('public.tenants') is not null
    and exists (
      select 1
      from information_schema.columns
      where table_schema = 'public'
        and table_name = 'tenants'
        and column_name in ('roomNumber', 'room_number', 'monthlyRent', 'monthly_rent')
    )
    and to_regclass('public.legacy_tenants') is null then
    alter table public.tenants rename to legacy_tenants;
  end if;
end $$;

create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.properties (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  address text,
  city text,
  total_beds integer not null default 0 check (total_beds >= 0),
  status text not null default 'active' check (status in ('active', 'inactive', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.rooms (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,
  room_number text not null,
  floor text,
  capacity integer not null default 1 check (capacity > 0),
  status text not null default 'active' check (status in ('active', 'inactive', 'maintenance', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint rooms_property_room_number_key unique (property_id, room_number)
);

create table if not exists public.beds (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.rooms(id) on delete cascade,
  bed_number text not null,
  status text not null default 'available' check (status in ('available', 'occupied', 'maintenance', 'reserved', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint beds_room_bed_number_key unique (room_id, bed_number)
);

create table if not exists public.tenants (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  property_id uuid not null references public.properties(id) on delete cascade,
  name text not null,
  phone text not null,
  join_date date not null,
  status text not null default 'active' check (status in ('active', 'archived', 'moved_out', 'suspended')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.occupancies (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  property_id uuid not null references public.properties(id) on delete cascade,
  room_id uuid not null references public.rooms(id) on delete restrict,
  bed_id uuid not null references public.beds(id) on delete restrict,
  monthly_rent numeric(12,2) not null default 0 check (monthly_rent >= 0),
  payment_status text not null default 'Unpaid' check (payment_status in ('Paid', 'Unpaid')),
  payment_date date,
  start_date date not null,
  end_date date,
  status text not null default 'active' check (status in ('active', 'ended', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists occupancies_one_active_per_bed_idx
  on public.occupancies (bed_id)
  where status = 'active';

create index if not exists properties_organization_id_idx on public.properties (organization_id);
create index if not exists rooms_property_id_idx on public.rooms (property_id);
create index if not exists beds_room_id_idx on public.beds (room_id);
create index if not exists tenants_organization_id_idx on public.tenants (organization_id);
create index if not exists tenants_property_id_idx on public.tenants (property_id);
create index if not exists tenants_status_idx on public.tenants (status);
create index if not exists occupancies_tenant_id_idx on public.occupancies (tenant_id);
create index if not exists occupancies_property_id_idx on public.occupancies (property_id);
create index if not exists occupancies_room_id_idx on public.occupancies (room_id);
create index if not exists occupancies_bed_id_idx on public.occupancies (bed_id);
create index if not exists occupancies_status_idx on public.occupancies (status);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_organizations_updated_at on public.organizations;
create trigger set_organizations_updated_at
before update on public.organizations
for each row execute function public.set_updated_at();

drop trigger if exists set_properties_updated_at on public.properties;
create trigger set_properties_updated_at
before update on public.properties
for each row execute function public.set_updated_at();

drop trigger if exists set_rooms_updated_at on public.rooms;
create trigger set_rooms_updated_at
before update on public.rooms
for each row execute function public.set_updated_at();

drop trigger if exists set_beds_updated_at on public.beds;
create trigger set_beds_updated_at
before update on public.beds
for each row execute function public.set_updated_at();

drop trigger if exists set_tenants_updated_at on public.tenants;
create trigger set_tenants_updated_at
before update on public.tenants
for each row execute function public.set_updated_at();

drop trigger if exists set_occupancies_updated_at on public.occupancies;
create trigger set_occupancies_updated_at
before update on public.occupancies
for each row execute function public.set_updated_at();

alter table public.organizations enable row level security;
alter table public.properties enable row level security;
alter table public.rooms enable row level security;
alter table public.beds enable row level security;
alter table public.tenants enable row level security;
alter table public.occupancies enable row level security;

drop policy if exists mvp_public_select on public.organizations;
create policy mvp_public_select on public.organizations for select using (true);
drop policy if exists mvp_public_insert on public.organizations;
create policy mvp_public_insert on public.organizations for insert with check (true);
drop policy if exists mvp_public_update on public.organizations;
create policy mvp_public_update on public.organizations for update using (true) with check (true);
drop policy if exists mvp_public_delete on public.organizations;
create policy mvp_public_delete on public.organizations for delete using (true);

drop policy if exists mvp_public_select on public.properties;
create policy mvp_public_select on public.properties for select using (true);
drop policy if exists mvp_public_insert on public.properties;
create policy mvp_public_insert on public.properties for insert with check (true);
drop policy if exists mvp_public_update on public.properties;
create policy mvp_public_update on public.properties for update using (true) with check (true);
drop policy if exists mvp_public_delete on public.properties;
create policy mvp_public_delete on public.properties for delete using (true);

drop policy if exists mvp_public_select on public.rooms;
create policy mvp_public_select on public.rooms for select using (true);
drop policy if exists mvp_public_insert on public.rooms;
create policy mvp_public_insert on public.rooms for insert with check (true);
drop policy if exists mvp_public_update on public.rooms;
create policy mvp_public_update on public.rooms for update using (true) with check (true);
drop policy if exists mvp_public_delete on public.rooms;
create policy mvp_public_delete on public.rooms for delete using (true);

drop policy if exists mvp_public_select on public.beds;
create policy mvp_public_select on public.beds for select using (true);
drop policy if exists mvp_public_insert on public.beds;
create policy mvp_public_insert on public.beds for insert with check (true);
drop policy if exists mvp_public_update on public.beds;
create policy mvp_public_update on public.beds for update using (true) with check (true);
drop policy if exists mvp_public_delete on public.beds;
create policy mvp_public_delete on public.beds for delete using (true);

drop policy if exists mvp_public_select on public.tenants;
create policy mvp_public_select on public.tenants for select using (true);
drop policy if exists mvp_public_insert on public.tenants;
create policy mvp_public_insert on public.tenants for insert with check (true);
drop policy if exists mvp_public_update on public.tenants;
create policy mvp_public_update on public.tenants for update using (true) with check (true);
drop policy if exists mvp_public_delete on public.tenants;
create policy mvp_public_delete on public.tenants for delete using (true);

drop policy if exists mvp_public_select on public.occupancies;
create policy mvp_public_select on public.occupancies for select using (true);
drop policy if exists mvp_public_insert on public.occupancies;
create policy mvp_public_insert on public.occupancies for insert with check (true);
drop policy if exists mvp_public_update on public.occupancies;
create policy mvp_public_update on public.occupancies for update using (true) with check (true);
drop policy if exists mvp_public_delete on public.occupancies;
create policy mvp_public_delete on public.occupancies for delete using (true);

insert into public.organizations (name)
select 'Default Organization'
where not exists (select 1 from public.organizations);

insert into public.properties (organization_id, name, total_beds)
select organizations.id, 'Main Hostel', 24
from public.organizations
where organizations.name = 'Default Organization'
  and not exists (select 1 from public.properties);

do $$
declare
  legacy_exists boolean;
begin
  select to_regclass('public.legacy_tenants') is not null into legacy_exists;

  if legacy_exists then
    create temporary table legacy_tenant_rows on commit drop as
    select
      coalesce(nullif(name::text, ''), 'Unnamed Tenant') as name,
      coalesce(nullif(phone::text, ''), 'Unknown') as phone,
      coalesce(nullif(coalesce(
        case when to_jsonb(legacy_tenants) ? 'roomNumber' then to_jsonb(legacy_tenants)->>'roomNumber' end,
        case when to_jsonb(legacy_tenants) ? 'room_number' then to_jsonb(legacy_tenants)->>'room_number' end,
        case when to_jsonb(legacy_tenants) ? 'roomnumber' then to_jsonb(legacy_tenants)->>'roomnumber' end
      ), ''), 'Unassigned') as room_number,
      coalesce(nullif(coalesce(
        case when to_jsonb(legacy_tenants) ? 'monthlyRent' then to_jsonb(legacy_tenants)->>'monthlyRent' end,
        case when to_jsonb(legacy_tenants) ? 'monthly_rent' then to_jsonb(legacy_tenants)->>'monthly_rent' end,
        case when to_jsonb(legacy_tenants) ? 'monthlyrent' then to_jsonb(legacy_tenants)->>'monthlyrent' end
      ), ''), '0')::numeric(12,2) as monthly_rent,
      coalesce(nullif(coalesce(
        case when to_jsonb(legacy_tenants) ? 'joinDate' then to_jsonb(legacy_tenants)->>'joinDate' end,
        case when to_jsonb(legacy_tenants) ? 'join_date' then to_jsonb(legacy_tenants)->>'join_date' end,
        case when to_jsonb(legacy_tenants) ? 'joindate' then to_jsonb(legacy_tenants)->>'joindate' end
      ), ''), current_date::text)::date as join_date,
      coalesce(nullif(coalesce(
        case when to_jsonb(legacy_tenants) ? 'paymentStatus' then to_jsonb(legacy_tenants)->>'paymentStatus' end,
        case when to_jsonb(legacy_tenants) ? 'payment_status' then to_jsonb(legacy_tenants)->>'payment_status' end,
        case when to_jsonb(legacy_tenants) ? 'paymentstatus' then to_jsonb(legacy_tenants)->>'paymentstatus' end
      ), ''), 'Unpaid') as payment_status,
      nullif(coalesce(
        case when to_jsonb(legacy_tenants) ? 'paymentDate' then to_jsonb(legacy_tenants)->>'paymentDate' end,
        case when to_jsonb(legacy_tenants) ? 'payment_date' then to_jsonb(legacy_tenants)->>'payment_date' end,
        case when to_jsonb(legacy_tenants) ? 'paymentdate' then to_jsonb(legacy_tenants)->>'paymentdate' end
      ), '')::date as payment_date
    from public.legacy_tenants;

    insert into public.rooms (property_id, room_number, capacity)
    select distinct properties.id, legacy_tenant_rows.room_number, 1
    from legacy_tenant_rows
    cross join public.properties
    where properties.name = 'Main Hostel'
    on conflict (property_id, room_number) do nothing;

    insert into public.beds (room_id, bed_number, status)
    select rooms.id, '1', 'available'
    from public.rooms
    join public.properties on properties.id = rooms.property_id
    where properties.name = 'Main Hostel'
    on conflict (room_id, bed_number) do nothing;

    insert into public.tenants (organization_id, property_id, name, phone, join_date, status)
    select organizations.id, properties.id, rows.name, rows.phone, rows.join_date, 'active'
    from legacy_tenant_rows rows
    cross join public.organizations
    cross join public.properties
    where organizations.name = 'Default Organization'
      and properties.name = 'Main Hostel'
      and not exists (
        select 1
        from public.tenants
        where tenants.phone = rows.phone
          and tenants.name = rows.name
          and tenants.property_id = properties.id
      );

    insert into public.occupancies (
      tenant_id,
      property_id,
      room_id,
      bed_id,
      monthly_rent,
      payment_status,
      payment_date,
      start_date,
      status
    )
    select
      tenants.id,
      properties.id,
      rooms.id,
      beds.id,
      rows.monthly_rent,
      case when rows.payment_status = 'Paid' then 'Paid' else 'Unpaid' end,
      rows.payment_date,
      rows.join_date,
      'active'
    from legacy_tenant_rows rows
    join public.properties on properties.name = 'Main Hostel'
    join public.rooms on rooms.property_id = properties.id and rooms.room_number = rows.room_number
    join public.beds on beds.room_id = rooms.id and beds.bed_number = '1'
    join public.tenants on tenants.property_id = properties.id
      and tenants.name = rows.name
      and tenants.phone = rows.phone
    where not exists (
      select 1
      from public.occupancies
      where occupancies.tenant_id = tenants.id
        and occupancies.status = 'active'
    )
    on conflict do nothing;

    update public.beds
    set status = 'occupied'
    where exists (
      select 1
      from public.occupancies
      where occupancies.bed_id = beds.id
        and occupancies.status = 'active'
    );
  end if;
end $$;
