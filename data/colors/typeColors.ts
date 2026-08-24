import { ContentType } from "@/types";
import {
  FileText,
  BookOpenText,
  Bell,
  ClipboardList,
  HelpCircle,
  GitFork,
  LucideIcon,
} from "lucide-react";

type NoteTypeOption = {
  type: ContentType;
  label: string;
  color: string;
  description: string;
  icon: LucideIcon;
};

export const contentTypes: NoteTypeOption[] = [
  {
    type: "note",
    label: "Note",
    color: "#a78bfa",
    description: "Capture facts, definitions, formulas, or direct information.",
    icon: FileText,
  },
  {
    type: "summarize",
    label: "Summarize",
    color: "#3b82f6",
    description: "Paste any content and AI will generate a concise summary.",
    icon: BookOpenText,
  },
  {
    type: "reminder",
    label: "Reminder",
    color: "#f59e0b",
    description: "Set a reminder for important tasks or things to remember.",
    icon: Bell,
  },
  {
    type: "homework",
    label: "Homework",
    color: "#ef4444",
    description: "Track assignments, deadlines, and important school tasks.",
    icon: ClipboardList,
  },
  {
    type: "quiz",
    label: "Quiz",
    color: "#10b981",
    description: "Create a quiz to test your knowledge and understanding.",
    icon: HelpCircle,
  },
  {
    type: "diagram",
    label: "Diagram",
    color: "#ec4899",
    description: "Generate a visual diagram or chart from your content.",
    icon: GitFork,
  },
];
