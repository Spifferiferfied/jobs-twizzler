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

  const { data: questions } = await supabase.from("questions").select(`
      id,
      question,
      lines (
        line
      ),
      enabled
    `);

  return (
    <div>
      <ul>
        {questions?.map((question: Question) => (
          <li key={question.id}>
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
