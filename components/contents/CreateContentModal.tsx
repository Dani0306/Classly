import { ContentType, Plan } from "@/types";
import { useState } from "react";
import SelectContentTypeView from "./SelectContentTypeView";
import CreateContent from "./CreateContent";
import { useAiUsage } from "@/hooks/ai/useAiUsage";
const CreateContentModal = ({
  classId,
  plan,
}: {
  classId: string;
  plan: Plan;
}) => {
  const [contentType, setContentType] = useState<ContentType>("note");
  const [currentSection, setCurrentSection] = useState(1);

  // What the plan allows, so limits are shown before the form is filled in.
  const usage = useAiUsage();

  return (
    <div className="flex h-full flex-col lg:flex-row space-x-4 space-y-6">
      {currentSection === 1 ? (
        <SelectContentTypeView
          contentType={contentType}
          setContentType={setContentType}
          setCurrentSection={setCurrentSection}
          plan={plan}
        />
      ) : (
        <CreateContent
          classId={classId}
          contentType={contentType}
          usage={usage}
        />
      )}
    </div>
  );
};

export default CreateContentModal;
