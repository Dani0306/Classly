// * FORMAT TO COP

import { addDays, setHours, setMinutes, startOfWeek } from "date-fns";
import { Content, QuizQuestion } from "@/types";

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

//* AT

const monday = startOfWeek(new Date(), { weekStartsOn: 1 });

export function at(dayOffset: number, hour: number, minute = 0) {
  return setMinutes(setHours(addDays(monday, dayOffset), hour), minute);
}

export function getHours(time: string) {
  return Number(time.split(":")[0]);
}

export function getMinutes(time: string) {
  return Number(time.split(":")[1]);
}

// * PATHNAME INCLUDES

export const pathnameIncludes = (pathname: string, keywords: string[]) => {
  let includes = false;
  for (let i = 0; i < keywords.length; i++) {
    if (pathname.includes(keywords[i])) includes = true;
  }

  return includes;
};

// * Sanitize file name

export const sanitizeFileName = (name: string) => {
  const cleaned = name
    .toLowerCase()
    .replace(/[^a-z0-9._-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^[.-]+/, "");

  return cleaned.slice(-80) || "file";
};

// * File helpers

const IMAGE_EXTENSIONS = [".png", ".jpg", ".jpeg", ".webp", ".gif"];

// Storage keys are written as "<timestamp>-<random>-<name>" by uploadFile(),
// so strip that prefix before showing the name to the user.
export const getFileName = (url: string) => {
  try {
    const key = decodeURIComponent(
      new URL(url).pathname.split("/").pop() ?? "",
    );
    return key.replace(/^\d+-[0-9a-f]{8}-/, "") || "file";
  } catch {
    return "file";
  }
};

// next/image serves optimized files from /_next/image?url=<encoded original>,
// so the real file URL has to be unwrapped before reading its path.
const unwrapOptimizerUrl = (url: URL) => {
  const inner = url.searchParams.get("url");

  if (!inner) return url;

  try {
    return new URL(inner, url.origin);
  } catch {
    return url;
  }
};

/**
 * Display title for a file URL, whether it is a raw storage URL or one wrapped
 * by the next/image optimizer.
 *
 *   .../content-files/<uid>/1789698077400-60b01b0f-img_4552.jpeg -> img_4552.jpeg
 *   /_next/image?url=<that, encoded>&w=750&q=75                  -> img_4552.jpeg
 */
export const getTitleByUrl = (url: string) => {
  try {
    const parsed = unwrapOptimizerUrl(new URL(url));
    const key = decodeURIComponent(parsed.pathname.split("/").pop() ?? "");

    return key.replace(/^\d+-[0-9a-f]{8}-/, "") || "file";
  } catch {
    return "file";
  }
};

const hasExtension = (url: string, extensions: string[]) => {
  const name = getFileName(url).toLowerCase();
  return extensions.some((extension) => name.endsWith(extension));
};

export const isImageFile = (url: string) => hasExtension(url, IMAGE_EXTENSIONS);

export const isPdfFile = (url: string) => hasExtension(url, [".pdf"]);

export const isWordFile = (url: string) =>
  hasExtension(url, [".doc", ".docx"]);

// Only .docx (a zip of XML) can be rendered in the browser; legacy .doc can't.
export const isDocxFile = (url: string) => hasExtension(url, [".docx"]);

// NewContent omits image_urls, so a file created through the normal pipeline
// stores its public URL in ai_output, exactly like a diagram does.
export const getFileUrl = (content: Pick<Content, "ai_output">) =>
  content.ai_output ?? "";

//* Craete local URL for a file

export const createLocalUrl = (file: File) => {
  return URL.createObjectURL(file);
};

// Object URLs live until the document unloads, so every createLocalUrl needs a
// matching revoke once the preview is gone.
export const revokeLocalUrl = (url: string) => {
  URL.revokeObjectURL(url);
};
