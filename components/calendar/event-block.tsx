import { Check } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Event } from "@/types";
import { TASK_COLOR, classColor, getEventLayout, shortClock } from "./utils";
import { EventDetails } from "./event-details";

export const popover = "cal-popover w-76 gap-0 p-0 ring-0";

/** A class session in the day grid, placed in its lane when classes overlap. */
export function EventBlock({
  event,
  lane = 0,
  lanes = 1,
  past = false,
}: {
  event: Event;
  lane?: number;
  lanes?: number;
  past?: boolean;
}) {
  const { top, height } = getEventLayout(event);
  const roomy = height >= 44;
  const width = 100 / lanes;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label={`${event.title}, ${shortClock(event.start)} to ${shortClock(event.end)}`}
          style={
            {
              top: top + 1,
              height: height - 2,
              left: `calc(${lane * width}% + 3px)`,
              width: `calc(${width}% - 6px)`,
              "--class": classColor(event),
            } as React.CSSProperties
          }
          className={cn(
            "cal-block absolute z-10 flex cursor-pointer flex-col overflow-hidden rounded-[3px] px-2 text-left text-ink outline-none focus-visible:z-20 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
            roomy ? "gap-0.5 py-1.5" : "justify-center py-0.5",
            past && "is-past",
          )}
        >
          <span
            className={cn(
              "truncate font-bold leading-tight tracking-tight",
              roomy ? "text-xs" : "text-[11px]",
              past && "text-ink/70",
            )}
          >
            {event.title}
          </span>
          {roomy && (
            <span className="tabular truncate text-[11px] leading-tight text-ink/65">
              {shortClock(event.start)} – {shortClock(event.end)}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent side="right" align="start" className={popover}>
        <EventDetails event={event} />
      </PopoverContent>
    </Popover>
  );
}

/** A task on its due day: a small pink sticky note. Done ones go plain. */
export function TaskChip({
  event,
  tilt = 0,
  side = "bottom",
}: {
  event: Event;
  tilt?: number;
  side?: "bottom" | "right";
}) {
  const done = !!event.completed;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label={`${event.title}${done ? ", done" : ""}`}
          style={
            {
              "--tilt": `${tilt}deg`,
              backgroundColor: done ? "var(--note-paper)" : TASK_COLOR,
            } as React.CSSProperties
          }
          className={cn(
            "cal-task flex w-full min-w-0 cursor-pointer items-center gap-1.5 rounded-[3px] px-2 py-1 text-left text-[11px] font-semibold leading-tight text-ink outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
            done && "text-ink/55",
          )}
        >
          {done ? (
            <Check className="size-3 shrink-0 text-[#1f8a4c]" strokeWidth={3} />
          ) : (
            <span
              aria-hidden
              className="size-1.5 shrink-0 rounded-full bg-ink/70"
            />
          )}
          <span className={cn("truncate", done && "line-through decoration-1")}>
            {event.title}
          </span>
        </button>
      </PopoverTrigger>
      <PopoverContent side={side} align="start" className={popover}>
        <EventDetails event={event} />
      </PopoverContent>
    </Popover>
  );
}

/** A class in a month cell: its color, start time and name on one line. */
export function ClassLine({ event }: { event: Event }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="flex w-full min-w-0 cursor-pointer items-center gap-1.5 rounded-[3px] px-1 py-0.5 text-left text-[11px] leading-tight text-ink outline-none hover:bg-ink/[0.06] focus-visible:ring-2 focus-visible:ring-ring"
        >
          <span
            aria-hidden
            className="size-2 shrink-0 rounded-[2px]"
            style={{ backgroundColor: classColor(event) }}
          />
          <span className="tabular shrink-0 text-ink/60">
            {shortClock(event.start)}
          </span>
          <span className="truncate font-semibold">{event.title}</span>
        </button>
      </PopoverTrigger>
      <PopoverContent side="right" align="start" className={popover}>
        <EventDetails event={event} />
      </PopoverContent>
    </Popover>
  );
}
