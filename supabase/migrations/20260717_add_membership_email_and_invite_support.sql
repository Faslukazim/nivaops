ALTER TABLE memberships ADD COLUMN IF NOT EXISTS email text;

UPDATE memberships m SET email = u.email
FROM auth.users u WHERE u.id = m.user_id AND m.email IS NULL;

CREATE OR REPLACE FUNCTION public.create_organization(org_name text, property_name text DEFAULT NULL::text, total_beds integer DEFAULT 0)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  new_org uuid;
begin
  if auth.uid() is null then raise exception 'not authenticated'; end if;
  if coalesce(trim(org_name), '') = '' then raise exception 'organization name is required'; end if;
  insert into public.organizations (name) values (trim(org_name)) returning id into new_org;
  insert into public.memberships (organization_id, user_id, role, email) values (new_org, auth.uid(), 'owner', auth.email());
  if coalesce(trim(property_name), '') <> '' then
    insert into public.properties (organization_id, name, total_beds)
    values (new_org, trim(property_name), greatest(coalesce(total_beds, 0), 0));
  end if;
  return new_org;
end;
$function$;
