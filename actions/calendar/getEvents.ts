"use server";

import { Class, Content, Event, EventKind } from "@/types";
import { at, getHours, getMinutes } from "@/utils/fn";
import { createServerSupabase } from "@/utils/supabase/server";

// ScheduleEntry.day is 0=Sun..6=Sat. at() expects days after Monday.
function dayOffsetFromMonday(day: number) {
  return (day + 6) % 7; // Mon->0, Tue->1, ... Sun->6
}

export const getMyEvents = async (type?: EventKind | "all") => {
  const supabase = await createServerSupabase();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("No user found.");

  const wantsClasses = !type || type === "class" || type === "all";
  const wantsContents =
    !type || type === "homework" || type === "reminder" || type === "all";

  let classesEvents: Event[] = [];

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
          start: at(
            dayOffsetFromMonday(s.day),
            getHours(s.start_time),
            getMinutes(s.start_time),
          ),
          end: at(
            dayOffsetFromMonday(s.day),
            getHours(s.end_time),
            getMinutes(s.end_time),
          ),
          description: item.description ?? "",
          allDay: false,
        })),
      ) ?? [];
  }

  //* reminders + homework

  let contentEvents: Event[] = [];

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
      .map((item) => {
        const due = new Date(item.due_date!);
        return {
          id: item.id,
          title: item.title,
          kind: item.type as Event["kind"],
          start: due,
          end: due,
          description: item.ai_output ?? item.content ?? "",
          allDay: true,
        };
      });
  }

  return [...classesEvents, ...contentEvents];
};
