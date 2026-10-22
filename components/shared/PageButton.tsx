import { LucideIcon } from "lucide-react";

type ButtonSize = "sm" | "md" | "lg";

interface PageButtonProps {
  text: string;
  icon?: LucideIcon;
  light?: boolean;
  size?: ButtonSize;
  onClick?: () => void;
  disabled?: boolean;
}

/** A small paper note you press: lime for the main action, plain paper otherwise. */
const PageButton = ({
  text,
  icon: Icon,
  light,
  size = "md",
  onClick,
  disabled = false,
}: PageButtonProps) => {
  const sizeStyles = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2.5 text-xs",
    lg: "px-6 py-4 text-sm",
  };

  const iconSizes = {
    sm: "size-3",
    md: "size-4",
    lg: "size-4.5",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        press flex items-center justify-center gap-2 rounded-[3px] font-semibold text-ink
        shadow-[0_1px_0_rgba(0,0,0,0.14),0_10px_18px_-10px_rgba(0,0,0,0.5)]
        ${sizeStyles[size]}
        ${
          disabled
            ? "cursor-not-allowed bg-note-paper/60 text-ink/50 shadow-none"
            : light
              ? "cursor-pointer border border-ink/15 bg-note-paper hover:bg-white"
              : "cursor-pointer bg-note-lime hover:bg-[#b8f774]"
        }
      `}
    >
      <span>{text}</span>
      {Icon && <Icon className={iconSizes[size]} />}
    </button>
  );
};

export default PageButton;
