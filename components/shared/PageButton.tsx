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
    sm: "px-3 py-1.5 text-xs rounded-xl",
    md: "px-5 py-2.5 text-xs rounded-2xl",
    lg: "px-6 py-3 text-sm rounded-2xl",
  };

  const iconSizes = {
    sm: "size-3",
    md: "size-4",
    lg: "size-5",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        transition-all duration-300 ease-out
        flex items-center gap-2
        justify-center
        ${sizeStyles[size]}
        ${
          disabled
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : light
              ? "bg-white border border-black text-black hover:bg-gray-50 hover:scale-[1.03] cursor-pointer"
              : "bg-primary hover:shadow-[0_0_20px_rgba(34,197,94,0.6)] hover:bg-primary hover:scale-[1.03] cursor-pointer"
        }
      `}
    >
      <span className="font-medium">{text}</span>
      {Icon && <Icon className={iconSizes[size]} />}
    </button>
  );
};

export default PageButton;
