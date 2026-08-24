import React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

const SelectOptions = ({
  name,
  value,
  setValue,
  options,
  placeholder,
  label,
  className,
}: {
  name: string;
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  options: string[];
  placeholder: string;
  label?: string;
  className?: string;
}) => {
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
        <select
          id={name}
          name={name}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className={cn(
            "w-full text-sm outline-none transition-all duration-200 appearance-none",
            "bg-gray-50 border border-gray-200",
            "rounded-2xl py-2.5 px-4 pr-10",
            "focus:border-primary/60 focus:ring-2 focus:ring-primary/10",
            !value ? "text-muted-foreground/50" : "text-foreground",
            className,
          )}
        >
          <option value="" disabled hidden>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/60 pointer-events-none" />
      </div>
    </div>
  );
};

export default SelectOptions;
