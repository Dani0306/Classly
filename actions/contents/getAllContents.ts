"use server";

import { Content } from "@/types";
import { normalizeContent, typesForFilter } from "@/lib/contenttypes";
import { createServerSupabase } from "@/utils/supabase/server";

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

// PostgREST filter strings treat commas and parentheses as syntax, so user
// input has to be quoted before it goes into .or().
const quoteFilterValue = (value: string) =>
  `"${value.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;

export const getAllContents = async (
  search?: string,
  /** A CONTENT_FILTERS value: "note", "task" or "study". */
  type?: string,
  dueDate?: string,
): Promise<Content[]> => {
  const supabase = await createServerSupabase();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("User not found.");

  let query = supabase.from("contents").select("*").eq("user_id", user.id);

  const term = search?.trim();

  if (term) {
    const pattern = quoteFilterValue(`%${term}%`);
    query = query.or(
      `title.ilike.${pattern},content.ilike.${pattern},ai_output.ilike.${pattern}`,
    );
  }

  const types = typesForFilter(type);
  if (types) query = query.in("type", types);

  if (dueDate && DATE_PATTERN.test(dueDate)) {
    const nextDay = new Date(`${dueDate}T00:00:00Z`);

    if (
      !isNaN(nextDay.getTime()) &&
      nextDay.toISOString().startsWith(dueDate)
    ) {
      nextDay.setUTCDate(nextDay.getUTCDate() + 1);
      query = query
        .gte("due_date", dueDate)
        .lt("due_date", nextDay.toISOString().split("T")[0]);
    }
  }

  const { data, error } = await query.order("created_at", {
    ascending: false,
  });

  if (error) throw new Error("Failed getting contents.");

  return (data as Content[]).map(normalizeContent);
};
