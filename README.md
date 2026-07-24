# CC Meetup V2

Vercel-ready Next.js meetup site with:
- Registration storage
- Public meetup code
- Public group chat
- Public read-only announcements
- Admin-only announcement posting and deletion
- Private admin dashboard

## Database update
Run `supabase.sql` in Supabase SQL Editor. Existing tables are preserved because all statements use `if not exists`.

## Environment variables
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`
- `SESSION_SECRET`
- `NEXT_PUBLIC_MEETUP_TIME`

## Suggestions
Visitors can privately send suggestions from `/suggestions`. Only authenticated admins can view or delete them in the Suggestions tab.
