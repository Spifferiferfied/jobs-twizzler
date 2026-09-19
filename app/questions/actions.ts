"use server";

import { revalidatePath, updateTag } from "next/cache";
import { createClient } from "@/utils/supabase/server";

export type ClearAnswersState = { error?: string; cleared?: number };

/**
 * Deletes the current user's answers so they can re-vote.
 * RLS ("admins delete own answers") restricts this to admins deleting their
 * own rows; a non-admin call simply deletes nothing.
 */
export async function clearMyAnswers(): Promise<ClearAnswersState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be signed in." };
  }

  const { error, count } = await supabase
    .from("answers")
    .delete({ count: "exact" })
    .eq("user_id", user.id);

  if (error) {
    return { error: "Could not clear your answers. Please try again." };
  }

  revalidatePath("/questions");
  revalidatePath("/");
  updateTag("questions");
  return { cleared: count ?? 0 };
}
