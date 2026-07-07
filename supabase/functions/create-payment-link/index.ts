import { createClient } from 'jsr:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, content-type',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  const authHeader = req.headers.get('Authorization') ?? '';
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_ANON_KEY')!,
    { global: { headers: { Authorization: authHeader } } },
  );

  // Verify caller is authenticated
  const { data: { user }, error: authErr } = await supabase.auth.getUser();
  if (authErr || !user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: corsHeaders });
  }

  const { paymentRecordId, tenantName, phone, amount, description } = await req.json();
  if (!paymentRecordId || !amount) {
    return new Response(JSON.stringify({ error: 'Missing paymentRecordId or amount' }), { status: 400, headers: corsHeaders });
  }

  const supabaseAdmin = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );

  // Resolve which organization this payment belongs to, then use that
  // org's own Razorpay account if they've connected one — falls back to
  // the platform-wide keys (this project's own account) for orgs that
  // haven't connected their own yet.
  const { data: record } = await supabaseAdmin
    .from('payment_records')
    .select('property_id, properties(organization_id)')
    .eq('id', paymentRecordId)
    .maybeSingle();
  const orgId = (record as any)?.properties?.organization_id;

  let keyId = Deno.env.get('RAZORPAY_KEY_ID');
  let keySecret = Deno.env.get('RAZORPAY_KEY_SECRET');

  if (orgId) {
    const { data: creds } = await supabaseAdmin.rpc('get_org_razorpay_credentials', { org_id: orgId });
    const row = Array.isArray(creds) ? creds[0] : creds;
    if (row?.key_id && row?.key_secret) {
      keyId = row.key_id;
      keySecret = row.key_secret;
    }
  }

  if (!keyId || !keySecret) {
    return new Response(
      JSON.stringify({ error: 'Razorpay is not connected for this property. Add your Razorpay keys in Settings.' }),
      { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }

  const credentials = btoa(`${keyId}:${keySecret}`);
  const expireBy = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60; // 7 days

  const payload: Record<string, unknown> = {
    amount: Math.round(Number(amount) * 100), // paise
    currency: 'INR',
    description: description ?? 'Monthly rent',
    expire_by: expireBy,
    reminder_enable: true,
    notify: { sms: false, email: false },
    callback_url: `${Deno.env.get('SUPABASE_URL')}/functions/v1/razorpay-webhook`,
    callback_method: 'get',
  };

  if (phone) {
    const digits = String(phone).replace(/\D/g, '').slice(-10);
    payload.customer = { name: tenantName ?? 'Tenant', contact: `+91${digits}` };
    payload.notify = { sms: true, email: false };
  }

  const rzRes = await fetch('https://api.razorpay.com/v1/payment_links', {
    method: 'POST',
    headers: { 'Authorization': `Basic ${credentials}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const rzData = await rzRes.json();
  if (!rzRes.ok) {
    return new Response(JSON.stringify({ error: rzData.error?.description ?? 'Razorpay error' }), { status: 502, headers: corsHeaders });
  }

  await supabaseAdmin
    .from('payment_records')
    .update({ payment_link: rzData.short_url, payment_link_id: rzData.id })
    .eq('id', paymentRecordId);

  return new Response(
    JSON.stringify({ url: rzData.short_url, id: rzData.id }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
  );
});
