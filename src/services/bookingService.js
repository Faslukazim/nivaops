import { supabase, hasSupabaseConfig } from '../lib/supabase';

export async function fetchBookings(propertyId) {
  if (!hasSupabaseConfig) return [];
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('property_id', propertyId)
    .eq('status', 'pending')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function fetchBookingsForMonth(propertyId, yearMonth) {
  if (!hasSupabaseConfig) return [];
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('property_id', propertyId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  if (!yearMonth) return data || [];
  return (data || []).filter(b => {
    const d = b.created_at || b.booking_date || '';
    return d.slice(0, 7) === yearMonth;
  });
}

export async function createBooking(propertyId, _organizationId, { roomId, bedId, name, phone, advanceAmount, expectedJoinDate }) {
  if (!hasSupabaseConfig) return null;

  // Always resolve org from the property to avoid null org_id RLS failures
  const { data: prop, error: propErr } = await supabase
    .from('properties')
    .select('organization_id')
    .eq('id', propertyId)
    .single();
  if (propErr) throw propErr;

  const { data, error } = await supabase
    .from('bookings')
    .insert({
      property_id: propertyId,
      organization_id: prop.organization_id,
      room_id: roomId,
      bed_id: bedId,
      name,
      phone: phone || '',
      advance_amount: advanceAmount || 0,
      expected_join_date: expectedJoinDate || null,
      status: 'pending',
    })
    .select()
    .single();
  if (error) throw error;

  const { error: bedError } = await supabase
    .from('beds')
    .update({ status: 'reserved' })
    .eq('id', bedId);
  if (bedError) throw bedError;

  return data;
}

export async function cancelBooking(bookingId, bedId) {
  if (!hasSupabaseConfig) return;
  const { error: bookingError } = await supabase
    .from('bookings')
    .update({ status: 'cancelled' })
    .eq('id', bookingId);
  if (bookingError) throw bookingError;

  if (bedId) {
    const { error: bedError } = await supabase
      .from('beds')
      .update({ status: 'available' })
      .eq('id', bedId);
    if (bedError) throw bedError;
  }
}

export async function convertBooking(bookingId, tenantId) {
  if (!hasSupabaseConfig) return;

  // 1. If tenantId is provided, try updating status and tenant_id
  if (tenantId) {
    const { error } = await supabase
      .from('bookings')
      .update({ status: 'converted', tenant_id: tenantId })
      .eq('id', bookingId)
      .eq('status', 'pending');

    if (!error) return;

    // If tenant_id column doesn't exist in live schema cache, fallback to status-only update
    console.warn('convertBooking with tenant_id failed, falling back to status-only update:', error.message);
  }

  // 2. Resilient fallback: update status only (works with base bookings schema)
  const { error: fallbackError } = await supabase
    .from('bookings')
    .update({ status: 'converted' })
    .eq('id', bookingId)
    .eq('status', 'pending');

  if (fallbackError) throw fallbackError;
}