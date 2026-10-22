import { ContentType } from "@/types";
import {
  FileText,
  BookOpenText,
  ListChecks,
  HelpCircle,
  GitFork,
  LucideIcon,
} from "lucide-react";

type ContentTypeOption = {
  type: Exclude<ContentType, "class">;
  label: string;
  /** Tape and dot color, from the sticky-note palette. */
  color: string;
  description: string;
  icon: LucideIcon;
};

export const contentTypes: ContentTypeOption[] = [
  {
    type: "note",
    label: "Note",
    color: "#49c6ff",
    description: "Write down what you learned. AI can tidy it up.",
    icon: FileText,
  },
  {
    type: "task",
    label: "Task",
    color: "#ff6fb5",
    description: "Homework, reminders, anything with a due date.",
    icon: ListChecks,
  },
  {
    type: "summarize",
    label: "Summary",
    color: "#ffe94a",
    description: "The key points of a note, at the length you pick.",
    icon: BookOpenText,
  },
  {
    type: "quiz",
    label: "Quiz",
    color: "#a8f05a",
    description: "Multiple-choice questions made from a note.",
    icon: HelpCircle,
  },
  {
    type: "diagram",
    label: "Diagram",
    color: "#b79cff",
    description: "A visual diagram made from a note.",
    icon: GitFork,
  },
];

export const contentOption = (type: ContentType) =>
  contentTypes.find((item) => item.type === type);

export const typeColor = (type: ContentType) =>
  contentOption(type)?.color ?? "#ffffff";
