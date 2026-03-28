"use sever";

import { NewClass } from "@/types";
import { createServerSupabase } from "@/utils/supabase/server";

export const createClass = async (newClass: NewClass) => {
  const supabase = await createServerSupabase();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const { data, error } = await supabase
    .from("classes")
    .insert({ ...newClass, user_id: user.id })
    .select()
    .single();

  if (error) {
    console.error("Failed to create a class: ", error.message);
    throw new Error("Failed to create the class.");
  }

  return data;
};
