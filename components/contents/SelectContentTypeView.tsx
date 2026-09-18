import { ContentType } from "@/types";
import React from "react";
import ModalTitle from "../modal/ModalTitle";
import { contentTypes } from "@/data/colors/typeColors";
import PageButton from "../shared/PageButton";
import { ArrowRight, Check } from "lucide-react";

const SelectContentTypeView = ({
  setCurrentSection,
  contentType,
  setContentType,
}: {
  contentType: ContentType;
  setCurrentSection: React.Dispatch<React.SetStateAction<number>>;
  setContentType: React.Dispatch<React.SetStateAction<ContentType>>;
}) => {
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
            return (
              <div
                onClick={() => setContentType(item.type)}
                title={item.description}
                style={{
                  borderColor: selected ? item.color : `${item.color}40`,
                  backgroundColor: `${item.color}25`,
                }}
                key={item.label}
                className="relative flex cursor-pointer flex-col gap-2.5 rounded-xl border-2 p-4 transition-transform duration-200 hover:scale-[1.02]"
              >
                {selected && (
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
      <div className="w-full flex items-end justify-end lg:pb-0 pb-8">
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
