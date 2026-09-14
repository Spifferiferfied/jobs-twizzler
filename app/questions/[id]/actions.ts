"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";

export async function submitVote(questionId: number, answer: boolean) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be signed in to vote." };
  }

  const { error } = await supabase.from("answers").insert({
    question_id: questionId,
    answer,
    user_id: user.id,
  });

  if (error) {
    // Unique constraint violation — already voted
    if (error.code === "23505") {
      return { error: "You've already voted on this question." };
    }
    return { error: "Something went wrong. Please try again." };
  }

  revalidatePath(`/questions/${questionId}`);
  return { success: true };
}
