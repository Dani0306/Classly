"use server";

import { client } from "@/ai/client";
import { generateQuizPrompt } from "@/ai/prompts/generateQuizPrompt";
import { createServerSupabase } from "@/utils/supabase/server";

export const generateQuiz = async (title: string, text: string) => {
  const supabase = await createServerSupabase();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("No user found.");

  const { output_text, error } = await client.responses.create({
    input: generateQuizPrompt(title, text),
    model: "gpt-5-mini",
  });

  if (error) throw new Error("Failed generating quiz.");

  const response = JSON.parse(output_text);

  return response;
};
