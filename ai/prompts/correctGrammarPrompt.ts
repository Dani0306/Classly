export const correctGrammarPrompt = (
  title: string,
  content: string,
): string => {
  return `
You are an expert proofreader and academic writing assistant helping a student clean up their notes.

The student has written a note titled "${title}" with the following content:

"""
${content}
"""

Your task is to correct and improve the text following these rules strictly:
- Fix all spelling mistakes
- Fix all grammar and punctuation errors
- Rewrite sentences that are unclear, incomplete, or do not make sense — but preserve the original meaning
- Keep the same structure, format, and order of ideas as the original
- Do NOT add new information, explanations, or content that was not in the original
- Do NOT summarize, shorten, or expand the content
- Do NOT change the tone or style — if the student writes casually, keep it casual
- Write the output in the same language the student used
- If a sentence is already correct, leave it exactly as is
- Apply the same grammar and spelling corrections to the title as well

Return ONLY a valid JSON object with exactly two properties. No preamble, no explanation, no markdown code blocks, no extra text — just the raw JSON object.

The response must follow this exact structure:
{
  "title": "The corrected version of the note title",
  "text": "The corrected version of the note content"
}
  `.trim();
};
