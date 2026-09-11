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

  const { error: bedErr } = await supabase
    .from('beds')
    .update({ status: 'reserved' })
    .eq('id', bedId);
  if (bedErr) throw bedErr;

  return data;
}

export async function cancelBooking(bookingId, bedId) {
  if (!hasSupabaseConfig) return;
  const { error } = await supabase.from('bookings').update({ status: 'cancelled' }).eq('id', bookingId);
  if (error) throw error;
  if (bedId) {
    const { error: bedErr } = await supabase.from('beds').update({ status: 'available' }).eq('id', bedId);
    if (bedErr) throw bedErr;
  }
}

// Convert only when the tenant/occupancy already exists for the reserved bed.
// App currently calls this when opening the tenant form, so it must not make
// the booking disappear before the operator actually saves the tenant.
// The occupancy trigger completes the conversion after a successful insert.
export async function convertBooking(bookingId) {
  if (!hasSupabaseConfig) return;

  const { data: booking, error: bookingError } = await supabase
    .from('bookings')
    .select('id, bed_id, status')
    .eq('id', bookingId)
    .maybeSingle();
  if (bookingError) throw bookingError;
  if (!booking || booking.status !== 'pending') return;

  const { data: occupancy, error: occupancyError } = await supabase
    .from('occupancies')
    .select('id')
    .eq('bed_id', booking.bed_id)
    .eq('status', 'active')
    .maybeSingle();
  if (occupancyError) throw occupancyError;

  // No tenant yet: keep the booking pending and visible.
  if (!occupancy) return;

  const { error } = await supabase
    .from('bookings')
    .update({ status: 'converted' })
    .eq('id', bookingId)
    .eq('status', 'pending');
  if (error) throw error;
}