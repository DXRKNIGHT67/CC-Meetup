# CC Meetup V6

Vercel-ready Next.js site with registration, meetup code, chat, announcements, suggestions, support tickets, two admin accounts, and creator social panels.

## Supabase
Run the full `supabase.sql` file in Supabase SQL Editor. It uses `if not exists`, so rerunning it keeps existing rows.

## Vercel environment variables
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`
- `ADMIN2_USERNAME`
- `ADMIN2_PASSWORD`
- `SESSION_SECRET`
- `NEXT_PUBLIC_MEETUP_TIME`

Admin credentials stay in Vercel environment variables rather than public GitHub source code.


## Admin-editable meetup time
Both configured admin accounts can change the homepage meetup time from the **Meetup Time** tab in the admin dashboard. The value is stored in the `settings` table as `meetup_time`, so changing it does not require a Vercel redeploy.
