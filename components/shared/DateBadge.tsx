import { Calendar } from "lucide-react";
import { differenceInCalendarDays } from "date-fns";
import { cn } from "@/lib/utils";

const ICON_COLORS: Record<string, string> = {
  red: "text-red-500",
  orange: "text-amber-500",
  green: "text-emerald-500",
  neutral: "text-black/40",
};

function getDueColor(date: Date): "red" | "orange" | "green" {
  const daysUntilDue = differenceInCalendarDays(date, new Date());

  if (daysUntilDue < 0) return "red"; // already passed
  if (daysUntilDue <= 2) return "orange"; // due today, tomorrow, or the day after
  return "green"; // more than 2 days out
}

const DateBadge = ({
  timestamp,
  color,
}: {
  timestamp: string;
  color?: string;
}) => {
  const date = new Date(timestamp);
  const formatted = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const resolvedColor = color ?? getDueColor(date);
  const iconColor = ICON_COLORS[resolvedColor] ?? ICON_COLORS.neutral;

  return (
    <div className="inline-flex items-center gap-1.5 rounded-md px-3.5 py-1">
      <Calendar className={cn("size-3.5 shrink-0", iconColor)} />
      <span className="text-[12px] font-semibold text-black/70 whitespace-nowrap">
        {formatted}
      </span>
    </div>
  );
};

export default DateBadge;
