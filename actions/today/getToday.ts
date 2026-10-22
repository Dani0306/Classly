"use server";

import { TodayData, TodayTask } from "@/types";
import { normalizeContent, TASK_DB_TYPES } from "@/lib/contenttypes";
import { createServerSupabase } from "@/utils/supabase/server";

/**
 * Classes (for today's timetable) and tasks for the Today screen: every open
 * task, plus finished ones due from yesterday on so a task ticked off today
 * stays on the list. "Today" depends on the student's timezone, so the
 * browser does the grouping.
 */
export const getToday = async (): Promise<TodayData> => {
  const supabase = await createServerSupabase();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("User not found.");

  // Two days back covers every timezone's "yesterday" against the server's UTC.
  const recent = new Date();
  recent.setUTCDate(recent.getUTCDate() - 2);
  const recentDay = recent.toISOString().slice(0, 10);

  const [
    { data: classes, error: classesError },
    { data: tasks, error: tasksError },
  ] = await Promise.all([
    supabase
      .from("classes")
      .select("id, name, color, schedule")
      .eq("user_id", user.id)
      .order("name"),
    supabase
      .from("contents")
      .select("*, classes(name, color)")
      .eq("user_id", user.id)
      .in("type", TASK_DB_TYPES)
      .not("due_date", "is", null)
      .or(`is_completed.is.false,is_completed.is.null,due_date.gte.${recentDay}`)
      .order("due_date", { ascending: true }),
  ]);

  if (classesError) throw new Error("Failed getting your classes.");
  if (tasksError) throw new Error("Failed getting your tasks.");

  return {
    classes: classes ?? [],
    tasks: ((tasks ?? []) as TodayTask[]).map(normalizeContent),
  };
};
