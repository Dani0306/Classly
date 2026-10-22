"use server";

import { grammarCorrection } from "@/actions/ai/correctGrammar";
import { generateDiagram } from "@/actions/ai/generateDiagram";
import { generateQuiz } from "@/actions/ai/generateQuiz";
import { generateSummary } from "@/actions/ai/generateSummary";
import { CreateContentInput, NewContent } from "@/types";
import { consumeAiCredit, refundAiCredit } from "@/lib/ai/credits";
import { AI_KIND_BY_CONTENT_TYPE } from "@/lib/ai/kinds";
import { createServerSupabase } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { uploadFiles } from "../files/uploadFiles";

const buildContent = async (input: CreateContentInput): Promise<NewContent> => {
  const { type, classId, title, text, files } = input;

  let files_urls: string[] = [];

  if (files.length !== 0) {
    files_urls = await uploadFiles(files);
  }

  const base = { type, class_id: classId, title, content: text, files_urls };

  switch (type) {
    case "note": {
      if (!input.polish) return base;

      const corrected = await grammarCorrection(title, text);
      return {
        ...base,
        title: corrected.title || title,
        ai_output: corrected.description || text,
      };
    }

    case "task":
      return { ...base, due_date: input.dueDate, priority: input.priority };

    case "summarize": {
      const summary = await generateSummary(title, text, input.size);
      if (!summary.text) throw new Error("The generated summary was empty.");
      return {
        ...base,
        title: summary.title || title,
        ai_output: summary.text,
      };
    }

    case "quiz": {
      const questions = await generateQuiz(title, text);
      if (!Array.isArray(questions) || questions.length === 0)
        throw new Error("The generated quiz was empty.");
      return { ...base, ai_output: JSON.stringify(questions) };
    }

    case "diagram": {
      const imageUrl = await generateDiagram(
        title,
        text,
        input.diagramType ?? "flowchart",
        input.constraints,
      );
      return { ...base, ai_output: imageUrl };
    }
  }
};

export const createContentByType = async (input: CreateContentInput) => {
  const supabase = await createServerSupabase();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("User not found.");

  // A task's details are optional; everything else needs text to work from.
  if (!input.title.trim() || (input.type !== "task" && !input.text.trim()))
    throw new Error("Title and content are required.");

  if (input.type === "task" && (!input.dueDate || !input.priority))
    throw new Error("A task needs a due date and a priority.");

  // AI work claims the allowance before the call and gives it back if
  // nothing was saved. Tasks and unpolished notes spend nothing.
  const kind =
    input.type === "note" && !input.polish
      ? null
      : AI_KIND_BY_CONTENT_TYPE[input.type];

  const usageId = kind ? await consumeAiCredit(kind) : null;

  let content: NewContent;

  try {
    content = await buildContent(input);
  } catch (aiError) {
    if (usageId) await refundAiCredit(usageId);
    throw aiError;
  }

  const { error } = await supabase
    .from("contents")
    .insert({ ...content, user_id: user.id });

  if (error) {
    if (usageId) await refundAiCredit(usageId);
    throw new Error("Failed creating content.");
  }

  revalidatePath("/app/class/[id]", "page");
  revalidatePath("/app/today");
};
