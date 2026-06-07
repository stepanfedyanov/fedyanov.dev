create table if not exists public.admin_rate_limits (
  key text primary key,
  count integer not null default 0,
  reset_at timestamptz not null,
  blocked_until timestamptz not null default '-infinity'
);

alter table public.admin_rate_limits enable row level security;

create or replace function public.assert_admin_rate_limit(
  p_key text,
  p_limit integer,
  p_window_seconds integer,
  p_block_seconds integer
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  current_bucket public.admin_rate_limits%rowtype;
  current_time timestamptz := now();
begin
  perform pg_advisory_xact_lock(hashtext(p_key));

  select *
  into current_bucket
  from public.admin_rate_limits
  where key = p_key
  for update;

  if current_bucket.key is null or current_bucket.reset_at <= current_time then
    insert into public.admin_rate_limits (key, count, reset_at, blocked_until)
    values (
      p_key,
      1,
      current_time + make_interval(secs => p_window_seconds),
      '-infinity'
    )
    on conflict (key) do update
    set count = 1,
        reset_at = excluded.reset_at,
        blocked_until = excluded.blocked_until;

    return;
  end if;

  if current_bucket.blocked_until > current_time then
    raise exception 'rate_limited';
  end if;

  if current_bucket.count + 1 > p_limit then
    update public.admin_rate_limits
    set count = count + 1,
        blocked_until = current_time + make_interval(secs => p_block_seconds)
    where key = p_key;

    raise exception 'rate_limited';
  end if;

  update public.admin_rate_limits
  set count = count + 1
  where key = p_key;
end;
$$;

create or replace function public.clear_admin_rate_limit(p_key text)
returns void
language sql
security definer
set search_path = public
as $$
  delete from public.admin_rate_limits
  where key = p_key;
$$;

grant execute on function public.assert_admin_rate_limit(text, integer, integer, integer) to service_role;
grant execute on function public.clear_admin_rate_limit(text) to service_role;
grant select, insert, update, delete on table public.admin_rate_limits to service_role;

update storage.buckets
set public = false
where id = 'vinyl-covers';

drop policy if exists "Anyone can read vinyl covers" on storage.objects;
drop policy if exists "Anyone can read published vinyl covers" on storage.objects;
drop policy if exists "Admins can read vinyl covers" on storage.objects;

create policy "Anyone can read published vinyl covers"
on storage.objects
for select
using (
  bucket_id = 'vinyl-covers'
  and exists (
    select 1
    from public.vinyl_records
    where cover_image_path = storage.objects.name
      and is_published = true
  )
);

create policy "Admins can read vinyl covers"
on storage.objects
for select
using (
  bucket_id = 'vinyl-covers'
  and public.is_admin()
);
