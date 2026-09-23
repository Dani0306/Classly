import { format } from "date-fns";
import { AI_KINDS, AI_KIND_LABELS } from "@/lib/ai/kinds";
import type { AiUsageSummary } from "@/actions/ai/getMyAiUsage";
import { cn } from "@/lib/utils";

/** This month's AI usage per feature, with the plan's allowance. */
const UsageSummary = ({ usage }: { usage: AiUsageSummary }) => {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border bg-surface-muted p-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <strong className="text-xs font-semibold text-foreground">
          AI usage this month
        </strong>
        <span className="text-[11px] font-light text-foreground/50">
          Resets {format(new Date(usage.resetsOn), "MMM d")}
        </span>
      </div>

      <ul className="flex flex-col gap-2">
        {AI_KINDS.map((kind) => {
          const { used, limit } = usage.allowances[kind];
          const isOut = limit != null && limit > 0 && used >= limit;

          return (
            <li
              key={kind}
              className="flex items-center justify-between gap-3 text-xs font-light"
            >
              <span className="capitalize text-foreground/70">
                {AI_KIND_LABELS[kind]}
              </span>
              <span
                className={cn(
                  "font-medium",
                  limit === 0
                    ? "text-foreground/40"
                    : isOut
                      ? "text-red-600"
                      : "text-foreground/70",
                )}
              >
                {limit === 0
                  ? "Pro only"
                  : limit === null
                    ? `${used} used · unlimited`
                    : `${used} of ${limit} used`}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default UsageSummary;
