"use server";

import { createServerSupabase } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export const deleteContent = async (id: string) => {
  const supabase = await createServerSupabase();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("No user found.");

  const { error } = await supabase
    .from("contents")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw new Error("Error deleting content.");

  revalidatePath("/app/class/[id]");

  return true;
};
