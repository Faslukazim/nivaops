-- Property creation never captured a city, so no existing property has one
-- set — the /pg/:city public route can't resolve anything without it.
-- Let city be set from the same Listing Settings panel as the rest of the
-- listing fields, instead of requiring a separate property-edit flow.
create or replace function public.set_property_listing(
  p_property_id uuid,
  p_is_listed boolean,
  p_city text default null,
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
      city = coalesce(nullif(trim(p_city), ''), city),
      locality = p_locality,
      listing_description = p_listing_description,
      cover_photo_url = p_cover_photo_url,
      gender_preference = coalesce(p_gender_preference, 'any'),
      amenities = coalesce(p_amenities, '{}')
  where id = p_property_id;
end;
$$;

drop function if exists public.set_property_listing(uuid, boolean, text, text, text, text, text[]);

grant execute on function public.set_property_listing(uuid, boolean, text, text, text, text, text, text[]) to authenticated;
