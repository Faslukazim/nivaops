import assert from 'node:assert/strict';
import {
  calculateMoveInFinancials,
  calculateCycleFinancials,
  calculateBookingFinancials,
  reconcileMonthlyAccounts,
} from '../src/utils/financialEngine.js';

console.log('--- RUNNING FINANCIAL ENGINE TESTS (P0 & P1) ---');

// Test 1: Standard Tenant without booking advance
{
  const res = calculateMoveInFinancials({
    monthlyRent: 7000,
    admissionFee: 500,
    depositAmount: 500,
    bookingAdvance: 0,
    paymentStatus: 'Unpaid',
  });
  assert.equal(res.totalCharges, 8000, 'Total charges must be 8000');
  assert.equal(res.bookingAdvance, 0);
  assert.equal(res.totalPaid, 0);
  assert.equal(res.balance, 8000, 'Balance must be 8000');
  assert.equal(res.isFullyPaid, false);
  console.log('✓ Test 1 Passed: Standard Tenant without booking advance');
}

// Test 2: Converted Tenant with ₹1,000 booking advance (Unpaid)
{
  const res = calculateMoveInFinancials({
    monthlyRent: 7000,
    admissionFee: 500,
    depositAmount: 500,
    bookingAdvance: 1000,
    paymentStatus: 'Unpaid',
  });
  assert.equal(res.totalCharges, 8000, 'Charges must NOT be reduced by advance: must remain 8000');
  assert.equal(res.breakdown.rent, 7000, 'Rent must remain 7000');
  assert.equal(res.breakdown.admissionFee, 500, 'Admission must remain 500');
  assert.equal(res.breakdown.depositAmount, 500, 'Deposit must remain 500');
  assert.equal(res.bookingAdvance, 1000, 'Advance is 1000 paid');
  assert.equal(res.totalPaid, 1000, 'Total paid is 1000');
  assert.equal(res.balance, 7000, 'Remaining balance must be 7000');
  assert.equal(res.remainingDueToCollect, 7000);
  assert.equal(res.isFullyPaid, false);
  assert.equal(res.isPartiallyPaid, true);
  console.log('✓ Test 2 Passed: Converted Tenant with ₹1,000 booking advance (Unpaid)');
}

// Test 3: Converted Tenant pays remaining balance of ₹7,000 (Full Payment)
{
  const res = calculateMoveInFinancials({
    monthlyRent: 7000,
    admissionFee: 500,
    depositAmount: 500,
    bookingAdvance: 1000,
    amountCollected: 7000,
    paymentStatus: 'Paid',
  });
  assert.equal(res.totalCharges, 8000);
  assert.equal(res.bookingAdvance, 1000);
  assert.equal(res.subsequentPaid, 7000);
  assert.equal(res.totalPaid, 8000, 'Total paid must equal 8000 (1000 advance + 7000 collection)');
  assert.equal(res.balance, 0, 'Balance must be 0');
  assert.equal(res.isFullyPaid, true);
  assert.equal(res.isOverpaid, false);
  console.log('✓ Test 3 Passed: Converted Tenant pays remaining balance of ₹7,000');
}

// Test 4: Converted Tenant makes Partial Payment of ₹4,000
{
  const res = calculateMoveInFinancials({
    monthlyRent: 7000,
    admissionFee: 500,
    depositAmount: 500,
    bookingAdvance: 1000,
    amountCollected: 4000,
    paymentStatus: 'Unpaid',
  });
  assert.equal(res.totalCharges, 8000);
  assert.equal(res.bookingAdvance, 1000);
  assert.equal(res.subsequentPaid, 4000);
  assert.equal(res.totalPaid, 5000, 'Total paid is 1000 + 4000 = 5000');
  assert.equal(res.balance, 3000, 'Remaining balance is 3000');
  assert.equal(res.isFullyPaid, false);
  assert.equal(res.isPartiallyPaid, true);
  console.log('✓ Test 4 Passed: Converted Tenant makes Partial Payment of ₹4,000');
}

// Test 5: Booking Reservation Financials
{
  const res = calculateBookingFinancials({
    expectedRent: 7000,
    advanceAmount: 1000,
    admissionFee: 500,
    depositAmount: 500,
  });
  assert.equal(res.totalEstimatedCharges, 8000);
  assert.equal(res.advancePaid, 1000);
  assert.equal(res.estimatedBalanceDue, 7000);
  console.log('✓ Test 5 Passed: Booking Reservation Financials');
}

// Test 6: Accounts Reconciliation with Pending Booking Advances
{
  const recon = reconcileMonthlyAccounts({
    yearMonth: '2026-09',
    bookings: [
      { advance_amount: 1000, created_at: '2026-09-01T10:00:00Z', status: 'pending' },
    ],
    tenants: [
      { joinDate: '2026-09-02', admissionFee: 500, depositAmount: 500, depositPreAccounted: false },
    ],
    paymentRecords: [
      { status: 'paid', amount: 7000, amountCollected: 7000 },
    ],
    expenses: [
      { amount: 2000, category: 'food' },
    ],
  });

  assert.equal(recon.inflow.bookingAdvancesCollected, 1000, 'Pending booking advance must be 1000');
  assert.equal(recon.inflow.admissionCollected, 500, 'Admission must be 500');
  assert.equal(recon.inflow.depositsCollected, 500, 'Deposit must be 500');
  assert.equal(recon.inflow.rentCollected, 7000, 'Rent collected must be 7000');
  assert.equal(recon.inflow.totalInflow, 9000, 'Total inflow must be 1000 + 500 + 500 + 7000 = 9000');
  assert.equal(recon.outflow.totalExpenses, 2000);
  assert.equal(recon.netCashflow, 7000);
  console.log('✓ Test 6 Passed: Accounts Reconciliation with Pending Booking Advances');
}

// Test 7: Accounts Reconciliation with Converted Booking (Zero Double-Counting)
{
  const recon = reconcileMonthlyAccounts({
    yearMonth: '2026-09',
    bookings: [
      // Booking was converted to a tenant
      { advance_amount: 1000, created_at: '2026-09-01T10:00:00Z', status: 'converted' },
    ],
    tenants: [
      { joinDate: '2026-09-02', admissionFee: 500, depositAmount: 500, depositPreAccounted: false },
    ],
    paymentRecords: [
      // Remaining rent payment collected: 7,000 (after 1,000 advance)
      { status: 'paid', amount: 7000, amountCollected: 7000 },
    ],
    expenses: [
      { amount: 1500, category: 'food' },
    ],
  });

  assert.equal(recon.inflow.bookingAdvancesCollected, 0, 'Converted booking advance must NOT be counted again in bookingAdvancesCollected');
  assert.equal(recon.inflow.admissionCollected, 500, 'Admission fee is 500');
  assert.equal(recon.inflow.depositsCollected, 500, 'Deposit is 500');
  assert.equal(recon.inflow.rentCollected, 7000, 'Rent collected is 7000');
  assert.equal(recon.inflow.totalInflow, 8000, 'Total cash inflow is 8000 (no double counting of advance)');
  assert.equal(recon.netProfit, 6500);
  console.log('✓ Test 7 Passed: Accounts Reconciliation with Converted Booking (Zero Double-Counting)');
}

// Test 8: Month 2 Recurring Cycle Reverts to Standard Rent (P5)
{
  const month2 = calculateCycleFinancials({
    monthlyRent: 7000,
    amountCollected: null,
    paymentStatus: 'unpaid',
    bookingAdvance: 0, // Advance was consumed in Month 1
  });

  assert.equal(month2.standardCharge, 7000);
  assert.equal(month2.bookingAdvance, 0);
  assert.equal(month2.totalPaid, 0);
  assert.equal(month2.balance, 7000, 'Month 2 balance must revert to full 7000 without reapplying advance');
  console.log('✓ Test 8 Passed: Month 2 Recurring Cycle Reverts to Standard Rent');
}

console.log('ALL FINANCIAL ENGINE TESTS PASSED SUCCESSFULLY!');
