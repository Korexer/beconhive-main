create table if not exists public.ai_waitlist_signups (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  source text not null default 'ai-planner',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create unique index if not exists ai_waitlist_signups_email_lower_idx
  on public.ai_waitlist_signups (lower(email));

alter table public.ai_waitlist_signups enable row level security;

grant usage on schema public to anon, authenticated;
grant insert on table public.ai_waitlist_signups to anon, authenticated;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'ai_waitlist_signups'
      and policyname = 'Allow public waitlist inserts'
  ) then
    create policy "Allow public waitlist inserts"
      on public.ai_waitlist_signups
      for insert
      to anon, authenticated
      with check (true);
  end if;
end
$$;
