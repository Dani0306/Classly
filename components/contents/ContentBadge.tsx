import {
  StickyNote,
  BookOpenText,
  Bell,
  ClipboardCheck,
  HelpCircle,
  Workflow,
  GraduationCap,
  LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ContentType } from "@/types";
import { CONTENT_TYPE_COLORS } from "@/lib/contentcolors";

const TYPE_ICONS: Record<ContentType, LucideIcon> = {
  note: StickyNote,
  summarize: BookOpenText,
  reminder: Bell,
  homework: ClipboardCheck,
  quiz: HelpCircle,
  diagram: Workflow,
  class: GraduationCap,
};

const TYPE_LABELS: Record<ContentType, string> = {
  note: "Note",
  summarize: "Summary",
  reminder: "Reminder",
  homework: "Homework",
  quiz: "Quiz",
  diagram: "Diagram",
  class: "Class",
};

const ContentBadge = ({ type }: { type: ContentType }) => {
  const Icon = TYPE_ICONS[type];
  const colors = CONTENT_TYPE_COLORS[type];

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border px-3.5 py-1",
        colors.bg,
        colors.border,
      )}
    >
      <Icon className={cn("size-3.5 shrink-0", colors.icon)} />
      <span
        className={cn(
          "text-[12px] font-semibold whitespace-nowrap",
          colors.text,
        )}
      >
        {TYPE_LABELS[type]}
      </span>
    </div>
  );
};

export default ContentBadge;
