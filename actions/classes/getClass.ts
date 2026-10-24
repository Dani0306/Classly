"use server";

import { Class, ClassPin, Content } from "@/types";
import {
  isPendingFilter,
  normalizeContent,
  PENDING_CONDITION,
  typesForFilter,
} from "@/lib/contenttypes";
import { createServerSupabase } from "@/utils/supabase/server";

/** `filter` is a CONTENT_FILTERS value: "note", "task", "pending" or "study". */
export const getClass = async (id: string, filter?: string) => {
  const supabase = await createServerSupabase();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("User not found.");

  let query = supabase
    .from("materials")
    .select("*")
    .eq("class_id", id)
    .eq("user_id", user.id);

  const types = typesForFilter(filter);
  if (types) query = query.in("type", types);

  const pending = isPendingFilter(filter);
  if (pending) {
    query = query
      .or(PENDING_CONDITION)
      .order("due_date", { ascending: true, nullsFirst: false });
  }

  const [
    { data: classItem, error: classError },
    { data: contents, error: notesError },
    { data: pins, error: pinsError },
  ] = await Promise.all([
    supabase
      .from("classes")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .single(),
    query.order("created_at", { ascending: false }),
    supabase
      .from("class_pins")
      .select("*")
      .eq("class_id", id)
      .eq("user_id", user.id)
      .order("created_at", { ascending: true }),
  ]);

  if (classError) throw new Error("Failed getting class.");
  if (notesError) throw new Error("Failed getting notes from class.");
  if (pinsError) throw new Error("Failed getting the class's pinned items.");

  return {
    classItem: classItem as Class,
    contents: (contents as Content[]).map(normalizeContent),
    pins: pins as ClassPin[],
  };
};
