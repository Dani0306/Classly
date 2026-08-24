export const generateQuizPrompt = (title: string, content: string): string => {
  return `
You are an expert academic assistant helping a student test their knowledge through a quiz.

The student has written a note titled "${title}" with the following content:

"""
${content}
"""

Your task is to generate a multiple-choice quiz based strictly on the content above.

Follow these rules strictly:
- Generate exactly 10 questions
- Each question must have exactly 4 answer options
- Only one answer is correct per question
- Base every question exclusively on the information provided — do not invent or add external knowledge
- Questions should vary in difficulty: mix easy, medium, and hard questions
- Avoid trivial or trick questions — focus on key concepts and understanding
- Write everything in the same language the student used in their note
- The "correct_answer" must be an exact match to one of the strings in the "answers" array

Return ONLY a valid JSON array with exactly 10 objects. No preamble, no explanation, no markdown code blocks, no extra text — just the raw JSON array.

Each object must follow this exact structure:
{
  "question": "The question text here",
  "answers": ["Option A", "Option B", "Option C", "Option D"],
  "correct_answer": "Option A"
  "selected_answer": ""
}
  `.trim();
};
