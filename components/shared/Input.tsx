import React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

const Input = ({
  placeholder,
  name,
  value,
  setValue,
  icon: Icon,
  className,
  label,
  textarea,
  rows = 3,
}: {
  placeholder: string;
  name: string;
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  icon?: LucideIcon;
  className?: string;
  label?: string;
  textarea?: boolean;
  rows?: number;
}) => {
  const sharedClasses = cn(
    "w-full text-sm text-foreground outline-none transition-all duration-200",
    "bg-gray-50 border border-gray-200",
    "placeholder:text-muted-foreground/50",
    "focus:border-primary/60 focus:ring-2 focus:ring-primary/10",
    textarea ? "rounded-2xl resize-none py-3" : "rounded-2xl py-2.5",
    Icon ? "pl-10 pr-4" : "px-4",
    className,
  );

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label
          htmlFor={name}
          className="text-xs font-medium text-foreground/70 tracking-wide"
        >
          {label}
        </label>
      )}
      <div className="relative w-full">
        {Icon && (
          <Icon
            className={cn(
              "absolute left-3.5 size-4 text-muted-foreground/60 pointer-events-none",
              textarea ? "top-3.5" : "top-1/2 -translate-y-1/2",
            )}
          />
        )}
        {textarea ? (
          <textarea
            id={name}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className={sharedClasses}
            placeholder={placeholder}
            name={name}
            rows={rows}
          />
        ) : (
          <input
            id={name}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            type="text"
            className={sharedClasses}
            placeholder={placeholder}
            name={name}
          />
        )}
      </div>
    </div>
  );
};

export default Input;
