import { ContentType } from "@/types";

export const CONTENT_DESCRIPTIONS: Record<ContentType, string> = {
  note: "Write what you learned. AI can tidy the spelling and grammar, and later turn it into a summary, quiz or diagram.",
  task: "Homework, a reminder, anything with a due date. It shows up on Today and on your Calendar.",
  summarize:
    "Paste long material and AI will condense it into the key points worth remembering.",
  quiz: "Write or paste your content and AI will generate multiple choice questions to test your knowledge.",
  diagram:
    "Describe your topic and AI will generate a visual diagram to help you study and understand it better.",
  class: "Create a class to organize your notes and tasks in one place.",
};
