"use client";

import Link from "next/link";
import { addDays, differenceInCalendarDays, format } from "date-fns";
import { ArrowRight } from "lucide-react";
import { TodayData, TodayTask } from "@/types";
import { cn } from "@/lib/utils";
import { dayKey, describeDue, parseDueDate } from "@/lib/dates";
import { useNow } from "@/hooks/shared/useNow";
import { useToggleComplete } from "@/hooks/contents/useToggleComplete";
import { useModal } from "@/providers/AppModalProvider";
import PageContainer from "../shared/PageContainer";
import ModalContainer from "../modal/ModalContainer";
import ShowContent from "../contents/ShowContent";
import QuickAddTask from "./QuickAddTask";
import ClassesToday from "./ClassesToday";
import TaskRow from "./TaskRow";

const dueDay = (task: TodayTask) => task.due_date!.slice(0, 10);

/** A note holding one list of tasks. */
const TaskNote = ({
  title,
  meta,
  className,
  children,
}: {
  title: string;
  meta?: string;
  className?: string;
  children: React.ReactNode;
}) => (
  <section className={cn("note tape p-5 pt-7 md:p-7 md:pt-8", className)}>
    <header className="mb-2 flex items-baseline justify-between gap-3">
      <h2 className="text-lg font-bold tracking-tight">{title}</h2>
      {meta && (
        <span className="tabular text-sm font-semibold text-ink/65">{meta}</span>
      )}
    </header>
    {children}
  </section>
);

/**
 * The student's day at a glance: what's overdue, what's due today, the week
 * ahead and today's classes, with a quick way to write new homework down.
 */
const TodayContent = ({ data }: { data: TodayData }) => {
  const now = useNow();
  const { openModal } = useModal();
  const { isDone, toggle, touched } = useToggleComplete();

  // "Today" is the browser's day, which the server can't know.
  if (!now) return <PageContainer title="Today">{null}</PageContainer>;

  const today = dayKey(now);
  const tomorrow = dayKey(addDays(now, 1));
  const weekEnd = dayKey(addDays(now, 7));

  // A task ticked off here stays put until the next visit, so the list
  // doesn't jump under the cursor when the page refreshes its data.
  const isOpen = (task: TodayTask) => !task.is_completed || touched(task.id);

  const overdue = data.tasks.filter(
    (task) => dueDay(task) < today && isOpen(task),
  );
  const dueToday = data.tasks.filter((task) => dueDay(task) === today);
  const upcoming = data.tasks.filter(
    (task) => dueDay(task) > today && dueDay(task) <= weekEnd && isOpen(task),
  );
  const later = data.tasks.filter(
    (task) => dueDay(task) > weekEnd && !task.is_completed,
  );

  const upcomingByDay = new Map<string, TodayTask[]>();
  for (const task of upcoming) {
    upcomingByDay.set(dueDay(task), [
      ...(upcomingByDay.get(dueDay(task)) ?? []),
      task,
    ]);
  }
  const doneToday = dueToday.filter((task) => isDone(task.id, task.is_completed));

  const open = (task: TodayTask) =>
    openModal(
      <ModalContainer defaultPadding={false}>
        <ShowContent content={task} classLabel={task.classes?.name} />
      </ModalContainer>,
    );

  const row = (task: TodayTask, dueLabel?: string) => (
    <TaskRow
      key={task.id}
      task={task}
      done={isDone(task.id, task.is_completed)}
      dueLabel={dueLabel}
      onToggle={() => toggle(task.id, task.is_completed)}
      onOpen={() => open(task)}
    />
  );

  return (
    <PageContainer title="Today" description={format(now, "EEEE, MMMM d")}>
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
        <div className="flex flex-col gap-9 lg:col-span-7">
          <QuickAddTask
            classes={data.classes}
            today={today}
            tomorrow={tomorrow}
          />

          {overdue.length > 0 && (
            <TaskNote
              title="Overdue"
              className="is-pink [transform:rotate(0.3deg)]"
            >
              <ul>
                {overdue.map((task) =>
                  row(task, describeDue(task.due_date!, now).label),
                )}
              </ul>
            </TaskNote>
          )}

          <TaskNote
            title="Due today"
            meta={
              dueToday.length > 0
                ? `${doneToday.length} of ${dueToday.length} done`
                : undefined
            }
            className="is-yellow [transform:rotate(-0.4deg)]"
          >
            {dueToday.length === 0 ? (
              <p className="py-2 text-[15px] text-ink/75">
                Nothing due today. Add a task above, or get ahead on the week.
              </p>
            ) : (
              <ul>{dueToday.map((task) => row(task))}</ul>
            )}
          </TaskNote>

          <TaskNote title="Next 7 days" className="[transform:rotate(0.2deg)]">
            {upcoming.length === 0 ? (
              <p className="py-2 text-[15px] text-ink/70">
                Nothing due in the next 7 days.
              </p>
            ) : (
              <div className="flex flex-col gap-4">
                {[...upcomingByDay].map(([day, tasks]) => {
                  const date = parseDueDate(day);
                  const label =
                    differenceInCalendarDays(date, now) === 1
                      ? "Tomorrow"
                      : format(date, "EEEE, MMM d");

                  return (
                    <div key={day}>
                      <h3 className="pt-2 text-xs font-semibold text-ink/60">
                        {label}
                      </h3>
                      <ul>{tasks.map((task) => row(task))}</ul>
                    </div>
                  );
                })}
              </div>
            )}
          </TaskNote>
        </div>

        <aside className="flex flex-col gap-6 lg:col-span-5">
          <ClassesToday classes={data.classes} now={now} />

          {later.length > 0 && (
            <Link
              href="/app/calendar"
              className="inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              {later.length} more {later.length === 1 ? "task" : "tasks"} due
              after next week
              <ArrowRight className="size-4" />
            </Link>
          )}
        </aside>
      </div>
    </PageContainer>
  );
};

export default TodayContent;
