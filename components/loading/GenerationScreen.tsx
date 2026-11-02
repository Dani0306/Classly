"use client";

import { useEffect, useState } from "react";
import { AiKind } from "@/lib/ai/kinds";
import { typeColor } from "@/lib/contentoptions";
import { ContentType } from "@/types";

const KINDS: Record<
  AiKind,
  { type: ContentType; title: string; phases: string[]; hint: string }
> = {
  grammar: {
    type: "note",
    title: "Polishing your note",
    phases: ["Reading what you wrote", "Fixing spelling and grammar"],
    hint: "Usually a few seconds.",
  },
  summary: {
    type: "summarize",
    title: "Making your summary",
    phases: [
      "Reading your note",
      "Picking out the key points",
      "Writing the summary",
    ],
    hint: "Usually under 20 seconds.",
  },
  quiz: {
    type: "quiz",
    title: "Making your quiz",
    phases: [
      "Reading your note",
      "Choosing what to ask",
      "Writing the questions",
    ],
    hint: "Usually under 30 seconds.",
  },
  diagram: {
    type: "diagram",
    title: "Drawing your diagram",
    phases: [
      "Reading your note",
      "Planning the layout",
      "Drawing the diagram",
    ],
    hint: "Diagrams can take up to a minute.",
  },
};

/** How long each phase of the status line stays up before the next. */
const PHASE_MS = 5000;

/** Written lines: a note being typed out, line by line. */
const LinesScene = ({ highlight }: { highlight?: boolean }) => (
  <div className="flex flex-col gap-3">
    <span className="gen-line h-2.5 w-2/5 bg-ink" style={{ animationDelay: "0ms" }} />
    {[100, 92, 100, 64].map((width, i) => (
      <span
        key={i}
        className="relative h-2 rounded-[2px]"
        style={{ width: `${width}%` }}
      >
        {highlight && (i === 1 || i === 3) && (
          <span
            className="gen-mark absolute -inset-y-0.5 inset-x-0 bg-note-yellow"
            style={{ animationDelay: `${600 + i * 300}ms` }}
          />
        )}
        <span
          className="gen-line absolute inset-0 bg-ink/70"
          style={{ animationDelay: `${(i + 1) * 260}ms` }}
        />
      </span>
    ))}
  </div>
);

/** A question and its options, picked one after another. */
const QuizScene = () => (
  <div className="flex flex-col gap-3">
    <span className="gen-line h-2.5 w-3/4 bg-ink" />
    {[0, 1, 2].map((i) => (
      <span
        key={i}
        className="relative flex h-6 items-center gap-2 overflow-hidden rounded-[3px] border border-ink/20 px-1.5"
      >
        <span
          className="gen-pick absolute inset-0 bg-highlight-soft"
          style={{ animationDelay: `${i * 1500}ms` }}
        />
        <span className="relative size-3 shrink-0 rounded-[2px] bg-ink/20" />
        <span className="relative h-1.5 flex-1 rounded-[2px] bg-ink/45" style={{ maxWidth: `${72 - i * 14}%` }} />
      </span>
    ))}
  </div>
);

/** A root and two branches: nodes settle in and the edges draw to them. */
const DiagramScene = () => (
  <svg viewBox="0 0 200 110" className="block w-full text-ink" aria-hidden>
    {[
      "M100 30 C100 48 46 46 46 68",
      "M100 30 C100 48 154 46 154 68",
    ].map((d, i) => (
      <path
        key={i}
        d={d}
        pathLength={1}
        fill="none"
        stroke="currentColor"
        strokeOpacity={0.55}
        strokeWidth={1.75}
        strokeLinecap="round"
        className="gen-edge"
        style={{ animationDelay: `${500 + i * 250}ms` }}
      />
    ))}
    {[
      { x: 70, y: 6, w: 60, fill: "var(--note-yellow)", delay: 0 },
      { x: 16, y: 68, w: 60, fill: "var(--note-blue)", delay: 900 },
      { x: 124, y: 68, w: 60, fill: "var(--note-pink)", delay: 1150 },
    ].map((n, i) => (
      <rect
        key={i}
        x={n.x}
        y={n.y}
        width={n.w}
        height={24}
        rx={3}
        fill={n.fill}
        stroke="currentColor"
        strokeOpacity={0.7}
        strokeWidth={1.5}
        className="gen-node"
        style={{ animationDelay: `${n.delay}ms` }}
      />
    ))}
  </svg>
);

/**
 * Shown while an AI generation runs, which takes seconds to a minute. A small
 * paper note acts out what is being made, and the status line moves through
 * the stages without pretending to know a percentage.
 */
const GenerationScreen = ({ kind }: { kind: AiKind }) => {
  const { type, title, phases, hint } = KINDS[kind];
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const id = setInterval(
      () => setPhase((p) => Math.min(p + 1, phases.length - 1)),
      PHASE_MS,
    );
    return () => clearInterval(id);
  }, [phases.length]);

  return (
    <div className="flex flex-col items-center gap-7 py-6">
      <div
        aria-hidden
        className="gen-sheet relative w-60 -rotate-1 rounded-[3px] bg-note-paper p-5 pt-7 shadow-[0_1px_0_rgba(0,0,0,0.14),0_18px_28px_-16px_rgba(0,0,0,0.55)] motion-reduce:rotate-0"
        style={{ "--tape": `${typeColor(type)}d9` } as React.CSSProperties}
      >
        <span className="sheet-tape" />
        <div className="h-28 overflow-hidden">
          {kind === "quiz" ? (
            <QuizScene />
          ) : kind === "diagram" ? (
            <DiagramScene />
          ) : (
            <LinesScene highlight={kind === "grammar"} />
          )}
        </div>
      </div>

      <div role="status" className="flex flex-col items-center gap-1.5 text-center">
        <p className="text-base font-bold tracking-[-0.02em] text-ink">{title}</p>
        <p key={phase} className="gen-phase text-sm text-ink/75">
          {phases[phase]} …
        </p>
        <p className="text-xs text-ink/55">{hint}</p>
      </div>
    </div>
  );
};

export default GenerationScreen;
