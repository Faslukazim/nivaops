import { createClient } from 'jsr:@supabase/supabase-js@2';

async function verifySignature(secret: string, body: string, signature: string): Promise<boolean> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(body));
  const expected = Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  // Webhook signatures are hexadecimal SHA-256 HMAC values.
  return expected === signature;
}

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

// Razorpay sends the raw request body for webhook signature verification.
// Rent is marked paid only after the signature, amount, and currency are verified.
Deno.serve(async (req: Request) => {
  if (req.method === 'POST') {
    const body = await req.text();
    const signature = req.headers.get('x-razorpay-signature') ?? '';

    let event: any;
    try {
      event = JSON.parse(body);
    } catch {
      return new Response('Invalid JSON', { status: 400 });
    }

    if (event.event !== 'payment_link.paid') {
      return new Response('ok');
    }

    // Use the payment-link ID only to locate the organization-specific
    // webhook secret. The payload is not trusted until the HMAC passes.
    const linkId = event.payload?.payment_link?.entity?.id;
    if (!linkId) return new Response('ok');

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const { data: record, error: recordErr } = await supabase
      .from('payment_records')
      .select('id, tenant_id, amount, status, payment_link_id, properties(organization_id)')
      .eq('payment_link_id', linkId)
      .maybeSingle();

    if (recordErr) {
      console.error('payment_records lookup failed', recordErr);
      return new Response('Database error', { status: 500 });
    }

    if (!record) return new Response('ok');

    const orgId = (record as any)?.properties?.organization_id;
    let webhookSecret = Deno.env.get('RAZORPAY_WEBHOOK_SECRET');

    if (orgId) {
      const { data: creds, error: credsErr } = await supabase.rpc(
        'get_org_razorpay_credentials',
        { org_id: orgId },
      );
      if (credsErr) {
        console.error('Razorpay credentials lookup failed', credsErr);
        return new Response('Database error', { status: 500 });
      }

      const row = Array.isArray(creds) ? creds[0] : creds;
      if (row?.webhook_secret) webhookSecret = row.webhook_secret;
    }

    if (!webhookSecret) {
      return new Response('Webhook secret not configured', { status: 500 });
    }

    if (!(await verifySignature(webhookSecret, body, signature))) {
      return new Response('Invalid signature', { status: 400 });
    }

    const paymentLink = event.payload?.payment_link?.entity ?? {};
    const order = event.payload?.order?.entity ?? {};
    const payment = event.payload?.payment?.entity ?? {};

    // Razorpay amounts are expressed in the smallest currency unit.
    // A payment_link.paid event must settle the full invoice, not merely
    // an arbitrary or partial amount.
    const expectedAmountPaise = Math.round(Number(record.amount) * 100);
    const paidAmountPaise = Number(
      paymentLink.amount_paid ?? order.amount_paid ?? payment.amount,
    );
    const currency = paymentLink.currency ?? order.currency ?? payment.currency;

    if (!Number.isFinite(expectedAmountPaise) || expectedAmountPaise <= 0) {
      console.error('Invalid invoice amount', { paymentRecordId: record.id, amount: record.amount });
      return new Response('Invalid invoice amount', { status: 409 });
    }

    if (!Number.isFinite(paidAmountPaise) || paidAmountPaise !== expectedAmountPaise) {
      console.error('Payment amount mismatch', {
        paymentRecordId: record.id,
        expectedAmountPaise,
        paidAmountPaise,
        linkId,
      });
      return new Response('Payment amount mismatch', { status: 409 });
    }

    if (currency && currency !== 'INR') {
      console.error('Unexpected payment currency', { paymentRecordId: record.id, currency, linkId });
      return new Response('Unexpected payment currency', { status: 409 });
    }

    // Idempotency: Razorpay can retry webhook delivery. Once this invoice is
    // paid, a duplicate event must be harmless and must not create a second
    // financial transition.
    if (record.status === 'paid') {
      return new Response('ok');
    }

    const paidAt = new Date().toISOString();
    const { error: updateErr } = await supabase
      .from('payment_records')
      .update({ status: 'paid', paid_at: paidAt })
      .eq('id', record.id)
      .neq('status', 'paid');

    if (updateErr) {
      console.error('payment_records update failed', updateErr);
      return new Response('Database error', { status: 500 });
    }

    // Keep the existing tenant-facing status in sync. payment_records remains
    // the financial source of truth.
    if (record.tenant_id) {
      const { error: occErr } = await supabase
        .from('occupancies')
        .update({
          payment_status: 'Paid',
          payment_date: paidAt.slice(0, 10),
        })
        .eq('tenant_id', record.tenant_id)
        .eq('status', 'active');

      if (occErr) {
        // Do not turn a successful rent payment into a webhook retry loop just
        // because a derived UI status failed to sync. The financial record is
        // already marked paid and can be reconciled from payment_records.
        console.error('occupancies sync failed', occErr);
      }
    }

    return new Response('ok');
  }

  // GET callback from the Payment Link redirect. This is only a UX redirect;
  // server-side payment confirmation happens through the webhook above.
  const appUrl = Deno.env.get('APP_URL') ?? 'https://nivaops.com';
  return new Response(null, {
    status: 302,
    headers: { Location: `${appUrl}?payment=done` },
  });
});
