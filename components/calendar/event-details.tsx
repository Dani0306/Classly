"use client";

import { useState } from "react";
import { format, isSameDay } from "date-fns";
import { Check, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import ContentBadge from "@/components/contents/ContentBadge";
import { cn } from "@/lib/utils";
import { KIND_COLORS } from "./utils";
import { Event, ContentType } from "@/types";

export function EventDetails({
  event,
  onToggleComplete,
}: {
  event: Event;
  onToggleComplete?: (event: Event) => void;
}) {
  const [expanded, setExpanded] = useState(false);

  const colors = KIND_COLORS[event.kind];
  const sameDay = isSameDay(event.start, event.end);
  const completed = false;

  return (
    <div className={cn("space-y-3 p-2", completed && "opacity-75")}>
      <div className="flex items-start justify-between gap-2">
        {completed ? (
          <Badge
            variant="outline"
            className="shrink-0 border-border text-muted-foreground"
          >
            Completed
          </Badge>
        ) : (
          <ContentBadge type={event.kind as ContentType} />
        )}

        {onToggleComplete && (
          <button
            type="button"
            aria-label={completed ? "Mark as not complete" : "Mark as complete"}
            onClick={() => onToggleComplete(event)}
            className={cn(
              "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-[1.5px] transition-colors",
              completed
                ? "border-emerald-600 bg-emerald-600 text-white"
                : "border-muted-foreground/40 text-transparent hover:border-muted-foreground",
            )}
          >
            <Check className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      <h3
        className={cn(
          "text-sm font-semibold leading-snug",
          completed ? "text-muted-foreground line-through" : colors.text,
        )}
      >
        {event.title}
      </h3>

      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Clock className="h-3.5 w-3.5 shrink-0" />
        {event.allDay ? (
          <span>{format(event.start, "EEEE, MMMM d")} · All day</span>
        ) : sameDay ? (
          <span>
            {format(event.start, "EEEE, MMMM d · h:mm a")} –{" "}
            {format(event.end, "h:mm a")}
          </span>
        ) : (
          <span>
            {format(event.start, "MMM d, h:mm a")} –{" "}
            {format(event.end, "MMM d, h:mm a")}
          </span>
        )}
      </div>

      {event.description && (
        <div className="border-t pt-2">
          <p
            className="text-xs text-muted-foreground"
            style={
              expanded
                ? undefined
                : {
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }
            }
          >
            {event.description}
          </p>
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="mt-1 text-xs font-medium text-primary hover:underline"
          >
            {expanded ? "Show less" : "Show more"}
          </button>
        </div>
      )}
    </div>
  );
}
