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
  current_timestamp_at timestamptz := now();
begin
  perform pg_advisory_xact_lock(hashtext(p_key));

  select *
  into current_bucket
  from public.admin_rate_limits
  where key = p_key
  for update;

  if current_bucket.key is null or current_bucket.reset_at <= current_timestamp_at then
    insert into public.admin_rate_limits (key, count, reset_at, blocked_until)
    values (
      p_key,
      1,
      current_timestamp_at + make_interval(secs => p_window_seconds),
      '-infinity'
    )
    on conflict (key) do update
    set count = 1,
        reset_at = excluded.reset_at,
        blocked_until = excluded.blocked_until;

    return;
  end if;

  if current_bucket.blocked_until > current_timestamp_at then
    raise exception 'rate_limited';
  end if;

  if current_bucket.count + 1 > p_limit then
    update public.admin_rate_limits
    set count = count + 1,
        blocked_until = current_timestamp_at + make_interval(secs => p_block_seconds)
    where key = p_key;

    raise exception 'rate_limited';
  end if;

  update public.admin_rate_limits
  set count = count + 1
  where key = p_key;
end;
$$;
