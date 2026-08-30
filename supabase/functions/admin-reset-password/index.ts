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

    const { user_id, new_password } = await req.json();
    if (!user_id || !new_password || new_password.length < 8) {
      return new Response(JSON.stringify({ error: 'Missing user_id or new_password' }), { status: 400, headers: corsHeaders });
    }

    const { error: resetErr } = await supabaseAdmin.auth.admin.updateUserById(user_id, { password: new_password });
    if (resetErr) throw new Error(resetErr.message);

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    const status = message === 'Unauthorized' ? 403 : 500;
    return new Response(JSON.stringify({ error: message }), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
