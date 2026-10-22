import { NewContentType } from "@/lib/contenttypes";

export type ContentFormField = "dueDate" | "priority" | "description";

type ContentFormConfig = {
  fields: ContentFormField[];
  required: ContentFormField[];
  textLabel: string;
  loadingMessage: string;
};

/** The New content form. Only notes and tasks are created from it. */
export const CONTENT_FORMS: Record<NewContentType, ContentFormConfig> = {
  note: {
    fields: ["description"],
    required: ["description"],
    textLabel: "Content",
    loadingMessage: "Saving your note ...",
  },
  task: {
    fields: ["dueDate", "priority", "description"],
    required: ["dueDate", "priority"],
    textLabel: "Details (optional)",
    loadingMessage: "Saving task ...",
  },
};

export const PRIORITIES = ["low", "medium", "high"];

export const SUMMARY_SIZES = [
  "Short (50-100 words)",
  "Medium (150-250 words)",
  "Detailed (300-500 words)",
];
