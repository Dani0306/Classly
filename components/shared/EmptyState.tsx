import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/** Faint dummy cards behind the message, hinting at what will fill the page. */
const GhostCards = () => (
  <div
    aria-hidden
    className="pointer-events-none absolute inset-x-0 bottom-0 hidden items-end justify-center gap-4 opacity-40 sm:flex"
  >
    {[0, 1, 2].map((index) => (
      <div
        key={index}
        className={cn(
          "w-40 rounded-2xl border border-border bg-surface p-3 shadow-sm",
          index === 1 ? "h-28" : "h-20 translate-y-3",
        )}
      >
        <div className="mb-2 h-2.5 w-10 rounded-full bg-foreground/15" />
        <div className="mb-1.5 h-2 w-full rounded-full bg-foreground/10" />
        <div className="h-2 w-2/3 rounded-full bg-foreground/10" />
      </div>
    ))}
  </div>
);

/**
 * Shown in place of an empty list, so a new user lands on something that
 * explains the page instead of blank space. `action` is the way out of the
 * empty state (create the first item, clear the filters).
 */
const EmptyState = ({
  icon: Icon,
  title,
  description,
  action,
  compact,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
  /** Less vertical space and no ghost cards, for smaller areas. */
  compact?: boolean;
}) => {
  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-xl border border-dashed border-foreground/30 bg-surface-muted/60",
        compact ? "px-6 py-10" : "px-6 pb-28 pt-14",
      )}
    >
      {/* Decoration: the quad ground, quieter. */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="bg-quad absolute inset-0 opacity-60" />
      </div>

      {!compact && <GhostCards />}

      <div className="relative flex flex-col items-center gap-3 text-center">
        <span className="grid size-14 place-items-center rounded-lg border border-border bg-surface shadow-sm">
          <Icon className="size-6 text-foreground/50" />
        </span>

        <div className="flex max-w-md flex-col gap-1.5">
          <strong className="text-sm font-semibold text-foreground">
            {title}
          </strong>
          <p className="text-xs font-light leading-relaxed text-muted-foreground">
            {description}
          </p>
        </div>

        {action && <div className="mt-1">{action}</div>}
      </div>
    </div>
  );
};

export default EmptyState;
