"use client";

import { EllipsisIcon, Pencil, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Class } from "@/types";
import { useDeleteClass } from "@/hooks/classes/useDeleteClass";

const ClassDropDownMenu = ({ item }: { item: Class }) => {
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

  const { handleDelete } = useDeleteClass(item);

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
          <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-gray-50 transition-colors">
            <Pencil className="size-4 text-muted-foreground" />
            Edit
          </button>
          <div className="mx-4 h-px bg-border" />
          <button
            onClick={handleDelete}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
          >
            <Trash2 className="size-4" />
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default ClassDropDownMenu;
