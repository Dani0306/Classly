import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Round add-file control with a dark tooltip above it. The tooltip is pure
 * CSS — it reveals on hover and on keyboard focus, so no state is needed.
 */
const AddFilesButton = ({
  onClick,
  label = "Add more files",
  small,
  className,
}: {
  onClick?: () => void;
  label?: string;
  small?: boolean;
  className?: string;
}) => {
  return (
    <div className={cn("group relative inline-flex", className)}>
      <button
        type="button"
        onClick={onClick}
        aria-label={label}
        className={cn(
          "grid place-items-center rounded-full bg-indigo-50 text-indigo-600",
          "ring-4 ring-indigo-50/50 transition-all duration-200",
          "cursor-pointer hover:bg-indigo-100 hover:ring-indigo-100/60",
          "focus-visible:outline-none focus-visible:ring-indigo-300",
          "active:scale-95",
          small ? "size-9" : "size-12",
        )}
      >
        <Plus className={small ? "size-4" : "size-5"} strokeWidth={2.5} />
      </button>

      <span
        role="tooltip"
        className={cn(
          "pointer-events-none absolute bottom-full left-1/2 z-50 mb-3 -translate-x-1/2",
          "whitespace-nowrap rounded-lg bg-[#252b3f] px-3 py-2 text-xs font-medium text-white shadow-lg",
          "opacity-0 transition-opacity duration-200",
          "group-hover:opacity-100 group-focus-within:opacity-100",
        )}
      >
        {label}
        {/* Pointer — a rotated square tucked under the bubble. */}
        <span className="absolute left-1/2 top-full size-2 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-[#252b3f]" />
      </span>
    </div>
  );
};

export default AddFilesButton;
