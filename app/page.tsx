import { cookies } from "next/headers";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";

type Question = {
  id: number;
  question: string;
  lines: Array<{
    line: string;
  }>;
  enabled: boolean;
};

export default async function Page() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data } = await supabase.from("questions").select(`
      id,
      question,
      lines (
        line
      ),
      enabled
    `);
  const questions = data?.sort((a, b) => a.id - b.id) || [];
  return (
    <div className="text-center">
      <ul>
        {questions?.map((question: Question) => (
          <li className="mb-3" key={question.id}>
            <Link href={`/questions/${question.id}`}>
              {question.question}
              {question.lines.length > 0 && ` +/- ${question.lines[0]?.line}`}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
