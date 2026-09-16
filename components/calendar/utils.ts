import { differenceInMinutes, isSameDay } from "date-fns";
import { ColorKey } from "./types";
import { Event } from "@/types";

// Visible time window for the day/week grid. Adjust to fit your class schedule.
export const DAY_START_HOUR = 5;
export const DAY_END_HOUR = 23;
export const PX_PER_HOUR = 64;

export function eventsForDay(events: Event[], day: Date) {
  return events
    .filter((e) => !e.allDay && isSameDay(e.start, day))
    .sort((a, b) => a.start.getTime() - b.start.getTime());
}

export function allDayEventsForDay(events: Event[], day: Date) {
  return events.filter((e) => e.allDay && isSameDay(e.start, day));
}

/** Pixel offset + height for a timed event inside the day grid. */
export function getEventLayout(event: Event) {
  const dayStartMinutes = DAY_START_HOUR * 60;
  const startMinutes =
    event.start.getHours() * 60 + event.start.getMinutes() - dayStartMinutes;
  const durationMinutes = Math.max(
    differenceInMinutes(event.end, event.start),
    20, // never render a sliver too small to click
  );
  const top = (startMinutes / 60) * PX_PER_HOUR;
  const height = (durationMinutes / 60) * PX_PER_HOUR;
  return { top, height };
}

/** Pixel offset for the "current time" line inside the day grid. Null when out of the visible window. */
export function getNowLineOffset(now: Date) {
  const minutes = now.getHours() * 60 + now.getMinutes() - DAY_START_HOUR * 60;
  if (minutes < 0 || minutes > (DAY_END_HOUR - DAY_START_HOUR) * 60)
    return null;
  return (minutes / 60) * PX_PER_HOUR;
}

export const COURSE_COLORS: Record<
  ColorKey,
  { dot: string; bg: string; border: string; text: string; solid: string }
> = {
  violet: {
    dot: "bg-violet-500",
    bg: "bg-violet-50 dark:bg-violet-950/40",
    border: "border-violet-300 dark:border-violet-800",
    text: "text-violet-900 dark:text-violet-200",
    solid: "bg-violet-500",
  },
  sky: {
    dot: "bg-sky-500",
    bg: "bg-sky-50 dark:bg-sky-950/40",
    border: "border-sky-300 dark:border-sky-800",
    text: "text-sky-900 dark:text-sky-200",
    solid: "bg-sky-500",
  },
  amber: {
    dot: "bg-amber-500",
    bg: "bg-amber-50 dark:bg-amber-950/40",
    border: "border-amber-300 dark:border-amber-800",
    text: "text-amber-900 dark:text-amber-200",
    solid: "bg-amber-500",
  },
  rose: {
    dot: "bg-rose-500",
    bg: "bg-rose-50 dark:bg-rose-950/40",
    border: "border-rose-300 dark:border-rose-800",
    text: "text-rose-900 dark:text-rose-200",
    solid: "bg-rose-500",
  },
  emerald: {
    dot: "bg-emerald-500",
    bg: "bg-emerald-50 dark:bg-emerald-950/40",
    border: "border-emerald-300 dark:border-emerald-800",
    text: "text-emerald-900 dark:text-emerald-200",
    solid: "bg-emerald-500",
  },
  slate: {
    dot: "bg-slate-500",
    bg: "bg-slate-50 dark:bg-slate-900/40",
    border: "border-slate-300 dark:border-slate-700",
    text: "text-slate-900 dark:text-slate-200",
    solid: "bg-slate-500",
  },
};

export const KIND_LABEL: Record<Event["kind"], string> = {
  class: "Class",
  homework: "Homework",
  reminder: "Reminder",
};

import { EventKind } from "@/types";

export const KIND_COLORS: Record<
  EventKind,
  { dot: string; bg: string; border: string; text: string }
> = {
  class: {
    dot: "bg-violet-500",
    bg: "bg-violet-50 dark:bg-violet-950/40",
    border: "border-violet-300 dark:border-violet-800",
    text: "text-violet-900 dark:text-violet-200",
  },
  homework: {
    dot: "bg-red-500",
    bg: "bg-red-50 dark:bg-red-950/40",
    border: "border-red-300 dark:border-red-800",
    text: "text-red-900 dark:text-red-200",
  },
  reminder: {
    dot: "bg-amber-500",
    bg: "bg-amber-50 dark:bg-amber-950/40",
    border: "border-amber-300 dark:border-amber-800",
    text: "text-amber-900 dark:text-amber-200",
  },
};
