import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdmin } from "@/utils/auth";
import AddQuestionForm from "./AddQuestionForm";

export default async function NewQuestionPage() {
  if (!(await isAdmin())) {
    redirect("/questions");
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Add a question</h1>
        <Link
          href="/questions"
          className="text-sm text-foreground/60 hover:text-foreground transition-colors"
        >
          Back
        </Link>
      </div>
      <AddQuestionForm />
    </div>
  );
}
