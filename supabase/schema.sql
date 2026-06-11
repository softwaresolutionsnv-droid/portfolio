-- ============================================================
-- Portfolio CMS — schema
-- Eén keer uitvoeren in de Supabase SQL editor (daarna seed.sql).
-- ============================================================

create extension if not exists pgcrypto;

-- ------------------------------------------------------------
-- Tabellen
-- ------------------------------------------------------------

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text not null default '',
  lede text not null default '',
  tags text[] not null default '{}',
  role text not null default '',
  year text not null default '',
  client text not null default '',
  url text,
  -- Storage-key ('slug/123-foo.jpg') of site-pad ('/projects/foo.jpg')
  image text,
  image_alt text not null default '',
  color text not null default 'oklch(0.22 0.05 230)',
  overview text[] not null default '{}',
  highlights jsonb not null default '[]'::jsonb,
  gallery jsonb not null default '[]'::jsonb,
  show_badge boolean not null default false,
  show_cta boolean not null default false,
  published boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.site_settings (
  id integer primary key check (id = 1),
  availability_state text not null default 'available'
    check (availability_state in ('available', 'limited', 'unavailable')),
  available_from text,
  about jsonb not null default '{}'::jsonb,
  skills jsonb not null default '{}'::jsonb,
  contact jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- Alleen voor de ingelogde beheerder (deploy hook is semi-geheim).
create table if not exists public.admin_settings (
  id integer primary key check (id = 1),
  deploy_hook_url text,
  last_published_at timestamptz
);

-- ------------------------------------------------------------
-- updated_at trigger
-- ------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists projects_set_updated_at on public.projects;
create trigger projects_set_updated_at
  before update on public.projects
  for each row execute function public.set_updated_at();

drop trigger if exists site_settings_set_updated_at on public.site_settings;
create trigger site_settings_set_updated_at
  before update on public.site_settings
  for each row execute function public.set_updated_at();

-- ------------------------------------------------------------
-- Row Level Security
-- anon (build + bezoekers): alleen gepubliceerde projecten + site_settings lezen.
-- authenticated (de beheerder): alles.
-- ------------------------------------------------------------

alter table public.projects enable row level security;
alter table public.site_settings enable row level security;
alter table public.admin_settings enable row level security;

drop policy if exists "Public read published projects" on public.projects;
create policy "Public read published projects"
  on public.projects for select
  using (published);

drop policy if exists "Admin manages projects" on public.projects;
create policy "Admin manages projects"
  on public.projects for all
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Public read site settings" on public.site_settings;
create policy "Public read site settings"
  on public.site_settings for select
  using (true);

drop policy if exists "Admin manages site settings" on public.site_settings;
create policy "Admin manages site settings"
  on public.site_settings for all
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Admin manages admin settings" on public.admin_settings;
create policy "Admin manages admin settings"
  on public.admin_settings for all
  to authenticated
  using (true)
  with check (true);

-- ------------------------------------------------------------
-- Storage: publieke bucket voor projectbeelden
-- ------------------------------------------------------------

insert into storage.buckets (id, name, public)
values ('project-images', 'project-images', true)
on conflict (id) do nothing;

drop policy if exists "Public read project images" on storage.objects;
create policy "Public read project images"
  on storage.objects for select
  using (bucket_id = 'project-images');

drop policy if exists "Admin uploads project images" on storage.objects;
create policy "Admin uploads project images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'project-images');

drop policy if exists "Admin updates project images" on storage.objects;
create policy "Admin updates project images"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'project-images');

drop policy if exists "Admin deletes project images" on storage.objects;
create policy "Admin deletes project images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'project-images');
