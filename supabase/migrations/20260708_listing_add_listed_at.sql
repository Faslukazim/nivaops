-- Reuses properties.updated_at (already bumped by the standard
-- set_updated_at trigger on every listing edit) as a "recently listed"
-- signal for the public page, instead of adding a dedicated column.
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
  vacant_beds integer,
  listed_at timestamptz
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
    count(b.id) filter (where b.status = 'available')::int as vacant_beds,
    p.updated_at as listed_at
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
