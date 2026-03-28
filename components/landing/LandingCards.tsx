"use client";

import { CARDS_INFO } from "@/data/landing/features";
import { useInviewCustom } from "@/hooks/shared/useInViewCustom";
import { LucideIcon } from "lucide-react";

const LandingCard = ({
  title,
  description,
  icon: Icon,
}: {
  title: string;
  description: string;
  icon: LucideIcon;
}) => {
  return (
    <div className="flex flex-col space-y-5 w-75 h-65  border border-gray-300 shadow-xl p-6 rounded-xl">
      <div className="bg-primary/20 rounded-full p-2 w-max">
        <Icon className="size-5 text-green-500" />
      </div>
      <h3 className="text-black font-medium text-base">{title}</h3>
      <p className="text-sm text-gray-600 font-extralight">{description}</p>
    </div>
  );
};

const LandingCards = () => {
  const { inView, ref } = useInviewCustom();

  return (
    <div
      ref={ref}
      className={`flex flex-col space-y-8 mt-24 ${inView && "slide-left"} opacity-0`}
    >
      <div className="flex flex-col space-y-3 max-w-150 px-6 text-center mx-auto mb-12">
        <h2 className="text-black font-semibold text-3xl">
          Streamline Your Learning
        </h2>
        <p className="text-sm text-gray-600 font-extralight">
          Powerful AI tools designed to help students excel without the
          busywork. Focus on concepts, and let Classly handle the structure.
        </p>
      </div>

      <div className="flex gap-8 flex-wrap items-center justify-center mx-auto mt-12">
        {CARDS_INFO.map((item) => (
          <LandingCard
            key={item.title}
            title={item.title}
            description={item.description}
            icon={item.icon}
          />
        ))}
      </div>
    </div>
  );
};

export default LandingCards;
