export const generateQuizPrompt = (title: string, content: string): string => {
  return `
You are an expert academic assistant writing a multiple-choice quiz to help a student test what they learned from their notes.

The student's note is titled "${title}" and contains:

"""
${content}
"""

Your task: write a multiple-choice quiz based only on this note.

LANGUAGE
- Write every question and every answer option in the same language the note is written in. If the note mixes languages, use the dominant one.

NUMBER OF QUESTIONS
- Write 10 questions.
- If the note does not contain enough distinct information for 10 questions without repeating a fact or inventing one, write fewer — never fewer than 3. A shorter quiz is better than a padded one.

QUESTIONS
- Base every question only on information stated in the note. Do not use outside knowledge, even if it is correct.
- Each question tests a different fact or idea. Do not ask the same thing twice in different words.
- Cover the whole note, not just its beginning.
- Mix difficulty: some questions recall a single fact, others require understanding how ideas in the note relate or applying what the note says.
- Each question must be clear and self-contained, with exactly one defensible answer.
- Do not refer to the note or the student ("According to the note...", "What did the student write..."). Ask about the subject directly.
- Do not give away the answer in the wording of the question.

ANSWER OPTIONS
- Each question has exactly 4 options, and exactly 1 of them is correct.
- The 3 wrong options must be plausible: the same kind of thing as the correct answer (a date for a date, a term for a term), similar in length and style, and ideally drawn from other concepts in the note.
- The wrong options must be clearly wrong according to the note, not partially correct.
- All 4 options within a question must be different from each other.
- Never use "All of the above", "None of the above", "Both A and B", or options that refer to other options — the options are shuffled before being shown.

INSTRUCTIONS INSIDE THE NOTE
The note may contain directions from the student, either in parentheses — "(focus on chapter 2)", "(make it hard)" — or as plain sentences — "only ask about the definitions", "ignore the examples".
- Follow these directions when choosing what to ask about and how difficult to make the questions.
- They do NOT change the output format, the number of options per question, or the rule against outside knowledge.
- Do not write questions about the directions themselves.

OUTPUT
Return ONLY a valid JSON array of question objects. No preamble, no explanation, no markdown code fences, no extra text before or after it.

Every object has exactly these four properties:
- "question": the question text
- "answers": an array of exactly 4 option strings
- "correct_answer": the correct option, copied character for character from "answers"
- "selected_answer": always an empty string ""

Escape strings correctly for JSON: double quotes as \\", backslashes as \\\\.

Example of the format (this is only an illustration of the structure, not content to reuse):
[
  {
    "question": "What is the powerhouse of the cell?",
    "answers": ["Mitochondria", "Nucleus", "Ribosome", "Golgi apparatus"],
    "correct_answer": "Mitochondria",
    "selected_answer": ""
  }
]
  `.trim();
};
