// Vercel cron job — runs daily at 9 AM IST (03:30 UTC)
// Calls the Supabase Edge Function that emails operators their overdue tenant list.
export default async function handler(req, res) {
  if (req.headers['authorization'] !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const url = `${process.env.VITE_SUPABASE_URL}/functions/v1/send-rent-reminders`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: '{}',
  });

  const data = await response.json();
  res.status(response.ok ? 200 : 502).json(data);
}
