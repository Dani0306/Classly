import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { TodayData } from "@/types";
import { cn } from "@/lib/utils";
import { minutesOf, shortTime } from "@/lib/dates";

/** Today's timetable, from each class's weekly schedule. */
const ClassesToday = ({
  classes,
  now,
}: {
  classes: TodayData["classes"];
  now: Date;
}) => {
  const minute = now.getHours() * 60 + now.getMinutes();

  const slots = classes
    .flatMap((item) =>
      (item.schedule ?? [])
        .filter((slot) => slot.day === now.getDay())
        .map((slot) => ({ ...slot, id: item.id, name: item.name, color: item.color })),
    )
    .sort((a, b) => minutesOf(a.start_time) - minutesOf(b.start_time));

  return (
    <section className="note is-blue tape p-5 pt-7 md:p-7 md:pt-8 [transform:rotate(0.4deg)]">
      <h2 className="text-lg font-bold tracking-tight">Classes today</h2>

      {slots.length === 0 ? (
        <div className="mt-3 flex flex-col items-start gap-2">
          <p className="text-[15px]">No classes on the timetable today.</p>
          <Link
            href="/app/classes"
            className="inline-flex items-center gap-1 text-xs font-semibold underline underline-offset-4"
          >
            Set class times
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
      ) : (
        <ol className="mt-3">
          {slots.map((slot) => {
            const start = minutesOf(slot.start_time);
            const end = minutesOf(slot.end_time);
            const passed = end <= minute;
            const current = start <= minute && minute < end;

            return (
              <li
                key={`${slot.id}-${slot.start_time}`}
                className={cn(
                  "flex items-center gap-4 border-t border-ink/15 py-3 first:border-t-0",
                  passed && "text-ink/65",
                )}
              >
                <span className="tabular w-[6.5rem] shrink-0 text-sm font-semibold">
                  {shortTime(slot.start_time)}–{shortTime(slot.end_time)}
                </span>
                <Link
                  href={`/app/class/${slot.id}`}
                  className="min-w-0 flex-1 truncate text-[15px] font-semibold decoration-ink/30 underline-offset-4 hover:underline"
                >
                  {slot.name}
                </Link>
                {current && (
                  <span className="rounded-[3px] bg-ink px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-note-yellow">
                    Now
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
};

export default ClassesToday;
