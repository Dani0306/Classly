import { Content } from "@/types";
import Image from "next/image";
import DateBadge from "../shared/DateBadge";
import PriorityBadge from "../shared/PriorityBadge";
import { TypeBadge } from "../contents/ContentCard";
import { contentTypes } from "@/data/colors/typeColors";
import { Trash2 } from "lucide-react";
import { useModal } from "@/providers/AppModalProvider";

const ShowDiagram = ({ content }: { content: Content }) => {
  const itemContent = contentTypes.find((item) => item.type === content.type)!;

  const { closeModal } = useModal();

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

          <div className="relative z-10">
            <DateBadge timestamp={content.due_date ?? content.created_at} />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="relative w-full h-full rounded-2xl overflow-hidden bg-white">
          <Image
            src={content.ai_output!}
            alt="Diagram"
            fill
            className="object-contain"
          />
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

export default ShowDiagram;
