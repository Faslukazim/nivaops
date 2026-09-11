/**
 * NivaOps Authoritative Financial Engine (P0)
 *
 * Single source of truth for:
 * - Total Charges (Contractual obligations)
 * - Total Paid (Actual verified payments collected)
 * - Balance (Net outstanding amount due)
 * - Deposits (Security deposits held / settled)
 * - Refunds & Credits (Adjustments and cash returns)
 *
 * Core rule: Charges are strictly separated from payments.
 * A payment (e.g. booking advance) NEVER reduces individual charges.
 * A payment can NEVER be counted twice.
 */

/**
 * Calculate move-in financials for a tenant or prospective tenant.
 *
 * @param {Object} params
 * @param {number|string} params.monthlyRent - Agreed monthly rent (e.g. 7000)
 * @param {number|string} [params.admissionFee] - One-time non-refundable fee (e.g. 500)
 * @param {number|string} [params.depositAmount] - Security deposit (e.g. 500)
 * @param {number|string} [params.bookingAdvance] - Advance paid during reservation (e.g. 1000)
 * @param {number|string|null} [params.amountCollected] - Subsequent payment collected
 * @param {string} [params.paymentStatus] - 'Paid' | 'Unpaid'
 * @param {number|string} [params.credits] - Any concessions / deduction credits
 * @param {number|string} [params.refunds] - Any refunded cash
 * @param {string} [params.depositStatus] - 'held' | 'returned' | 'forfeited' | 'none'
 */
export function calculateMoveInFinancials({
  monthlyRent = 0,
  admissionFee = 0,
  depositAmount = 0,
  bookingAdvance = 0,
  amountCollected = null,
  paymentStatus = 'Unpaid',
  credits = 0,
  refunds = 0,
  depositStatus = 'none',
} = {}) {
  const rent = Math.max(0, Number(monthlyRent) || 0);
  const fee = Math.max(0, Number(admissionFee) || 0);
  const deposit = Math.max(0, Number(depositAmount) || 0);
  const advance = Math.max(0, Number(bookingAdvance) || 0);
  const creds = Math.max(0, Number(credits) || 0);
  const ref = Math.max(0, Number(refunds) || 0);

  // Total contractual charges at move-in (Charges are immutable with respect to advance)
  const totalCharges = rent + fee + deposit;

  const isPaid = paymentStatus === 'Paid' || paymentStatus === 'paid';

  // Determine subsequent payment collected:
  // If marked Paid and no explicit amountCollected was stored, the subsequent payment is the remaining balance.
  let subsequentPaid = 0;
  if (isPaid) {
    if (amountCollected != null && Number(amountCollected) > 0) {
      subsequentPaid = Number(amountCollected);
    } else {
      subsequentPaid = Math.max(0, totalCharges - advance - creds);
    }
  } else if (amountCollected != null && Number(amountCollected) > 0) {
    subsequentPaid = Number(amountCollected);
  }

  // Total verified payments collected = booking advance + subsequent payment
  // (Prevents double counting: advance is collected once, subsequent payment is the rest)
  const totalPaid = advance + subsequentPaid;

  // Remaining balance due
  let balance = 0;
  if (!isPaid) {
    balance = Math.max(0, totalCharges - totalPaid - creds + ref);
  }

  const isFullyPaid = isPaid || (totalCharges > 0 && balance === 0);
  const isPartiallyPaid = !isFullyPaid && totalPaid > 0;
  const overpayment = Math.max(0, (totalPaid + creds) - (totalCharges + ref));

  // The remaining balance that should be collected specifically for the initial cycle
  const remainingDueToCollect = balance;

  return {
    // Contractual charges
    totalCharges,
    breakdown: {
      rent,
      admissionFee: fee,
      depositAmount: deposit,
    },
    // Payments
    bookingAdvance: advance,
    subsequentPaid,
    totalPaid,
    // Status & balances
    balance,
    remainingDueToCollect,
    credits: creds,
    refunds: ref,
    isFullyPaid,
    isPartiallyPaid,
    isOverpaid: overpayment > 0,
    overpaymentAmount: overpayment,
    // Deposit state
    depositHeld: depositStatus === 'returned' || depositStatus === 'forfeited' ? 0 : deposit,
    depositStatus: deposit > 0 ? (depositStatus === 'none' ? 'held' : depositStatus) : 'none',
    // Helper formatted display strings
    explanation: advance > 0
      ? `Total charges remain ${totalCharges}. The ${advance} booking advance was already paid and is deducted only from the balance due.`
      : null,
  };
}

/**
 * Calculate monthly cycle financials (for standard recurring rent cycles).
 */
export function calculateCycleFinancials({
  monthlyRent = 0,
  amountCollected = null,
  paymentStatus = 'unpaid',
  bookingAdvance = 0,
  credits = 0,
  refunds = 0,
} = {}) {
  const rent = Math.max(0, Number(monthlyRent) || 0);
  const advance = Math.max(0, Number(bookingAdvance) || 0);
  const creds = Math.max(0, Number(credits) || 0);
  const ref = Math.max(0, Number(refunds) || 0);

  const isPaid = paymentStatus === 'Paid' || paymentStatus === 'paid';

  let collected = 0;
  if (isPaid) {
    collected = amountCollected != null ? Number(amountCollected) : Math.max(0, rent - advance - creds);
  } else if (amountCollected != null) {
    collected = Number(amountCollected);
  }

  const totalPaid = advance + collected;
  const balance = isPaid ? 0 : Math.max(0, rent - totalPaid - creds + ref);
  const deduction = isPaid && collected < rent ? rent - collected : 0;

  return {
    standardCharge: rent,
    bookingAdvance: advance,
    amountCollected: collected,
    totalPaid,
    balance,
    deduction,
    isPaid,
  };
}

/**
 * Calculate booking reservation financials.
 */
export function calculateBookingFinancials({
  expectedRent = 0,
  advanceAmount = 0,
  admissionFee = 0,
  depositAmount = 0,
} = {}) {
  const rent = Math.max(0, Number(expectedRent) || 0);
  const advance = Math.max(0, Number(advanceAmount) || 0);
  const fee = Math.max(0, Number(admissionFee) || 0);
  const deposit = Math.max(0, Number(depositAmount) || 0);

  const totalEstimatedCharges = rent + fee + deposit;
  const estimatedBalanceDue = Math.max(0, totalEstimatedCharges - advance);

  return {
    expectedRent: rent,
    advancePaid: advance,
    admissionFee: fee,
    depositAmount: deposit,
    totalEstimatedCharges,
    estimatedBalanceDue,
  };
}

/**
 * Authoritative reconciliation of monthly accounts (P4).
 * Ensures booking advances, rent collections, admission fees, and deposits
 * are accounted accurately without double counting.
 */
export function reconcileMonthlyAccounts({
  paymentRecords = [],
  expenses = [],
  incomeRecords = [],
  bookings = [],
  tenants = [],
  depositSettlements = [],
  yearMonth = '',
} = {}) {
  // 1. Rent Collections for this month (actual cash received from payment records)
  const paidRecords = paymentRecords.filter(r => r.status === 'paid');
  const rentCollected = paidRecords.reduce((sum, r) => {
    const amt = r.amountCollected != null ? Number(r.amountCollected) : Number(r.amount || 0);
    return sum + amt;
  }, 0);

  const rentDeductions = paidRecords.reduce((sum, r) => {
    const standard = Number(r.amount || 0);
    const collected = r.amountCollected != null ? Number(r.amountCollected) : standard;
    return sum + Math.max(0, standard - collected);
  }, 0);

  // 2. Booking Advances received in this month
  // A booking advance is cash received when the booking was made.
  // For pending reservations (not yet moved in), this is active cash inflow.
  // Converted bookings have their advance already recognized under the tenant's move-in charges.
  const pendingBookings = bookings.filter(b => {
    const date = b.created_at || b.booking_date || '';
    const isThisMonth = date.slice(0, 7) === yearMonth;
    return isThisMonth && (!b.status || b.status === 'pending');
  });
  const bookingAdvancesCollected = pendingBookings.reduce((sum, b) => sum + Number(b.advance_amount || 0), 0);

  // 3. New tenants joining this month
  const newTenants = tenants.filter(t => (t.joinDate || '').slice(0, 7) === yearMonth);
  const admissionCollected = newTenants.reduce((sum, t) => sum + Number(t.admissionFee || 0), 0);
  const depositsCollected = newTenants
    .filter(t => !t.depositPreAccounted)
    .reduce((sum, t) => sum + Number(t.depositAmount || 0), 0);

  // 4. Other income records
  const otherIncome = incomeRecords.reduce((sum, r) => sum + Number(r.amount || 0), 0);

  // 5. Forfeited deposits (retained as income)
  const forfeitedDeposits = depositSettlements
    .filter(d => d.deposit_status === 'forfeited')
    .reduce((sum, d) => sum + Number(d.deposit_amount || 0), 0);

  // Total Gross Cash Inflow
  // (Notice: rentCollected accounts for the remaining rent collected; booking advances collected accounts for advances. No duplicate!)
  const totalInflow = rentCollected + bookingAdvancesCollected + admissionCollected + depositsCollected + otherIncome + forfeitedDeposits;

  // 6. Expenses
  const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);
  const depositRefunds = expenses
    .filter(e => e.category === 'deposit_refund')
    .reduce((sum, e) => sum + Number(e.amount || 0), 0);
  const operationalExpenses = totalExpenses - depositRefunds;

  const netCashflow = totalInflow - totalExpenses;

  return {
    yearMonth,
    inflow: {
      rentCollected,
      rentDeductions,
      bookingAdvancesCollected,
      admissionCollected,
      depositsCollected,
      forfeitedDeposits,
      otherIncome,
      totalInflow,
    },
    outflow: {
      operationalExpenses,
      depositRefunds,
      totalExpenses,
    },
    netCashflow,
    netProfit: netCashflow,
  };
}
