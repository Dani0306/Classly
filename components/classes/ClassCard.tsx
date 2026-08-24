"use client";

import { classColors } from "@/data/colors/colors";
import { classIcons } from "@/data/icons/icons";
import { Class } from "@/types";
import ClassDropDownMenu from "./ClassDropDownMenu";
import { useRouter } from "next/navigation";

const ClassCard = ({ item }: { item: Class }) => {
  const Icon = classIcons.find((i) => i.name === item.icon)?.icon;
  const bg = classColors.find((i) => i.color === item.color)?.color;

  const router = useRouter();

  return (
    <div
      onClick={() => router.push(`/app/class/${item.id}`)}
      style={{ borderColor: bg ?? "#ddd" }}
      className="cursor-pointer p-6 flex flex-col space-y-6 w-85 shadow-xl rounded-xl border-l-5 hover:scale-[1.03] transition-all duration-200"
    >
      <div className="flex items-start justify-between">
        {Icon && (
          <Icon
            style={{ backgroundColor: bg ?? "#ddd" }}
            className="size-12 p-3 rounded-xl"
          />
        )}
        <ClassDropDownMenu item={item} />
      </div>

      <div className="flex flex-col space-y-1">
        <strong className="font-bold text-black">{item.name}</strong>
        <p className="text-xs font-light text-foreground">{item.description}</p>
      </div>
    </div>
  );
};

export default ClassCard;
