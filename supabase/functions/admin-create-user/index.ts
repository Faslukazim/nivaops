import { createClient } from 'jsr:@supabase/supabase-js@2';

const ADMIN_UID = '06d41f5f-07c6-4922-9456-3e935eef72e7';

async function requireAdmin(token: string) {
  if (!token) throw new Error('Unauthorized');
  const authClient = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_ANON_KEY')!,
    { auth: { persistSession: false } },
  );
  const { data, error } = await authClient.auth.getUser(token);
  if (error || data.user?.id !== ADMIN_UID) throw new Error('Unauthorized');
}

Deno.serve(async (req: Request) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, content-type',
  };
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const token = req.headers.get('Authorization')?.replace(/^Bearer\s+/i, '') ?? '';
    await requireAdmin(token);

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const { email, password, org_name, property_name, plan } = await req.json();
    if (!email || !password || !org_name || password.length < 8) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400, headers: corsHeaders });
    }

    const { data: newUser, error: createErr } = await supabaseAdmin.auth.admin.createUser({
      email, password, email_confirm: true,
    });
    if (createErr) throw new Error(createErr.message);

    const { data: org, error: orgErr } = await supabaseAdmin
      .from('organizations').insert({ name: org_name, approved: true, plan: plan === 'pro' ? 'pro' : 'starter' }).select().single();
    if (orgErr) throw new Error(orgErr.message);

    const { error: memErr } = await supabaseAdmin
      .from('memberships').insert({ user_id: newUser.user.id, organization_id: org.id, role: 'owner' });
    if (memErr) throw new Error(memErr.message);

    if (property_name) {
      await supabaseAdmin.from('properties').insert({ name: property_name, organization_id: org.id, status: 'active' });
    }

    return new Response(JSON.stringify({ success: true, user_id: newUser.user.id, org_id: org.id }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    const status = message === 'Unauthorized' ? 403 : 500;
    return new Response(JSON.stringify({ error: message }), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
