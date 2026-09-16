"use client";

import { useSyncExternalStore } from "react";
import { format, isToday } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Event } from "@/types";
import {
  DAY_END_HOUR,
  DAY_START_HOUR,
  PX_PER_HOUR,
  allDayEventsForDay,
  eventsForDay,
  getNowLineOffset,
  KIND_COLORS,
} from "./utils";

import { EventBlock } from "./event-block";
import { EventDetails } from "./event-details";

const hours = Array.from(
  { length: DAY_END_HOUR - DAY_START_HOUR },
  (_, i) => DAY_START_HOUR + i,
);

const MINUTE = 60_000;

function subscribeToMinute(onChange: () => void) {
  const id = setInterval(onChange, MINUTE);
  return () => clearInterval(id);
}

// Snapshots must be stable between calls, so round to the minute.
const getMinute = () => Math.floor(Date.now() / MINUTE) * MINUTE;
// Null on the server avoids a hydration mismatch for the "current time" line.
const getServerMinute = () => null;

export function WeekView({ days, events }: { days: Date[]; events: Event[] }) {
  const nowMs = useSyncExternalStore(
    subscribeToMinute,
    getMinute,
    getServerMinute,
  );
  const now = nowMs === null ? null : new Date(nowMs);

  const hasAllDay = days.some((d) => allDayEventsForDay(events, d).length > 0);

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Day headers */}
      <div className="flex border-b">
        <div className="w-16 shrink-0 border-r" />
        {days.map((day) => (
          <div
            key={day.toISOString()}
            className={cn(
              "flex flex-1 flex-col items-center gap-0.5 border-r py-2 last:border-r-0",
              isToday(day) && "bg-accent/40",
            )}
          >
            <span className="text-xs font-medium text-muted-foreground">
              {format(day, "EEE")}
            </span>
            <span
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded-full text-sm font-semibold",
                isToday(day) && "bg-primary text-primary-foreground",
              )}
            >
              {format(day, "d")}
            </span>
          </div>
        ))}
      </div>

      {/* All-day row */}
      {hasAllDay && (
        <div className="flex border-b">
          <div className="w-16 shrink-0 border-r px-2 py-1.5 text-right text-[11px] text-muted-foreground">
            All day
          </div>
          {days.map((day) => {
            const items = allDayEventsForDay(events, day);
            return (
              <div
                key={day.toISOString()}
                className="flex flex-1 flex-col gap-1 border-r p-1 last:border-r-0"
              >
                {items.map((event) => {
                  const colors = KIND_COLORS[event.kind];
                  return (
                    <Popover key={event.id}>
                      <PopoverTrigger asChild>
                        <button
                          className={cn(
                            "truncate rounded border px-1.5 py-0.5 text-left text-[11px] font-medium",
                            colors.bg,
                            colors.border,
                            colors.text,
                          )}
                        >
                          {event.title}
                        </button>
                      </PopoverTrigger>
                      <PopoverContent
                        side="bottom"
                        align="start"
                        className="p-3"
                      >
                        <EventDetails event={event} />
                      </PopoverContent>
                    </Popover>
                  );
                })}
              </div>
            );
          })}
        </div>
      )}

      {/* Timed grid */}
      <div className="flex flex-1 overflow-y-auto">
        <div className="w-16 shrink-0 border-r">
          {hours.map((hour) => (
            <div
              key={hour}
              style={{ height: PX_PER_HOUR }}
              className="relative"
            >
              <span className="absolute -top-2.5 right-2 text-[11px] text-muted-foreground">
                {format(new Date().setHours(hour, 0, 0, 0), "h a")}
              </span>
            </div>
          ))}
        </div>

        {days.map((day) => {
          const dayEvents = eventsForDay(events, day);
          const nowOffset = now && isToday(day) ? getNowLineOffset(now) : null;

          return (
            <div
              key={day.toISOString()}
              className="relative flex-1 border-r last:border-r-0"
              style={{ height: hours.length * PX_PER_HOUR }}
            >
              {hours.map((hour) => (
                <div
                  key={hour}
                  style={{ height: PX_PER_HOUR }}
                  className="border-b border-dashed border-border/60"
                />
              ))}

              {dayEvents.map((event) => (
                <EventBlock key={event.id} event={event} />
              ))}

              {nowOffset !== null && (
                <div
                  className="pointer-events-none absolute left-0 right-0 z-20 flex items-center"
                  style={{ top: nowOffset }}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                  <span className="h-px flex-1 bg-red-500" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
