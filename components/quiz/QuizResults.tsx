import { cn } from "@/lib/utils";
import { QuizQuestion } from "@/types";
import { Check, X } from "lucide-react";

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`;

/** What the score means, and what to do next. */
const verdict = (score: number, total: number) => {
  const missed = total - score;
  const ratio = total ? score / total : 0;

  if (missed === 0)
    return { title: "Perfect score.", hint: "Every answer right. Nothing to review." };
  if (ratio >= 0.8)
    return { title: "Strong work.", hint: `Go over the ${plural(missed, "question")} you missed below.` };
  if (ratio >= 0.5)
    return { title: "Getting there.", hint: `Go over the ${plural(missed, "question")} you missed below.` };
  return {
    title: "Worth another pass.",
    hint: "Reread the note, then retake the quiz.",
  };
};

/**
 * The submitted quiz: the score stamped on a canary note, then every
 * question with the student's answer and, where it was wrong, the right one.
 */
const QuizResults = ({
  questions,
  score,
}: {
  questions: QuizQuestion[];
  score: number;
}) => {
  const total = questions.length;
  const percent = total ? Math.round((score / total) * 100) : 0;
  const { title, hint } = verdict(score, total);

  return (
    <section aria-label="Results" className="flex flex-col gap-10">
      <div className="flex flex-wrap items-center gap-x-8 gap-y-5">
        <div className="stamp -rotate-1 rounded-[3px] bg-note-yellow px-6 py-5 shadow-[0_1px_0_rgba(0,0,0,0.14),0_18px_28px_-16px_rgba(0,0,0,0.55)] motion-reduce:rotate-0">
          <p className="tabular text-[3.25rem] font-extrabold leading-none tracking-[-0.04em] text-ink">
            {score}
            <span className="text-ink/45">/{total}</span>
          </p>
          <p className="tabular mt-2 text-xs font-semibold text-ink/75">
            {percent}% correct
          </p>
        </div>

        <div className="flex max-w-xs flex-col gap-1.5">
          <p className="text-xl font-bold tracking-[-0.025em] text-ink">{title}</p>
          <p className="text-sm leading-relaxed text-ink/70">{hint}</p>
        </div>
      </div>

      <ol className="flex flex-col">
        {questions.map((q, i) => {
          const right = q.selected_answer === q.correct_answer;

          return (
            <li
              key={i}
              className="flex gap-4 border-t border-ink/10 py-5 first:border-t-0 first:pt-0"
            >
              <span
                className={cn(
                  "mt-0.5 grid size-6 shrink-0 place-items-center rounded-full text-white",
                  right ? "bg-[#1a7541]" : "bg-red-600",
                )}
              >
                {right ? (
                  <Check className="size-3.5" strokeWidth={3} aria-label="Correct" />
                ) : (
                  <X className="size-3.5" strokeWidth={3} aria-label="Wrong" />
                )}
              </span>

              <div className="flex min-w-0 flex-col gap-2">
                <p className="text-[15px] font-semibold leading-snug text-ink">
                  <span className="tabular mr-1.5 text-ink/50">{i + 1}.</span>
                  {q.question}
                </p>

                <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm">
                  <dt className="text-ink/60">Your answer</dt>
                  <dd
                    className={cn(
                      "[overflow-wrap:anywhere]",
                      right
                        ? "font-semibold text-[#1a7541]"
                        : "text-red-700 line-through decoration-red-700/50",
                    )}
                  >
                    {q.selected_answer || "No answer"}
                  </dd>
                  {!right && (
                    <>
                      <dt className="text-ink/60">Correct</dt>
                      <dd className="font-semibold text-[#1a7541] [overflow-wrap:anywhere]">
                        {q.correct_answer}
                      </dd>
                    </>
                  )}
                </dl>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
};

export default QuizResults;
