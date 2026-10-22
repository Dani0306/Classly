import React from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import ModalTitle from "../modal/ModalTitle";
import PageButton from "../shared/PageButton";
import { contentOption } from "@/lib/contentoptions";
import { NEW_CONTENT_TYPES, NewContentType } from "@/lib/contenttypes";
import { cn } from "@/lib/utils";

const SelectContentTypeView = ({
  setCurrentSection,
  contentType,
  setContentType,
}: {
  contentType: NewContentType;
  setCurrentSection: React.Dispatch<React.SetStateAction<number>>;
  setContentType: React.Dispatch<React.SetStateAction<NewContentType>>;
}) => {
  return (
    <div className="flex h-full w-full flex-col gap-8">
      <ModalTitle
        title="New Content"
        description="What do you want to add to this class?"
      />

      <div
        role="radiogroup"
        aria-label="Content type"
        className="grid gap-4 sm:grid-cols-2"
      >
        {NEW_CONTENT_TYPES.map((type, index) => {
          const option = contentOption(type)!;
          const selected = contentType === type;

          return (
            <button
              key={type}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => setContentType(type)}
              onDoubleClick={() => setCurrentSection(2)}
              style={
                {
                  "--tape": `${option.color}d9`,
                  "--tilt": index === 0 ? "-0.6deg" : "0.5deg",
                } as React.CSSProperties
              }
              className={cn(
                // An outline, not a ring: the note's own shadow would hide a ring.
                "note tape tilt flex cursor-pointer flex-col gap-4 p-6 pt-8 text-left outline-offset-4",
                selected
                  ? "outline-2 outline-ink"
                  : "opacity-75 hover:opacity-100",
              )}
            >
              <option.icon className="size-6" strokeWidth={2} />
              <span className="flex flex-col gap-1.5">
                <strong className="text-lg font-bold tracking-tight">
                  {option.label}
                </strong>
                <span className="text-[13px] leading-relaxed text-ink/70">
                  {option.description}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <p className="flex items-start gap-2.5 text-xs leading-relaxed text-muted-foreground">
        <Sparkles className="mt-0.5 size-3.5 shrink-0 text-foreground/80" />
        <span>
          Summaries, quizzes and diagrams are made from a note: open one and
          use its study tools.
        </span>
      </p>

      <div className="mt-auto flex justify-end pb-8 lg:pb-0">
        <PageButton
          onClick={() => setCurrentSection(2)}
          text="Next"
          icon={ArrowRight}
        />
      </div>
    </div>
  );
};

export default SelectContentTypeView;
