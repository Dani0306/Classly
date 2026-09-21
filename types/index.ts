import { LucideIcon } from "lucide-react";

export type Plan = "starter" | "pro" | "team";

export type AppUser = {
  created_at: Date;
  name: string;
  email: string;
  image_url: string;
  updated_at: Date;
  plan: Plan;
  id?: string | number;
};

export type UpdateProfile = Pick<AppUser, "name" | "image_url">;

//* SCHEDULE TYPE

export type ScheduleEntry = {
  day: number; // 0 = Sunday ... 6 = Saturday (matches JS Date.getDay())
  start_time: string; // "09:00"
  end_time: string; // "10:15"
};

// * CLASS TYPE

export type Class = {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  created_at: string;
  updated_at: string;
  schedule?: ScheduleEntry[];
};

export type NewClass = Omit<
  Class,
  "id" | "created_at" | "updated_at" | "user_id"
>;

export type UpdateClass = Partial<
  Omit<Class, "id" | "user_id" | "created_at" | "updated_at">
>;

// * CONTENT TYPE

export type ContentType =
  | "note"
  | "summarize"
  | "reminder"
  | "homework"
  | "quiz"
  | "diagram"
  | "class";

export type ContentPriority = "low" | "medium" | "high";

export type Content = {
  id: string;
  user_id: string;
  class_id: string;
  type: ContentType;
  title: string;
  content: string;
  ai_output?: string;
  due_date?: string;
  priority?: ContentPriority;
  files_urls: string[];
  is_completed?: boolean;
  created_at: string;
  updated_at: string;
};

export type NewContent = Omit<
  Content,
  "id" | "created_at" | "updated_at" | "image_urls" | "user_id"
>;

export type CreatableContentType = Exclude<ContentType, "class">;

export type CreateContentInput = {
  type: CreatableContentType;
  classId: string;
  title: string;
  text: string;
  dueDate?: string;
  priority?: ContentPriority;
  size?: string;
  diagramType?: DiagramType;
  constraints?: string;
  files: File[];
};

export type UpdateContent = Partial<
  Omit<Content, "id" | "user_id" | "class_id" | "created_at" | "updated_at">
>;

// * QUIZ TYPE

export type QuizQuestion = {
  question: string;
  answers: string[];
  correct_answer: string;
  selected_answer?: string;
};

// * SHARED

export interface SearchParamProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

// * Diagram type

export type DiagramType =
  | "flowchart"
  | "mindmap"
  | "orgchart"
  | "venn"
  | "timeline"
  | "comparison"
  | "cycle"
  | "pyramid";

export type DropDownMenuOptions = Array<{
  label: string;
  fn: () => void;
  icon?: LucideIcon;
}>;

//* EVENT TYPES

export type EventKind = "class" | "homework" | "reminder";

export interface Event {
  id: string;
  title: string;
  start: Date;
  end: Date;
  kind: EventKind;
  description?: string;
  allDay?: boolean;
}

// * section type

export type ViewType = "content" | "attachments";
