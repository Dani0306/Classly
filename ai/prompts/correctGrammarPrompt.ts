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

Your ONLY task is to correct grammar, spelling, and punctuation. This is a proofreading task, not an editing or rewriting task.

Correct these, and nothing else:
- Misspelled words
- Grammar errors: verb tense, subject-verb agreement, articles, prepositions, plurals, word forms
- Punctuation errors: missing or wrong commas, periods, question marks, apostrophes
- Capitalization errors: sentence beginnings and proper nouns

Leave everything else EXACTLY as the student wrote it:
- Do NOT rewrite, rephrase, or reword anything. If a sentence is grammatically correct but awkward, unclear, or incomplete, leave it untouched.
- Do NOT change word choice. Keep the student's exact words, including slang, abbreviations, and informal wording.
- Do NOT add anything: no new sentences, words, explanations, headings, bullet points, titles, or closing remarks.
- Do NOT remove or shorten anything, and do NOT summarize or expand.
- Do NOT reorder sentences, ideas, or lines.
- Do NOT change the language. Correct the text in the language the student wrote it in.

Preserve the original formatting and spacing EXACTLY, character for character:
- Keep every line break exactly where it is. Do not merge lines into paragraphs and do not split lines.
- Keep every blank line, including consecutive blank ones.
- Keep all leading indentation and spacing at the start of lines.
- Keep spacing inside lines as written, including multiple consecutive spaces and any trailing spaces.
- Keep all existing markers exactly as written: bullets ("-", "*", "•"), numbering ("1.", "a)"), symbols, emoji, arrows, and any markdown such as #, **, or backticks.
- Do NOT add formatting the student did not use, and do NOT convert between formats (for example, do not turn lines into a bulleted or numbered list).
- The corrected text must have exactly the same number of lines as the original.

The only characters that may differ from the original are the letters and punctuation marks inside an actual grammar or spelling error. If a line contains no such error, reproduce it byte for byte.

Return ONLY a valid JSON object with exactly two properties, "title" and "description". No preamble, no explanation, no markdown code blocks, no extra text — just the raw JSON object.

- "title": the note title, corrected
- "description": the note content, corrected

Every rule above applies to BOTH properties equally. Correct grammar, spelling, punctuation, and capitalization in each, and in each one preserve the original wording, formatting, line breaks, and spacing exactly as described. Never leave one of the two out: include both properties even if that value needed no corrections, in which case return it exactly as the student wrote it.

Do NOT add, rename, or omit properties, and do NOT nest them inside another object.

Escape the text correctly for JSON: line breaks as \\n, double quotes as \\", backslashes as \\\\. Escaping changes how the text is encoded, never its content — the decoded string must still match the original character for character apart from the corrections.

The response must follow this exact structure:
{
  "title": "The corrected version of the note title",
  "description": "The corrected version of the note content"
}
  `.trim();
};
