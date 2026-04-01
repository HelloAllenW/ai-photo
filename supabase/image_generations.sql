create extension if not exists pgcrypto;

create table if not exists public.image_generations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  generation_count integer not null default 1,
  style text not null,
  prompt text not null,
  image_url text,
  storage_path text,
  created_at timestamptz not null default timezone('utc', now())
);

alter table public.image_generations
  add column if not exists generation_count integer not null default 1;

alter table public.image_generations
  add column if not exists style text not null default 'ghibli';

alter table public.image_generations
  add column if not exists prompt text not null default '';

alter table public.image_generations
  add column if not exists image_url text;

alter table public.image_generations
  add column if not exists storage_path text;

alter table public.image_generations
  add column if not exists created_at timestamptz not null default timezone('utc', now());

insert into storage.buckets (id, name, public)
values ('ai-images', 'ai-images', true)
on conflict (id) do nothing;

alter table public.image_generations enable row level security;

drop policy if exists "Users can view own generations" on public.image_generations;
create policy "Users can view own generations"
  on public.image_generations
  for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert own generations" on public.image_generations;
create policy "Users can insert own generations"
  on public.image_generations
  for insert
  with check (auth.uid() = user_id);

drop policy if exists "Public can view ai-images" on storage.objects;
create policy "Public can view ai-images"
  on storage.objects
  for select
  using (bucket_id = 'ai-images');
