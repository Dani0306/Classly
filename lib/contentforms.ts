import { CreatableContentType } from "@/types";

export type ContentFormField =
  | "dueDate"
  | "priority"
  | "size"
  | "diagramType"
  | "constraints";

type ContentFormConfig = {
  fields: ContentFormField[];
  required: ContentFormField[];
  textLabel: string;
  loadingMessage: string;
};

export const CONTENT_FORMS: Record<CreatableContentType, ContentFormConfig> = {
  note: {
    fields: [],
    required: [],
    textLabel: "Content",
    loadingMessage: "Correcting your note ...",
  },
  summarize: {
    fields: ["size"],
    required: [],
    textLabel: "Content to summarize",
    loadingMessage: "Summarizing your content ...",
  },
  reminder: {
    fields: ["dueDate", "priority"],
    required: ["dueDate", "priority"],
    textLabel: "Description",
    loadingMessage: "Creating reminder ...",
  },
  homework: {
    fields: ["dueDate", "priority"],
    required: ["dueDate", "priority"],
    textLabel: "Description",
    loadingMessage: "Creating homework ...",
  },
  quiz: {
    fields: [],
    required: [],
    textLabel: "Content to quiz yourself on",
    loadingMessage: "Generating quiz ...",
  },
  diagram: {
    fields: ["diagramType", "constraints"],
    required: ["diagramType"],
    textLabel: "Topic",
    loadingMessage: "Drawing diagram ...",
  },
};

export const PRIORITIES = ["low", "medium", "high"];

export const SUMMARY_SIZES = [
  "Short (50-100 words)",
  "Medium (150-250 words)",
  "Detailed (300-500 words)",
];
