"use server";

import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export type CreateQuestionState = { error?: string };

export async function createQuestion(
  _prevState: CreateQuestionState,
  formData: FormData,
): Promise<CreateQuestionState> {
  const supabase = await createClient();

  // Defense in depth — RLS also enforces this on insert.
  const { data: admin } = await supabase.rpc("is_admin");
  if (admin !== true) {
    return { error: "You must be an admin to add questions." };
  }

  const question = formData.get("question")?.toString().trim() ?? "";
  const type = formData.get("type")?.toString() ?? "";
  const line = formData.get("line")?.toString().trim() ?? "";
  const enabled = formData.get("enabled") === "on";

  if (!question) return { error: "Question text is required." };
  if (type !== "yes/no" && type !== "over/under") {
    return { error: "Please choose a question type." };
  }
  if (type === "over/under" && !line) {
    return { error: "Over/under questions need a line value." };
  }

  // Resolve the type_id from the canonical question_types row.
  const { data: typeRow } = await supabase
    .from("question_types")
    .select("id")
    .eq("type", type)
    .maybeSingle();

  const { data: inserted, error: qErr } = await supabase
    .from("questions")
    .insert({ question, enabled, type_id: typeRow?.id ?? null })
    .select("id")
    .single();

  if (qErr || !inserted) {
    return { error: "Could not create the question. Please try again." };
  }

  // Over/under questions carry their line in the lines table.
  if (type === "over/under") {
    const { error: lErr } = await supabase
      .from("lines")
      .insert({ question_id: inserted.id, line });
    if (lErr) {
      return { error: "Question saved, but the line failed to save." };
    }
  }

  revalidatePath("/questions");
  revalidatePath("/");
  updateTag("questions");
  redirect(`/questions/${inserted.id}`);
}
