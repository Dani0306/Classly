"use server";

import { createServerSupabase } from "@/utils/supabase/server";

export const getMyClasses = async (search?: string) => {
  const supabase = await createServerSupabase();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("No user found.");

  let query = supabase
    .from("classes")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (search && search.trim() !== "") {
    const term = search.trim();
    query = query.or(
      `name.ilike.%${term}%,description.ilike.%${term}%,icon.ilike.%${term}%,color.ilike.%${term}%`,
    );
  }

  const { data: classes, error: classesError } = await query;

  if (classesError) {
    console.error(classesError);
    throw new Error("Failed getting classes.");
  }

  return classes;
};
