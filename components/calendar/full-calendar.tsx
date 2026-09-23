"use client";

import { useMemo, useState } from "react";
import {
  addDays,
  addMonths,
  addWeeks,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  startOfMonth,
  startOfWeek,
  subDays,
  subMonths,
  subWeeks,
} from "date-fns";
import { ChevronLeft, ChevronRight, ListFilter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarView } from "./types";
import { WeekView } from "./week-view";
import { MonthView } from "./month-view";
import { EventData } from "@/types";
import { buildEvents } from "./utils";
import { useFilters } from "@/hooks/shared/useFilters";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function FullCalendar({ events }: { events: EventData[] }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<CalendarView>("week");

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
    if (view === "day") return format(currentDate, "MMMM d, yyyy");
    if (view === "month") return format(currentDate, "MMMM yyyy");
    const start = startOfWeek(currentDate, { weekStartsOn: 1 });
    const end = endOfWeek(currentDate, { weekStartsOn: 1 });
    const sameMonth = start.getMonth() === end.getMonth();
    return sameMonth
      ? `${format(start, "MMMM d")} – ${format(end, "d, yyyy")}`
      : `${format(start, "MMM d")} – ${format(end, "MMM d, yyyy")}`;
  }, [currentDate, view]);

  function goToday() {
    setCurrentDate(new Date());
  }

  function goPrev() {
    setCurrentDate((d) =>
      view === "day"
        ? subDays(d, 0)
        : view === "week"
          ? subWeeks(d, 1)
          : subMonths(d, 1),
    );
  }

  function goNext() {
    setCurrentDate((d) =>
      view === "day"
        ? addDays(d, 1)
        : view === "week"
          ? addWeeks(d, 1)
          : addMonths(d, 1),
    );
  }

  const { handleFilter } = useFilters();

  return (
    <div className="flex lg:px-10 h-screen w-full flex-col overflow-hidden bg-background">
      {/* Header */}
      <header className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-b lg:px-4 pt-10 lg:pt-2.5 pb-8">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={goToday}>
            Today
          </Button>
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={goPrev}
              aria-label="Previous"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={goNext}
              aria-label="Next"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <h1 className="ml-1 text-base font-semibold">{rangeLabel}</h1>
        </div>

        <div>
          <Select
            onValueChange={(value) => handleFilter({ type: "type", value })}
          >
            <SelectTrigger className="w-full max-w-48">
              <div className="flex space-x-3 p-2 items-center">
                <SelectValue placeholder="Filter by event" />
                <ListFilter />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Filter By Events</SelectLabel>
                <SelectItem value="reminder">Reminders</SelectItem>
                <SelectItem value="homework">Homeworks</SelectItem>
                <SelectItem value="class">Classes</SelectItem>
                <SelectItem value="all">All</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Tabs value={view} onValueChange={(v) => setView(v as CalendarView)}>
            <TabsList>
              <TabsTrigger value="day">Day</TabsTrigger>
              <TabsTrigger value="week">Week</TabsTrigger>
              <TabsTrigger value="month">Month</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </header>

      {/* Body */}
      <div className="flex min-h-0 flex-1">
        <main className="min-w-0 flex-1 overflow-hidden">
          {view === "month" ? (
            <MonthView currentDate={currentDate} events={calendarEvents} />
          ) : (
            <WeekView days={days} events={calendarEvents} />
          )}
        </main>
      </div>
    </div>
  );
}
