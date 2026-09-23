import { ContentType } from "@/types";
import React from "react";
import ModalTitle from "../modal/ModalTitle";
import { contentTypes } from "@/data/colors/typeColors";
import PageButton from "../shared/PageButton";
import { ArrowRight, Check, Lock } from "lucide-react";
import { AI_KIND_BY_CONTENT_TYPE } from "@/lib/ai/kinds";
import type { AiUsageSummary } from "@/actions/ai/getMyAiUsage";
import { cn } from "@/lib/utils";

const SelectContentTypeView = ({
  setCurrentSection,
  contentType,
  setContentType,
  usage,
}: {
  contentType: ContentType;
  setCurrentSection: React.Dispatch<React.SetStateAction<number>>;
  setContentType: React.Dispatch<React.SetStateAction<ContentType>>;
  usage: AiUsageSummary | null;
}) => {
  // A limit of 0 means the plan doesn't include that type at all.
  const isLocked = (type: ContentType) => {
    if (!usage || type === "class") return false;

    const kind = AI_KIND_BY_CONTENT_TYPE[type];
    return usage.allowances[kind]?.limit === 0;
  };

  return (
    <div className="w-full h-full flex flex-col space-y-6">
      <ModalTitle
        title="New Content"
        description="What type of content do you want to create?"
      />
      <div className="flex-1">
        {/* Auto-fitting columns keep every type on screen as the list grows,
            instead of wrapping fixed-width cards into a scrolling stack. */}
        <div className="grid auto-rows-fr grid-cols-2 gap-3 md:grid-cols-3">
          {contentTypes.map((item) => {
            const selected = contentType === item.type;
            const locked = isLocked(item.type);

            return (
              <div
                onClick={() => {
                  if (!locked) setContentType(item.type);
                }}
                title={item.description}
                style={{
                  borderColor: selected ? item.color : `${item.color}40`,
                  backgroundColor: `${item.color}25`,
                }}
                key={item.label}
                className={cn(
                  "relative flex flex-col gap-2.5 rounded-xl border-2 p-4 transition-transform duration-200",
                  locked
                    ? "cursor-not-allowed opacity-60"
                    : "cursor-pointer hover:scale-[1.02]",
                )}
              >
                {locked && (
                  <span className="absolute right-2 top-2 flex items-center gap-1 rounded-lg bg-foreground/80 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-white">
                    <Lock className="size-2.5" />
                    Pro
                  </span>
                )}
                {selected && !locked && (
                  <Check
                    style={{
                      backgroundColor: item.color,
                      color: "white",
                    }}
                    className="absolute size-5 top-2 right-2 p-1 rounded-lg"
                  />
                )}
                <item.icon
                  style={{
                    backgroundColor: `${item.color}40`,
                    color: item.color,
                  }}
                  className="size-9 shrink-0 p-2 rounded-lg"
                />
                <div className="flex flex-col gap-1">
                  <strong className="font-medium text-foreground text-sm leading-tight">
                    {item.label}
                  </strong>
                  <p className="text-[11px] font-light leading-snug text-foreground/60 line-clamp-2">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="w-full flex flex-wrap items-center justify-between gap-3 lg:pb-0 pb-8">
        {usage?.plan === "starter" ? (
          <p className="text-[11px] font-light text-foreground/50">
            Quizzes and diagrams are included in Pro.
          </p>
        ) : (
          <span />
        )}
        <PageButton
          onClick={() => setCurrentSection(2)}
          text="Next"
          icon={ArrowRight}
          disabled={isLocked(contentType)}
        />
      </div>
    </div>
  );
};

export default SelectContentTypeView;
