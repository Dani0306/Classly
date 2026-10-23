"use client";

import { useFilters } from "@/hooks/shared/useFilters";
import { CONTENT_FILTERS } from "@/lib/contenttypes";
import { typeColor } from "@/lib/contentoptions";
import { ContentType } from "@/types";
import { cn } from "@/lib/utils";

const DOTS: Record<string, ContentType[]> = {
  note: ["note"],
  task: ["task"],
  pending: ["task"],
  study: ["summarize", "quiz", "diagram"],
};

const pill =
  "press flex cursor-pointer items-center gap-2 rounded-[3px] border px-3.5 py-1.5 text-xs font-semibold";

/** All · Notes · Tasks · Pending · Study aids, kept in the `?type=` search param. */
const TypeFilters = () => {
  const { handleFilter, hasFilter, clearFilter } = useFilters();

  const allSelected = !CONTENT_FILTERS.some((item) =>
    hasFilter({ type: "type", value: item.value }),
  );

  return (
    <div className="flex flex-wrap items-center gap-2.5">
      <button
        type="button"
        onClick={() => clearFilter({ type: "type" })}
        aria-pressed={allSelected}
        className={cn(
          pill,
          allSelected
            ? "border-note-yellow bg-note-yellow text-ink"
            : "border-border bg-surface text-foreground hover:bg-surface-muted",
        )}
      >
        All
      </button>

      {CONTENT_FILTERS.map(({ value, label }) => {
        const selected = hasFilter({ type: "type", value });
        return (
          <button
            key={value}
            type="button"
            onClick={() =>
              selected
                ? clearFilter({ type: "type" })
                : handleFilter({ type: "type", value })
            }
            aria-pressed={selected}
            className={cn(
              pill,
              selected
                ? "border-note-yellow bg-note-yellow text-ink"
                : "border-border bg-surface text-foreground hover:bg-surface-muted",
            )}
          >
            <span aria-hidden className="flex -space-x-1">
              {DOTS[value].map((type) => (
                <span
                  key={type}
                  style={{ backgroundColor: typeColor(type) }}
                  className="size-2 rounded-full ring-1 ring-ink/30"
                />
              ))}
            </span>
            {label}
          </button>
        );
      })}
    </div>
  );
};

export default TypeFilters;
