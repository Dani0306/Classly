"use server";

import { Class, Content } from "@/types";
import { normalizeContent, typesForFilter } from "@/lib/contenttypes";
import { createServerSupabase } from "@/utils/supabase/server";

/** `filter` is a CONTENT_FILTERS value: "note", "task" or "study". */
export const getClass = async (id: string, filter?: string) => {
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

  const types = typesForFilter(filter);
  if (types) query = query.in("type", types);

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
    query.order("created_at", { ascending: false }),
  ]);

  if (classError) throw new Error("Failed getting class.");
  if (notesError) throw new Error("Failed getting notes from class.");

  return {
    classItem: classItem as Class,
    contents: (contents as Content[]).map(normalizeContent),
  };
};
