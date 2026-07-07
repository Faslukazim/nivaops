-- Each organization can connect its own Razorpay account, so rent money
-- lands directly in that hostel owner's bank account. NivaOps never pools
-- payments — this keeps NivaOps a software tool, not a payment
-- intermediary (avoids RBI Payment Aggregator licensing entirely).
--
-- key_id is not sensitive on its own (Razorpay key IDs are meant to be
-- public-ish, similar to a publishable key) so it's stored in plain text.
-- key_secret and webhook_secret are true secrets — stored in Supabase
-- Vault (encrypted at rest), with only a UUID reference kept on the
-- organizations row.

alter table public.organizations
  add column if not exists razorpay_key_id text,
  add column if not exists razorpay_key_secret_id uuid references vault.secrets(id) on delete set null,
  add column if not exists razorpay_webhook_secret_id uuid references vault.secrets(id) on delete set null;

-- Security-definer RPC: only an org owner can set their own org's
-- Razorpay credentials. Client calls this directly via supabase.rpc();
-- it upserts the secret into Vault and stores the reference id.
create or replace function public.set_org_razorpay_credentials(
  org_id uuid,
  key_id text,
  key_secret text,
  webhook_secret text default null
)
returns void
language plpgsql
security definer
set search_path = public, vault
as $$
declare
  existing_secret_id uuid;
  existing_webhook_id uuid;
  new_secret_id uuid;
  new_webhook_id uuid;
begin
  if not public.is_org_owner(org_id) then
    raise exception 'not authorized';
  end if;

  select razorpay_key_secret_id, razorpay_webhook_secret_id
    into existing_secret_id, existing_webhook_id
  from public.organizations where id = org_id;

  if existing_secret_id is not null then
    update vault.secrets set secret = key_secret, updated_at = now() where id = existing_secret_id;
    new_secret_id := existing_secret_id;
  else
    new_secret_id := vault.create_secret(key_secret, 'razorpay_key_secret_' || org_id::text);
  end if;

  if webhook_secret is not null then
    if existing_webhook_id is not null then
      update vault.secrets set secret = webhook_secret, updated_at = now() where id = existing_webhook_id;
      new_webhook_id := existing_webhook_id;
    else
      new_webhook_id := vault.create_secret(webhook_secret, 'razorpay_webhook_secret_' || org_id::text);
    end if;
  else
    new_webhook_id := existing_webhook_id;
  end if;

  update public.organizations
  set razorpay_key_id = key_id,
      razorpay_key_secret_id = new_secret_id,
      razorpay_webhook_secret_id = new_webhook_id
  where id = org_id;
end;
$$;

grant execute on function public.set_org_razorpay_credentials(uuid, text, text, text) to authenticated;

-- Org owner can check whether credentials are connected (not the secret
-- values themselves — just key_id + a boolean for "is configured").
create or replace function public.get_org_razorpay_status(org_id uuid)
returns table(key_id text, is_configured boolean, webhook_configured boolean)
language sql
stable
security definer
set search_path = public
as $$
  select
    o.razorpay_key_id,
    o.razorpay_key_secret_id is not null,
    o.razorpay_webhook_secret_id is not null
  from public.organizations o
  where o.id = org_id
    and public.is_org_member(org_id);
$$;

grant execute on function public.get_org_razorpay_status(uuid) to authenticated;

-- Used only by edge functions (via the service-role client) to resolve an
-- organization's own Razorpay credentials at request time. Deliberately
-- NOT granted to authenticated/anon — only the service role can call this,
-- since it returns decrypted secrets.
create or replace function public.get_org_razorpay_credentials(org_id uuid)
returns table(key_id text, key_secret text, webhook_secret text)
language sql
stable
security definer
set search_path = public, vault
as $$
  select
    o.razorpay_key_id,
    ks.decrypted_secret,
    ws.decrypted_secret
  from public.organizations o
  left join vault.decrypted_secrets ks on ks.id = o.razorpay_key_secret_id
  left join vault.decrypted_secrets ws on ws.id = o.razorpay_webhook_secret_id
  where o.id = org_id;
$$;

revoke all on function public.get_org_razorpay_credentials(uuid) from public, authenticated, anon;
grant execute on function public.get_org_razorpay_credentials(uuid) to service_role;
