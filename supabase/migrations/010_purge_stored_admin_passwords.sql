-- Passwords are authentication secrets and must never be retained by the app.
-- Keep the legacy table temporarily because existing admin RPCs may still join it,
-- but irreversibly remove every stored password value.

do $$
begin
  if to_regclass('public.admin_credentials') is not null then
    execute 'delete from public.admin_credentials';
  end if;
end $$;
