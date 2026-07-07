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

// Saves this organization's own Razorpay account credentials so rent
// payments go straight into their own bank account. Only the org owner
// can call this (enforced server-side by set_org_razorpay_credentials).
export async function saveRazorpayCredentials(organizationId, { keyId, keySecret, webhookSecret }) {
  if (!hasSupabaseConfig) throw new Error('Supabase not configured');
  const { error } = await supabase.rpc('set_org_razorpay_credentials', {
    org_id: organizationId,
    key_id: keyId,
    key_secret: keySecret,
    webhook_secret: webhookSecret || null,
  });
  if (error) throw error;
}

// Returns { key_id, is_configured, webhook_configured } — never the
// secret values themselves, just enough to show connection status.
export async function fetchRazorpayStatus(organizationId) {
  if (!hasSupabaseConfig) return null;
  const { data, error } = await supabase.rpc('get_org_razorpay_status', { org_id: organizationId });
  if (error) throw error;
  const row = Array.isArray(data) ? data[0] : data;
  return row ?? { key_id: null, is_configured: false, webhook_configured: false };
}
