"use client";

import { useState } from "react";
import Link from "next/link";
import { format, isSameDay } from "date-fns";
import { ArrowRight, CircleCheck, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Event } from "@/types";
import { KIND_LABEL, TASK_COLOR, classColor } from "./utils";

/** What a calendar item is, when, and where to go to work on it. */
export function EventDetails({ event }: { event: Event }) {
  const [expanded, setExpanded] = useState(false);

  const isTask = event.kind === "task";
  const sameDay = isSameDay(event.start, event.end);
  const long = (event.description?.length ?? 0) > 140;

  return (
    <div className="flex flex-col gap-3 p-4">
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="inline-flex items-center gap-1.5 rounded-[3px] bg-ink/[0.07] px-2 py-1 font-semibold">
          <span
            aria-hidden
            className="size-2 rounded-[2px]"
            style={{
              backgroundColor: isTask ? TASK_COLOR : classColor(event),
            }}
          />
          {KIND_LABEL[event.kind]}
        </span>

        {isTask && event.completed && (
          <span className="inline-flex items-center gap-1 rounded-[3px] bg-[#1f8a4c] px-2 py-1 font-semibold text-white">
            <CircleCheck className="size-3.5" strokeWidth={2.25} />
            Done
          </span>
        )}

        {isTask && event.className && (
          <span className="inline-flex min-w-0 items-center gap-1.5 font-semibold text-ink/75">
            <span
              aria-hidden
              className="size-2 shrink-0 rounded-full ring-1 ring-ink/25"
              style={{ backgroundColor: classColor(event) }}
            />
            <span className="truncate">{event.className}</span>
          </span>
        )}
      </div>

      <h3
        className={cn(
          "text-base font-bold leading-snug tracking-tight text-balance",
          event.completed && "text-ink/55 line-through decoration-1",
        )}
      >
        {event.title}
      </h3>

      <p className="flex items-start gap-2 text-[13px] text-ink/75">
        <Clock className="mt-0.5 size-3.5 shrink-0" />
        <span className="tabular">
          {event.allDay
            ? `Due ${format(event.start, "EEEE, MMMM d")}`
            : sameDay
              ? `${format(event.start, "EEEE, MMMM d · h:mm a")} – ${format(event.end, "h:mm a")}`
              : `${format(event.start, "MMM d, h:mm a")} – ${format(event.end, "MMM d, h:mm a")}`}
        </span>
      </p>

      {event.description?.trim() && (
        <div className="border-t border-ink/15 pt-3">
          <p
            className={cn(
              "whitespace-pre-line text-[13px] leading-relaxed text-ink/75",
              !expanded && "line-clamp-3",
            )}
          >
            {event.description}
          </p>
          {long && (
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="mt-1.5 cursor-pointer text-xs font-semibold text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-ink"
            >
              {expanded ? "Show less" : "Show more"}
            </button>
          )}
        </div>
      )}

      {event.classId && (
        <Link
          href={`/app/class/${event.classId}${isTask ? "?type=task" : ""}`}
          className="press mt-1 inline-flex w-fit items-center gap-1.5 rounded-[3px] border border-ink/15 px-3 py-2 text-xs font-semibold hover:bg-white"
        >
          {isTask ? "See tasks in this class" : "Open class"}
          <ArrowRight className="size-3.5" />
        </Link>
      )}
    </div>
  );
}
