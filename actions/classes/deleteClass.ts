"use server";

import { createServerSupabase } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export const deleteClass = async (id: string) => {
  const supabase = await createServerSupabase();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("User not found.");

  const { error } = await supabase
    .from("classes")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw new Error("Failed deleting class.");

  revalidatePath("/app/classes");

  return true;
};
