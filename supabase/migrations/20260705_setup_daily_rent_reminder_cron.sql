create extension if not exists pg_cron;
create extension if not exists pg_net;

-- Runs every day at 09:00 UTC (2:30 PM IST) — calls the send-rent-reminders
-- edge function, which finds unpaid rent due today/overdue, generates a
-- Razorpay payment link per tenant, and texts it to them automatically.
select cron.schedule(
  'daily-rent-reminders',
  '0 9 * * *',
  $$
  select net.http_post(
    url := 'https://drlkmfhpthhkvnljuprm.supabase.co/functions/v1/send-rent-reminders',
    headers := jsonb_build_object('Content-Type', 'application/json')
  );
  $$
);
