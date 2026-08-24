"use server";

import { NewContent } from "@/types";
import { createServerSupabase } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export const createContent = async (note: NewContent) => {
  const supabase = await createServerSupabase();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("User not found.");

  const { data, error } = await supabase
    .from("contents")
    .insert({ ...note, user_id: user.id });

  if (error) throw new Error("Failed creating note.");

  revalidatePath("/app/class/[id]");

  return data;
};
