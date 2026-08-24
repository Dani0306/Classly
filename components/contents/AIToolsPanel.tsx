import { noteModalCards } from "@/data/noteModal/noteModalCards";
import { cn } from "@/lib/utils";
import { ArrowRight, Sparkles } from "lucide-react";
import React from "react";

const AIToolsPanel = ({
  setAItask,
  AItask,
  generate,
}: {
  AItask: string;
  setAItask: React.Dispatch<React.SetStateAction<string>>;
  generate: () => void;
}) => {
  return (
    <div className="mt-8 md:mt-0 w-full lg:w-[35%] bg-green-600/20 p-5 md:p-6 rounded-xl flex flex-col space-y-8">
      {/* Header */}
      <div className="flex flex-col space-y-3">
        <h2 className="text-xl md:text-2xl font-semibold text-green-700 flex items-center space-x-2">
          <Sparkles className="size-6" />
          <span>AI Tools</span>
        </h2>
        <p className="text-xs text-foreground/60 font-light">
          Select the tools you need and let AI transform your notes into
          structured insights.
        </p>
      </div>

      {/* Cards — flex-1 pushes button down */}
      <div className="flex-1 flex flex-wrap items-center justify-center gap-4 content-start">
        {noteModalCards.map((item) => {
          const active = AItask === item.title;
          return (
            <div
              onClick={() => setAItask(item.title)}
              key={item.title}
              className={cn(
                "max-w-35 flex flex-col space-y-2 p-4 bg-white rounded-xl cursor-pointer",
                active && "border border-green-600",
              )}
            >
              <item.icon className="size-6 text-green-700" />
              <h3 className="font-semibold text-green-600 text-sm">
                {item.title}
              </h3>
              <p className="text-foreground/60 font-light text-[10px]">
                {item.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Button — naturally sits at the bottom */}
      <button
        onClick={generate}
        className="cursor-pointer self-end px-6 py-2.5 rounded-full bg-primary flex items-center space-x-2 text-sm hover:shadow-[0_0_20px_rgba(34,197,94,0.6)]"
      >
        <span>Generate</span>
        <ArrowRight className="size-4 p-0.5 rounded-full bg-foreground text-white" />
      </button>
    </div>
  );
};

export default AIToolsPanel;
