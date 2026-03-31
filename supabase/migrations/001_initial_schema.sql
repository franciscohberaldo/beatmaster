-- Enable UUID generation
create extension if not exists "pgcrypto";

-- ── projects table ─────────────────────────────────────────────────────────
create table public.projects (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid not null references auth.users(id) on delete cascade,
  name                text not null default 'Untitled Project',
  bpm                 integer not null default 120 check (bpm between 60 and 200),
  pad_configs         jsonb not null default '[]'::jsonb,
  sequencer_patterns  jsonb not null default '[]'::jsonb,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create index projects_user_id_updated_at_idx
  on public.projects(user_id, updated_at desc);

create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger projects_updated_at
  before update on public.projects
  for each row execute procedure public.handle_updated_at();

-- ── samples table ──────────────────────────────────────────────────────────
create table public.samples (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  name          text not null,
  storage_path  text not null,
  file_size     bigint not null,
  mime_type     text not null check (mime_type in (
    'audio/wav','audio/mpeg','audio/ogg','audio/flac','audio/aiff'
  )),
  created_at    timestamptz not null default now()
);

create index samples_user_id_created_at_idx
  on public.samples(user_id, created_at desc);

-- ── Row Level Security ─────────────────────────────────────────────────────
alter table public.projects enable row level security;
alter table public.samples   enable row level security;

create policy "projects: select own" on public.projects for select using (auth.uid() = user_id);
create policy "projects: insert own" on public.projects for insert with check (auth.uid() = user_id);
create policy "projects: update own" on public.projects for update using (auth.uid() = user_id);
create policy "projects: delete own" on public.projects for delete using (auth.uid() = user_id);

create policy "samples: select own"  on public.samples for select using (auth.uid() = user_id);
create policy "samples: insert own"  on public.samples for insert with check (auth.uid() = user_id);
create policy "samples: update own"  on public.samples for update using (auth.uid() = user_id);
create policy "samples: delete own"  on public.samples for delete using (auth.uid() = user_id);
