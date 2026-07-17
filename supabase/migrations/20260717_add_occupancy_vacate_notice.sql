ALTER TABLE occupancies
  ADD COLUMN IF NOT EXISTS notice_end_date date,
  ADD COLUMN IF NOT EXISTS notice_deposit_action text CHECK (notice_deposit_action IN ('returned', 'forfeited', 'later'));
