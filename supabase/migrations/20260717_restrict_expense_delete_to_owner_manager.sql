CREATE OR REPLACE FUNCTION public.is_org_owner_or_manager(org uuid)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  select exists (
    select 1 from public.memberships m
    where m.organization_id = org and m.user_id = auth.uid() and m.role in ('owner', 'manager')
  );
$function$;

DROP POLICY IF EXISTS expense_delete ON public.expenses;
CREATE POLICY expense_delete ON public.expenses
  FOR DELETE USING (is_org_owner_or_manager(organization_id));
