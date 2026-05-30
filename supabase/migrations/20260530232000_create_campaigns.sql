create table if not exists public.campaigns (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text null,
  image_path text not null,
  href text not null default '/kampanyalar',
  sort_order integer not null default 0,
  is_active boolean not null default true,
  starts_at timestamptz null,
  ends_at timestamptz null,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now())
);

create or replace function public.set_campaigns_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$;

drop trigger if exists campaigns_set_updated_at on public.campaigns;
create trigger campaigns_set_updated_at
before update on public.campaigns
for each row
execute function public.set_campaigns_updated_at();

alter table public.campaigns enable row level security;

drop policy if exists campaigns_public_select on public.campaigns;
create policy campaigns_public_select
  on public.campaigns
  for select
  to anon, authenticated
  using (
    is_active = true
    and (starts_at is null or starts_at <= now())
    and (ends_at is null or ends_at >= now())
  );

drop policy if exists campaigns_admin_all on public.campaigns;
create policy campaigns_admin_all
  on public.campaigns
  for all
  to authenticated
  using (
    exists (
      select 1
      from public.profiles p
      where p.id = auth.uid()
        and p.role in ('admin', 'super_admin', 'superadmin')
    )
  )
  with check (
    exists (
      select 1
      from public.profiles p
      where p.id = auth.uid()
        and p.role in ('admin', 'super_admin', 'superadmin')
    )
  );
