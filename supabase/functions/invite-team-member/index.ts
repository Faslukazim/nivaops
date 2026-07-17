import { createClient } from 'jsr:@supabase/supabase-js@2';

const ALLOWED_ROLES = ['manager', 'staff'];

Deno.serve(async (req: Request) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, content-type',
  };
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const token = req.headers.get('Authorization')?.replace('Bearer ', '') ?? '';
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const { data: callerData, error: callerErr } = await supabaseAdmin.auth.getUser(token);
    if (callerErr || !callerData?.user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: corsHeaders });
    }

    const { organizationId, email, password, role } = await req.json();
    if (!organizationId || !email || !password || !ALLOWED_ROLES.includes(role)) {
      return new Response(JSON.stringify({ error: 'Missing or invalid fields' }), { status: 400, headers: corsHeaders });
    }
    if (password.length < 6) {
      return new Response(JSON.stringify({ error: 'Password must be at least 6 characters' }), { status: 400, headers: corsHeaders });
    }

    const { data: membership, error: memErr } = await supabaseAdmin
      .from('memberships')
      .select('role')
      .eq('organization_id', organizationId)
      .eq('user_id', callerData.user.id)
      .maybeSingle();
    if (memErr) throw new Error(memErr.message);
    if (!membership || membership.role !== 'owner') {
      return new Response(JSON.stringify({ error: 'Only the organization owner can invite team members' }), { status: 403, headers: corsHeaders });
    }

    const { data: newUser, error: createErr } = await supabaseAdmin.auth.admin.createUser({
      email, password, email_confirm: true,
    });
    if (createErr) throw new Error(createErr.message);

    const { error: insertErr } = await supabaseAdmin
      .from('memberships')
      .insert({ user_id: newUser.user.id, organization_id: organizationId, role, email });
    if (insertErr) throw new Error(insertErr.message);

    return new Response(JSON.stringify({ success: true, user_id: newUser.user.id }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return new Response(JSON.stringify({ error: message }), { status: 500, headers: { 'Access-Control-Allow-Origin': '*' } });
  }
});
