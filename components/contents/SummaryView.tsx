"use client";

import { useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

const WORDS_PER_MINUTE = 220;

/**
 * A summary as a reader sees it: how long it is and how long it takes to
 * read, a copy button, then the markdown. Double-click edits, like any text.
 */
const SummaryView = ({
  text,
  onEdit,
}: {
  text: string;
  onEdit: () => void;
}) => {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / WORDS_PER_MINUTE));

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      return;
    }
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between gap-3 border-b border-ink/10 pb-3 text-xs text-ink/65">
        <p className="tabular">
          {words} words · {minutes} min read
        </p>
        <button
          type="button"
          onClick={copy}
          aria-live="polite"
          className={cn(
            "press inline-flex cursor-pointer items-center gap-1.5 rounded-[3px] px-2.5 py-1.5 font-semibold hover:bg-ink/[0.06]",
            copied ? "text-[#1a7541]" : "text-ink/75",
          )}
        >
          {copied ? (
            <Check className="size-3.5" strokeWidth={2.5} />
          ) : (
            <Copy className="size-3.5" />
          )}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      <div onDoubleClick={onEdit} className="reading">
        <ReactMarkdown>{text}</ReactMarkdown>
      </div>
    </div>
  );
};

export default SummaryView;
