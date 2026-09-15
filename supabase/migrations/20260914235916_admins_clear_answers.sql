-- Let admins delete their OWN answers (a testing convenience: clears their
-- votes from the totals so they can answer everything again).
--
-- Scoped to admins on purpose: regular users' votes stay final (the login
-- page promises "no take-backs"), so no general self-delete policy is added.
-- is_admin() is SECURITY DEFINER, so it evaluates fine inside RLS.

create policy "admins delete own answers" on public.answers for delete
  to authenticated
  using (public.is_admin() and auth.uid() = user_id);
