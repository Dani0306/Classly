"use client";

import ReactMarkdown from "react-markdown";

const AIOutput = ({ content }: { content: string }) => {
  const getText = () => {
    try {
      return JSON.parse(content)?.text ?? content;
    } catch {
      return content;
    }
  };

  return (
    <div className="rounded-xl space-y-3 text-xs text-foreground/70 font-light leading-relaxed">
      <ReactMarkdown
        components={{
          p: ({ children }) => (
            <p className="text-xs text-foreground/70 leading-relaxed mb-3">
              {children}
            </p>
          ),
          strong: ({ children }) => (
            <strong className="!font-semibold !text-foreground">
              {children}
            </strong>
          ),
          ul: ({ children }) => (
            <ul className="list-disc list-inside space-y-1.5 text-foreground/70 mb-3">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside space-y-1.5 text-foreground/70 mb-3">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="text-xs leading-relaxed">{children}</li>
          ),
          h1: ({ children }) => (
            <h1 className="text-sm !font-semibold text-foreground mb-2">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-sm !font-semibold text-foreground mb-2">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-xs !font-semibold text-foreground mb-1">
              {children}
            </h3>
          ),
        }}
      >
        {getText()}
      </ReactMarkdown>
    </div>
  );
};

export default AIOutput;
