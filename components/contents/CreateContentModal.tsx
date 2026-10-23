import { useState } from "react";
import SelectContentTypeView from "./SelectContentTypeView";
import CreateContent from "./CreateContent";
import { useAiUsage } from "@/hooks/ai/useAiUsage";
import { NewContentType } from "@/lib/contenttypes";

/**
 * Inside a class, `classId` is fixed. From All Materials there is no class
 * yet, so `classes` is passed and the first step asks which one.
 */
const CreateContentModal = ({
  classId,
  classes,
}: {
  classId?: string;
  classes?: { id: string; name: string }[];
}) => {
  const [selectedClassId, setSelectedClassId] = useState(
    classId ?? classes?.[0]?.id ?? "",
  );
  const [contentType, setContentType] = useState<NewContentType>("note");
  const [currentSection, setCurrentSection] = useState(1);

  // What the plan allows, so limits are shown before the form is filled in.
  const usage = useAiUsage();

  return (
    <div className="flex h-full flex-col">
      {currentSection === 1 ? (
        <SelectContentTypeView
          contentType={contentType}
          setContentType={setContentType}
          setCurrentSection={setCurrentSection}
          classes={classId ? undefined : classes}
          classId={selectedClassId}
          setClassId={setSelectedClassId}
        />
      ) : (
        <CreateContent
          classId={selectedClassId}
          contentType={contentType}
          usage={usage}
        />
      )}
    </div>
  );
};

export default CreateContentModal;
