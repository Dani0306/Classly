import { ContentType } from "@/types";

export const CONTENT_DESCRIPTIONS: Record<ContentType, string> = {
  note: "Write your topic and let AI turn it into clean, structured study material.",
  summarize:
    "Paste long material and AI will condense it into the key points worth remembering.",
  reminder:
    "Set an alert with a date, time, and priority so you never miss what matters.",
  homework:
    "Track an assignment with its due date and priority so you always hand it in on time.",
  quiz: "Write or paste your content and AI will generate multiple choice questions to test your knowledge.",
  diagram:
    "Describe your topic and AI will generate a visual diagram to help you study and understand it better.",
  file: "Upload an image or PDF and keep it attached to your class for later.",
  class:
    "Create a class to organize your notes, homework and reminders in one place.",
};
