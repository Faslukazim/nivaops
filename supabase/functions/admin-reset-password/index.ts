import { createClient } from 'jsr:@supabase/supabase-js@2';

const ADMIN_UID = '06d41f5f-07c6-4922-9456-3e935eef72e7';

function getUidFromToken(token: string): string | null {
  try {
    return JSON.parse(atob(token.split('.')[1])).sub ?? null;
  } catch {
    return null;
  }
}

Deno.serve(async (req: Request) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, content-type',
  };
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const token = req.headers.get('Authorization')?.replace('Bearer ', '') ?? '';
    // verify_jwt: true already validated the signature — just check the sub
    if (getUidFromToken(token) !== ADMIN_UID) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 403, headers: corsHeaders });
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const { user_id, new_password, org_id } = await req.json();
    if (!user_id || !new_password) {
      return new Response(JSON.stringify({ error: 'Missing user_id or new_password' }), { status: 400, headers: corsHeaders });
    }

    const { error: resetErr } = await supabaseAdmin.auth.admin.updateUserById(user_id, { password: new_password });
    if (resetErr) throw resetErr;

    if (org_id) {
      const { data: userRow } = await supabaseAdmin.auth.admin.getUserById(user_id);
      const email = userRow?.user?.email ?? '';
      await supabaseAdmin
        .from('admin_credentials')
        .upsert({ org_id, email, password: new_password, updated_at: new Date().toISOString() });
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return new Response(JSON.stringify({ error: message }), { status: 500, headers: { 'Access-Control-Allow-Origin': '*' } });
  }
});
