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

const PageButton = ({
  text,
  icon: Icon,
  light,
  size = "md",
  onClick,
  disabled = false,
}: PageButtonProps) => {
  const sizeStyles = {
    sm: "px-3 py-1.5 text-xs rounded-md",
    md: "px-4 py-2.5 text-xs rounded-lg",
    lg: "px-6 py-3.5 text-sm rounded-lg",
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
        press flex items-center justify-center gap-2 font-medium
        ${sizeStyles[size]}
        ${
          disabled
            ? "cursor-not-allowed border border-border bg-surface-muted text-muted-foreground"
            : light
              ? "cursor-pointer border border-foreground/80 bg-surface text-foreground hover:bg-highlight-soft"
              : "cursor-pointer border border-primary bg-primary text-primary-foreground hover:bg-primary-hover"
        }
      `}
    >
      <span>{text}</span>
      {Icon && <Icon className={iconSizes[size]} />}
    </button>
  );
};

export default PageButton;
