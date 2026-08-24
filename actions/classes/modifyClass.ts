"use server";

import { UpdateClass } from "@/types";
import { createServerSupabase } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export const modifyClass = async (newClass: UpdateClass, id: string) => {
  const supabase = await createServerSupabase();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("User not found.");

  const { data, error } = await supabase
    .from("classes")
    .update({ ...newClass, updated_at: new Date().toISOString() })
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) throw new Error("Error creating class.");

  revalidatePath("/app/class/[id]");

  return data;
};
