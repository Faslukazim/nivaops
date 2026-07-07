-- Public PG/hostel discovery listings. An org can opt a property into a
-- public, read-only directory (nivaops.com/pg/:city) that surfaces live
-- vacant beds to prospective tenants — no tenant login, no portal, just a
-- read-only marketing surface. Owner controls what's shown and can turn it
-- off any time via is_listed.

alter table public.properties
  add column if not exists is_listed boolean not null default false,
  add column if not exists locality text,
  add column if not exists listing_description text,
  add column if not exists cover_photo_url text,
  add column if not exists gender_preference text not null default 'any'
    check (gender_preference in ('any', 'male', 'female')),
  add column if not exists amenities text[] not null default '{}';

alter table public.beds
  add column if not exists asking_rent numeric(12,2);

-- Public directory: only listed properties, only vacancy counts + safe
-- marketing fields. No tenant data, no financials beyond asking rent.
create or replace function public.get_listed_properties(p_city text default null)
returns table(
  id uuid,
  name text,
  city text,
  locality text,
  listing_description text,
  cover_photo_url text,
  gender_preference text,
  amenities text[],
  vacant_beds integer,
  min_asking_rent numeric,
  max_asking_rent numeric
)
language sql
stable
security definer
set search_path = public
as $$
  select
    p.id,
    p.name,
    p.city,
    p.locality,
    p.listing_description,
    p.cover_photo_url,
    p.gender_preference,
    p.amenities,
    count(b.id) filter (where b.status = 'available')::int as vacant_beds,
    min(b.asking_rent) filter (where b.status = 'available') as min_asking_rent,
    max(b.asking_rent) filter (where b.status = 'available') as max_asking_rent
  from public.properties p
  join public.rooms r on r.property_id = p.id
  join public.beds b on b.room_id = r.id
  where p.is_listed = true
    and p.status = 'active'
    and (p_city is null or p.city ilike p_city)
  group by p.id
  having count(b.id) filter (where b.status = 'available') > 0;
$$;

grant execute on function public.get_listed_properties(text) to anon, authenticated;

-- Detail view for a single listed property: vacant beds with room number
-- and asking rent, for the property detail page.
create or replace function public.get_listed_property_beds(p_property_id uuid)
returns table(
  room_number text,
  bed_number text,
  asking_rent numeric
)
language sql
stable
security definer
set search_path = public
as $$
  select r.room_number, b.bed_number, b.asking_rent
  from public.properties p
  join public.rooms r on r.property_id = p.id
  join public.beds b on b.room_id = r.id
  where p.id = p_property_id
    and p.is_listed = true
    and p.status = 'active'
    and b.status = 'available'
  order by r.room_number, b.bed_number;
$$;

grant execute on function public.get_listed_property_beds(uuid) to anon, authenticated;

-- Owner-only: update this org's own property listing settings.
create or replace function public.set_property_listing(
  p_property_id uuid,
  p_is_listed boolean,
  p_locality text default null,
  p_listing_description text default null,
  p_cover_photo_url text default null,
  p_gender_preference text default 'any',
  p_amenities text[] default '{}'
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  org_id uuid;
begin
  select organization_id into org_id from public.properties where id = p_property_id;
  if org_id is null or not public.is_org_owner(org_id) then
    raise exception 'not authorized';
  end if;

  update public.properties
  set is_listed = p_is_listed,
      locality = p_locality,
      listing_description = p_listing_description,
      cover_photo_url = p_cover_photo_url,
      gender_preference = coalesce(p_gender_preference, 'any'),
      amenities = coalesce(p_amenities, '{}')
  where id = p_property_id;
end;
$$;

grant execute on function public.set_property_listing(uuid, boolean, text, text, text, text, text[]) to authenticated;

-- Owner-only: set per-bed asking rent (shown to prospective tenants once listed).
create or replace function public.set_bed_asking_rent(p_bed_id uuid, p_asking_rent numeric)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  org_id uuid;
begin
  select p.organization_id into org_id
  from public.beds b
  join public.rooms r on r.id = b.room_id
  join public.properties p on p.id = r.property_id
  where b.id = p_bed_id;

  if org_id is null or not public.is_org_owner(org_id) then
    raise exception 'not authorized';
  end if;

  update public.beds set asking_rent = p_asking_rent where id = p_bed_id;
end;
$$;

grant execute on function public.set_bed_asking_rent(uuid, numeric) to authenticated;
