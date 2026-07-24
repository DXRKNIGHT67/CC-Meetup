create table if not exists public.registrations (
  id bigint generated always as identity primary key,
  name text not null check (char_length(name) between 2 and 50),
  created_at timestamptz not null default now()
);

create table if not exists public.settings (
  key text primary key,
  value text not null default ''
);

insert into public.settings (key, value)
values ('meetup_code', 'No code has been posted yet')
on conflict (key) do nothing;

alter table public.registrations enable row level security;
alter table public.settings enable row level security;

-- No public RLS policies are added. The website accesses these tables only
-- through secure server-side API routes using the service-role key.
revoke all on table public.registrations from anon, authenticated;
revoke all on table public.settings from anon, authenticated;
grant all on table public.registrations to service_role;
grant all on table public.settings to service_role;

create table if not exists public.chat_messages (
  id bigint generated always as identity primary key,
  name text not null check (char_length(name) between 2 and 30),
  message text not null check (char_length(message) between 1 and 300),
  created_at timestamptz not null default now()
);

alter table public.chat_messages enable row level security;
revoke all on table public.chat_messages from anon, authenticated;
grant all on table public.chat_messages to service_role;

create table if not exists public.announcements (
  id bigint generated always as identity primary key,
  title text not null check (char_length(title) between 2 and 80),
  message text not null check (char_length(message) between 1 and 1000),
  created_at timestamptz not null default now()
);

alter table public.announcements enable row level security;
revoke all on table public.announcements from anon, authenticated;
grant all on table public.announcements to service_role;

create table if not exists public.suggestions (
  id bigint generated always as identity primary key,
  name text not null check (char_length(name) between 2 and 50),
  suggestion text not null check (char_length(suggestion) between 3 and 1000),
  created_at timestamptz not null default now()
);

alter table public.suggestions enable row level security;
revoke all on table public.suggestions from anon, authenticated;
grant all on table public.suggestions to service_role;
