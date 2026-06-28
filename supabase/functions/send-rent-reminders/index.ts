import { createClient } from 'jsr:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, content-type',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );

  const resendKey = Deno.env.get('RESEND_API_KEY');

  const today = new Date();
  const ym = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;

  // Fetch all unpaid records for current month with tenant + org info
  const { data: records, error } = await supabase
    .from('payment_records')
    .select(`
      amount, due_day,
      tenant:tenants(name, phone),
      occupancy:occupancies(
        property:properties(
          name,
          organization_id,
          organization:organizations(name)
        ),
        room:rooms(room_number),
        bed:beds(bed_number)
      )
    `)
    .eq('month', ym)
    .eq('status', 'unpaid');

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: corsHeaders });
  }

  // Filter to actually overdue (due_day has passed)
  const overdue = (records ?? []).filter(r => today.getDate() > (r.due_day ?? 1));

  // Group by org
  const byOrg: Record<string, { orgName: string; orgId: string; items: typeof overdue }> = {};
  for (const r of overdue) {
    const prop = (r.occupancy as any)?.property;
    const orgId = prop?.organization_id;
    if (!orgId) continue;
    if (!byOrg[orgId]) {
      byOrg[orgId] = { orgName: prop?.organization?.name ?? 'Your Property', orgId, items: [] };
    }
    byOrg[orgId].items.push(r);
  }

  const results: string[] = [];

  for (const { orgName, orgId, items } of Object.values(byOrg)) {
    // Fetch org owner email
    const { data: memberships } = await supabase
      .from('memberships')
      .select('user_id, role')
      .eq('organization_id', orgId)
      .eq('role', 'owner');

    if (!memberships?.length) continue;

    for (const m of memberships) {
      const { data: userData } = await supabase.auth.admin.getUserById(m.user_id);
      const email = userData?.user?.email;
      if (!email) continue;

      const rows = items.map(r => {
        const t = r.tenant as any;
        const occ = r.occupancy as any;
        const room = occ?.room?.room_number ?? '?';
        const bed = occ?.bed?.bed_number ?? '?';
        return `  • ${t?.name ?? 'Tenant'} — Room ${room} Bed ${bed} — ₹${Number(r.amount).toLocaleString('en-IN')} overdue`;
      }).join('\n');

      const body = `Hi,

Here is today's rent collection summary for ${orgName}:

OVERDUE (${items.length} tenant${items.length !== 1 ? 's' : ''}):
${rows}

Total outstanding: ₹${items.reduce((s, r) => s + Number(r.amount), 0).toLocaleString('en-IN')}

Open NivaOps to send WhatsApp reminders or mark payments collected.

— NivaOps`;

      if (resendKey) {
        const res = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            from: 'NivaOps <reminders@nivaops.com>',
            to: [email],
            subject: `Rent reminder — ${items.length} overdue tenant${items.length !== 1 ? 's' : ''} (${orgName})`,
            text: body,
          }),
        });
        results.push(`${email}: ${res.status}`);
      } else {
        // Log when no email provider configured
        console.log(`[reminder] ${email} — ${items.length} overdue\n${rows}`);
        results.push(`${email}: logged (no RESEND_API_KEY)`);
      }
    }
  }

  return new Response(
    JSON.stringify({ ok: true, processed: overdue.length, sent: results }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
  );
});
