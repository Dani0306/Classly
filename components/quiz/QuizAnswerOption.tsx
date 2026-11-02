import { cn } from "@/lib/utils";

export const OPTION_KEYS = ["A", "B", "C", "D"];

/** One choice: a paper strip with its letter key. Picked means highlighted and inked in. */
const QuizAnswerOption = ({
  answer,
  index,
  isSelected,
  disabled,
  onSelect,
}: {
  answer: string;
  index: number;
  isSelected: boolean;
  disabled: boolean;
  onSelect: () => void;
}) => (
  <button
    type="button"
    role="radio"
    aria-checked={isSelected}
    disabled={disabled}
    onClick={onSelect}
    className={cn(
      "quiz-option group flex w-full cursor-pointer items-start gap-3.5 rounded-[3px] border px-4 py-3.5 text-left disabled:cursor-default",
      isSelected
        ? "border-ink bg-highlight-soft shadow-[inset_0_0_0_1px_var(--ink)]"
        : "border-ink/15 bg-note-paper hover:border-ink/35 hover:bg-white",
    )}
  >
    <span
      aria-hidden
      className={cn(
        "grid size-6 shrink-0 place-items-center rounded-[3px] text-[11px] font-bold transition-colors duration-150",
        isSelected
          ? "bg-ink text-note-yellow"
          : "bg-ink/[0.07] text-ink/70 group-hover:bg-ink/[0.12]",
      )}
    >
      {OPTION_KEYS[index]}
    </span>
    <span className="pt-0.5 text-[15px] leading-snug text-ink [overflow-wrap:anywhere]">
      {answer}
    </span>
  </button>
);

export default QuizAnswerOption;
