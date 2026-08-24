"use server";

import { UpdateContent } from "@/types";
import { createServerSupabase } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export const modifyContent = async (content: UpdateContent, id: string) => {
  const supabase = await createServerSupabase();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("No user found.");

  const { data, error } = await supabase
    .from("contents")
    .update({ ...content, updated_at: new Date().toISOString() })
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) throw new Error("Failed updating note.");

  revalidatePath("/app/class/[id]");

  return data;
};
