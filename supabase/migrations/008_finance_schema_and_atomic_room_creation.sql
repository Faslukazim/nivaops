-- Consolidates finance prerequisites that previously lived outside the Supabase
-- migration directory, and makes room + bed creation transactional.

create table if not exists public.expenses (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,
  organization_id uuid references public.organizations(id) on delete cascade,
  category text not null check (category in ('building_rent', 'food', 'salary', 'electricity', 'internet', 'maintenance', 'misc')),
  amount numeric(12,2) not null check (amount >= 0),
  description text,
  expense_date date not null,
  created_at timestamptz not null default now()
);

create table if not exists public.cash_flow_items (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,
  organization_id uuid references public.organizations(id) on delete cascade,
  type text not null check (type in ('building_rent', 'salary', 'emi', 'other')),
  label text not null,
  amount numeric(12,2) not null check (amount >= 0),
  due_day integer not null check (due_day between 1 and 31),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.occupancies
  add column if not exists rent_due_day integer check (rent_due_day between 1 and 28);

update public.occupancies
set rent_due_day = least(greatest(extract(day from start_date)::integer, 1), 28)
where rent_due_day is null and start_date is not null;

update public.occupancies set rent_due_day = 1 where rent_due_day is null;
alter table public.occupancies alter column rent_due_day set default 1;
alter table public.occupancies alter column rent_due_day set not null;

update public.expenses e
set organization_id = p.organization_id
from public.properties p
where e.property_id = p.id and e.organization_id is null;

update public.cash_flow_items c
set organization_id = p.organization_id
from public.properties p
where c.property_id = p.id and c.organization_id is null;

alter table public.expenses enable row level security;
alter table public.cash_flow_items enable row level security;

drop policy if exists expense_select on public.expenses;
drop policy if exists expense_insert on public.expenses;
drop policy if exists expense_update on public.expenses;
drop policy if exists expense_delete on public.expenses;
create policy expense_select on public.expenses for select using (public.is_org_member(organization_id));
create policy expense_insert on public.expenses for insert with check (public.is_org_member(organization_id));
create policy expense_update on public.expenses for update using (public.is_org_member(organization_id)) with check (public.is_org_member(organization_id));
create policy expense_delete on public.expenses for delete using (public.is_org_member(organization_id));

drop policy if exists cf_item_select on public.cash_flow_items;
drop policy if exists cf_item_insert on public.cash_flow_items;
drop policy if exists cf_item_update on public.cash_flow_items;
drop policy if exists cf_item_delete on public.cash_flow_items;
create policy cf_item_select on public.cash_flow_items for select using (public.is_org_member(organization_id));
create policy cf_item_insert on public.cash_flow_items for insert with check (public.is_org_member(organization_id));
create policy cf_item_update on public.cash_flow_items for update using (public.is_org_member(organization_id)) with check (public.is_org_member(organization_id));
create policy cf_item_delete on public.cash_flow_items for delete using (public.is_org_member(organization_id));

create index if not exists expenses_property_date_idx on public.expenses (property_id, expense_date desc);
create index if not exists cash_flow_items_property_active_idx on public.cash_flow_items (property_id, active);

create or replace function public.create_room_with_beds(
  p_property_id uuid,
  p_room_number text,
  p_bed_count integer
)
returns jsonb
language plpgsql
as $$
declare
  new_room public.rooms;
  created_beds jsonb;
begin
  if coalesce(trim(p_room_number), '') = '' then
    raise exception 'room number is required';
  end if;
  if p_bed_count is null or p_bed_count < 1 or p_bed_count > 50 then
    raise exception 'bed count must be between 1 and 50';
  end if;

  insert into public.rooms (property_id, room_number, capacity, status)
  values (p_property_id, trim(p_room_number), p_bed_count, 'active')
  returning * into new_room;

  insert into public.beds (room_id, bed_number, status)
  select new_room.id, series::text, 'available'
  from generate_series(1, p_bed_count) as series;

  select coalesce(jsonb_agg(to_jsonb(b) order by b.bed_number::integer), '[]'::jsonb)
  into created_beds
  from public.beds b
  where b.room_id = new_room.id;

  return jsonb_build_object('room', to_jsonb(new_room), 'beds', created_beds);
end;
$$;

grant execute on function public.create_room_with_beds(uuid, text, integer) to authenticated;
