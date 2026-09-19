import { createClient } from "@supabase/supabase-js";
import { unstable_cache } from "next/cache";

function anonClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error("Supabase environment variables are not set.");
  }
  return createClient(url, key);
}

export type QuestionListRow = {
  id: number;
  question: string;
  lines: Array<{ line: string }>;
  answers: Array<{ count: number }>;
  enabled: boolean;
};

export type QuestionDetail = {
  id: number;
  question: string;
  lines: Array<{ line: string }>;
  answers: Array<{ answer: boolean }>;
};

// Public data — identical for every viewer — so it lives in the Next data
// cache and is invalidated by revalidateTag("questions") on any vote or new
// question. Per-user data (userVote, next question, answered-set) is fetched
// separately, uncached, with the request's cookie client.
export const getQuestions = unstable_cache(
  async (): Promise<QuestionListRow[]> => {
    const { data } = await anonClient()
      .from("questions")
      .select(`id, question, lines (line), answers (count), enabled`)
      .order("id", { ascending: true });
    return (data as QuestionListRow[] | null) ?? [];
  },
  ["questions-list"],
  { tags: ["questions"] },
);

export function getQuestion(id: string): Promise<QuestionDetail | null> {
  return unstable_cache(
    async (): Promise<QuestionDetail | null> => {
      const { data } = await anonClient()
        .from("questions")
        .select(`id, question, lines (line), answers (answer)`)
        .eq("id", id)
        .limit(1)
        .maybeSingle();
      return (data as QuestionDetail | null) ?? null;
    },
    ["question", id],
    { tags: ["questions"] },
  )();
}
