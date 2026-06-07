grant usage on schema public to anon, authenticated, service_role;

grant execute on function public.is_admin() to anon, authenticated, service_role;

grant select on table public.admin_users to authenticated, service_role;
grant insert, delete on table public.admin_users to service_role;

grant select on table public.vinyl_records to anon, authenticated, service_role;
grant insert, update, delete on table public.vinyl_records to service_role;

grant usage on type public.vinyl_record_speed to anon, authenticated, service_role;
