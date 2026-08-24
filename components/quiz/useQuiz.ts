import { modifyContent } from "@/actions/contents/modifyContent";
import { Content, QuizQuestion } from "@/types";
import { checkQuestions, shuffleAnswers } from "@/utils/fn";
import { useRef, useState, useTransition } from "react";

export const useQuiz = (content: Content) => {
  const [currentContent, setCurrentContent] = useState<Content>(content);
  const [questions, setQuestions] = useState<QuizQuestion[]>(
    shuffleAnswers(JSON.parse(currentContent.ai_output ?? "[]")),
  );

  const [current, setCurrent] = useState(0);
  const [isPending, startTransition] = useTransition();

  const containerRef = useRef<HTMLDivElement>(null);

  const isSubmitted = currentContent.is_completed;

  const isLast = current === questions.length - 1;

  const scrollTo = (index: number) => {
    containerRef.current?.children[index]?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "start",
    });
  };

  const handleNext = () => {
    if (current >= questions.length - 1) return;
    const next = current + 1;
    setCurrent(next);
    scrollTo(next);
  };

  const handlePrev = () => {
    if (current <= 0) return;
    const prev = current - 1;
    setCurrent(prev);
    scrollTo(prev);
  };

  const handleSelectAnswer = (index: number, answer: string) => {
    if (isSubmitted) return;

    setQuestions((prev) =>
      prev.map((q, i) => (i === index ? { ...q, selected_answer: answer } : q)),
    );
  };

  const submitQuiz = () => {
    if (isSubmitted || !checkQuestions(questions)) return;

    startTransition(async () => {
      try {
        const result = await modifyContent(
          {
            ...content,
            is_completed: true,
            ai_output: JSON.stringify(questions),
          },
          content.id,
        );

        setCurrentContent({ ...result });
      } catch (err) {
        console.log(err);
      }
    });
  };

  return {
    questions,
    current,
    isPending,
    isSubmitted,
    isLast,
    containerRef,
    handleNext,
    handlePrev,
    handleSelectAnswer,
    submitQuiz,
  };
};
