import { NotePriority } from "@/types";
import React from "react";

const priorityConfig: Record<
  NotePriority,
  { label: string; color: string; bg: string }
> = {
  low: {
    label: "Low",
    color: "#16a34a",
    bg: "#16a34a20",
  },
  medium: {
    label: "Medium",
    color: "#f59e0b",
    bg: "#f59e0b20",
  },
  high: {
    label: "High",
    color: "#ef4444",
    bg: "#ef444420",
  },
};

const PriorityBadge = ({
  priority,
  filled = false,
}: {
  priority: NotePriority;
  filled?: boolean;
}) => {
  const { label, color, bg } = priorityConfig[priority];

  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
      style={{
        backgroundColor: filled ? color : bg,
        color: filled ? "#fff" : color,
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{
          backgroundColor: filled ? "#fff" : color,
        }}
      />
      {label}
    </span>
  );
};

export default PriorityBadge;
