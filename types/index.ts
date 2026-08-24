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
  | "diagram";

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
  image_urls?: string[];
  is_completed?: boolean;
  created_at: string;
  updated_at: string;
};

export type NewContent = Omit<
  Content,
  "id" | "created_at" | "updated_at" | "image_urls" | "priority" | "user_id"
>;

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
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
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
