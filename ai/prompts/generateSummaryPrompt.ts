const DEFAULT_SIZE = "Medium (150-250 words)";

export const generateSummaryPrompt = (
  title: string,
  content: string,
  size: string = DEFAULT_SIZE,
): string => {
  const length = size.trim() || DEFAULT_SIZE;

  return `
You are an expert academic assistant helping a student turn their notes into a study summary.

The student's note is titled "${title}" and contains:

"""
${content}
"""

Your task: write a clear, well-structured summary of this note that the student can study from, plus a short title for it.

LANGUAGE
- Write both the title and the summary in the same language the note is written in. If the note mixes languages, use the dominant one.

LENGTH
- Target length: ${length}. Stay within that range.
- Never invent, pad, or repeat content to reach the minimum. If the note is too short to fill the range, write a shorter summary that covers everything in it.

CONTENT
- Use only information that is in the note. Do not add facts, examples, explanations, or background knowledge that the note does not contain.
- Keep the key ideas, definitions, names, dates, numbers, and formulas exactly as the note states them.
- Leave out filler, repetition, and side remarks that do not matter for studying.
- Keep related ideas together, following the note's order unless a different grouping is clearly easier to study from.

STYLE AND FORMAT
- Write directly about the subject. Never refer to the note or the student ("This note explains...", "The student wrote...", "In summary...").
- Use short paragraphs, or bullet points ("- ") for lists of related items. Use a blank line between paragraphs or groups.
- Put the most important terms and concepts in **bold**. Bold only key terms, not whole sentences.
- Do not use headings, tables, code blocks, or emoji unless the student asks for them.

TITLE
- A short, specific title (about 3-8 words) that names the topic of the summary, not "Summary" or "Notes".

INSTRUCTIONS INSIDE THE NOTE
The note may contain directions written by the student in addition to subject matter, either in parentheses — "(focus only on the main concepts)", "(use bullet points only)" — or as plain sentences — "focus on X", "ignore Y", "make it simple", "only cover the first three points".
- Follow these directions. They take priority over the CONTENT and STYLE AND FORMAT rules above.
- They do NOT override the LANGUAGE or LENGTH rules, and never permit adding information that is not in the note.
- Treat them as directions only: do not summarize them or mention them in the output.

OUTPUT
Return ONLY a valid JSON object with exactly two string properties, "title" and "text". No preamble, no explanation, no markdown code fences, no extra text before or after it.

Escape the text correctly for JSON: line breaks as \\n, double quotes as \\", backslashes as \\\\.

{
  "title": "The summary title",
  "text": "The full summary, using \\n for line breaks"
}
  `.trim();
};
