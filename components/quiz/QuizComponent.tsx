"use client";

import { Content } from "@/types";
import { cn } from "@/lib/utils";
import { typeColor } from "@/lib/contentoptions";
import { useDeleteContent } from "@/hooks/contents/useDeleteContent";
import { format, parseISO } from "date-fns";
import { useEffect, useEffectEvent, useState } from "react";
import { ArrowLeft, ArrowRight, Check, RotateCcw, Trash2 } from "lucide-react";
import { useQuiz } from "./useQuiz";
import QuizProgress from "./QuizProgress";
import QuizAnswerOption, { OPTION_KEYS } from "./QuizAnswerOption";
import QuizResults from "./QuizResults";
import ContentBadge from "../contents/ContentBadge";
import LoadingScreen from "../loading/LoadingScreen";
import PageButton from "../shared/PageButton";

/** Keys that pick an option: 1–4 or A–D. */
const optionFromKey = (key: string) => {
  const digit = Number(key);
  if (digit >= 1 && digit <= 4) return digit - 1;
  const letter = OPTION_KEYS.indexOf(key.toUpperCase());
  return letter;
};

/**
 * A quiz opened as a sheet of paper: one question at a time with a tick per
 * question along the top, then, once submitted, the score and a review of
 * every answer. Students can retake it; the saved score is replaced only when
 * the new attempt is submitted.
 */
const QuizComponent = ({
  content,
  classLabel,
}: {
  content: Content;
  /** The class name, when the opener knows it. */
  classLabel?: string;
}) => {
  const quiz = useQuiz(content);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const { isPending: deleting, deleteContent } = useDeleteContent(content.id);

  const answering = !quiz.isSubmitted && quiz.total > 0;

  const onKeyDown = useEffectEvent((e: KeyboardEvent) => {
    if (!answering || confirmingDelete || quiz.isPending) return;
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    // A focused control handles its own Enter and Space.
    const target = e.target as HTMLElement | null;
    if (target?.closest("button, input, textarea, select, a")) {
      if (e.key === "Enter" || e.key === " ") return;
    }

    if (e.key === "ArrowRight") {
      e.preventDefault();
      quiz.next(false);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      quiz.prev(false);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (quiz.isLast) quiz.submit();
      else quiz.next(false);
    } else {
      const option = optionFromKey(e.key);
      const answer = quiz.question?.answers[option];
      if (option !== -1 && answer != null) {
        e.preventDefault();
        quiz.select(answer);
      }
    }
  });

  useEffect(() => {
    const listener = (e: KeyboardEvent) => onKeyDown(e);
    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, []);

  if (deleting) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <LoadingScreen message="Deleting ..." />
      </div>
    );
  }

  const { question } = quiz;

  return (
    <article className="relative flex min-h-full flex-col">
      <span
        aria-hidden
        className="sheet-tape"
        style={{ "--tape": `${typeColor(content.type)}d9` } as React.CSSProperties}
      />

      <header className="flex flex-col gap-4 px-6 pt-12 md:px-12 md:pt-14">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 pr-8 text-xs text-ink/65">
          <ContentBadge type={content.type} />
          {classLabel && (
            <span className="font-semibold text-ink/80">{classLabel}</span>
          )}
          <span>Added {format(parseISO(content.created_at), "MMM d, yyyy")}</span>
          {quiz.total > 0 && (
            <span className="tabular">{quiz.total} questions</span>
          )}
        </div>

        <h2 className="text-balance text-2xl font-extrabold leading-[1.15] tracking-[-0.03em] md:text-[1.75rem]">
          {content.title}
        </h2>

        {answering && (
          <QuizProgress
            questions={quiz.questions}
            current={quiz.current}
            onJump={(i) => quiz.goTo(i)}
          />
        )}
      </header>

      <div className="flex-1 px-6 py-8 md:px-12">
        {quiz.total === 0 ? (
          <p className="max-w-md rounded-[3px] border-2 border-dashed border-ink/15 px-6 py-10 text-sm leading-relaxed text-ink/70">
            This quiz couldn&apos;t be read. Delete it, then make a new one from
            the note with Study tools.
          </p>
        ) : quiz.isSubmitted ? (
          <QuizResults
            key={`results-${quiz.attempt}`}
            questions={quiz.questions}
            score={quiz.score}
          />
        ) : (
          question && (
            <div
              key={`${quiz.attempt}-${quiz.current}`}
              className={cn("flex flex-col gap-6", quiz.step.animate && "quiz-step")}
              style={
                { "--step-from": `${quiz.step.direction * 14}px` } as React.CSSProperties
              }
            >
              <h3
                id="quiz-question"
                className="text-pretty text-xl font-bold leading-snug tracking-[-0.02em] text-ink md:text-[1.375rem]"
              >
                {question.question}
              </h3>

              <div
                role="radiogroup"
                aria-labelledby="quiz-question"
                className="flex flex-col gap-2.5"
              >
                {question.answers.map((answer, i) => (
                  <QuizAnswerOption
                    key={i}
                    index={i}
                    answer={answer}
                    isSelected={question.selected_answer === answer}
                    disabled={quiz.isPending}
                    onSelect={() => quiz.select(answer)}
                  />
                ))}
              </div>

              <p className="hidden text-xs text-ink/55 md:block">
                Press 1–4 to choose, ← and → to move, Enter to continue.
              </p>
            </div>
          )
        )}
      </div>

      <footer className="sticky bottom-0 flex flex-wrap items-center justify-end gap-3 border-t border-ink/15 bg-surface px-6 py-4 md:px-12">
        {confirmingDelete ? (
          <>
            <p className="mr-auto text-sm font-semibold text-ink">
              Delete this quiz? This can&apos;t be undone.
            </p>
            <PageButton
              light
              text="Keep it"
              onClick={() => setConfirmingDelete(false)}
            />
            <button
              type="button"
              onClick={deleteContent}
              className="press cursor-pointer rounded-[3px] bg-red-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-red-700"
            >
              Delete
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={() => setConfirmingDelete(true)}
              className="press mr-auto inline-flex cursor-pointer items-center gap-1.5 rounded-[3px] px-3 py-2.5 text-xs font-semibold text-red-700 hover:bg-red-600/10"
            >
              <Trash2 className="size-3.5" />
              Delete
            </button>

            {answering && (
              <>
                {quiz.isLast && quiz.unanswered > 0 && (
                  <span className="tabular text-xs font-semibold text-ink/70">
                    {quiz.unanswered} unanswered
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => quiz.prev()}
                  disabled={quiz.isFirst}
                  aria-label="Previous question"
                  className="press grid size-9.5 cursor-pointer place-items-center rounded-[3px] border border-ink/15 bg-note-paper text-ink hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ArrowLeft className="size-4" />
                </button>
                {quiz.isLast ? (
                  <PageButton
                    text={
                      quiz.isPending
                        ? "Saving..."
                        : quiz.unanswered > 0
                          ? "Go to unanswered"
                          : "Submit quiz"
                    }
                    icon={quiz.unanswered > 0 ? ArrowRight : Check}
                    disabled={quiz.isPending}
                    onClick={quiz.submit}
                  />
                ) : (
                  <PageButton
                    text="Next"
                    icon={ArrowRight}
                    onClick={() => quiz.next()}
                  />
                )}
              </>
            )}

            {quiz.isSubmitted && quiz.total > 0 && (
              <PageButton text="Retake quiz" icon={RotateCcw} onClick={quiz.retake} />
            )}
          </>
        )}
      </footer>
    </article>
  );
};

export default QuizComponent;
