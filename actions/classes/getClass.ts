"use server";

import { ContentType } from "@/types";
import { createServerSupabase } from "@/utils/supabase/server";

export const getClass = async (id: string, noteType?: ContentType) => {
  const supabase = await createServerSupabase();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("User not found.");

  let query = supabase
    .from("contents")
    .select("*")
    .eq("class_id", id)
    .eq("user_id", user.id);

  if (noteType) query = query.eq("type", noteType);

  const [
    { data: classItem, error: classError },
    { data: contents, error: notesError },
  ] = await Promise.all([
    supabase
      .from("classes")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .single(),
    query,
  ]);

  if (classError) throw new Error("Failed getting class.");
  if (notesError) throw new Error("Failed getting notes from class.");

  return { classItem, contents };
};
