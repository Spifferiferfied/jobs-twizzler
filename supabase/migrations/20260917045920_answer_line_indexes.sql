-- Indexes for per-question lookups. The only existing index on `answers`
-- leads with user_id (the unique (user_id, question_id) constraint), so it
-- can't serve question_id-only reads used by the vote counts/totals.
create index if not exists answers_question_id_idx on public.answers (question_id);
create index if not exists lines_question_id_idx on public.lines (question_id);
