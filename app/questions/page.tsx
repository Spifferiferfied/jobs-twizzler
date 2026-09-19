import Image from "next/image";
import Link from "next/link";
import { getQuestions } from "@/utils/queries";
import { createClient } from "@/utils/supabase/server";

type Question = {
  id: number;
  question: string;
  lines: Array<{ line: string }>;
  answerCount: number;
  enabled: boolean;
};

export default async function Page() {
  // Public list — served from the Next data cache (see utils/queries.ts).
  const rows = await getQuestions();
  const questions: Question[] = rows.map((q) => ({
    id: q.id,
    question: q.question,
    lines: q.lines,
    answerCount: q.answers[0]?.count ?? 0,
    enabled: q.enabled,
  }));

  // Per-user: which questions they've answered (sinks answered to the bottom).
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let answeredIds = new Set<number>();
  if (user) {
    const { data: myAnswers } = await supabase
      .from("answers")
      .select("question_id")
      .eq("user_id", user.id);
    answeredIds = new Set(
      (myAnswers ?? []).map((a: { question_id: number }) => a.question_id),
    );
  }

  const sortedQuestions = user
    ? [
        ...questions.filter((q) => !answeredIds.has(q.id)),
        ...questions.filter((q) => answeredIds.has(q.id)),
      ]
    : questions;

  return (
    <div>
      <ul>
        {sortedQuestions.map((question: Question) => (
          <li
            className="border-2 border-secondary rounded-lg mb-4 p-4 font-bold text-md bg-secondary-dark"
            key={question.id}
          >
            <Link href={`/questions/${question.id}`} className="loading-btn">
              <div className="mb-2">{question.question}</div>
              <div className="text-sm font-normal flex justify-between items-center">
                <span>{question.answerCount} Answered</span>
                <span className="inline">
                  <Image
                    src="/icons/arrow-right.svg"
                    alt="arrow"
                    width={4}
                    height={8}
                  />
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
