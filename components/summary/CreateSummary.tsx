import React, { useState, useTransition } from "react";
import LoadingScreen from "../loading/LoadingScreen";
import ModalTitle from "../modal/ModalTitle";
import Input from "../shared/Input";
import { NotebookText } from "lucide-react";
import { generateSummary } from "@/actions/ai/generateSummary";
import { createContent } from "@/actions/contents/createContent";
import { useModal } from "@/providers/AppModalProvider";
import { useToast } from "@/providers/ToastProvider";
import { TypeBadge } from "../contents/ContentCard";
import { contentTypes } from "@/data/colors/typeColors";
// import SelectOptions from "../shared/SelectOptions";

// const summarySizeOptions = [
//   "Short (50-100 words)",
//   "Medium (150-250 words)",
//   "Detailed (300-500 words)",
// ];

const CreateSummary = ({ classId }: { classId: string }) => {
  const [isPending, startTransition] = useTransition();
  const [summarySize, setSummarySize] = useState<string>("");

  const { closeModal } = useModal();

  const { toast } = useToast();

  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");

  const createSummary = () => {
    startTransition(async () => {
      try {
        const response = await generateSummary(title, content, summarySize);
        const formattedResponse = JSON.parse(response);

        if (formattedResponse) {
          await createContent({
            title,
            content,
            ai_output: response,
            class_id: classId,
            type: "summarize",
          });
          toast({
            title: "Summary generated successfully!",
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
          <LoadingScreen message="Summarizing content with AI ..." />
        </div>
      ) : (
        <>
          <div className="flex flex-col space-y-3">
            <div>
              <TypeBadge type="summarize" />
            </div>
            <ModalTitle
              title="New Summary"
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

            <Input
              value={summarySize}
              setValue={setSummarySize}
              label="Size"
              placeholder="Choose the summary size ..."
              name="size"
            />
            {/* 
            <SelectOptions
              value={summarySize}
              setValue={setSummarySize}
              name="size"
              placeholder="Choose the summary size."
              label="Summarize size"
              options={summarySizeOptions}
            /> */}
          </div>
          <button
            onClick={createSummary}
            disabled={!title || !content || !summarySize}
            style={{
              backgroundColor: contentTypes.find(
                (item) => item.type === "summarize",
              )?.color,
            }}
            className="w-full disabled:opacity-50 py-2.5 text-white font-medium text-sm rounded-full flex space-x-1.5 items-center justify-center hover:opacity-80 transition-all duration-300 cursor-pointer"
          >
            <NotebookText className="size-4 text-white" />
            <span>Summarize</span>
          </button>
        </>
      )}
    </div>
  );
};

export default CreateSummary;
