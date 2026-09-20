"use server";

import { grammarCorrection } from "@/actions/ai/correctGrammar";
import { generateDiagram } from "@/actions/ai/generateDiagram";
import { generateQuiz } from "@/actions/ai/generateQuiz";
import { generateSummary } from "@/actions/ai/generateSummary";
import { CreateContentInput, NewContent } from "@/types";
import { createServerSupabase } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

const buildContent = async (input: CreateContentInput): Promise<NewContent> => {
  const { type, classId, title, text, files_urls } = input;
  const base = { type, class_id: classId, title, content: text, files_urls };

  switch (type) {
    case "note":
    case "reminder":
    case "homework": {
      const corrected = await grammarCorrection(title, text);
      return {
        ...base,
        title: corrected.title || title,
        ai_output: corrected.description || text,
        ...(type !== "note" && {
          due_date: input.dueDate,
          priority: input.priority,
        }),
      };
    }

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

    // A file has no AI step: uploadFile() has already produced the public
    // URL by this point, so the record is stored as-is.
    case "file":
      return { ...base, ai_output: text };

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

  if (!input.title.trim() || !input.text.trim())
    throw new Error("Title and content are required.");

  const content = await buildContent(input);

  const { error } = await supabase
    .from("contents")
    .insert({ ...content, user_id: user.id });

  if (error) throw new Error("Failed creating content.");

  revalidatePath("/app/class/[id]", "page");
};
