-- Needed to attribute a deposit refund/forfeit to the correct month in P&L
-- now that deposits are treated as cash-basis income/expense rather than
-- a tracked liability.
alter table public.occupancies
  add column if not exists deposit_settled_at timestamptz;
