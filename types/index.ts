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

export type NewClass = Omit<Class, "id" | "created_at" | "updated_at">;

export type UpdateClass = Partial<
  Omit<Class, "id" | "user_id" | "created_at" | "updated_at">
>;

//* NOTE TYPE

export type NoteType = "literal" | "explanation" | "reminder" | "homework";
export type NotePriority = "low" | "medium" | "high";

export type Note = {
  id: string;
  user_id: string;
  class_id: string;
  type: NoteType;
  title: string;
  content: string;
  ai_output?: string;
  due_date?: string;
  priority?: NotePriority;
  is_completed?: boolean;
  image_urls?: string[];
  created_at: string;
  updated_at: string;
};

export type NewNote = Omit<Note, "id" | "created_at" | "updated_at">;
export type UpdateNote = Partial<
  Omit<Note, "id" | "user_id" | "class_id" | "created_at" | "updated_at">
>;
