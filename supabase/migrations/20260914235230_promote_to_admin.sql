-- Maintenance helper: promote a user to admin by email, returning a status
-- message so a missed email doesn't fail silently.
--
-- Notes:
--   * Case-insensitive lookup — auth.users stores emails lowercased, so a
--     stray capital letter in the literal would otherwise match nothing.
--   * NOT security definer: it runs with the caller's privileges, so it only
--     works when executed by the service role (e.g. the Supabase SQL editor).
--   * execute is revoked from the client roles so it can never be reached via
--     the auto-generated RPC API (otherwise any signed-in user could self-promote).
--
-- Usage (SQL editor):
--   select public.promote_to_admin('someone@example.com');

create or replace function public.promote_to_admin(_email text)
returns text
language plpgsql
as $$
declare
  _uid uuid;
  _n int;
begin
  select id into _uid from auth.users where lower(email) = lower(_email);
  if _uid is null then
    return 'No user found with ' || _email || ' (have they signed in at least once?)';
  end if;

  insert into public.user_roles (user_id, role)
  values (_uid, 'admin')
  on conflict (user_id, role) do nothing;
  get diagnostics _n = row_count;

  return case
    when _n = 1 then 'Promoted ' || _email || ' to admin'
    else _email || ' was already an admin - no change'
  end;
end;
$$;

revoke execute on function public.promote_to_admin(text) from anon, authenticated;
