create extension if not exists pgcrypto with schema extensions;

create type public.vinyl_record_speed as enum ('33_1_3', '45');

create table public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users
    where user_id = auth.uid()
  );
$$;

create table public.vinyl_records (
  id uuid primary key default gen_random_uuid(),
  artist text not null,
  album text not null,
  album_release_year smallint not null,
  edition_release_year smallint,
  genres text[] not null default '{}',
  cover_image_path text,

  label text,
  country text,
  vinyl_color text,
  disc_count smallint not null default 1,
  speed public.vinyl_record_speed,
  limited_edition boolean not null default false,
  copy_number text,
  discogs_url text,

  rating smallint,
  favorite_tracks text[] not null default '{}',
  purchased_at date,
  purchased_from text,
  collection_reason text,
  comment text,

  is_published boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint vinyl_records_album_release_year_check
    check (album_release_year between 1900 and 2100),
  constraint vinyl_records_edition_release_year_check
    check (edition_release_year is null or edition_release_year between 1900 and 2100),
  constraint vinyl_records_disc_count_check
    check (disc_count > 0),
  constraint vinyl_records_rating_check
    check (rating is null or rating between 1 and 10),
  constraint vinyl_records_discogs_url_check
    check (discogs_url is null or discogs_url ~* '^https?://')
);

create index vinyl_records_published_sort_order_idx
  on public.vinyl_records (is_published, sort_order, created_at desc);

create index vinyl_records_artist_album_idx
  on public.vinyl_records (artist, album);

alter table public.vinyl_records enable row level security;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_vinyl_records_updated_at
before update on public.vinyl_records
for each row
execute function public.set_updated_at();

create policy "Anyone can read published vinyl records"
on public.vinyl_records
for select
using (is_published = true);

create policy "Admins can read all vinyl records"
on public.vinyl_records
for select
using (public.is_admin());

create policy "Admins can create vinyl records"
on public.vinyl_records
for insert
with check (public.is_admin());

create policy "Admins can update vinyl records"
on public.vinyl_records
for update
using (public.is_admin())
with check (public.is_admin());

create policy "Admins can delete vinyl records"
on public.vinyl_records
for delete
using (public.is_admin());

create policy "Admins can read admin users"
on public.admin_users
for select
using (public.is_admin());

create policy "Admins can create admin users"
on public.admin_users
for insert
with check (public.is_admin());

create policy "Admins can delete admin users"
on public.admin_users
for delete
using (public.is_admin());

insert into storage.buckets (id, name, public)
values ('vinyl-covers', 'vinyl-covers', true)
on conflict (id) do nothing;

create policy "Anyone can read vinyl covers"
on storage.objects
for select
using (bucket_id = 'vinyl-covers');

create policy "Admins can upload vinyl covers"
on storage.objects
for insert
with check (
  bucket_id = 'vinyl-covers'
  and public.is_admin()
);

create policy "Admins can update vinyl covers"
on storage.objects
for update
using (
  bucket_id = 'vinyl-covers'
  and public.is_admin()
)
with check (
  bucket_id = 'vinyl-covers'
  and public.is_admin()
);

create policy "Admins can delete vinyl covers"
on storage.objects
for delete
using (
  bucket_id = 'vinyl-covers'
  and public.is_admin()
);
