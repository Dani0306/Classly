"use client";

import { Content } from "@/types";
import { useQuiz } from "./useQuiz";
import QuizProgress from "./QuizProgress";
import QuizAnswerOption from "./QuizAnswerOption";
import QuizNavigation from "./QuizNavigation";
import { contentTypes } from "@/data/colors/typeColors";
import DateBadge from "../shared/DateBadge";
import PriorityBadge from "../shared/PriorityBadge";
import { TypeBadge } from "../contents/ContentCard";
import { Trash2 } from "lucide-react";
import { useModal } from "@/providers/AppModalProvider";
import { useDeleteContent } from "@/hooks/contents/useDeleteContent";

const QuizComponent = ({ content }: { content: Content }) => {
  const itemContent = contentTypes.find((item) => item.type === content.type)!;

  const { closeModal } = useModal();
  const {
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
  } = useQuiz(content);

  const { deleteContent, isPending: loading } = useDeleteContent(content.id);

  return (
    <div className="w-full h-full flex flex-col">
      <div className="relative flex items-center justify-between h-[25%] p-6 overflow-hidden">
        <div
          style={{
            background: `linear-gradient(to bottom, ${itemContent.color ?? "#CCC"}40, transparent)`,
          }}
          className="absolute inset-0"
        />

        <div className="relative z-10 flex items-center space-x-3">
          <itemContent.icon
            style={{ backgroundColor: itemContent?.color ?? "#CCC" }}
            className="size-12 text-white p-2 rounded-xl"
          />
          <div className="flex flex-col space-y-3">
            <h2 className="text-base md:text-xl font-semibold text-foreground">
              {content.title}
            </h2>
            <div className="flex items-center space-x-2">
              <TypeBadge filled type={content.type} />
              <PriorityBadge filled priority={content.priority ?? "medium"} />
            </div>
          </div>
        </div>

        <div className="relative z-10">
          <DateBadge timestamp={content.due_date ?? content.created_at} />
        </div>
      </div>

      <div className="flex-1">
        <div
          ref={containerRef}
          className="w-full h-full flex overflow-x-hidden"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {questions.map((item, index) => (
            <div
              key={item.question}
              className="w-full shrink-0 h-full flex flex-col space-y-5 p-8"
              style={{ scrollSnapAlign: "start" }}
            >
              <QuizProgress
                current={current}
                total={questions.length}
                index={index}
              />

              <h2 className="text-base font-semibold text-foreground">
                {item.question}
              </h2>

              <div className="flex flex-col space-y-3">
                {item.answers.map((answer) => (
                  <QuizAnswerOption
                    key={answer}
                    answer={answer}
                    isSelected={item.selected_answer === answer}
                    isCorrectAnswer={answer === item.correct_answer}
                    isSubmitted={isSubmitted ?? false}
                    correctAnswer={item.correct_answer}
                    onSelect={() => handleSelectAnswer(index, answer)}
                  />
                ))}
              </div>

              <QuizNavigation
                isLast={isLast}
                isSubmitted={isSubmitted ?? false}
                isPending={isPending}
                onNext={handleNext}
                onPrev={handlePrev}
                onSubmit={submitQuiz}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-between p-6">
        <button className="cursor-pointer rounded-xl text-sm hover:bg-orange-50 transition-all duration-500 font-medium text-red-600 flex items-center space-x-3 justify-center h-full px-6 py-2 border border-red-600">
          <Trash2 className="size-4" />
          <span>Delete</span>
        </button>
        <button
          onClick={closeModal}
          className="cursor-pointer rounded-xl text-sm font-medium text-foreground/80 h-full px-6 py-2 border border-black"
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default QuizComponent;
