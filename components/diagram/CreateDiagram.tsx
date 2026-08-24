import React, { useState, useTransition } from "react";
import LoadingScreen from "../loading/LoadingScreen";
import Input from "../shared/Input";
import { TypeBadge } from "../contents/ContentCard";
import ModalTitle from "../modal/ModalTitle";
import { contentTypes } from "@/data/colors/typeColors";
import { ChartLine } from "lucide-react";
import { createContent } from "@/actions/contents/createContent";
import { useToast } from "@/providers/ToastProvider";
import { useModal } from "@/providers/AppModalProvider";
import { DiagramType } from "@/types";
import { generateDiagram } from "@/actions/ai/generateDiagram";
import { diagramTypes } from "@/data/diagram/diagramTypes";

const CreateDiagram = ({ classId }: { classId: string }) => {
  const [isPending, startTransition] = useTransition();

  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [constraints, setConstraints] = useState<string>("");
  const [diagramType, setDiagramType] = useState<DiagramType>("flowchart");

  const { closeModal } = useModal();

  const { toast } = useToast();

  const createDiagram = () => {
    startTransition(async () => {
      try {
        const response = await generateDiagram(
          title,
          content,
          diagramType,
          constraints,
        );

        await createContent({
          title,
          content: content,
          class_id: classId,
          ai_output: response,
          type: "diagram",
        });
        toast({
          title: "Diagram generated successfully!",
          type: "success",
        });

        closeModal();
      } catch (err) {
        console.log(err);
      }
    });
  };

  return (
    <div className="w-full rounded-xl flex flex-col space-y-6">
      {isPending ? (
        <div className="flex items-center justify-center w-full h-full">
          <LoadingScreen message="Creating diagram ..." />
        </div>
      ) : (
        <>
          <div className="flex flex-col space-y-3">
            <div>
              <TypeBadge type="diagram" />
            </div>
            <ModalTitle
              title="New Diagram"
              description="Describe your topic and AI will generate a visual diagram to help you study and understand it better."
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
              label="Description"
              placeholder="Description ..."
              name="description"
              textarea
              rows={3}
            />

            <Input
              value={constraints}
              setValue={setConstraints}
              label="Contraints"
              placeholder="Constraints ..."
              name="constraints"
              textarea
              rows={3}
            />

            <div className="flex flex-wrap gap-2">
              {diagramTypes.map((item) => {
                const selected = diagramType === item.type;

                return (
                  <div
                    style={{
                      borderColor: contentTypes.find(
                        (item) => item.type === "diagram",
                      )?.color,
                      color: selected
                        ? "white"
                        : contentTypes.find((item) => item.type === "diagram")
                            ?.color,
                      backgroundColor: selected
                        ? contentTypes.find((item) => item.type === "diagram")
                            ?.color
                        : "transparent",
                    }}
                    className="cursor-pointer px-4 py-1.5 text-xs font-medium rounded-xl border"
                    onClick={() => setDiagramType(item.type)}
                    key={item.label}
                  >
                    {item.label}
                  </div>
                );
              })}
            </div>
          </div>
          <button
            onClick={createDiagram}
            disabled={!title || !content || !diagramType}
            style={{
              backgroundColor: contentTypes.find(
                (item) => item.type === "diagram",
              )?.color,
            }}
            className="w-full disabled:opacity-50 lg:mb-0 mb-8 py-2.5 text-white font-medium text-sm rounded-full flex space-x-1.5 items-center justify-center hover:opacity-80 transition-all duration-300 cursor-pointer"
          >
            <ChartLine className="size-4 text-white" />
            <span>Save Diagram</span>
          </button>
        </>
      )}
    </div>
  );
};

export default CreateDiagram;
