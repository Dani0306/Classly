"use client";
import { Content } from "@/types";
import { contentTypes } from "@/data/colors/typeColors";
import { TypeBadge } from "../contents/ContentCard";
import PriorityBadge from "../shared/PriorityBadge";
import DateBadge from "../shared/DateBadge";
import {
  Calendar,
  CircleCheckBig,
  Flag,
  Info,
  RefreshCcw,
  Trash2,
} from "lucide-react";
import { formatDate, formatText } from "@/utils/fn";
import { useModal } from "@/providers/AppModalProvider";
import { useMarkAsCompleted } from "@/hooks/contents/useMarkAsCompleted";
import LoadingScreen from "../loading/LoadingScreen";

const ShowHomework = ({ content }: { content: Content }) => {
  const itemContent = contentTypes.find((item) => item.type === content.type)!;
  const { closeModal } = useModal();

  const { markAsCompleted, isPending } = useMarkAsCompleted(
    content.is_completed ?? false,
    content.id,
  );

  return (
    <>
      {isPending ? (
        <div className="flex items-center justify-center w-full h-full">
          <LoadingScreen message="Changing content status ..." />
        </div>
      ) : (
        <div className="w-full h-full flex flex-col">
          <div className="relative flex items-center justify-between h-[25%]  p-6 overflow-hidden">
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
                  <PriorityBadge
                    filled
                    priority={content.priority ?? "medium"}
                  />
                </div>
              </div>
            </div>

            <div className="relative z-10">
              <DateBadge timestamp={content.due_date ?? content.created_at} />
            </div>
          </div>

          <div className="flex flex-1 flex-col p-6 space-y-6">
            <div className="bg-purple-800/10 rounded-xl p-6 flex space-x-3">
              <Info className="text-purple-600 size-12" />
              <div className="flex flex-col space-y-2">
                <strong className="text-purple-600 font-bold text-sm">
                  About this homework
                </strong>
                <p className="text-xs text-foreground font-light leading-relaxed">
                  {content.content ?? content.ai_output}
                </p>
              </div>
            </div>
            <div className="flex flex-col space-y-3">
              <span className="text-xs font-medium text-foreground/80">
                Details
              </span>
              <div className="flex flex-col rounded-xl border border-foreground/30 bg-[#cccc]/10 p-4">
                <div className="flex items-center justify-between pb-4 px-4 border-b border-foreground/20">
                  <div className="flex space-x-3 items-center">
                    <Calendar className="size-5 text-purple-600" />
                    <span className="font-medium text-xs text-foreground/80">
                      Due Date
                    </span>
                  </div>
                  <span className="font-medium text-foreground/80 text-xs">
                    {formatDate(content.due_date ?? content.created_at)}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-4 px-4">
                  <div className="flex space-x-3 items-center">
                    <Flag className="size-5 text-purple-600" />
                    <span className="font-medium text-xs text-foreground/80">
                      Priority
                    </span>
                  </div>
                  <span className="font-medium text-foreground/80 text-xs">
                    {formatText(content.priority ?? "Medium")}
                  </span>
                </div>
              </div>
            </div>
            {content.is_completed ? (
              <div className="flex py-3 bg-green-500 items-center border-green-500 justify-center border-2 rounded-xl">
                <div className="flex items-center justify-center space-x-2">
                  <CircleCheckBig className="size-5 text-white" />
                  <strong className="text-sm font-medium text-white">
                    Task Completed
                  </strong>
                </div>
              </div>
            ) : (
              <button
                onClick={markAsCompleted}
                className="flex flex-col py-3 space-y-1 cursor-pointer border-green-500 hover:bg-green-50 transition-all duration-500 items-center justify-center border-2 rounded-xl"
              >
                <div className="flex items-center justify-center space-x-2">
                  <CircleCheckBig className="size-5 text-green-500" />
                  <strong className="text-sm font-medium text-green-500">
                    Mark as completed
                  </strong>
                </div>
                <span className="text-foreground/50 font-medium text-xs">
                  You can undo this later.
                </span>
              </button>
            )}
          </div>

          <div className="flex items-center justify-between p-6">
            <div className="flex space-x-3">
              <button className="cursor-pointer hover:bg-orange-50 transition-all duration-500 rounded-xl text-sm font-medium text-red-600 flex items-center space-x-3 justify-center h-full px-6 py-2 border border-red-600">
                <Trash2 className="size-4" />
                <span>Delete</span>
              </button>
              {content.is_completed && (
                <button
                  onClick={markAsCompleted}
                  className="cursor-pointer hover:bg-blue-50 transition-all duration-500 rounded-xl text-sm font-medium text-blue-600 flex items-center space-x-3 justify-center h-full px-6 py-2 border border-blue-600"
                >
                  <RefreshCcw className="size-4" />
                  <span>Reopen</span>
                </button>
              )}
            </div>
            <button
              onClick={closeModal}
              className="cursor-pointer rounded-xl text-sm font-medium text-foreground/80 h-full px-6 py-2 border border-black"
            >
              Back
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ShowHomework;
