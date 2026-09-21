"use client";

import { EllipsisIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { DropDownMenuOptions } from "@/types";

const DropDownMenu = ({ options }: { options: DropDownMenuOptions }) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpen((prev) => !prev);
        }}
        className="p-1 rounded-md hover:bg-gray-100 transition-colors cursor-pointer"
      >
        <EllipsisIcon className="size-5 text-foreground" />
      </button>

      {open && (
        <div className="absolute right-0 top-8 z-50 w-44 bg-white rounded-xl shadow-lg border border-border overflow-hidden">
          {options.map((item) => (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setOpen(false);
                item.fn();
              }}
              key={item.label}
              className="cursor-pointer w-full flex items-center gap-3 pl-10 border py-2.5 text-xs text-foreground hover:bg-gray-50 transition-colors"
            >
              {item.icon && <item.icon className="size-4" />}
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default DropDownMenu;
