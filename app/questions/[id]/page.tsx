import { createClient as createRawClient } from "@supabase/supabase-js";
import Link from "next/link";
import { getQuestion } from "@/utils/queries";
import { createClient } from "@/utils/supabase/server";
import VoteButtons from "./VoteButtons";

export async function generateStaticParams() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Supabase environment variables are not set.");
  }
  const supabase = createRawClient(supabaseUrl, supabaseKey);
  const { data: questions } = await supabase.from("questions").select(`id`);
  return (
    questions?.map((question: { id: number }) => {
      return { id: String(question.id) };
    }) || []
  );
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const supabase = await createClient();
  const { id } = await params;

  if (!id) {
    return <div>Question not found</div>;
  }

  const [
    question,
    {
      data: { user },
    },
  ] = await Promise.all([getQuestion(id), supabase.auth.getUser()]);

  if (!question) {
    return <div>Question not found</div>;
  }

  const isLine = question.lines.length > 0;
  const line = question.lines[0]?.line;

  const totals = {
    true: question.answers.filter((a) => a.answer === true).length,
    false: question.answers.filter((a) => a.answer === false).length,
  };
  const answerCount = question.answers.length;

  // One trip for this user's answers covers BOTH: whether they've voted on this
  // question (and how), and the answered-set used to pick the next unanswered
  // question. The two per-user queries run in parallel.
  let hasVoted = false;
  let userVote: boolean | null = null;
  let nextQuestionId: number | null = null;
  if (user) {
    const [{ data: myAnswers }, { data: allQuestions }] = await Promise.all([
      supabase
        .from("answers")
        .select("question_id, answer")
        .eq("user_id", user.id),
      supabase.from("questions").select("id").order("id"),
    ]);

    const mine = (myAnswers ?? []).find(
      (a: { question_id: number; answer: boolean }) =>
        a.question_id === question.id,
    );
    hasVoted = !!mine;
    userVote = mine?.answer ?? null;

    const answeredIds = new Set(
      (myAnswers ?? []).map((a: { question_id: number }) => a.question_id),
    );
    answeredIds.add(question.id);
    const unanswered = (allQuestions ?? []).filter(
      (q: { id: number }) => !answeredIds.has(q.id),
    );
    nextQuestionId =
      unanswered.find((q: { id: number }) => q.id > question.id)?.id ??
      unanswered[0]?.id ??
      null;
  }

  return (
    <>
      <div className="border-2 border-secondary rounded-lg p-4 font-bold text-md bg-secondary-dark justify-center items-center flex flex-col">
        <h1 className="text-2xl font-bold ${isLine mb-4">
          {question.question}
        </h1>
        {isLine && (
          <p className="text-lg font-normal border-2 border-primary rounded-lg p-3 text-center bg-secondary/20 mb-2 w-full">
            Line: <span className="font-bold">+/- {line}</span>
          </p>
        )}
        <span className="text-sm font-normal">{answerCount} Answered</span>
      </div>

      {!user && (
        <p className="text-gray-500 text-sm">
          <Link
            href={`/auth/login?next=/questions/${id}`}
            className="underline font-medium text-primary"
          >
            Sign in
          </Link>{" "}
          to cast your vote.
        </p>
      )}

      {user && hasVoted && (
        <>
          <div className="border-2 border-secondary bg-primary/20 rounded-lg p-4">
            <div
              className="rounded-lg flex justify-between mb-2 bg-tertiary"
              style={
                {
                  "--true-width": `${(totals.true / (totals.true + totals.false)) * 100}%`,
                  "--false-width": `${(totals.false / (totals.true + totals.false)) * 100}%`,
                } as React.CSSProperties
              }
            >
              <div
                className={`w-(--true-width) h-[25px] border-2 rounded-tl-lg rounded-bl-lg ${userVote === true ? "bg-primary  border-secondary  starting:w-0 transition-[width] duration-750" : " border-2 border-transparent"}`}
              ></div>
              <div
                className={`w-(--false-width) h-[25px] border-2 rounded-tr-lg rounded-br-lg ${userVote === false ? "bg-primary  border-secondary  starting:w-0 transition-[width] duration-750" : " border-2 border-transparent"}`}
              ></div>
            </div>
            <div className="flex justify-between text-sm items-center">
              <div
                className={`${userVote === true ? "text-lg font-bold" : "font-bold text-foreground/75"}`}
              >
                {isLine ? "Over" : "Yes"}:{" "}
                <span className="font-normal">
                  {Math.round(
                    (totals.true / (totals.true + totals.false)) * 100,
                  )}
                  %
                </span>
              </div>
              <div
                className={`${userVote === false ? "text-lg font-bold" : "font-bold text-foreground/75"}`}
              >
                {isLine ? "Under" : "No"}:{" "}
                <span className="font-normal">
                  {Math.round(
                    (totals.false / (totals.true + totals.false)) * 100,
                  )}
                  %
                </span>
              </div>
            </div>
          </div>
          {nextQuestionId ? (
            <Link
              href={`/questions/${nextQuestionId}`}
              className="loading-btn py-4 w-full block text-center rounded-lg border-2 border-secondary bg-primary font-bold hover:bg-primary/80 hover:text-white transition-colors disabled:opacity-50"
            >
              Next Question
            </Link>
          ) : (
            <span className="py-4 w-full block text-center rounded-lg border-2 border-secondary bg-primary/50 font-bold opacity-50">
              No more questions
            </span>
          )}
        </>
      )}

      {user && !hasVoted && (
        <VoteButtons questionId={question.id} isLine={isLine} />
      )}
    </>
  );
}
