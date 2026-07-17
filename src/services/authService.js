import { hasSupabaseConfig, supabase, supabaseFunctionsUrl } from '../lib/supabase';

// ─── Session ──────────────────────────────────────────────────────────────────

/** Current session (or null). Returns null when Supabase isn't configured. */
export async function getSession() {
  if (!hasSupabaseConfig) return null;
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session ?? null;
}

/**
 * Subscribe to auth changes. Returns an unsubscribe function.
 * Callback receives the new session (or null on sign-out).
 */
export function onAuthChange(callback) {
  if (!hasSupabaseConfig) return () => {};
  const { data } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session ?? null);
  });
  return () => data.subscription.unsubscribe();
}

// ─── Email / password ─────────────────────────────────────────────────────────

export async function signUp(email, password) {
  if (!hasSupabaseConfig) throw new Error('Supabase is not configured');
  const { data, error } = await supabase.auth.signUp({
    email: email.trim(),
    password,
  });
  if (error) throw error;
  // session is null when email confirmation is required
  return { session: data.session ?? null, needsConfirmation: !data.session };
}

export async function signIn(email, password) {
  if (!hasSupabaseConfig) throw new Error('Supabase is not configured');
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  });
  if (error) throw error;
  return data.session;
}

export async function signInWithGoogle() {
  if (!hasSupabaseConfig) throw new Error('Supabase is not configured');
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: window.location.origin },
  });
  if (error) throw error;
}

export async function signOut() {
  if (!hasSupabaseConfig) return;
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

// ─── Organizations / memberships ───────────────────────────────────────────────

/**
 * Orgs the signed-in user belongs to.
 * Returns [{ organizationId, role, name }] sorted by name.
 */
export async function fetchMemberships() {
  if (!hasSupabaseConfig) return [];
  const { data, error } = await supabase
    .from('memberships')
    .select('organization_id, role, organization:organizations(name, approved, plan)')
    .order('created_at', { ascending: true });
  if (error) throw error;
  return (data ?? []).map(m => ({
    organizationId: m.organization_id,
    role: m.role,
    name: m.organization?.name ?? 'Organization',
    approved: m.organization?.approved ?? false,
    plan: m.organization?.plan ?? 'starter',
  }));
}

/**
 * Create an organization (and optional first property) for the current user,
 * who becomes its owner. Returns the new organization id.
 */
export async function createOrganization({ orgName, propertyName, totalBeds }) {
  if (!hasSupabaseConfig) throw new Error('Supabase is not configured');
  const { data, error } = await supabase.rpc('create_organization', {
    org_name: orgName,
    property_name: propertyName || null,
    total_beds: Number(totalBeds) || 0,
  });
  if (error) throw error;
  return data; // new organization id (uuid)
}

// ─── Team members (staff / manager logins) ─────────────────────────────────────

/** All members of an org (owner + any invited manager/staff). */
export async function fetchOrgMembers(organizationId) {
  if (!hasSupabaseConfig) return [];
  const { data, error } = await supabase
    .from('memberships')
    .select('id, user_id, role, email, created_at')
    .eq('organization_id', organizationId)
    .order('created_at', { ascending: true });
  if (error) throw error;
  return data;
}

/**
 * Owner-only: creates a real login for a staff/manager member and adds them
 * to the org. Runs server-side (invite-team-member edge function) since
 * creating an auth user requires the service role key.
 */
export async function inviteTeamMember({ organizationId, email, password, role }) {
  if (!hasSupabaseConfig || !supabaseFunctionsUrl) throw new Error('Supabase not configured');
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error('Not signed in');

  const res = await fetch(`${supabaseFunctionsUrl}/invite-team-member`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${session.access_token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ organizationId, email, password, role }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error ?? 'Failed to invite team member');
  return json;
}

/** Owner-only (enforced by RLS): removes a team member's access to the org. */
export async function removeTeamMember(membershipId) {
  if (!hasSupabaseConfig) return;
  const { error } = await supabase.from('memberships').delete().eq('id', membershipId);
  if (error) throw error;
}
