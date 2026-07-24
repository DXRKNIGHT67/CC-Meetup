# CC Meetup

A Vercel-ready Next.js site with:
- animated loading screen and custom CC logo
- public name registration
- public read-only meetup code
- hidden bottom-right admin button
- protected admin login
- admin registration list and deletion
- admin-editable meetup code
- Supabase database storage

## Required environment variables
Copy `.env.example` into `.env.local` for local development. On Vercel, add the same variables in Project Settings > Environment Variables.

Important: use `DXRKN!GHT` for `ADMIN_USERNAME`, but choose a new stronger password rather than reusing one shared in a chat.

## Database
Run `supabase.sql` inside your Supabase project's SQL Editor.

## Chat update

The public Chat button opens `/chat`. Messages are stored in the `chat_messages` Supabase table and refreshed every two seconds. Run the newest `supabase.sql` after updating the project.
