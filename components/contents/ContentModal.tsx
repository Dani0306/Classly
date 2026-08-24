import { Content } from "@/types";
import SummaryGrammarContent from "../summary/SummaryGrammarNote";
import QuizComponent from "../quiz/QuizComponent";
import ShowReminder from "../reminder/ShowReminder";
import ShowHomework from "../homework/ShowHomework";
import ShowDiagram from "../diagram/ShowDiagram";

const ContentModal = ({ content }: { content: Content }) => {
  const displayContent = () =>
    ({
      note: <SummaryGrammarContent content={content} />,
      summarize: <SummaryGrammarContent content={content} />,
      quiz: <QuizComponent content={content} />,
      homework: <ShowHomework content={content} />,
      reminder: <ShowReminder content={content} />,
      diagram: <ShowDiagram content={content} />,
    })[content.type ?? "note"];

  return <>{displayContent()}</>;
};

export default ContentModal;
