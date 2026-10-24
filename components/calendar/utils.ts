import {
  differenceInMinutes,
  format,
  isSameDay,
  parseISO,
  setHours,
  setMinutes,
  startOfDay,
} from "date-fns";
import { Event, EventData } from "@/types";
import { typeColor } from "@/lib/contentoptions";

// Visible time window for the day/week grid. Adjust to fit your class schedule.
export const DAY_START_HOUR = 5;
export const DAY_END_HOUR = 23;
export const PX_PER_HOUR = 64;

/** Classes without a color of their own still need a paper to sit on. */
const FALLBACK_CLASS_COLOR = "#49c6ff";

/** A class's color, or the fallback. */
export const classColor = (event: Pick<Event, "color">) =>
  event.color || FALLBACK_CLASS_COLOR;

/** Pink paper for tasks, the same as their tape everywhere else. */
export const TASK_COLOR = typeColor("task");

const atTime = (day: Date, time: string) => {
  const [hour, minute] = time.split(":").map(Number);
  return setMinutes(setHours(startOfDay(day), hour), minute || 0);
};

/**
 * Turns the server's plain event data into Dates, in the browser's timezone.
 * Classes repeat weekly, so one is emitted for every matching day on screen.
 */
export function buildEvents(data: EventData[], days: Date[]): Event[] {
  return data.flatMap((item): Event[] => {
    const shared = {
      title: item.title,
      kind: item.kind,
      description: item.description,
      classId: item.classId,
      className: item.className,
      color: item.color,
      completed: item.completed,
    };

    if (item.kind === "class") {
      if (item.day == null || !item.startTime || !item.endTime) return [];

      return days
        .filter((day) => day.getDay() === item.day)
        .map((day) => ({
          ...shared,
          id: `${item.id}-${format(day, "yyyy-MM-dd")}`,
          start: atTime(day, item.startTime!),
          end: atTime(day, item.endTime!),
          allDay: false,
        }));
    }

    if (!item.dueDate) return [];

    // parseISO reads a plain "YYYY-MM-DD" as local midnight, so the day shown
    // is the day that was picked, wherever the user is.
    const due = parseISO(item.dueDate);

    return [{ ...shared, id: item.id, start: due, end: due, allDay: true }];
  });
}

export function eventsForDay(events: Event[], day: Date) {
  return events
    .filter((e) => !e.allDay && isSameDay(e.start, day))
    .sort((a, b) => a.start.getTime() - b.start.getTime());
}

/** Open tasks first, then the ones already done. */
export function allDayEventsForDay(events: Event[], day: Date) {
  return events
    .filter((e) => e.allDay && isSameDay(e.start, day))
    .sort((a, b) => Number(!!a.completed) - Number(!!b.completed));
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

/**
 * Side-by-side lanes for classes that overlap, so two at the same time sit
 * next to each other instead of one hiding the other. `events` must be
 * sorted by start.
 */
export function layoutLanes(events: Event[]) {
  const placed: { event: Event; lane: number; lanes: number }[] = [];
  let cluster: typeof placed = [];
  let clusterEnd = 0;
  let laneEnds: number[] = [];

  const closeCluster = () => {
    const lanes = laneEnds.length;
    for (const item of cluster) item.lanes = lanes;
    cluster = [];
    laneEnds = [];
  };

  for (const event of events) {
    const start = event.start.getTime();
    if (cluster.length > 0 && start >= clusterEnd) closeCluster();

    let lane = laneEnds.findIndex((end) => end <= start);
    if (lane === -1) lane = laneEnds.length;
    laneEnds[lane] = event.end.getTime();

    const item = { event, lane, lanes: 1 };
    cluster.push(item);
    placed.push(item);
    clusterEnd = Math.max(clusterEnd, event.end.getTime());
  }
  closeCluster();

  return placed;
}

/** Pixel offset for the "current time" line inside the day grid. Null when out of the visible window. */
export function getNowLineOffset(now: Date) {
  const minutes = now.getHours() * 60 + now.getMinutes() - DAY_START_HOUR * 60;
  if (minutes < 0 || minutes > (DAY_END_HOUR - DAY_START_HOUR) * 60)
    return null;
  return (minutes / 60) * PX_PER_HOUR;
}

/** Where the day grid should open: an hour before now, or 7 AM. */
export function initialScrollTop(now: Date, showsToday: boolean) {
  const hour = showsToday ? Math.max(now.getHours() - 1, 7) : 7;
  return Math.max(hour - DAY_START_HOUR, 0) * PX_PER_HOUR;
}

export const KIND_LABEL: Record<Event["kind"], string> = {
  class: "Class",
  task: "Task",
};

/** "9:00" or "9:30 AM"-style times, short enough for a narrow block. */
export const shortClock = (date: Date) =>
  format(date, date.getMinutes() === 0 ? "h a" : "h:mm a");
