create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  source text not null default 'website',
  name text,
  email text,
  phone text,
  company text,
  budget text,
  timeline text,
  message text,
  project text,
  page_url text,
  created_at timestamptz not null default now()
);

alter table public.leads enable row level security;

drop policy if exists "Allow public lead inserts" on public.leads;

create policy "Allow public lead inserts"
on public.leads
for insert
to anon
with check (true);
