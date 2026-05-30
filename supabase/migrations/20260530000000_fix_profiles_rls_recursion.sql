-- RLS'i bypass eden güvenli helper fonksiyonlar (recursion'ı kırar)
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'::user_role
  );
$$;

create or replace function public.current_user_role()
returns user_role
language sql
security definer
set search_path = public
stable
as $$
  select role from public.profiles where id = auth.uid();
$$;

-- Recursion yapan eski policy'leri kaldır
drop policy if exists "Admin can manage all profiles" on public.profiles;
drop policy if exists "Users can update own profile non-role fields" on public.profiles;

-- Admin yönetimi: helper fonksiyon kullanır → recursion YOK
drop policy if exists "profiles_admin_all" on public.profiles;
create policy "profiles_admin_all" on public.profiles
  for all to authenticated
  using ( public.is_admin() )
  with check ( public.is_admin() );

-- Kullanıcı kendi profilini günceller; rolünü değiştiremez (subquery yok, helper kullanılır)
drop policy if exists "profiles_update_own_safe" on public.profiles;
create policy "profiles_update_own_safe" on public.profiles
  for update to authenticated
  using ( id = auth.uid() )
  with check ( id = auth.uid() and role = public.current_user_role() );
