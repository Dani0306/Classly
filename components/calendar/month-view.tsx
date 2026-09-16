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
import { KIND_COLORS } from "./utils";
import { EventDetails } from "./event-details";
import { Event } from "@/types";

const CHIP_LIMIT = 3;
const WEEKDAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function MonthView({
  currentDate,
  events,
}: {
  currentDate: Date;
  events: Event[];
}) {
  const monthStart = startOfMonth(currentDate);
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const gridEnd = endOfWeek(endOfMonth(currentDate), { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: gridStart, end: gridEnd });
  const weeks = Array.from({ length: days.length / 7 }, (_, i) =>
    days.slice(i * 7, i * 7 + 7),
  );

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="grid grid-cols-7 border-b">
        {WEEKDAY_LABELS.map((label) => (
          <div
            key={label}
            className="border-r px-2 py-2 text-center text-xs font-medium text-muted-foreground last:border-r-0"
          >
            {label}
          </div>
        ))}
      </div>

      <div className="grid flex-1 grid-rows-6 overflow-y-auto">
        {weeks.map((week, weekIdx) => (
          <div
            key={weekIdx}
            className="grid grid-cols-7 border-b last:border-b-0"
          >
            {week.map((day) => {
              const dayEvents = events
                .filter((e) => isSameDay(e.start, day))
                .sort((a, b) => a.start.getTime() - b.start.getTime());
              const visible = dayEvents.slice(0, CHIP_LIMIT);
              const overflow = dayEvents.length - visible.length;

              return (
                <div
                  key={day.toISOString()}
                  className={cn(
                    "flex min-h-28 flex-col gap-1 border-r p-1.5 last:border-r-0",
                    !isSameMonth(day, currentDate) &&
                      "bg-muted/30 text-muted-foreground",
                  )}
                >
                  <span
                    className={cn(
                      "flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold",
                      isToday(day) && "bg-primary text-primary-foreground",
                    )}
                  >
                    {format(day, "d")}
                  </span>

                  <div className="flex flex-1 flex-col gap-1">
                    {visible.map((event) => {
                      const colors = KIND_COLORS[event.kind];
                      return (
                        <Popover key={event.id}>
                          <PopoverTrigger asChild>
                            <button
                              className={cn(
                                "flex items-center gap-1 truncate rounded px-1 py-0.5 text-left text-[11px]",
                                colors.bg,
                                colors.text,
                              )}
                            >
                              <span
                                className={cn(
                                  "h-1.5 w-1.5 shrink-0 rounded-full",
                                  colors.dot,
                                )}
                              />
                              <span className="truncate">{event.title}</span>
                            </button>
                          </PopoverTrigger>
                          <PopoverContent
                            side="right"
                            align="start"
                            className="p-3"
                          >
                            <EventDetails event={event} />
                          </PopoverContent>
                        </Popover>
                      );
                    })}

                    {overflow > 0 && (
                      <Popover>
                        <PopoverTrigger asChild>
                          <button className="truncate px-1 text-left text-[11px] font-medium text-muted-foreground hover:text-foreground">
                            +{overflow} more
                          </button>
                        </PopoverTrigger>
                        <PopoverContent
                          side="right"
                          align="start"
                          className="w-64 p-3"
                        >
                          <p className="mb-2 text-xs font-medium text-muted-foreground">
                            {format(day, "EEEE, MMMM d")}
                          </p>
                          <div className="space-y-1.5">
                            {dayEvents.map((event) => {
                              const colors = KIND_COLORS[event.kind];
                              return (
                                <div
                                  key={event.id}
                                  className="flex items-center gap-1.5 text-xs"
                                >
                                  <span
                                    className={cn(
                                      "h-1.5 w-1.5 shrink-0 rounded-full",
                                      colors.dot,
                                    )}
                                  />
                                  <span className="font-medium">
                                    {format(event.start, "h:mm a")}
                                  </span>
                                  <span className="truncate text-muted-foreground">
                                    {event.title}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </PopoverContent>
                      </Popover>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
