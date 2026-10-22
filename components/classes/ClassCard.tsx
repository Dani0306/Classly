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
      className="lift sheet group relative w-70 cursor-pointer overflow-hidden p-5 flex flex-col gap-8"
    >
      <span
        aria-hidden
        style={{ backgroundColor: bg ?? "#c9d3c6" }}
        className="absolute inset-x-0 top-0 h-1.5"
      />
      <div className="flex items-start justify-between">
        {Icon && (
          <Icon
            style={{ backgroundColor: bg ?? "#ddd" }}
            className="size-10 p-2.5 rounded-md text-foreground"
          />
        )}
        <ClassDropDownMenu item={item} />
      </div>

      <div className="flex flex-col gap-1">
        <strong className="font-semibold text-base text-foreground">{item.name}</strong>
        <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
      </div>
    </div>
  );
};

export default ClassCard;
