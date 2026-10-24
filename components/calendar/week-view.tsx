"use client";

import { useEffect, useRef } from "react";
import { format, isToday } from "date-fns";
import { cn } from "@/lib/utils";
import { Event } from "@/types";
import { useNow } from "@/hooks/shared/useNow";
import {
  DAY_END_HOUR,
  DAY_START_HOUR,
  PX_PER_HOUR,
  allDayEventsForDay,
  eventsForDay,
  getNowLineOffset,
  initialScrollTop,
  layoutLanes,
} from "./utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { EventBlock, TaskChip, popover } from "./event-block";

/** Tasks shown per day in the header before the rest fold into "N more". */
const DUE_LIMIT = 3;

const hours = Array.from(
  { length: DAY_END_HOUR - DAY_START_HOUR },
  (_, i) => DAY_START_HOUR + i,
);

const GRID_HEIGHT = hours.length * PX_PER_HOUR;
const TODAY_TINT = "rgba(255, 233, 74, 0.13)";
const TILTS = [-0.8, 0.6, -0.4, 0.9];

// One hairline per hour, drawn by the column's background instead of a div
// per hour per day.
const hourLines = {
  backgroundImage: `repeating-linear-gradient(to bottom, transparent 0 ${PX_PER_HOUR - 1}px, rgba(23, 24, 28, 0.09) ${PX_PER_HOUR - 1}px ${PX_PER_HOUR}px)`,
};

const hourLabel = (hour: number) =>
  format(new Date(2000, 0, 1, hour), "h a");

/**
 * The day and week grids: a sticky header with each day and its due tasks,
 * then the hours with class sessions placed on them. Week view keeps a
 * minimum width and scrolls sideways on phones, with the hours pinned.
 */
export function WeekView({ days, events }: { days: Date[]; events: Event[] }) {
  const now = useNow();
  const scrollRef = useRef<HTMLDivElement>(null);
  const columns = `3.75rem repeat(${days.length}, minmax(0, 1fr))`;
  const showsToday = days.some((day) => isToday(day));
  const firstDay = days[0].getTime();

  // Open on the part of the day that matters instead of 5 AM.
  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTop = initialScrollTop(new Date(), showsToday);
  }, [firstDay, days.length, showsToday]);

  const nowOffset = now && showsToday ? getNowLineOffset(now) : null;

  return (
    <div
      ref={scrollRef}
      className="relative max-h-[calc(100dvh-15.5rem)] min-h-[420px] overflow-auto overscroll-contain"
    >
      <div className={cn(days.length > 1 && "min-w-[760px]")}>
        {/* Days and what's due on them, pinned while the hours scroll. */}
        <div
          className="sticky top-0 z-30 grid border-b border-ink/15 bg-note-paper"
          style={{ gridTemplateColumns: columns }}
        >
          <div className="sticky left-0 z-10 flex items-end justify-end bg-note-paper px-2 pb-2.5 text-[11px] font-semibold text-ink/55">
            Due
          </div>

          {days.map((day) => {
            const today = isToday(day);
            const due = allDayEventsForDay(events, day);

            return (
              <div
                key={day.getTime()}
                className="flex min-w-0 flex-col gap-2 border-l border-ink/10 px-2 pb-2.5 pt-3"
                style={today ? { backgroundColor: TODAY_TINT } : undefined}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "tabular grid h-8 min-w-8 place-items-center rounded-[3px] px-1 text-[15px] font-bold tracking-tight",
                      today &&
                        "bg-note-yellow shadow-[0_1px_0_rgba(0,0,0,0.14),0_8px_12px_-8px_rgba(0,0,0,0.5)] [transform:rotate(-2deg)]",
                    )}
                  >
                    {format(day, "d")}
                  </span>
                  <span
                    className={cn(
                      "text-xs font-semibold",
                      today ? "text-ink" : "text-ink/60",
                    )}
                  >
                    {format(day, days.length > 1 ? "EEE" : "EEEE")}
                    {today && <span className="sr-only"> (today)</span>}
                  </span>
                </div>

                <div className="flex min-h-6 flex-col gap-1.5">
                  {due.slice(0, DUE_LIMIT).map((event, i) => (
                    <TaskChip
                      key={event.id}
                      event={event}
                      tilt={TILTS[i % TILTS.length]}
                    />
                  ))}

                  {due.length > DUE_LIMIT && (
                    <Popover>
                      <PopoverTrigger asChild>
                        <button
                          type="button"
                          className="w-fit cursor-pointer px-1 text-[11px] font-semibold text-ink/65 underline decoration-ink/25 underline-offset-4 hover:text-ink hover:decoration-ink"
                        >
                          {due.length - DUE_LIMIT} more due
                        </button>
                      </PopoverTrigger>
                      <PopoverContent side="bottom" align="start" className={popover}>
                        <div className="flex flex-col gap-2 p-4">
                          <p className="text-sm font-bold tracking-tight">
                            Due {format(day, "EEEE, MMMM d")}
                          </p>
                          {due.map((event) => (
                            <TaskChip key={event.id} event={event} side="right" />
                          ))}
                        </div>
                      </PopoverContent>
                    </Popover>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Hours */}
        <div className="grid" style={{ gridTemplateColumns: columns }}>
          <div
            className="sticky left-0 z-20 bg-note-paper"
            style={{ height: GRID_HEIGHT }}
          >
            {hours.map((hour, i) =>
              i === 0 ? null : (
                <span
                  key={hour}
                  className="tabular absolute right-2 -translate-y-1/2 text-[11px] text-ink/55"
                  style={{ top: i * PX_PER_HOUR }}
                >
                  {hourLabel(hour)}
                </span>
              ),
            )}

            {nowOffset !== null && now && (
              <span
                className="tabular absolute right-1 z-10 -translate-y-1/2 rounded-[3px] bg-ink px-1.5 py-0.5 text-[10px] font-bold text-note-yellow"
                style={{ top: nowOffset }}
              >
                {format(now, "h:mm")}
              </span>
            )}
          </div>

          {days.map((day) => {
            const today = isToday(day);

            return (
              <div
                key={day.getTime()}
                className="relative border-l border-ink/10"
                style={{
                  height: GRID_HEIGHT,
                  ...hourLines,
                  ...(today && { backgroundColor: TODAY_TINT }),
                }}
              >
                {layoutLanes(eventsForDay(events, day)).map(
                  ({ event, lane, lanes }) => (
                    <EventBlock
                      key={event.id}
                      event={event}
                      lane={lane}
                      lanes={lanes}
                      past={!!now && event.end < now}
                    />
                  ),
                )}

                {today && nowOffset !== null && (
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-x-0 z-20 flex items-center"
                    style={{ top: nowOffset - 1 }}
                  >
                    <span className="-ml-1 size-2.5 rounded-full bg-ink ring-2 ring-note-paper" />
                    <span className="h-0.5 flex-1 bg-ink" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
