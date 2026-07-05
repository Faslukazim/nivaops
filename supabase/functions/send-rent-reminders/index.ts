import { createClient } from 'jsr:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, content-type',
};

async function sendSms(apiKey: string, phone: string, message: string): Promise<string> {
  const digits = String(phone).replace(/\D/g, '').slice(-10);
  const res = await fetch('https://www.fast2sms.com/dev/bulkV2', {
    method: 'POST',
    headers: { 'authorization': apiKey, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      route: 'q',
      message,
      language: 'english',
      flash: 0,
      numbers: digits,
    }),
  });
  const json = await res.json();
  return json.return ? 'sent' : (json.message?.[0] ?? 'failed');
}

async function createPaymentLink(
  keyId: string,
  keySecret: string,
  supabaseUrl: string,
  opts: { paymentRecordId: string; tenantName: string; phone: string; amount: number },
): Promise<string | null> {
  const credentials = btoa(`${keyId}:${keySecret}`);
  const expireBy = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60;
  const digits = String(opts.phone).replace(/\D/g, '').slice(-10);

  const payload: Record<string, unknown> = {
    amount: Math.round(Number(opts.amount) * 100),
    currency: 'INR',
    description: 'Monthly rent',
    expire_by: expireBy,
    reminder_enable: true,
    notify: { sms: false, email: false },
    callback_url: `${supabaseUrl}/functions/v1/razorpay-webhook`,
    callback_method: 'get',
    customer: { name: opts.tenantName || 'Tenant', contact: `+91${digits}` },
  };

  const res = await fetch('https://api.razorpay.com/v1/payment_links', {
    method: 'POST',
    headers: { 'Authorization': `Basic ${credentials}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) {
    console.error('razorpay error', data);
    return null;
  }
  return data.short_url ?? null;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabase = createClient(supabaseUrl, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);

  const fast2smsKey = Deno.env.get('FAST2SMS_API_KEY');
  const razorpayKeyId = Deno.env.get('RAZORPAY_KEY_ID');
  const razorpayKeySecret = Deno.env.get('RAZORPAY_KEY_SECRET');

  const today = new Date();
  const ym = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;

  // Fetch all unpaid records for current month with tenant + room info
  const { data: records, error } = await supabase
    .from('payment_records')
    .select(`
      id, amount, due_day, payment_link,
      tenant:tenants(name, phone),
      occupancy:occupancies(
        property:properties(name, organization_id),
        room:rooms(room_number),
        bed:beds(bed_number)
      )
    `)
    .eq('month', ym)
    .eq('status', 'unpaid');

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: corsHeaders });
  }

  // Only remind tenants whose due day has passed (overdue) or is today
  const dueToday = (records ?? []).filter(r => today.getDate() >= (r.due_day ?? 1));

  const results: string[] = [];

  for (const r of dueToday) {
    const tenant = r.tenant as any;
    const room = (r.occupancy as any)?.room;
    const bed = (r.occupancy as any)?.bed;
    if (!tenant?.phone) { results.push(`record ${r.id}: no phone on file`); continue; }

    // Reuse an existing link if one was already generated for this record,
    // otherwise generate a fresh one via Razorpay.
    let link = r.payment_link as string | null;
    if (!link && razorpayKeyId && razorpayKeySecret) {
      link = await createPaymentLink(razorpayKeyId, razorpayKeySecret, supabaseUrl, {
        paymentRecordId: r.id,
        tenantName: tenant.name,
        phone: tenant.phone,
        amount: r.amount,
      });
      if (link) {
        await supabase.from('payment_records').update({ payment_link: link }).eq('id', r.id);
      }
    }

    const roomBed = room?.room_number ? ` (Room ${room.room_number}${bed?.bed_number ? ` Bed ${bed.bed_number}` : ''})` : '';
    const msg = link
      ? `Hi ${tenant.name}, your rent of Rs.${r.amount}${roomBed} is due. Pay now: ${link}`
      : `Hi ${tenant.name}, your rent of Rs.${r.amount}${roomBed} is due. Please pay via your usual method.`;

    if (fast2smsKey) {
      const status = await sendSms(fast2smsKey, tenant.phone, msg);
      results.push(`${tenant.name} (${tenant.phone}): ${status}${link ? ' + link' : ' (no link — Razorpay not configured)'}`);
    } else {
      console.log(`[reminder] ${tenant.phone} — ${msg}`);
      results.push(`${tenant.name}: logged only (no FAST2SMS_API_KEY)`);
    }
  }

  return new Response(
    JSON.stringify({ ok: true, processed: dueToday.length, results }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
  );
});
