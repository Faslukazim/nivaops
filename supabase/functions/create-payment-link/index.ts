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

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }

  const { paymentRecordId, tenantName, phone, amount, description } = await req.json();
  if (!paymentRecordId || !amount || Number(amount) <= 0) {
    return new Response(JSON.stringify({ error: 'Missing paymentRecordId or valid amount' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }

  const supabaseAdmin = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );

  const { data: record, error: recordErr } = await supabaseAdmin
    .from('payment_records')
    .select('id, property_id, tenant_id, amount, status, payment_link_id, properties(organization_id)')
    .eq('id', paymentRecordId)
    .maybeSingle();

  if (recordErr || !record) {
    return new Response(JSON.stringify({ error: 'Payment record not found' }), { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }

  const orgId = (record as any)?.properties?.organization_id;
  if (!orgId) {
    return new Response(JSON.stringify({ error: 'Payment record is not associated with an organization' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }

  // Rent must be collected into the property's own Razorpay account.
  // Never fall back to NivaOps's platform account: doing so would make
  // NivaOps the payment recipient/intermediary and expose the platform to
  // unnecessary payment volume and compliance obligations.
  const { data: creds } = await supabaseAdmin.rpc('get_org_razorpay_credentials', { org_id: orgId });
  const row = Array.isArray(creds) ? creds[0] : creds;

  if (!row?.key_id || !row?.key_secret) {
    return new Response(
      JSON.stringify({ error: 'Razorpay is not connected for this property. Connect the PG\'s Razorpay account in Settings before collecting rent.' }),
      { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }

  // Prevent generating another link for an invoice that is already paid.
  if (record.status === 'paid') {
    return new Response(JSON.stringify({ error: 'This rent payment is already marked as paid' }), { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }

  const expectedAmount = Number(record.amount);
  const requestedAmount = Number(amount);
  if (Number.isFinite(expectedAmount) && expectedAmount > 0 && Math.round(expectedAmount * 100) !== Math.round(requestedAmount * 100)) {
    return new Response(JSON.stringify({ error: 'Payment amount does not match the rent invoice' }), { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }

  const credentials = btoa(`${row.key_id}:${row.key_secret}`);
  const expireBy = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60;

  const payload: Record<string, unknown> = {
    amount: Math.round(requestedAmount * 100),
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
    if (digits.length === 10) {
      payload.customer = { name: tenantName ?? 'Tenant', contact: `+91${digits}` };
      payload.notify = { sms: true, email: false };
    }
  }

  const rzRes = await fetch('https://api.razorpay.com/v1/payment_links', {
    method: 'POST',
    headers: { 'Authorization': `Basic ${credentials}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const rzData = await rzRes.json();
  if (!rzRes.ok) {
    return new Response(JSON.stringify({ error: rzData.error?.description ?? 'Razorpay error' }), { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }

  const { error: saveErr } = await supabaseAdmin
    .from('payment_records')
    .update({
      payment_link: rzData.short_url,
      payment_link_id: rzData.id,
      status: record.status === 'overdue' ? 'overdue' : 'payment_initiated',
    })
    .eq('id', paymentRecordId)
    .neq('status', 'paid');

  if (saveErr) {
    console.error('payment_records update failed', saveErr);
    return new Response(JSON.stringify({ error: 'Payment link was created but could not be saved. Please do not create another link yet; support can reconcile this payment link.' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }

  return new Response(
    JSON.stringify({ url: rzData.short_url, id: rzData.id }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
  );
});
