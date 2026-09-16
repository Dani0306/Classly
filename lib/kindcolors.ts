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
    dot: "bg-amber-500",
    bg: "bg-amber-50 dark:bg-amber-950/40",
    border: "border-amber-300 dark:border-amber-800",
    text: "text-amber-900 dark:text-amber-200",
  },
  reminder: {
    dot: "bg-sky-500",
    bg: "bg-sky-50 dark:bg-sky-950/40",
    border: "border-sky-300 dark:border-sky-800",
    text: "text-sky-900 dark:text-sky-200",
  },
};
