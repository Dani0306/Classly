import { modifyContent } from "@/actions/contents/modifyContent";
import { useToast } from "@/providers/ToastProvider";
import { Content, QuizQuestion } from "@/types";
import { shuffleAnswers } from "@/utils/fn";
import { useState, useTransition } from "react";

/** The saved questions, or none when `ai_output` isn't a readable quiz. */
const parseQuestions = (raw?: string | null): QuizQuestion[] => {
  try {
    const parsed = JSON.parse(raw ?? "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

/** A fresh attempt: answers cleared and options reshuffled. */
const freshAttempt = (questions: QuizQuestion[]) =>
  shuffleAnswers(questions.map((q) => ({ ...q, selected_answer: "" })));

export type StepDirection = 1 | -1;

export const useQuiz = (content: Content) => {
  const { toast } = useToast();

  // A submitted quiz keeps the option order the student answered in, so the
  // review matches what they saw. An open one is shuffled on every open.
  const [questions, setQuestions] = useState<QuizQuestion[]>(() => {
    const saved = parseQuestions(content.ai_output);
    return content.is_completed ? saved : shuffleAnswers(saved);
  });
  const [isSubmitted, setIsSubmitted] = useState(Boolean(content.is_completed));
  const [current, setCurrent] = useState(0);
  // Which way the last move went, and whether to animate it. Keyboard moves
  // change instantly; pointer moves slide.
  const [step, setStep] = useState<{ direction: StepDirection; animate: boolean }>({
    direction: 1,
    animate: false,
  });
  // Bumped on retake so the first question remounts and replays its entrance.
  const [attempt, setAttempt] = useState(0);
  const [isPending, startTransition] = useTransition();

  const total = questions.length;
  const question = questions[current];
  const isFirst = current === 0;
  const isLast = current === total - 1;
  const answered = questions.filter((q) => q.selected_answer).length;
  const unanswered = total - answered;
  const score = questions.filter(
    (q) => q.selected_answer === q.correct_answer,
  ).length;

  const goTo = (index: number, animate = true) => {
    if (index < 0 || index >= total || index === current) return;
    setStep({ direction: index > current ? 1 : -1, animate });
    setCurrent(index);
  };

  const next = (animate?: boolean) => goTo(current + 1, animate);
  const prev = (animate?: boolean) => goTo(current - 1, animate);

  const select = (answer: string) => {
    if (isSubmitted || isPending) return;
    setQuestions((prev) =>
      prev.map((q, i) => (i === current ? { ...q, selected_answer: answer } : q)),
    );
  };

  /** Saves the attempt, or jumps to the first question still unanswered. */
  const submit = () => {
    if (isSubmitted || isPending) return;

    const missing = questions.findIndex((q) => !q.selected_answer);
    if (missing !== -1) {
      goTo(missing);
      return;
    }

    startTransition(async () => {
      try {
        await modifyContent(
          { is_completed: true, ai_output: JSON.stringify(questions) },
          content.id,
        );
        setIsSubmitted(true);
      } catch {
        toast({
          type: "error",
          title: "Couldn't save your answers",
          description: "Your answers are still here. Check your connection and submit again.",
        });
      }
    });
  };

  /** Starts over. The saved score stays until the new attempt is submitted. */
  const retake = () => {
    setQuestions((prev) => freshAttempt(prev));
    setCurrent(0);
    setStep({ direction: 1, animate: true });
    setAttempt((n) => n + 1);
    setIsSubmitted(false);
  };

  return {
    questions,
    question,
    current,
    total,
    isFirst,
    isLast,
    answered,
    unanswered,
    score,
    step,
    attempt,
    isSubmitted,
    isPending,
    goTo,
    next,
    prev,
    select,
    submit,
    retake,
  };
};
