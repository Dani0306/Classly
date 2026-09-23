import Link from "next/link";
import { Sparkles } from "lucide-react";
import { AI_KIND_LABELS, AiKind } from "@/lib/ai/kinds";
import type { AiAllowance } from "@/actions/ai/getMyAiUsage";
import { cn } from "@/lib/utils";

/**
 * "3 of 5 summaries left this month", or an upgrade prompt when the plan has
 * run out. Nothing is shown while the allowance is unknown or unlimited.
 */
const AllowanceNote = ({
  kind,
  allowance,
  onNavigate,
}: {
  kind: AiKind;
  allowance?: AiAllowance;
  /** Closes the modal when the user leaves for Settings. */
  onNavigate?: () => void;
}) => {
  if (!allowance || allowance.limit === null) return null;

  const left = Math.max(allowance.limit - allowance.used, 0);
  const label = AI_KIND_LABELS[kind];
  const isOut = left === 0;

  return (
    <p
      className={cn(
        "flex flex-wrap items-center gap-1.5 text-[11px] font-light",
        isOut ? "text-red-600" : "text-foreground/60",
      )}
    >
      <Sparkles className="size-3 shrink-0" />
      {allowance.limit === 0
        ? `${label[0].toUpperCase()}${label.slice(1)} are a Pro feature.`
        : isOut
          ? `You've used all ${allowance.limit} ${label} this month.`
          : `${left} of ${allowance.limit} ${label} left this month.`}
      {isOut && (
        <Link
          href="/app/settings"
          onClick={onNavigate}
          className="font-medium underline underline-offset-2"
        >
          Upgrade to Pro
        </Link>
      )}
    </p>
  );
};

export default AllowanceNote;
