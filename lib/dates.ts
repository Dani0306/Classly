import { differenceInCalendarDays, format, parseISO } from "date-fns";

/** "YYYY-MM-DD" for a date in the browser's timezone. */
export const dayKey = (date: Date) => format(date, "yyyy-MM-dd");

/** A due date is a calendar day; this reads it as local midnight. */
export const parseDueDate = (value: string) => parseISO(value.slice(0, 10));

export type DueTone = "overdue" | "soon" | "later" | "done";

/** "Due tomorrow", "2 days overdue", "Due Thursday", "Due Nov 4". */
export const describeDue = (value: string, now: Date) => {
  const due = parseDueDate(value);
  const days = differenceInCalendarDays(due, now);

  if (days < -1) return { label: `${-days} days overdue`, days };
  if (days === -1) return { label: "Due yesterday", days };
  if (days === 0) return { label: "Due today", days };
  if (days === 1) return { label: "Due tomorrow", days };
  if (days < 7) return { label: `Due ${format(due, "EEEE")}`, days };
  return { label: `Due ${format(due, "MMM d")}`, days };
};

/** The minutes since midnight of an "HH:MM" string. */
export const minutesOf = (time: string) => {
  const [hour, minute] = time.split(":").map(Number);
  return hour * 60 + (minute || 0);
};

/** "09:00" → "9:00". Keeps the 24h clock the schedule was entered in. */
export const shortTime = (time: string) => time.replace(/^0(\d)/, "$1");
