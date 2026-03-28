import { LucideIcon } from "lucide-react";

type ButtonSize = "sm" | "md" | "lg";

interface PageButtonProps {
  text: string;
  icon?: LucideIcon;
  light?: boolean;
  size?: ButtonSize;
  onClick?: () => void;
}

const PageButton = ({
  text,
  icon: Icon,
  light,
  size = "md",
  onClick,
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
      className={`
        transition-all duration-300 ease-out
        cursor-pointer
        flex items-center gap-2
        hover:scale-[1.03]
        justify-center
        ${sizeStyles[size]}
        ${
          light
            ? "bg-white border border-black text-black hover:bg-gray-50"
            : `
              bg-primary
              hover:shadow-[0_0_20px_rgba(34,197,94,0.6)]
              hover:bg-primary
            `
        }
      `}
    >
      <span className="font-medium">{text}</span>
      {Icon && <Icon className={iconSizes[size]} />}
    </button>
  );
};

export default PageButton;
