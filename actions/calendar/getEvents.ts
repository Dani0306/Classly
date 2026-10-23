"use server";

import { Class, Content, EventData, EventKind } from "@/types";
import { TASK_DB_TYPES } from "@/lib/contenttypes";
import { createServerSupabase } from "@/utils/supabase/server";

export const getMyEvents = async (
  type?: EventKind | "all",
): Promise<EventData[]> => {
  const supabase = await createServerSupabase();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("No user found.");

  const wantsClasses = !type || type === "class" || type === "all";
  const wantsTasks = !type || type === "task" || type === "all";

  let classesEvents: EventData[] = [];

  if (wantsClasses) {
    const { data: classes, error: classesError } = await supabase
      .from("classes")
      .select("*")
      .eq("user_id", user.id)
      .returns<Class[]>();

    if (classesError)
      throw new Error("Something went wrong fetching the classes");

    classesEvents =
      classes?.flatMap((item) =>
        (item.schedule ?? []).map((s, i) => ({
          id: `${item.id}-${i}`,
          title: item.name,
          kind: "class" as const,
          description: item.description ?? "",
          day: s.day,
          startTime: s.start_time,
          endTime: s.end_time,
        })),
      ) ?? [];
  }

  //* tasks (legacy homework and reminders included)

  let taskEvents: EventData[] = [];

  if (wantsTasks) {
    const { data: contents, error: contentsError } = await supabase
      .from("materials")
      .select("*")
      .eq("user_id", user.id)
      .in("type", TASK_DB_TYPES)
      .returns<Content[]>();

    if (contentsError)
      throw new Error("Something went wrong fetching your tasks.");

    taskEvents = (contents ?? [])
      .filter((item) => item.due_date)
      // due_date is a timestamp without a timezone — a calendar day, not a
      // moment — so keep only the date part and let the browser place it.
      .map((item) => ({
        id: item.id,
        title: item.title,
        kind: "task" as const,
        description: item.ai_output ?? item.content ?? "",
        dueDate: item.due_date!.slice(0, 10),
      }));
  }

  return [...classesEvents, ...taskEvents];
};
