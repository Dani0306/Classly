import { Flag } from "lucide-react";
import { cn } from "@/lib/utils";
import { ContentPriority } from "@/types";

const PRIORITY_ICON_COLORS: Record<ContentPriority, string> = {
  low: "text-emerald-500",
  medium: "text-amber-500",
  high: "text-red-500",
};

const PRIORITY_LABELS: Record<ContentPriority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
};

const PriorityBadge = ({ priority }: { priority: ContentPriority }) => {
  return (
    <div className="inline-flex items-center gap-1.5 rounded-md px-3.5 py-1">
      <Flag
        className={cn("size-3.5 shrink-0", PRIORITY_ICON_COLORS[priority])}
      />
      <span className="text-[12px] font-semibold text-black/70 whitespace-nowrap">
        {PRIORITY_LABELS[priority]} priority
      </span>
    </div>
  );
};

export default PriorityBadge;
