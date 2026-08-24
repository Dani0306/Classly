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
    <div className="w-full h-full flex flex-col space-y-8">
      <ModalTitle
        title="New Content"
        description="What type of content do you want to create?"
      />
      <div className="flex flex-1">
        <div className="flex h-max gap-6 flex-wrap items-center justify-center">
          {contentTypes.map((item) => {
            const selected = contentType === item.type;
            return (
              <div
                onClick={() => setContentType(item.type)}
                style={{
                  borderColor: selected ? item.color : `${item.color}40`,
                  backgroundColor: `${item.color}25`,
                }}
                key={item.label}
                className="p-6 w-65 min-h-25 rounded-xl border-2 cursor-pointer relative"
              >
                {selected && (
                  <Check
                    style={{
                      backgroundColor: item.color,
                      color: "white",
                    }}
                    className="absolute size-6 top-3 right-3 p-1 border rounded-xl"
                  />
                )}
                <div className="flex space-x-4 items-start">
                  <item.icon
                    style={{
                      backgroundColor: `${item.color}40`,
                      color: item.color,
                    }}
                    className="w-18 h-12 p-2 rounded-xl"
                  />
                  <div className="flex flex-col space-y-2">
                    <strong className="font-medium text-foreground text-sm">
                      {item.label}
                    </strong>
                    <p className="text-xs font-light text-foreground/60">
                      {item.description}
                    </p>
                  </div>
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
