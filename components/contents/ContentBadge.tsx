import {
  StickyNote,
  BookOpenText,
  ListChecks,
  HelpCircle,
  Workflow,
  GraduationCap,
  LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ContentType } from "@/types";
import { CONTENT_LABELS } from "@/lib/contenttypes";
import { typeColor } from "@/lib/contentoptions";

const TYPE_ICONS: Record<ContentType, LucideIcon> = {
  note: StickyNote,
  task: ListChecks,
  summarize: BookOpenText,
  quiz: HelpCircle,
  diagram: Workflow,
  class: GraduationCap,
};

/** Ink chip with the type's paper color as a dot. Text stays ink on paper. */
const ContentBadge = ({
  type,
  className,
}: {
  type: ContentType;
  className?: string;
}) => {
  const Icon = TYPE_ICONS[type];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-[3px] bg-ink/[0.07] px-2 py-1 text-xs font-semibold text-ink/80",
        className,
      )}
    >
      <span
        aria-hidden
        style={{ backgroundColor: typeColor(type) }}
        className="size-2 rounded-full ring-1 ring-ink/25"
      />
      <Icon className="size-3.5 shrink-0" strokeWidth={2.25} />
      <span className="whitespace-nowrap">{CONTENT_LABELS[type]}</span>
    </span>
  );
};

export default ContentBadge;
