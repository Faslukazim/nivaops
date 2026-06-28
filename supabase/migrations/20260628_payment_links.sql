-- Razorpay payment link tracking on payment records
alter table payment_records
  add column if not exists payment_link text,
  add column if not exists payment_link_id text;

create index if not exists payment_records_payment_link_id_idx
  on payment_records(payment_link_id)
  where payment_link_id is not null;
