-- Sprachwerk v19 - Supabase schema
-- Run this once in Supabase Dashboard -> SQL Editor.

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text not null check (char_length(username) between 3 and 24),
  created_at timestamptz not null default now()
);

create table if not exists public.user_progress (
  user_id uuid primary key references auth.users(id) on delete cascade,
  state jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.user_progress enable row level security;

-- A signed-in user may only see and update their own profile.
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
on public.profiles for select
to authenticated
using ((select auth.uid()) = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
on public.profiles for update
to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

-- A signed-in user may only see/write their own learning progress.
drop policy if exists "progress_select_own" on public.user_progress;
create policy "progress_select_own"
on public.user_progress for select
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "progress_insert_own" on public.user_progress;
create policy "progress_insert_own"
on public.user_progress for insert
to authenticated
with check ((select auth.uid()) = user_id);

drop policy if exists "progress_update_own" on public.user_progress;
create policy "progress_update_own"
on public.user_progress for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

-- Automatically create profile + empty progress row for every Auth user.
create or replace function public.handle_new_sprachwerk_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, username)
  values (
    new.id,
    coalesce(nullif(new.raw_user_meta_data ->> 'username', ''), split_part(new.email, '@', 1))
  )
  on conflict (id) do nothing;

  insert into public.user_progress (user_id, state)
  values (new.id, '{}'::jsonb)
  on conflict (user_id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created_sprachwerk on auth.users;
create trigger on_auth_user_created_sprachwerk
after insert on auth.users
for each row execute procedure public.handle_new_sprachwerk_user();

create index if not exists user_progress_user_id_idx
  on public.user_progress(user_id);
