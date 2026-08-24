"use server";

import { client } from "@/ai/client";
import { correctGrammarPrompt } from "@/ai/prompts/correctGrammarPrompt";
import { createServerSupabase } from "@/utils/supabase/server";

export const grammarCorrection = async (title: string, text: string) => {
  const supabase = await createServerSupabase();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("User not found.");

  const { error, output_text } = await client.responses.create({
    model: "gpt-5-mini",
    input: correctGrammarPrompt(title, text),
  });

  if (error) throw new Error("Error generating AI output.");

  return output_text;
};
