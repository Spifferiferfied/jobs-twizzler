import Link from "next/link";
import Image from "next/image";
import { isAdmin } from "@/utils/auth";
import ClearAnswersButton from "./ClearAnswersButton";
import { createClient } from "@/utils/supabase/server";

type QuestionRow = {
  id: number;
  question: string;
  lines: Array<{
    line: string;
  }>;
  answers: Array<{ count: number }>;
  enabled: boolean;
};

type Question = {
  id: number;
  question: string;
  lines: Array<{
    line: string;
  }>;
  answerCount: number;
  enabled: boolean;
};

export default async function Page() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("questions")
    .select(`
      id,
      question,
      lines (
        line
      ),
      answers (
        count
      ),
      enabled
    `)
    .order("id", { ascending: true });

  const questions: Question[] =
    data?.map((question: QuestionRow) => ({
      id: question.id,
      question: question.question,
      lines: question.lines,
      answerCount: question.answers[0]?.count ?? 0,
      enabled: question.enabled,
    })) ?? [];

  const admin = await isAdmin();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Signed-in users: questions they've already answered sink to the bottom.
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
      {admin && (
        <div className="mb-4 flex justify-end gap-3">
          <ClearAnswersButton />
          <Link
            href="/questions/new"
            className="px-4 py-2 rounded-lg border-2 border-secondary bg-primary font-bold hover:bg-primary/80 hover:text-white transition-colors"
          >
            + Add question
          </Link>
        </div>
      )}
      <ul>
        {sortedQuestions.map((question: Question) => (
          <li className="border-2 border-secondary rounded-lg mb-4 p-4 font-bold text-md bg-secondary-dark" key={question.id}>
            <Link href={`/questions/${question.id}`} className="loading-btn">
              <div className="mb-2">{ question.question }</div>
              <div className="text-sm font-normal flex justify-between items-center">
                <span>{ question.answerCount } Answered</span>
                <span className="inline"><Image src="/icons/arrow-right.svg" alt="arrow" width={4} height={8} /></span>
              </div>
              <div role="status" className="loading-spinner absolute -translate-x-1/2 -translate-y-1/2 top-2/4 left-1/2">
                <svg aria-hidden="true" className="w-8 h-8 text-neutral-tertiary animate-spin fill-primary" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/><path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/></svg>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
