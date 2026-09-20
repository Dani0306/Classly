import {
  StickyNote,
  BookOpenText,
  Bell,
  ClipboardCheck,
  HelpCircle,
  Workflow,
  GraduationCap,
  LucideIcon,
  Folder,
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
  file: Folder,
  class: GraduationCap,
};

const TYPE_LABELS: Record<ContentType, string> = {
  note: "Note",
  summarize: "Summary",
  reminder: "Reminder",
  homework: "Homework",
  quiz: "Quiz",
  diagram: "Diagram",
  file: "File",
  class: "Class",
};

const ContentBadge = ({
  type,
  onClick,
}: {
  type: ContentType;
  onClick?: () => void;
}) => {
  const Icon = TYPE_ICONS[type];
  const colors = CONTENT_TYPE_COLORS[type];

  return (
    <div
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border-2 px-3.5 py-1",
        colors.bg,
        colors.border,
        onClick && "cursor-pointer",
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
