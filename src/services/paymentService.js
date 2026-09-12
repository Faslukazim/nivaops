import { hasSupabaseConfig, supabase } from '../lib/supabase';
import { fetchTenants } from './tenantService';
import { calculateMoveInFinancials } from '../utils/financialEngine';

function localRecordsFromTenants(tenants) {
  return tenants.map(t => ({
    id: `local-${t.id}`,
    tenantId: t.id,
    name: t.name,
    phone: t.phone,
    roomNumber: t.roomNumber,
    bedNumber: t.bedNumber,
    amount: (t.balance != null && t.balance > 0) ? t.balance : t.monthlyRent,
    // Use explicit rentDueDay; fall back to joinDate day for old localStorage data
    dueDay: t.rentDueDay ?? (t.joinDate ? Number(t.joinDate.slice(8, 10)) : 1),
    status: t.paymentStatus === 'Paid' ? 'paid' : 'unpaid',
    paidAt: t.paymentDate || null,
    amountCollected: t.amountCollected || null,
    deductionReason: t.deductionReason || null,
    bookingAdvance: t.bookingAdvance || 0,
    isMoveInMonth: Boolean(t.joinDate && String(t.joinDate).slice(0, 7) === new Date().toISOString().slice(0, 7)),
  }));
}

export async function ensurePaymentRecords(propertyId, yearMonth) {
  if (!hasSupabaseConfig) return;

  const query = supabase
    .from('occupancies')
    .select('id, property_id, tenant_id, bed_id, monthly_rent, rent_due_day, payment_status, payment_date, start_date, admission_fee, deposit_amount')
    .eq('status', 'active');
  if (propertyId) query.eq('property_id', propertyId);

  const bookingsQuery = supabase
    .from('bookings')
    .select('bed_id, advance_amount')
    .in('status', ['converted', 'pending']);
  if (propertyId) bookingsQuery.eq('property_id', propertyId);

  const [{ data: occupancies, error }, { data: bookings }] = await Promise.all([
    query,
    bookingsQuery.then(r => r, () => ({ data: [] })),
  ]);
  if (error) throw error;
  if (!occupancies?.length) return;

  const advanceByBed = Object.fromEntries((bookings ?? []).map(b => [b.bed_id, Number(b.advance_amount || 0)]));

  const records = occupancies.map(occ => {
    const isMoveInMonth = occ.start_date && String(occ.start_date).slice(0, 7) === yearMonth;
    let recAmount = Number(occ.monthly_rent || 0);
    const bookingAdv = Number(occ.booking_advance || advanceByBed[occ.bed_id] || 0);

    // In the move-in month with an advance paid, the remaining balance due is calculated authoritatively
    if (isMoveInMonth && bookingAdv > 0) {
      const fin = calculateMoveInFinancials({
        monthlyRent: occ.monthly_rent,
        admissionFee: occ.admission_fee,
        depositAmount: occ.deposit_amount,
        bookingAdvance: bookingAdv,
        paymentStatus: occ.payment_status,
      });
      recAmount = fin.remainingDueToCollect;
    }

    // If occupancy was already marked Paid for this month (e.g. via Rooms/Dashboard
    // before Finance tab was first opened), initialise the record as paid so the
    // Finance page stays in sync even when the payment_records row didn't exist yet.
    const paidThisMonth = occ.payment_status === 'Paid'
      && occ.payment_date
      && String(occ.payment_date).slice(0, 7) === yearMonth;
    return {
      property_id:  occ.property_id,
      tenant_id:    occ.tenant_id,
      occupancy_id: occ.id,
      month:        yearMonth,
      amount:       recAmount,
      due_day:      occ.rent_due_day ?? 1,
      status:       paidThisMonth ? 'paid' : 'unpaid',
      paid_at:      paidThisMonth ? new Date().toISOString() : null,
    };
  });

  const { error: upsertError } = await supabase
    .from('payment_records')
    .upsert(records, { onConflict: 'occupancy_id,month', ignoreDuplicates: true });
  if (upsertError) throw upsertError;
}

export async function fetchPaymentRecords(propertyId, yearMonth) {
  if (!hasSupabaseConfig) {
    const tenants = await fetchTenants(propertyId);
    return localRecordsFromTenants(tenants);
  }

  const query = supabase
    .from('payment_records')
    .select('*, tenant:tenants(name, phone, status), occupancy:occupancies(monthly_rent, rent_due_day, status, admission_fee, deposit_amount, start_date, bed_id, room:rooms(room_number), bed:beds(bed_number))')
    .eq('month', yearMonth);
  if (propertyId) query.eq('property_id', propertyId);

  const bookingsQuery = supabase
    .from('bookings')
    .select('bed_id, advance_amount')
    .in('status', ['converted', 'pending']);
  if (propertyId) bookingsQuery.eq('property_id', propertyId);

  const [{ data, error }, { data: bookings }] = await Promise.all([
    query,
    bookingsQuery.then(r => r, () => ({ data: [] })),
  ]);
  if (error) throw error;

  const advanceByBed = Object.fromEntries((bookings ?? []).map(b => [b.bed_id, Number(b.advance_amount || 0)]));

  // Exclude vacated tenants — occupancy ended or tenant archived after move-out
  const active = data.filter(r => r.occupancy?.status === 'active' && r.tenant?.status === 'active');

  return active.map(r => ({
    id: r.id,
    tenantId: r.tenant_id,
    name: r.tenant?.name ?? '—',
    phone: r.tenant?.phone ?? '',
    roomNumber: r.occupancy?.room?.room_number ?? '—',
    bedNumber: r.occupancy?.bed?.bed_number ?? '—',
    amount: Number(r.amount ?? 0),
    amountCollected: r.amount_collected != null ? Number(r.amount_collected) : null,
    deductionReason: r.deduction_reason ?? null,
    // due_day is stamped at record creation from rent_due_day; use it directly
    dueDay: r.due_day,
    status: r.status,
    paidAt: r.paid_at,
    bookingAdvance: Number(r.occupancy?.booking_advance || advanceByBed[r.occupancy?.bed_id] || 0),
    isMoveInMonth: Boolean(r.occupancy?.start_date && String(r.occupancy.start_date).slice(0, 7) === yearMonth),
  }));
}

export async function updatePaymentRecordAmount(recordId, amount) {
  if (!hasSupabaseConfig || !recordId || amount == null) return;
  const num = Number(amount);
  if (num <= 0) return;
  const { error } = await supabase
    .from('payment_records')
    .update({ amount: num })
    .eq('id', recordId)
    .neq('status', 'paid');
  if (error) console.error('updatePaymentRecordAmount failed:', error);
}

export async function markRecordPaid(recordId, amountCollected, deductionReason) {
  if (!hasSupabaseConfig) return;
  const { error } = await supabase
    .from('payment_records')
    .update({
      status: 'paid',
      paid_at: new Date().toISOString(),
      amount_collected: amountCollected ?? null,
      deduction_reason: deductionReason || null,
    })
    .eq('id', recordId);
  if (error) throw error;
}

export async function markTenantRecordPaid(tenantId, yearMonth, amountCollected, deductionReason) {
  if (!hasSupabaseConfig) return;
  const { error } = await supabase
    .from('payment_records')
    .update({
      status: 'paid',
      paid_at: new Date().toISOString(),
      amount_collected: amountCollected ?? null,
      deduction_reason: deductionReason || null,
    })
    .eq('tenant_id', tenantId)
    .eq('month', yearMonth);
  if (error) throw error;
}

export async function markRecordUnpaid(recordId) {
  if (!hasSupabaseConfig) return;
  const { error } = await supabase
    .from('payment_records')
    .update({ status: 'unpaid', paid_at: null, amount_collected: null, deduction_reason: null })
    .eq('id', recordId);
  if (error) throw error;
}

/**
 * Sync occupancy.payment_status when a record is marked paid/unpaid via Finance tab.
 * Keeps Dashboard counts consistent with Finance page counts.
 */
export async function fetchTenantPaymentHistory(tenantId, limit = 12) {
  if (!hasSupabaseConfig) return [];
  const { data, error } = await supabase
    .from('payment_records')
    .select('month, amount, amount_collected, deduction_reason, status, paid_at, due_day')
    .eq('tenant_id', tenantId)
    .order('month', { ascending: false })
    .limit(limit);
  if (error) return [];
  return data;
}

// Resolves the current month's payment_records row for a tenant, creating
// it first if it doesn't exist yet. Used by PaymentLinkBtn so it can be
// dropped in anywhere (Tenants, Rooms, Dashboard) without every caller
// having to already know the record id.
export async function fetchCurrentMonthPaymentRecord(propertyId, tenantId) {
  if (!hasSupabaseConfig) return null;
  const yearMonth = new Date().toISOString().slice(0, 7);

  let { data, error } = await supabase
    .from('payment_records')
    .select('id, amount, payment_link')
    .eq('tenant_id', tenantId)
    .eq('month', yearMonth)
    .maybeSingle();
  if (error) throw error;

  if (!data) {
    await ensurePaymentRecords(propertyId, yearMonth);
    ({ data, error } = await supabase
      .from('payment_records')
      .select('id, amount, payment_link')
      .eq('tenant_id', tenantId)
      .eq('month', yearMonth)
      .maybeSingle());
    if (error) throw error;
  }
  return data;
}

export async function syncOccupancyPaymentStatus(tenantId, status) {
  if (!hasSupabaseConfig) return;
  const patch = status === 'Paid'
    ? { payment_status: 'Paid', payment_date: new Date().toISOString().slice(0, 10) }
    : { payment_status: 'Unpaid', payment_date: null };
  const { error } = await supabase
    .from('occupancies')
    .update(patch)
    .eq('tenant_id', tenantId)
    .eq('status', 'active');
  if (error) console.error('syncOccupancyPaymentStatus failed:', error);
}
