import { QuizQuestion } from "@/types";

const QuizScoreBadge = ({ questions }: { questions: QuizQuestion[] }) => {
  const total = questions.length;
  const correct = questions.filter(
    (q) => q.selected_answer === q.correct_answer,
  ).length;

  return (
    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200">
      <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
      <span className="text-xs font-medium text-blue-600">
        Score: {correct}/{total}
      </span>
    </div>
  );
};

export default QuizScoreBadge;
