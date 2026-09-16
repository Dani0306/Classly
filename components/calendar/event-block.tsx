import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { KIND_COLORS, getEventLayout } from "./utils";
import { EventDetails } from "./event-details";
import { Event } from "@/types";

export function EventBlock({ event }: { event: Event }) {
  const { top, height } = getEventLayout(event);
  const colors = KIND_COLORS[event.kind];
  const compact = height < 44;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          style={{ top, height }}
          className={cn(
            "absolute mx-6 left-1 right-1 z-10 overflow-hidden rounded-md border px-3 py-1 text-left shadow-sm transition-colors",
            "hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            colors.bg,
            colors.border,
            colors.text,
          )}
        >
          <p
            className={cn(
              "truncate font-medium",
              compact ? "text-[11px] leading-tight" : "text-xs",
            )}
          >
            {event.title}
          </p>
        </button>
      </PopoverTrigger>
      <PopoverContent side="right" align="start">
        <EventDetails event={event} />
      </PopoverContent>
    </Popover>
  );
}
