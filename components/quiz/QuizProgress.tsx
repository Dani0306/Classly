import { cn } from "@/lib/utils";
import { QuizQuestion } from "@/types";

/**
 * One tick per question. Answered ticks fill with ink and the current one
 * stands taller. Every tick is a button, so a student can jump back to a
 * question they skipped.
 */
const QuizProgress = ({
  questions,
  current,
  onJump,
}: {
  questions: QuizQuestion[];
  current: number;
  onJump: (index: number) => void;
}) => {
  const total = questions.length;
  const answered = questions.filter((q) => q.selected_answer).length;

  return (
    <div className="flex items-center gap-4">
      <ol className="flex flex-1 gap-1" aria-label="Questions">
        {questions.map((q, i) => {
          const isCurrent = i === current;
          const isAnswered = Boolean(q.selected_answer);

          return (
            <li key={i} className="flex-1">
              <button
                type="button"
                onClick={() => onJump(i)}
                aria-current={isCurrent ? "step" : undefined}
                aria-label={`Question ${i + 1}${isAnswered ? ", answered" : ""}`}
                className="group flex h-6 w-full cursor-pointer items-center rounded-[2px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                <span
                  className={cn(
                    "quiz-tick block h-2 w-full rounded-[2px]",
                    isCurrent ? "scale-y-100" : "scale-y-50",
                    isAnswered
                      ? "bg-ink"
                      : isCurrent
                        ? "bg-ink/45"
                        : "bg-ink/15 group-hover:bg-ink/30",
                  )}
                />
              </button>
            </li>
          );
        })}
      </ol>

      <p className="tabular shrink-0 text-xs font-semibold text-ink/70">
        <span className="text-ink">{current + 1}</span> / {total}
        <span className="sr-only">, {answered} answered</span>
      </p>
    </div>
  );
};

export default QuizProgress;
