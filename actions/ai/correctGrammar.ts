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
    // The cheapest model. "minimal" reasoning left typos like "tis" and
    // "taskck" untouched; "low" catches them and is still fast.
    model: "gpt-5-nano",
    reasoning: { effort: "low" },
    input: correctGrammarPrompt(title, text),
  });

  if (error) throw new Error("Error generating AI output.");

  const response = JSON.parse(output_text);

  return response;
};
