create table if not exists public.product_suggestions (
  id uuid primary key default gen_random_uuid(),
  supplier_id uuid not null references public.profiles(id) on delete cascade,
  product_name text not null,
  brand_name text null,
  category_name text null,
  description text null,
  notes text null,
  reference_url text null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now())
);

alter table public.product_suggestions enable row level security;

drop policy if exists "product_suggestions_insert_own" on public.product_suggestions;
create policy "product_suggestions_insert_own"
on public.product_suggestions
for insert
to authenticated
with check (auth.uid() = supplier_id);

drop policy if exists "product_suggestions_select_own" on public.product_suggestions;
create policy "product_suggestions_select_own"
on public.product_suggestions
for select
to authenticated
using (auth.uid() = supplier_id);

drop policy if exists "product_suggestions_admin_select" on public.product_suggestions;
create policy "product_suggestions_admin_select"
on public.product_suggestions
for select
to authenticated
using (
  exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.role in ('admin', 'super_admin')
  )
);
