import { createClient } from "@/utils/supabase/server";

/**
 * Returns true if the current signed-in user has the admin role.
 * Backed by the SECURITY DEFINER public.is_admin() function.
 */
export async function isAdmin(): Promise<boolean> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("is_admin");
  if (error) return false;
  return data === true;
}
