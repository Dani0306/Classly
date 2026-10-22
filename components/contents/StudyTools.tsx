"use client";

import { useState } from "react";
import {
  BookOpenText,
  HelpCircle,
  Lock,
  LucideIcon,
  Sparkles,
  Workflow,
} from "lucide-react";
import { Content, DiagramType } from "@/types";
import { cn } from "@/lib/utils";
import { AiKind } from "@/lib/ai/kinds";
import { StudyAidType } from "@/lib/contenttypes";
import { SUMMARY_SIZES } from "@/lib/contentforms";
import { diagramTypes } from "@/data/diagram/diagramTypes";
import { useAiUsage } from "@/hooks/ai/useAiUsage";
import { useCreateContent } from "@/hooks/contents/useCreateContent";
import { useModal } from "@/providers/AppModalProvider";
import SelectOptions from "../shared/SelectOptions";
import PageButton from "../shared/PageButton";
import LoadingScreen from "../loading/LoadingScreen";
import AllowanceNote from "./AllowanceNote";

const TOOLS: {
  type: StudyAidType;
  label: string;
  action: string;
  icon: LucideIcon;
  kind: AiKind;
  blurb: string;
  loading: string;
}[] = [
  {
    type: "summarize",
    label: "Summary",
    action: "Make summary",
    icon: BookOpenText,
    kind: "summary",
    blurb: "The key points of this note, at the length you pick.",
    loading: "Summarizing your note ...",
  },
  {
    type: "quiz",
    label: "Quiz",
    action: "Make quiz",
    icon: HelpCircle,
    kind: "quiz",
    blurb: "Up to 10 multiple-choice questions to test yourself on this note.",
    loading: "Writing your quiz ...",
  },
  {
    type: "diagram",
    label: "Diagram",
    action: "Draw diagram",
    icon: Workflow,
    kind: "diagram",
    blurb: "A visual map of this note, in the layout you pick.",
    loading: "Drawing your diagram ...",
  },
];

/** Summary, quiz and diagram, made from a note and saved next to it. */
const StudyTools = ({ content, text }: { content: Content; text: string }) => {
  const usage = useAiUsage();
  const { closeModal } = useModal();
  const { createContentFn, isPending } = useCreateContent();

  const [active, setActive] = useState<StudyAidType | null>(null);
  const [size, setSize] = useState(SUMMARY_SIZES[1]);
  const [diagramType, setDiagramType] = useState<DiagramType>("flowchart");

  const tool = TOOLS.find((item) => item.type === active);

  if (isPending && tool) {
    return (
      <div className="mt-10 py-10">
        <LoadingScreen message={tool.loading} />
      </div>
    );
  }

  const allowance = tool ? usage?.allowances[tool.kind] : undefined;
  // The server enforces limits too; this only avoids a request that would fail.
  const blocked = allowance?.limit != null && allowance.used >= allowance.limit;
  const empty = !text.trim();

  const generate = () => {
    if (!tool || blocked || empty) return;

    createContentFn({
      type: tool.type,
      classId: content.class_id,
      // Summaries get a title from the AI; the others keep the note's.
      title:
        tool.type === "summarize"
          ? content.title
          : `${content.title} · ${tool.label}`,
      text,
      files: [],
      ...(tool.type === "summarize" && { size }),
      ...(tool.type === "diagram" && { diagramType }),
    });
  };

  return (
    <section
      id="study-tools"
      aria-labelledby="study-tools-title"
      className="mt-10 scroll-mt-6 rounded-[3px] bg-ink/[0.045] p-4 md:p-5"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <h3
          id="study-tools-title"
          className="text-sm font-bold tracking-tight text-ink"
        >
          Turn this note into
        </h3>
        <span className="text-xs text-ink/60">Saved to this class</span>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2">
        {TOOLS.map((item) => {
          const selected = active === item.type;
          const locked = usage?.allowances[item.kind].limit === 0;

          return (
            <button
              key={item.type}
              type="button"
              aria-expanded={selected}
              onClick={() => setActive(selected ? null : item.type)}
              className={cn(
                "press flex cursor-pointer flex-col items-start gap-2.5 rounded-[3px] border p-3 text-left transition-[background-color,border-color] duration-150",
                selected
                  ? "border-ink bg-note-paper"
                  : "border-ink/15 bg-note-paper/60 hover:border-ink/35 hover:bg-note-paper",
              )}
            >
              <span className="flex w-full items-center justify-between gap-2">
                <item.icon className="size-4.5" strokeWidth={2} />
                {locked && (
                  <span className="inline-flex items-center gap-1 rounded-[3px] bg-ink px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-note-paper">
                    <Lock className="size-2.5" />
                    Pro
                  </span>
                )}
              </span>
              <span className="text-sm font-semibold text-ink">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>

      {tool && (
        <div key={tool.type} className="unfold mt-5 flex flex-col gap-4">
          <p className="text-[13px] leading-relaxed text-ink/70">
            {tool.blurb}
          </p>

          {tool.type === "summarize" && (
            <SelectOptions
              name="summary-size"
              label="Length"
              placeholder="Medium (150-250 words)"
              options={SUMMARY_SIZES}
              value={size}
              setValue={setSize}
            />
          )}

          {tool.type === "diagram" && (
            <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Diagram layout">
              {diagramTypes.map((item) => {
                const selected = diagramType === item.type;
                return (
                  <button
                    key={item.type}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => setDiagramType(item.type)}
                    className={cn(
                      "press cursor-pointer rounded-[3px] border px-3 py-1.5 text-xs font-semibold",
                      selected
                        ? "border-ink bg-ink text-note-paper"
                        : "border-ink/20 text-ink hover:bg-ink/5",
                    )}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3">
            <AllowanceNote
              kind={tool.kind}
              allowance={allowance}
              onNavigate={closeModal}
            />
            <div className="ml-auto">
              <PageButton
                text={tool.action}
                icon={Sparkles}
                onClick={generate}
                disabled={blocked || empty}
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default StudyTools;
