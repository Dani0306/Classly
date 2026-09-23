import { CreatableContentType } from "@/types";

export type AiKind = "grammar" | "summary" | "quiz" | "diagram";

export const AI_KINDS: AiKind[] = ["grammar", "summary", "quiz", "diagram"];

/** Which allowance a content type spends when it is created. */
export const AI_KIND_BY_CONTENT_TYPE: Record<CreatableContentType, AiKind> = {
  note: "grammar",
  reminder: "grammar",
  homework: "grammar",
  summarize: "summary",
  quiz: "quiz",
  diagram: "diagram",
};

/** Plural, for sentences like "all your summaries for this month". */
export const AI_KIND_LABELS: Record<AiKind, string> = {
  grammar: "AI writing help",
  summary: "summaries",
  quiz: "quizzes",
  diagram: "diagrams",
};
