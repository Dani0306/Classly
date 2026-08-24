import React, { useTransition, useState } from "react";
import ModalTitle from "../modal/ModalTitle";
import Input from "../shared/Input";
import { Camera, Newspaper } from "lucide-react";
import { grammarCorrection } from "@/actions/ai/grammarCorrection";
import { createContent } from "@/actions/contents/createContent";
import { useToast } from "@/providers/ToastProvider";
import { useModal } from "@/providers/AppModalProvider";
import LoadingScreen from "../loading/LoadingScreen";
import { TypeBadge } from "../contents/ContentCard";
import { contentTypes } from "@/data/colors/typeColors";

const GrammarCorrection = ({ classId }: { classId: string }) => {
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");

  const { toast } = useToast();

  const { closeModal } = useModal();

  const [isPending, startTransition] = useTransition();

  const correctGrammar = () => {
    if (!title || !content) return;

    startTransition(async () => {
      try {
        const response = await grammarCorrection(title, content);
        const formattedResponse = JSON.parse(response);

        if (formattedResponse) {
          await createContent({
            title,
            content,
            ai_output: response,
            class_id: classId,
            type: "note",
          });

          toast({
            title: "Grammar correction successfully applied!",
            type: "success",
          });
          closeModal();
        }
      } catch (err) {
        console.log(err);
      }
    });
  };

  return (
    <div className="w-full rounded-xl flex flex-col space-y-6">
      {isPending ? (
        <div className="flex items-center justify-center w-full h-full">
          <LoadingScreen message="Transforming content with AI ..." />
        </div>
      ) : (
        <>
          <div className="flex flex-col space-y-3">
            <div>
              <TypeBadge type="note" />
            </div>
            <ModalTitle
              title="New Note"
              description="Write your topic and let AI turn them into structured study material."
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

            <div className="min-h-30 w-full border-2 border-primary rounded-xl border-dashed flex items-center justify-center flex-col">
              <Camera className="size-9 p-2 rounded-full cursor-pointer bg-foreground/20" />
              <strong className="text-foreground font-bold text-sm">
                Add Visual Content
              </strong>
              <span className="text-foreground/40 text-xs font-light">
                Tap to upload or drag study diagrams.
              </span>
            </div>
          </div>
          <div className="w-full items-end flex justify-end">
            <button
              onClick={correctGrammar}
              disabled={!title || !content}
              style={{
                backgroundColor: contentTypes.find(
                  (item) => item.type === "note",
                )?.color,
              }}
              className="w-full disabled:opacity-50 py-2.5 text-white font-medium text-sm rounded-full flex space-x-1.5 items-center justify-center hover:opacity-80 transition-all duration-300 cursor-pointer"
            >
              <Newspaper className="size-4 text-white" />
              <span>New Note</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default GrammarCorrection;
