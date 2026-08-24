"use client";

import ReactMarkdown from "react-markdown";

const AIOutputSmall = ({ content }: { content: string }) => {
  const getText = () => {
    try {
      return JSON.parse(content)?.text ?? content;
    } catch {
      return content;
    }
  };

  return (
    <div className="max-h-32 overflow-y-auto rounded-xl prose prose-sm max-w-none text-foreground/60 font-light text-xs">
      <ReactMarkdown>{getText()}</ReactMarkdown>
    </div>
  );
};

export default AIOutputSmall;
