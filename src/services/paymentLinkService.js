import { hasSupabaseConfig, supabase, supabaseFunctionsUrl } from '../lib/supabase';

export async function createPaymentLink({ paymentRecordId, tenantName, phone, amount, description }) {
  if (!hasSupabaseConfig || !supabaseFunctionsUrl) throw new Error('Supabase not configured');

  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error('Not signed in');

  const res = await fetch(`${supabaseFunctionsUrl}/create-payment-link`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${session.access_token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ paymentRecordId, tenantName, phone, amount, description }),
  });

  const json = await res.json();
  if (!res.ok) throw new Error(json.error ?? 'Failed to create payment link');
  return json.url;
}
