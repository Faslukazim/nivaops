import { createClient } from 'jsr:@supabase/supabase-js@2';

async function verifySignature(secret: string, body: string, signature: string): Promise<boolean> {
  const key = await crypto.subtle.importKey(
    'raw', new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'],
  );
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(body));
  const expected = Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, '0')).join('');
  return expected === signature;
}

// Verifies Razorpay webhook signature and marks rent paid on payment.captured event.
Deno.serve(async (req: Request) => {
  // Razorpay sends payment captured events as POST with JSON body
  if (req.method === 'POST') {
    const body = await req.text();
    const signature = req.headers.get('x-razorpay-signature') ?? '';
    const event = JSON.parse(body);

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    if (event.event === 'payment_link.paid') {
      const linkId = event.payload?.payment_link?.entity?.id;
      if (!linkId) return new Response('ok');

      // Look up which organization this payment belongs to — needed
      // because each org may have connected its own Razorpay account,
      // and each such account has its own separate webhook secret. We
      // read payment_link_id from the (not-yet-verified) payload purely
      // to route to the right secret; nothing is trusted or written
      // until the signature check below passes.
      const { data: record } = await supabase
        .from('payment_records')
        .select('id, tenant_id, property_id, properties(organization_id)')
        .eq('payment_link_id', linkId)
        .maybeSingle();

      if (!record) return new Response('ok'); // unknown link, nothing to do

      const orgId = (record as any)?.properties?.organization_id;
      let webhookSecret = Deno.env.get('RAZORPAY_WEBHOOK_SECRET');

      if (orgId) {
        const { data: creds } = await supabase.rpc('get_org_razorpay_credentials', { org_id: orgId });
        const row = Array.isArray(creds) ? creds[0] : creds;
        if (row?.webhook_secret) webhookSecret = row.webhook_secret;
      }

      if (!webhookSecret) {
        return new Response('Webhook secret not configured', { status: 500 });
      }
      if (!(await verifySignature(webhookSecret, body, signature))) {
        return new Response('Invalid signature', { status: 400 });
      }

      const { error: updateErr } = await supabase
        .from('payment_records')
        .update({ status: 'paid', paid_at: new Date().toISOString() })
        .eq('payment_link_id', linkId);
      if (updateErr) console.error('payment_records update failed', updateErr);

      // Keep occupancies.payment_status in sync — this is what the
      // Tenants tab and Dashboard actually read from.
      if (record.tenant_id) {
        const { error: occErr } = await supabase
          .from('occupancies')
          .update({ payment_status: 'Paid', payment_date: new Date().toISOString().slice(0, 10) })
          .eq('tenant_id', record.tenant_id)
          .eq('status', 'active');
        if (occErr) console.error('occupancies sync failed', occErr);
      }
    }
    return new Response('ok');
  }

  // GET callback from Razorpay redirect after payment — redirect user to app
  const appUrl = Deno.env.get('APP_URL') ?? 'https://nivaops.com';
  return new Response(null, { status: 302, headers: { Location: `${appUrl}?payment=done` } });
});
