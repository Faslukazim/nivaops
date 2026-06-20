// Single source of truth for all payment status calculations.
// Used by FinancePage (payment_records) and Dashboard (tenant objects).
// Both use the same rules so counts always match.

export const STATUS = {
  PAID:     'paid',
  DUE_SOON: 'due_soon',
  DUE_TODAY:'due_today',
  OVERDUE:  'overdue',
  UPCOMING: 'upcoming', // new tenant grace or due date > 3 days away
};

// Parse YYYY-MM-DD without UTC timezone issues
function parseYMD(str) {
  if (!str) return null;
  const s = String(str).slice(0, 10);
  const parts = s.split('-').map(Number);
  if (parts.length !== 3 || parts.some(isNaN)) return null;
  const [y, m, d] = parts;
  return { year: y, month: m, day: d };
}

function ymStr(d) {
  return `${d.year}-${String(d.month).padStart(2, '0')}`;
}

function todayLocal() {
  const n = new Date();
  return { year: n.getFullYear(), month: n.getMonth() + 1, day: n.getDate() };
}

function daysBetween(a, b) {
  return Math.round(
    (new Date(b.year, b.month - 1, b.day) - new Date(a.year, a.month - 1, a.day)) / 86400000
  );
}

/**
 * Compute display status for a payment_record row.
 * record must have: { status, dueDay, joinDate? }
 * viewYM: the YYYY-MM month being displayed
 */
export function computeRecordStatus(record, viewYM) {
  if (record.status === 'paid') return STATUS.PAID;

  const today = todayLocal();
  const todayYM = ymStr(today);

  // Past month + unpaid = always Overdue
  if (viewYM < todayYM) return STATUS.OVERDUE;
  // Future month = not yet actionable
  if (viewYM > todayYM) return STATUS.UPCOMING;

  // Current month — check new-tenant grace period first
  const joinDate = parseYMD(record.joinDate);
  const daysSinceJoin = joinDate ? daysBetween(joinDate, today) : 999;
  // New tenant: first 30 days are grace — first rent cycle not complete yet
  if (daysSinceJoin < 30) return STATUS.UPCOMING;

  const dueDay = record.dueDay ?? 1;
  if (today.day > dueDay)       return STATUS.OVERDUE;
  if (today.day === dueDay)     return STATUS.DUE_TODAY;
  if (today.day >= dueDay - 3)  return STATUS.DUE_SOON;
  return STATUS.UPCOMING;
}

/** How many days overdue for a record. Returns 0 if not overdue. */
export function recordDaysOverdue(record, viewYM) {
  const today = todayLocal();
  const todayYM = ymStr(today);
  if (record.status === 'paid') return 0;
  if (viewYM < todayYM) {
    const [y, m] = viewYM.split('-').map(Number);
    const lastDay = new Date(y, m, 0).getDate();
    return daysBetween({ year: y, month: m, day: lastDay }, today);
  }
  if (viewYM === todayYM) {
    const diff = today.day - (record.dueDay ?? 1);
    return diff > 0 ? diff : 0;
  }
  return 0;
}

/** Days until this record's due date. Returns 0 if due today or past. */
export function recordDaysUntilDue(record) {
  const today = todayLocal();
  return Math.max(0, (record.dueDay ?? 1) - today.day);
}

/**
 * Compute display status from a tenant object (for Dashboard/Tenants page).
 * Uses paymentStatus + paymentDate to check if paid this billing cycle.
 */
export function computeTenantStatus(tenant) {
  const today = todayLocal();
  const todayYM = ymStr(today);

  // Paid this billing cycle = marked Paid AND paymentDate is in current month
  const payDate = parseYMD(tenant.paymentDate);
  if (tenant.paymentStatus === 'Paid' && payDate && ymStr(payDate) === todayYM) {
    return STATUS.PAID;
  }

  const joinDate = parseYMD(tenant.joinDate);
  const dueDay = joinDate?.day ?? 1;
  const daysSinceJoin = joinDate ? daysBetween(joinDate, today) : 999;

  if (daysSinceJoin < 30) return STATUS.UPCOMING;

  if (today.day > dueDay)       return STATUS.OVERDUE;
  if (today.day === dueDay)     return STATUS.DUE_TODAY;
  if (today.day >= dueDay - 3)  return STATUS.DUE_SOON;
  return STATUS.UPCOMING;
}

/** Days overdue for a tenant. Returns 0 if not overdue. */
export function tenantDaysOverdue(tenant) {
  const joinDate = parseYMD(tenant.joinDate);
  const dueDay = joinDate?.day ?? 1;
  const today = todayLocal();
  const diff = today.day - dueDay;
  return diff > 0 ? diff : 0;
}
