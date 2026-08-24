import React, { useState, useTransition } from "react";
import LoadingScreen from "../loading/LoadingScreen";
import Input from "../shared/Input";
import { BookOpenCheck, Camera } from "lucide-react";
import ModalTitle from "../modal/ModalTitle";
import { createContent } from "@/actions/contents/createContent";
import { useToast } from "@/providers/ToastProvider";
import { useModal } from "@/providers/AppModalProvider";
import { generateQuiz } from "@/actions/ai/generateQuiz";
import { TypeBadge } from "../contents/ContentCard";
import { contentTypes } from "@/data/colors/typeColors";

const CreateQuiz = ({ classId }: { classId: string }) => {
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");

  const [isPending, startTransition] = useTransition();

  const { toast } = useToast();

  const { closeModal } = useModal();

  const createQuiz = () => {
    startTransition(async () => {
      const response = await generateQuiz(title, content);
      const formattedResponse = JSON.parse(response);

      if (formattedResponse) {
        await createContent({
          title,
          content,
          ai_output: response,
          class_id: classId,
          type: "quiz",
        });
        toast({
          title: "Quiz generated successfully!",
          type: "success",
        });
        closeModal();
      }
    });
  };

  return (
    <div className="w-full rounded-xl flex flex-col space-y-6">
      {isPending ? (
        <div className="flex items-center justify-center w-full h-full">
          <LoadingScreen message="Summarizing content with AI ..." />
        </div>
      ) : (
        <>
          <div className="flex flex-col space-y-3">
            <div>
              <TypeBadge type="quiz" />
            </div>
            <ModalTitle
              title="Create Quiz"
              description="Write or paste your content and AI will generate a set of multiple choice questions to test your knowledge."
            />
          </div>

          <div className="flex flex-1 flex-col space-y-4 px-0">
            <Input
              value={title}
              setValue={setTitle}
              label="Title"
              placeholder="Title ..."
              name="title"
            />
            <Input
              value={content}
              setValue={setContent}
              label="Content"
              placeholder="Content ..."
              name="content"
              textarea
              rows={8}
            />

            <div className="min-h-25 w-full border-2 border-primary rounded-xl border-dashed flex items-center justify-center flex-col">
              <Camera className="size-9 p-2 rounded-full cursor-pointer bg-foreground/20" />
              <strong className="text-foreground font-bold text-sm">
                Add Visual Content
              </strong>
              <span className="text-foreground/40 text-xs font-light">
                Tap to upload or drag study diagrams.
              </span>
            </div>
          </div>

          <button
            onClick={createQuiz}
            disabled={!title || !content}
            style={{
              backgroundColor: contentTypes.find((item) => item.type === "quiz")
                ?.color,
            }}
            className="w-full disabled:opacity-50 py-2.5 text-white font-medium text-sm rounded-full flex space-x-1.5 items-center justify-center hover:opacity-80 transition-all duration-300 cursor-pointer"
          >
            <BookOpenCheck className="size-4 text-white" />
            <span>Crete Quiz</span>
          </button>
        </>
      )}
    </div>
  );
};

export default CreateQuiz;
