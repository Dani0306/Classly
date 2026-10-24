"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  addDays,
  addMonths,
  addWeeks,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
  subDays,
  subMonths,
  subWeeks,
} from "date-fns";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { EventData } from "@/types";
import { useFilters } from "@/hooks/shared/useFilters";
import { useNow } from "@/hooks/shared/useNow";
import PageContainer from "../shared/PageContainer";
import { CalendarView } from "./types";
import { WeekView } from "./week-view";
import { MonthView } from "./month-view";
import { TASK_COLOR, buildEvents } from "./utils";

const VIEWS: { value: CalendarView; label: string }[] = [
  { value: "day", label: "Day" },
  { value: "week", label: "Week" },
  { value: "month", label: "Month" },
];

const FILTERS = [
  { value: "class", label: "Classes" },
  { value: "task", label: "Tasks" },
] as const;

const control =
  "press cursor-pointer rounded-[3px] border text-xs font-semibold outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";
const on = "border-note-yellow bg-note-yellow text-ink";
const off = "border-border bg-surface text-foreground hover:bg-surface-muted";

export function FullCalendar({ events }: { events: EventData[] }) {
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [view, setView] = useState<CalendarView>("week");
  const { handleFilter, hasFilter, clearFilter } = useFilters();

  const days = useMemo(() => {
    if (view === "day") return [currentDate];
    const start = startOfWeek(currentDate, { weekStartsOn: 1 });
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  }, [currentDate, view]);

  // Every day the current view can show, so weekly classes can be repeated
  // across it. The month grid starts before the 1st and ends after the last.
  const visibleDays = useMemo(() => {
    if (view !== "month") return days;

    return eachDayOfInterval({
      start: startOfWeek(startOfMonth(currentDate), { weekStartsOn: 1 }),
      end: endOfWeek(endOfMonth(currentDate), { weekStartsOn: 1 }),
    });
  }, [view, currentDate, days]);

  // Dates are built here, in the browser, so they land on the day and time
  // the user picked rather than the server's timezone.
  const calendarEvents = useMemo(
    () => buildEvents(events, visibleDays),
    [events, visibleDays],
  );

  const rangeLabel = useMemo(() => {
    if (view === "day") return format(currentDate, "EEEE, MMMM d");
    if (view === "month") return format(currentDate, "MMMM yyyy");
    const start = startOfWeek(currentDate, { weekStartsOn: 1 });
    const end = endOfWeek(currentDate, { weekStartsOn: 1 });
    return isSameMonth(start, end)
      ? `${format(start, "MMMM d")} – ${format(end, "d, yyyy")}`
      : `${format(start, "MMM d")} – ${format(end, "MMM d, yyyy")}`;
  }, [currentDate, view]);

  // Null on the server, so "Back to today" never causes a hydration mismatch.
  const now = useNow();
  const showingNow =
    !now ||
    (view === "month"
      ? isSameMonth(currentDate, now)
      : days.some((day) => isToday(day)));

  const step = (direction: 1 | -1) =>
    setCurrentDate((d) =>
      view === "day"
        ? (direction > 0 ? addDays : subDays)(d, 1)
        : view === "week"
          ? (direction > 0 ? addWeeks : subWeeks)(d, 1)
          : (direction > 0 ? addMonths : subMonths)(d, 1),
    );

  const allSelected = !FILTERS.some(({ value }) =>
    hasFilter({ type: "type", value }),
  );

  return (
    <PageContainer
      title="Calendar"
      description="Your class timetable and every task's due date in one place."
    >
      <div className="flex flex-col gap-6">
        {/* Where you are in time, and how you're looking at it */}
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => step(-1)}
                aria-label={`Previous ${view}`}
                className={cn(control, off, "grid size-9 place-items-center")}
              >
                <ChevronLeft className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => step(1)}
                aria-label={`Next ${view}`}
                className={cn(control, off, "grid size-9 place-items-center")}
              >
                <ChevronRight className="size-4" />
              </button>
            </div>

            <h2
              aria-live="polite"
              className="tabular truncate text-xl font-bold tracking-tight md:text-2xl"
            >
              {rangeLabel}
            </h2>

            {!showingNow && (
              <button
                type="button"
                onClick={() => setCurrentDate(new Date())}
                className={cn(control, off, "shrink-0 px-3 py-2")}
              >
                Back to today
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div
              role="group"
              aria-label="Show"
              className="flex items-center gap-1.5"
            >
              <button
                type="button"
                aria-pressed={allSelected}
                onClick={() => clearFilter({ type: "type" })}
                className={cn(control, allSelected ? on : off, "px-3 py-2")}
              >
                All
              </button>
              {FILTERS.map(({ value, label }) => {
                const selected = hasFilter({ type: "type", value });
                return (
                  <button
                    key={value}
                    type="button"
                    aria-pressed={selected}
                    onClick={() =>
                      selected
                        ? clearFilter({ type: "type" })
                        : handleFilter({ type: "type", value })
                    }
                    className={cn(
                      control,
                      selected ? on : off,
                      "flex items-center gap-2 px-3 py-2",
                    )}
                  >
                    <span
                      aria-hidden
                      className={cn(
                        "size-2.5 rounded-[2px] ring-1 ring-ink/30",
                        value === "class" &&
                          "bg-[linear-gradient(135deg,#49c6ff_0_50%,#a8f05a_50%_100%)]",
                      )}
                      style={
                        value === "task"
                          ? { backgroundColor: TASK_COLOR }
                          : undefined
                      }
                    />
                    {label}
                  </button>
                );
              })}
            </div>

            <span aria-hidden className="hidden h-6 w-px bg-border sm:block" />

            {/* Switched often, so no animation between views. */}
            <div
              role="group"
              aria-label="View"
              className="flex rounded-[3px] border border-border bg-surface p-0.5"
            >
              {VIEWS.map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  aria-pressed={view === value}
                  onClick={() => setView(value)}
                  className={cn(
                    "cursor-pointer rounded-[2px] px-3.5 py-1.5 text-xs font-semibold outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    view === value
                      ? "bg-note-yellow text-ink"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {events.length === 0 && (
          <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
            {allSelected
              ? "Nothing on the calendar yet. Add class times to a class, or give a task a due date."
              : "Nothing of this kind on the calendar. Choose All to see everything."}
            {allSelected && (
              <Link
                href="/app/classes"
                className="inline-flex items-center gap-1 font-semibold text-foreground underline decoration-border underline-offset-4 hover:decoration-foreground"
              >
                Go to classes
                <ArrowRight className="size-3.5" />
              </Link>
            )}
          </p>
        )}

        {/* The planner sheet */}
        <section
          aria-label={`${view} view, ${rangeLabel}`}
          className="note overflow-hidden"
        >
          {view === "month" ? (
            <MonthView currentDate={currentDate} events={calendarEvents} />
          ) : (
            <WeekView days={days} events={calendarEvents} />
          )}
        </section>
      </div>
    </PageContainer>
  );
}
