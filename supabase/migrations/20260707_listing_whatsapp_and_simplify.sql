-- Rent asking price and a per-bed breakdown were more detail than owners
-- want to manage or prospects need — the public page now just needs a
-- real WhatsApp number to route enquiries to, and a vacancy count.
alter table public.properties
  add column if not exists whatsapp_number text;

drop function if exists public.get_listed_properties(text);

create function public.get_listed_properties(p_city text default null)
returns table(
  id uuid,
  name text,
  city text,
  locality text,
  listing_description text,
  cover_photo_url text,
  gender_preference text,
  amenities text[],
  whatsapp_number text,
  vacant_beds integer
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
    p.whatsapp_number,
    count(b.id) filter (where b.status = 'available')::int as vacant_beds
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

drop function if exists public.get_listed_property_beds(uuid);
drop function if exists public.set_bed_asking_rent(uuid, numeric);
drop function if exists public.set_property_listing(uuid, boolean, text, text, text, text, text, text[]);

create function public.set_property_listing(
  p_property_id uuid,
  p_is_listed boolean,
  p_city text default null,
  p_locality text default null,
  p_listing_description text default null,
  p_cover_photo_url text default null,
  p_gender_preference text default 'any',
  p_amenities text[] default '{}',
  p_whatsapp_number text default null
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
      city = coalesce(nullif(trim(p_city), ''), city),
      locality = p_locality,
      listing_description = p_listing_description,
      cover_photo_url = p_cover_photo_url,
      gender_preference = coalesce(p_gender_preference, 'any'),
      amenities = coalesce(p_amenities, '{}'),
      whatsapp_number = nullif(trim(p_whatsapp_number), '')
  where id = p_property_id;
end;
$$;

grant execute on function public.set_property_listing(uuid, boolean, text, text, text, text, text, text[], text) to authenticated;
