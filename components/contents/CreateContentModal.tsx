import { ContentType } from "@/types";
import { ReactNode, useState } from "react";
import SelectContentTypeView from "./SelectContentTypeView";
import GrammarCorrection from "../grammar/CreateGrammarCorrection";
import CreateSummary from "../summary/CreateSummary";

import CreateQuiz from "../quiz/CreateQuiz";
import CreateReminder from "../reminder/CreateReminder";
import CreateHomework from "../homework/CreateHomework";
import CreateDiagram from "../diagram/CreateDiagram";

const CreateContentModal = ({ classId }: { classId: string }) => {
  const [contentType, setContentType] = useState<ContentType>("note");
  const [currentSection, setCurrentSection] = useState(1);
  const contentToDisplay = () =>
    (
      {
        note: <GrammarCorrection classId={classId} />,
        summarize: <CreateSummary classId={classId} />,
        reminder: <CreateReminder classId={classId} />,
        homework: <CreateHomework classId={classId} />,
        quiz: <CreateQuiz classId={classId} />,
        diagram: <CreateDiagram classId={classId} />,
      } as Partial<Record<ContentType, ReactNode>>
    )[contentType];

  return (
    <div className="flex h-full flex-col lg:flex-row space-x-4 space-y-6">
      {currentSection === 1 ? (
        <SelectContentTypeView
          setCurrentSection={setCurrentSection}
          contentType={contentType}
          setContentType={setContentType}
        />
      ) : (
        <>{contentToDisplay()}</>
      )}
    </div>
  );
};

export default CreateContentModal;
