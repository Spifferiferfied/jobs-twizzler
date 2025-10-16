import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { createClient as createServerClient } from "@/utils/supabase/server";

export async function generateStaticParams() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Supabase environment variables are not set.");
  }
  const supabase = createClient(supabaseUrl, supabaseKey);
  const { data: questions } = await supabase.from("questions").select(`id`);
  return questions?.map((question: { id: number }) => {
    return { params: { page: question.id } };
  });
}

type Question = {
  question: string;
  lines: Array<{ line: string }>;
  question_type: {
    type: string;
  };
  answers: Array<{ answer: boolean }>;
};

export default async function Page({ params }: { params: { id: number } }) {
  const cookieStore = cookies();
  const supabase = createServerClient(cookieStore);
  const { id } = await params;
  if (!id) {
    return <div>Question not found</div>;
  }

  const { data } = await supabase
    .from("questions")
    .select(`
      question,
      question_type:question_types (
        type
      ),
      lines (
        line
      ),
      answers (answer)
    `)
    .eq("id", id)
    .limit(1)
    .single();
  const question: Question = data;
  const answers = {
    true: question?.answers.filter((answer) => answer.answer === true) || [],
    false: question?.answers.filter((answer) => answer.answer === false) || [],
  };
  const type = question?.question_type?.type;
  const isLine = type === "line" && question?.lines?.length > 0;

  return (
    <div>
      <h1>{question.question}</h1>
      {isLine && <p>Over or Under {question?.lines[0]?.line}</p>}
      {isLine && (
        <p>
          Over: {answers.true.length} Under: {answers.false.length}
        </p>
      )}
      {!isLine && (
        <p>
          Yes: {answers.true.length} No: {answers.false.length}
        </p>
      )}
    </div>
  );
}
