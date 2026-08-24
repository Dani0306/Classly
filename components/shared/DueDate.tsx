"use client";

import { Calendar } from "lucide-react";
import { formatDate } from "@/utils/fn";
import { cn } from "@/lib/utils";

const DueDate = ({ date }: { date: string }) => {
  const dueDate = new Date(date);
  const now = new Date();
  const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

  const isOverdue = dueDate < now;
  const isSoon = !isOverdue && dueDate < threeDaysFromNow;

  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-medium text-muted-foreground/70 tracking-wide">
        Due date
      </span>
      <div
        className={cn(
          "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border",
          isOverdue
            ? "bg-red-50 border-red-200 text-red-600"
            : isSoon
              ? "bg-amber-50 border-amber-200 text-amber-600"
              : "bg-gray-100 border-gray-200 text-muted-foreground",
        )}
      >
        <Calendar className="size-3.5 shrink-0" />
        <span className="text-xs font-medium">{formatDate(date)}</span>
      </div>
    </div>
  );
};

export default DueDate;
