"use client";

import { FormEvent, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react";
import { createContentByType } from "@/actions/contents/createContentByType";
import { useToast } from "@/providers/ToastProvider";
import { TodayData } from "@/types";
import { cn } from "@/lib/utils";

const chip =
  "press cursor-pointer rounded-[3px] border px-2.5 py-1.5 text-xs font-semibold";
const chipOn = "border-ink bg-ink text-note-paper";
const chipOff = "border-ink/15 text-ink hover:bg-ink/5";

/** Write the homework down the moment it's assigned: title, class, day. */
const QuickAddTask = ({
  classes,
  today,
  tomorrow,
}: {
  classes: TodayData["classes"];
  today: string;
  tomorrow: string;
}) => {
  const { toast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();

  const [title, setTitle] = useState("");
  const [classId, setClassId] = useState(classes[0]?.id ?? "");
  const [dueDate, setDueDate] = useState(today);

  if (classes.length === 0) {
    return (
      <section className="note flex flex-col items-start gap-4 p-6">
        <p className="text-[15px] leading-relaxed">
          Tasks live inside a class. Create your first class, then write your
          homework and reminders down here.
        </p>
        <Link
          href="/app/classes"
          className="press inline-flex items-center gap-2 rounded-[3px] bg-note-lime px-4 py-2.5 text-xs font-semibold text-ink shadow-[0_1px_0_rgba(0,0,0,0.14),0_10px_18px_-10px_rgba(0,0,0,0.5)] hover:bg-[#b8f774]"
        >
          Create a class
          <ArrowRight className="size-4" />
        </Link>
      </section>
    );
  }

  const canSubmit = title.trim() !== "" && classId !== "" && dueDate !== "";

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!canSubmit || isPending) return;

    startTransition(async () => {
      try {
        await createContentByType({
          type: "task",
          classId,
          title: title.trim(),
          text: "",
          dueDate,
          priority: "medium",
          files: [],
        });
        setTitle("");
        inputRef.current?.focus();
        toast({ type: "success", title: "Task added" });
      } catch (err) {
        toast({
          type: "error",
          title: "Couldn't add the task",
          description:
            err instanceof Error ? err.message : "Please try again.",
        });
      }
    });
  };

  const otherDay = dueDate !== today && dueDate !== tomorrow;

  return (
    <form onSubmit={handleSubmit} className="note flex flex-col gap-3 p-4 md:p-5">
      <div className="flex items-center gap-3">
        <Plus aria-hidden className="size-5 shrink-0 text-ink/50" />
        <label htmlFor="quick-task" className="sr-only">
          New task
        </label>
        <input
          id="quick-task"
          ref={inputRef}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add a task, like “Read chapter 4”"
          autoComplete="off"
          className="min-w-0 flex-1 bg-transparent py-1 text-[15px] font-medium text-ink outline-none placeholder:text-ink/45"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2 border-t border-ink/15 pt-3">
        <select
          aria-label="Class"
          value={classId}
          onChange={(e) => setClassId(e.target.value)}
          className="max-w-44 cursor-pointer truncate rounded-[3px] border border-ink/15 bg-transparent px-2.5 py-1.5 text-xs font-semibold text-ink outline-none hover:bg-ink/5"
        >
          {classes.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>

        <div role="group" aria-label="Due" className="flex flex-wrap gap-2">
          <button
            type="button"
            aria-pressed={dueDate === today}
            onClick={() => setDueDate(today)}
            className={cn(chip, dueDate === today ? chipOn : chipOff)}
          >
            Today
          </button>
          <button
            type="button"
            aria-pressed={dueDate === tomorrow}
            onClick={() => setDueDate(tomorrow)}
            className={cn(chip, dueDate === tomorrow ? chipOn : chipOff)}
          >
            Tomorrow
          </button>
          <input
            type="date"
            aria-label="Another day"
            value={otherDay ? dueDate : ""}
            min={today}
            onChange={(e) => setDueDate(e.target.value || today)}
            className={cn(chip, "py-1", otherDay ? chipOn : chipOff)}
          />
        </div>

        <button
          type="submit"
          disabled={!canSubmit || isPending}
          className="press ml-auto cursor-pointer rounded-[3px] bg-note-lime px-4 py-2 text-xs font-semibold text-ink shadow-[0_1px_0_rgba(0,0,0,0.14),0_10px_18px_-10px_rgba(0,0,0,0.5)] hover:bg-[#b8f774] disabled:cursor-not-allowed disabled:bg-ink/[0.06] disabled:text-ink/45 disabled:shadow-none"
        >
          {isPending ? "Adding ..." : "Add task"}
        </button>
      </div>
    </form>
  );
};

export default QuickAddTask;
