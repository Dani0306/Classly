// * FORMAT TO COP

import { QuizQuestion } from "@/types";

export function calculateStarFillPercentages(rating: number) {
  return [1, 2, 3, 4, 5].map((position) => {
    if (position <= Math.floor(rating)) {
      return 100;
    }

    if (position > Math.ceil(rating)) {
      return 0;
    }

    return Math.round((rating % 1) * 100);
  });
}

// * NORMALIZE STRING

export function normalize(s: unknown): string {
  if (s == null) return "";
  return String(s)
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .trim();
}

// * Format string

export function formatText(strings: string) {
  return strings
    .split(" ")
    .map((text) => {
      return text.slice(0, 1).toUpperCase() + text.slice(1, text.length);
    })
    .join(" ");
}

// * Format date

export const formatDate = (timestamp: string): string => {
  const date = new Date(timestamp);

  return date
    .toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
    .toUpperCase();
};

// * CutText

export function cutText(text: string) {
  return text.length > 50 ? text.slice(0, 200) + "..." : text;
}

// * Shuffle questions

export const shuffleAnswers = (questions: QuizQuestion[]): QuizQuestion[] => {
  return questions.map((q) => ({
    ...q,
    answers: [...q.answers].sort(() => Math.random() - 0.5),
  }));
};

// * Check all questions have been answered

export const checkQuestions = (questions: QuizQuestion[]): boolean => {
  let allAnswered = true;

  questions.forEach((question) => {
    if (!question.selected_answer) allAnswered = false;
  });

  return allAnswered;
};

//* cleanMermaidCode

export const cleanMermaidCode = (raw: string): string => {
  return raw
    .replace(/```mermaid/g, "")
    .replace(/```/g, "")
    .trim();
};
