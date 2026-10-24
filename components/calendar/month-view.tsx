"use client";

import {
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Event } from "@/types";
import { ClassLine, TaskChip, popover } from "./event-block";

const ITEM_LIMIT = 3;
const WEEKDAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const TODAY_TINT = "rgba(255, 233, 74, 0.13)";

/** Tasks due first (they're what the month is for), then classes by time. */
const itemsFor = (events: Event[], day: Date) => {
  const onDay = events.filter((e) => isSameDay(e.start, day));
  return [
    ...onDay
      .filter((e) => e.allDay)
      .sort((a, b) => Number(!!a.completed) - Number(!!b.completed)),
    ...onDay
      .filter((e) => !e.allDay)
      .sort((a, b) => a.start.getTime() - b.start.getTime()),
  ];
};

const Item = ({ event, index }: { event: Event; index: number }) =>
  event.allDay ? (
    <TaskChip event={event} tilt={index % 2 ? 0.5 : -0.5} side="right" />
  ) : (
    <ClassLine event={event} />
  );

/** A month on one sheet. Scrolls sideways on phones rather than squashing. */
export function MonthView({
  currentDate,
  events,
}: {
  currentDate: Date;
  events: Event[];
}) {
  const days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(currentDate), { weekStartsOn: 1 }),
    end: endOfWeek(endOfMonth(currentDate), { weekStartsOn: 1 }),
  });

  return (
    <div className="max-h-[calc(100dvh-15.5rem)] min-h-[420px] overflow-auto overscroll-contain">
      <div className="min-w-[760px]">
        <div className="sticky top-0 z-10 grid grid-cols-7 border-b border-ink/15 bg-note-paper">
          {WEEKDAY_LABELS.map((label) => (
            <div
              key={label}
              className="border-l border-ink/10 px-2.5 py-2.5 text-xs font-semibold text-ink/60 first:border-l-0"
            >
              {label}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7">
          {days.map((day) => {
            const inMonth = isSameMonth(day, currentDate);
            const today = isToday(day);
            const items = itemsFor(events, day);
            const visible = items.slice(0, ITEM_LIMIT);
            const overflow = items.length - visible.length;

            return (
              <div
                key={day.getTime()}
                className={cn(
                  "flex min-h-32 min-w-0 flex-col gap-1.5 border-b border-l border-ink/10 p-2 [&:nth-child(7n+1)]:border-l-0",
                  !inMonth && "bg-ink/[0.035]",
                )}
                style={today ? { backgroundColor: TODAY_TINT } : undefined}
              >
                <span
                  className={cn(
                    "tabular grid h-7 w-fit min-w-7 place-items-center rounded-[3px] px-1 text-sm font-bold",
                    today &&
                      "bg-note-yellow shadow-[0_1px_0_rgba(0,0,0,0.14),0_8px_12px_-8px_rgba(0,0,0,0.5)] [transform:rotate(-2deg)]",
                    !inMonth && !today && "font-semibold text-ink/40",
                  )}
                >
                  {format(day, "d")}
                  {today && <span className="sr-only"> (today)</span>}
                </span>

                <div className={cn("flex flex-col gap-1", !inMonth && "opacity-60")}>
                  {visible.map((event, i) => (
                    <Item key={event.id} event={event} index={i} />
                  ))}

                  {overflow > 0 && (
                    <Popover>
                      <PopoverTrigger asChild>
                        <button
                          type="button"
                          className="w-fit cursor-pointer rounded-[3px] px-1 py-0.5 text-[11px] font-semibold text-ink/65 underline decoration-ink/25 underline-offset-4 hover:text-ink hover:decoration-ink"
                        >
                          {overflow} more
                        </button>
                      </PopoverTrigger>
                      <PopoverContent
                        side="right"
                        align="start"
                        className={popover}
                      >
                        <div className="flex flex-col gap-2 p-4">
                          <p className="text-sm font-bold tracking-tight">
                            {format(day, "EEEE, MMMM d")}
                          </p>
                          <div className="flex flex-col gap-1.5">
                            {items.map((event, i) => (
                              <Item key={event.id} event={event} index={i} />
                            ))}
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
