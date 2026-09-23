"use client";

import { CalendarDays, Clock, Plus, Trash2, TriangleAlert } from "lucide-react";
import { ScheduleEntry } from "@/types";
import { cn } from "@/lib/utils";

const DAYS = [
  { label: "Sun", short: "S", value: 0 },
  { label: "Mon", short: "M", value: 1 },
  { label: "Tue", short: "T", value: 2 },
  { label: "Wed", short: "W", value: 3 },
  { label: "Thu", short: "T", value: 4 },
  { label: "Fri", short: "F", value: 5 },
  { label: "Sat", short: "S", value: 6 },
];

const toMinutes = (time: string) => {
  const [hours, minutes] = time.split(":").map(Number);
  return Number.isFinite(hours) ? hours * 60 + (minutes || 0) : null;
};

/** "1h 30m" for a filled-in, sensible range; null otherwise. */
const durationLabel = (entry: ScheduleEntry) => {
  const start = entry.start_time ? toMinutes(entry.start_time) : null;
  const end = entry.end_time ? toMinutes(entry.end_time) : null;

  if (start === null || end === null || end <= start) return null;

  const minutes = end - start;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;

  return [hours && `${hours}h`, rest && `${rest}m`].filter(Boolean).join(" ");
};

const endsBeforeItStarts = (entry: ScheduleEntry) => {
  const start = entry.start_time ? toMinutes(entry.start_time) : null;
  const end = entry.end_time ? toMinutes(entry.end_time) : null;

  return start !== null && end !== null && end <= start;
};

const overlaps = (a: ScheduleEntry, b: ScheduleEntry) => {
  if (a.day !== b.day) return false;

  const aStart = a.start_time ? toMinutes(a.start_time) : null;
  const aEnd = a.end_time ? toMinutes(a.end_time) : null;
  const bStart = b.start_time ? toMinutes(b.start_time) : null;
  const bEnd = b.end_time ? toMinutes(b.end_time) : null;

  if (aStart === null || aEnd === null || bStart === null || bEnd === null)
    return false;

  return aStart < bEnd && bStart < aEnd;
};

/** True when every entry is complete and nothing clashes. */
export const isScheduleValid = (schedule: ScheduleEntry[]) =>
  schedule.every(
    (entry, index) =>
      entry.start_time &&
      entry.end_time &&
      !endsBeforeItStarts(entry) &&
      !schedule.some((other, i) => i !== index && overlaps(entry, other)),
  );

const timeInputClasses = cn(
  "w-full rounded-xl border border-border bg-surface px-3 py-2",
  "text-sm text-foreground outline-none",
  "transition-[background-color,border-color,box-shadow] duration-200",
  "hover:border-muted-foreground/25",
  "focus:border-primary/50 focus:ring-4 focus:ring-primary/10",
);

/**
 * Weekly meeting times for a class: one card per session, with the day as a
 * row of toggles and a start/end pair. These drive the calendar, so an entry
 * with a missing or backwards time is flagged rather than silently saved.
 */
const ScheduleSelector = ({
  schedule,
  setSchedule,
}: {
  schedule: ScheduleEntry[];
  setSchedule: React.Dispatch<React.SetStateAction<ScheduleEntry[]>>;
}) => {
  const addEntry = () =>
    setSchedule((prev) => [
      ...prev,
      { day: 1, start_time: "08:00", end_time: "09:00" },
    ]);

  const updateEntry = (
    index: number,
    field: keyof ScheduleEntry,
    value: string | number,
  ) =>
    setSchedule((prev) =>
      prev.map((entry, i) =>
        i === index ? { ...entry, [field]: value } : entry,
      ),
    );

  const removeEntry = (index: number) =>
    setSchedule((prev) => prev.filter((_, i) => i !== index));

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-col gap-0.5">
          <label className="text-xs font-medium tracking-wide text-foreground/70">
            Class schedule
          </label>
          <span className="text-[11px] font-light text-muted-foreground">
            When this class meets each week. It shows up on your calendar.
          </span>
        </div>

        {schedule.length > 0 && (
          <button
            type="button"
            onClick={addEntry}
            className="flex shrink-0 cursor-pointer items-center gap-1.5 rounded-xl border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-surface-muted"
          >
            <Plus className="size-3.5" />
            Add day
          </button>
        )}
      </div>

      {schedule.length === 0 ? (
        <button
          type="button"
          onClick={addEntry}
          className="flex cursor-pointer flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-border bg-surface-muted/60 px-4 py-7 text-center transition-colors hover:border-primary/40 hover:bg-surface-muted"
        >
          <CalendarDays className="size-6 text-muted-foreground/50" />
          <span className="text-xs font-medium text-foreground">
            Add a meeting day
          </span>
          <span className="text-[11px] font-light text-muted-foreground">
            Optional — you can always add it later.
          </span>
        </button>
      ) : (
        <ul className="flex flex-col gap-2.5">
          {schedule.map((entry, index) => {
            const backwards = endsBeforeItStarts(entry);
            const clashes = schedule.some(
              (other, i) => i !== index && overlaps(entry, other),
            );
            const incomplete = !entry.start_time || !entry.end_time;
            const duration = durationLabel(entry);

            return (
              <li
                key={index}
                className={cn(
                  "flex flex-col gap-3 rounded-2xl border bg-surface-muted p-3.5 transition-colors",
                  backwards || clashes
                    ? "border-red-300 bg-red-50/60"
                    : "border-border",
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div
                    className="flex flex-wrap gap-1"
                    role="group"
                    aria-label="Day of the week"
                  >
                    {DAYS.map((day) => {
                      const selected = entry.day === day.value;

                      return (
                        <button
                          key={day.value}
                          type="button"
                          title={day.label}
                          aria-pressed={selected}
                          onClick={() => updateEntry(index, "day", day.value)}
                          className={cn(
                            "size-8 cursor-pointer rounded-lg text-[11px] font-semibold transition-colors",
                            selected
                              ? "bg-primary/30 text-foreground ring-2 ring-primary"
                              : "bg-surface text-muted-foreground hover:bg-black/5",
                          )}
                        >
                          {day.short}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    type="button"
                    onClick={() => removeEntry(index)}
                    aria-label={`Remove ${DAYS[entry.day]?.label ?? ""} session`}
                    className="grid size-8 shrink-0 cursor-pointer place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>

                <div className="flex flex-wrap items-end gap-2">
                  <div className="flex min-w-30 flex-1 flex-col gap-1">
                    <label className="text-[11px] font-medium text-muted-foreground">
                      Starts
                    </label>
                    <input
                      type="time"
                      value={entry.start_time}
                      onChange={(e) =>
                        updateEntry(index, "start_time", e.target.value)
                      }
                      className={timeInputClasses}
                    />
                  </div>

                  <span className="pb-2.5 text-muted-foreground/50">–</span>

                  <div className="flex min-w-30 flex-1 flex-col gap-1">
                    <label className="text-[11px] font-medium text-muted-foreground">
                      Ends
                    </label>
                    <input
                      type="time"
                      value={entry.end_time}
                      onChange={(e) =>
                        updateEntry(index, "end_time", e.target.value)
                      }
                      className={timeInputClasses}
                    />
                  </div>

                  {duration && (
                    <span className="flex items-center gap-1 pb-2.5 text-[11px] font-medium text-muted-foreground">
                      <Clock className="size-3" />
                      {duration}
                    </span>
                  )}
                </div>

                {(backwards || clashes || incomplete) && (
                  <p className="flex items-center gap-1.5 text-[11px] font-medium text-red-600">
                    <TriangleAlert className="size-3 shrink-0" />
                    {incomplete
                      ? "Add a start and end time."
                      : backwards
                        ? "The end time must be after the start time."
                        : "This overlaps another session on the same day."}
                  </p>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default ScheduleSelector;
