import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

const QuizAnswerOption = ({
  answer,
  isSelected,
  isCorrectAnswer,
  isSubmitted,
  correctAnswer,
  onSelect,
}: {
  answer: string;
  isSelected: boolean;
  isCorrectAnswer: boolean;
  isSubmitted: boolean;
  correctAnswer: string;
  onSelect: () => void;
}) => {
  const showCorrect = isSubmitted && isCorrectAnswer;
  const showWrong = isSubmitted && isSelected && !isCorrectAnswer;
  const showNeutralSelected = isSelected && !isSubmitted;

  return (
    <button
      onClick={onSelect}
      disabled={isSubmitted}
      className={cn(
        "flex items-center space-x-3 px-4 py-3 rounded-xl border text-left transition-all duration-200",
        isSubmitted ? "cursor-default" : "cursor-pointer",
        showCorrect
          ? "border-green-500 bg-green-50"
          : showWrong
            ? "border-red-500 bg-red-50"
            : showNeutralSelected
              ? "border-blue-600 bg-blue-600/10"
              : "border-border hover:border-primary/40 hover:bg-gray-50",
      )}
    >
      <div
        className={cn(
          "size-4 rounded-full border-2 flex items-center justify-center shrink-0",
          showCorrect
            ? "border-green-500 bg-green-500"
            : showWrong
              ? "border-red-500 bg-red-500"
              : showNeutralSelected
                ? "border-blue-600 bg-blue-600"
                : "border-gray-300",
        )}
      >
        {showCorrect && <Check className="size-2.5 text-white" />}
        {showWrong && <X className="size-2.5 text-white" />}
        {showNeutralSelected && <Check className="size-2.5 text-white" />}
      </div>

      <div className="flex flex-col gap-0.5 flex-1">
        <p
          className={cn(
            "text-xs font-light",
            showCorrect
              ? "text-green-700"
              : showWrong
                ? "text-red-600 line-through"
                : "text-foreground/80",
          )}
        >
          {answer}
        </p>
        {isSubmitted && showWrong && (
          <p className="text-[11px] text-green-600 font-medium">
            Correct answer: {correctAnswer}
          </p>
        )}
      </div>

      {showCorrect && (
        <span className="ml-auto text-[10px] font-medium text-green-600 bg-green-100 px-2 py-0.5 rounded-full shrink-0">
          Correct
        </span>
      )}
      {showWrong && (
        <span className="ml-auto text-[10px] font-medium text-red-500 bg-red-100 px-2 py-0.5 rounded-full shrink-0">
          Wrong
        </span>
      )}
    </button>
  );
};

export default QuizAnswerOption;
