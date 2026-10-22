import { ViewType } from "@/types";
import { cn } from "@/lib/utils";

/**
 * Content / Attachments switch for a note sheet. Switched often, so it
 * changes instantly: the ink underline moves without animating.
 */
const SheetTabs = ({
  value,
  onChange,
  contentLabel,
  attachments,
}: {
  value: ViewType;
  onChange: (value: ViewType) => void;
  contentLabel: string;
  attachments: number;
}) => {
  const tabs: { id: ViewType; label: string; count?: number }[] = [
    { id: "content", label: contentLabel },
    { id: "attachments", label: "Attachments", count: attachments },
  ];

  return (
    <div role="tablist" className="flex gap-6 border-b border-ink/15">
      {tabs.map((tab) => {
        const selected = value === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(tab.id)}
            className={cn(
              "-mb-px flex cursor-pointer items-center gap-1.5 border-b-2 pb-2.5 text-sm font-semibold transition-colors duration-150",
              selected
                ? "border-ink text-ink"
                : "border-transparent text-ink/55 hover:text-ink",
            )}
          >
            {tab.label}
            {tab.count != null && tab.count > 0 && (
              <span className="tabular rounded-[3px] bg-ink/[0.08] px-1.5 text-[11px] leading-5">
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default SheetTabs;
