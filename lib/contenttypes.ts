import { ContentType } from "@/types";

/** What the New button can create. Everything else is made from a note. */
export const NEW_CONTENT_TYPES = ["note", "task"] as const;
export type NewContentType = (typeof NEW_CONTENT_TYPES)[number];

/** AI study aids made from a note's text. */
export const STUDY_AID_TYPES = ["summarize", "quiz", "diagram"] as const;
export type StudyAidType = (typeof STUDY_AID_TYPES)[number];

/** Rows saved before homework and reminders were merged into tasks. */
const LEGACY_TASK_TYPES = ["homework", "reminder"];

/** Every `contents.type` value that is a task, legacy names included. */
export const TASK_DB_TYPES = ["task", ...LEGACY_TASK_TYPES];

/** Reads legacy homework and reminder rows as tasks. */
export const normalizeContent = <T extends { type: string }>(row: T): T =>
  LEGACY_TASK_TYPES.includes(row.type) ? { ...row, type: "task" } : row;

export const CONTENT_LABELS: Record<ContentType, string> = {
  note: "Note",
  task: "Task",
  summarize: "Summary",
  quiz: "Quiz",
  diagram: "Diagram",
  class: "Class",
};

/** The `?type=` filter on class pages and All Materials. */
export const CONTENT_FILTERS = [
  { value: "note", label: "Notes", types: ["note"] },
  { value: "task", label: "Tasks", types: TASK_DB_TYPES },
  { value: "pending", label: "Pending", types: TASK_DB_TYPES },
  { value: "study", label: "Study aids", types: [...STUDY_AID_TYPES] },
] as const;

/** "pending" is tasks not marked as done, soonest due first. */
export const isPendingFilter = (value?: string) => value === "pending";

/** PostgREST `.or()` for tasks not marked as done; old rows may hold null. */
export const PENDING_CONDITION = "is_completed.is.false,is_completed.is.null";

/** The `contents.type` values a filter matches, or undefined for no filter. */
export const typesForFilter = (value?: string) =>
  CONTENT_FILTERS.find((item) => item.value === value)?.types as
    | string[]
    | undefined;
