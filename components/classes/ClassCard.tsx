"use client";

import { classIcons } from "@/data/icons/icons";
import { Class } from "@/types";
import ClassDropDownMenu from "./ClassDropDownMenu";
import { useRouter } from "next/navigation";

const ClassCard = ({ item }: { item: Class }) => {
  const Icon = classIcons.find((i) => i.name === item.icon)?.icon;
  const bg = classIcons.find((i) => i.color === item.color)?.color;

  const router = useRouter();

  return (
    <div
      onClick={() => router.push(`/app/class/${item.id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.target !== e.currentTarget) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          router.push(`/app/class/${item.id}`);
        }
      }}
      style={{ "--tape": bg ? `${bg}d9` : undefined } as React.CSSProperties}
      className="note tape tilt group relative w-70 cursor-pointer p-5 pt-6 flex flex-col gap-8"
    >
      <div className="flex items-start justify-between">
        {Icon && (
          <Icon
            style={{ backgroundColor: bg ?? "#ddd" }}
            className="size-10 p-2.5 rounded-[3px] text-ink"
          />
        )}
        <ClassDropDownMenu item={item} />
      </div>

      <div className="flex flex-col gap-1">
        <strong className="font-bold text-lg tracking-tight">{item.name}</strong>
        <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
      </div>
    </div>
  );
};

export default ClassCard;
