"use server";

import { Class, Content, EventData, EventKind } from "@/types";
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
  const wantsContents =
    !type || type === "homework" || type === "reminder" || type === "all";

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

  //* reminders + homework

  let contentEvents: EventData[] = [];

  if (wantsContents) {
    let query = supabase.from("contents").select("*").eq("user_id", user.id);

    if (type === "homework" || type === "reminder") {
      query = query.eq("type", type); // narrowed to exactly one kind
    } else {
      query = query.in("type", ["reminder", "homework"]); // "all" case
    }

    const { data: contents, error: contentsError } =
      await query.returns<Content[]>();

    if (contentsError)
      throw new Error("Something went wrong fetching the contents");

    contentEvents = (contents ?? [])
      .filter((item) => item.due_date)
      // due_date is a timestamp without a timezone — a calendar day, not a
      // moment — so keep only the date part and let the browser place it.
      .map((item) => ({
        id: item.id,
        title: item.title,
        kind: item.type as EventData["kind"],
        description: item.ai_output ?? item.content ?? "",
        dueDate: item.due_date!.slice(0, 10),
      }));
  }

  return [...classesEvents, ...contentEvents];
};
