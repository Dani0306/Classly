import { Flag } from "lucide-react";
import { TodayTask } from "@/types";

/** One task on a Today list: tick it off, or open it to read the details. */
const TaskRow = ({
  task,
  done,
  dueLabel,
  onToggle,
  onOpen,
}: {
  task: TodayTask;
  done: boolean;
  /** Shown when the list isn't already grouped by day. */
  dueLabel?: string;
  onToggle: () => void;
  onOpen: () => void;
}) => {
  return (
    <li className="flex items-start gap-2 border-t border-ink/15 py-3 first:border-t-0">
      <button
        type="button"
        role="checkbox"
        aria-checked={done}
        aria-label={`${task.title}: mark as ${done ? "not done" : "done"}`}
        onClick={onToggle}
        className="check -my-1 -ml-1.5 shrink-0 cursor-pointer rounded-[3px] p-1.5"
      >
        <span className="check-box grid size-5 place-items-center rounded-[3px] border-2 border-ink/70 bg-note-paper/60">
          <svg viewBox="0 0 16 16" aria-hidden className="size-3.5">
            <path className="check-path" d="M3.5 8.5l3 3 6-7" />
          </svg>
        </span>
      </button>

      <div className="min-w-0 flex-1">
        <button
          type="button"
          onClick={onOpen}
          className="cursor-pointer text-left text-[15px] font-semibold leading-snug decoration-ink/30 underline-offset-4 hover:underline"
        >
          <span className="strike" data-done={done}>
            {task.title}
          </span>
        </button>

        <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink/65">
          {task.classes && (
            <span className="inline-flex items-center gap-1.5">
              <span
                aria-hidden
                style={{ backgroundColor: task.classes.color ?? undefined }}
                className="size-2 rounded-full bg-ink/30 ring-1 ring-ink/25"
              />
              {task.classes.name}
            </span>
          )}
          {dueLabel && <span>{dueLabel}</span>}
          {task.priority === "high" && !done && (
            <span className="inline-flex items-center gap-1 font-semibold text-red-700">
              <Flag className="size-3" strokeWidth={2.5} />
              High priority
            </span>
          )}
        </p>
      </div>
    </li>
  );
};

export default TaskRow;
