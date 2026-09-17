import { ContentType } from "@/types";
import { useState } from "react";
import SelectContentTypeView from "./SelectContentTypeView";
import CreateContent from "./CreateContent";
const CreateContentModal = ({ classId }: { classId: string }) => {
  const [contentType, setContentType] = useState<ContentType>("note");
  const [currentSection, setCurrentSection] = useState(1);

  return (
    <div className="flex h-full flex-col lg:flex-row space-x-4 space-y-6">
      {currentSection === 1 ? (
        <SelectContentTypeView
          contentType={contentType}
          setContentType={setContentType}
          setCurrentSection={setCurrentSection}
        />
      ) : (
        <CreateContent classId={classId} contentType={contentType} />
      )}
    </div>
  );
};

export default CreateContentModal;
