# StayB Hostel Manager

A small hostel management MVP built with React, Vite, Tailwind CSS, and Supabase.

## Setup

```bash
npm install
npm run dev
```

For Supabase persistence, copy `.env.example` to `.env` and set:

```bash
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Run the Phase 1 Supabase migration in `supabase/migrations` to create:

- `organizations`
- `properties`
- `rooms`
- `beds`
- `tenants`
- `occupancies`

The app keeps the current UI shape, but Supabase persistence now stores tenants through the normalized multi-property schema. Payment status remains on `occupancies` for this phase so the existing paid/unpaid workflow continues to work.

The app falls back to browser local storage when Supabase keys are not configured.
