"use client";

import { Check } from "lucide-react";
import { useState } from "react";
import PageButton from "../shared/PageButton";
import { PRICING_INFO } from "@/data/landing/pricing";
import { useInviewCustom } from "@/hooks/shared/useInViewCustom";

const PricingCard = ({
  name,
  price,
  billing,
  description,
  popular,
  buttonText,
  features,
  selected = false,
  onClick,
}: {
  name: string;
  price: number;
  billing: string;
  description: string;
  popular: boolean;
  buttonText: string;
  features: string[];
  selected: boolean;
  onClick?: () => void;
}) => {
  return (
    <div
      onClick={onClick}
      className={`h-85 transition-all justify-between duration-200 relative cursor-pointer p-6 flex flex-col space-y-6 w-80 shadow-xl border border-gray-300 rounded-2xl ${selected && "scale-105 border-2 border-primary"}`}
    >
      {popular && (
        <div className=" rounded-bl-2xl rounded-tr-2xl right-0 top-0 px-4 py-1 absolute bg-primary text-[7px] font-semibold text-black">
          MOST POPULAR
        </div>
      )}
      <div className="flex flex-col space-y-2">
        <strong className="text-sm font-medium text-black">{name}</strong>
        <span>
          <strong className="text-2xl font-bold text-black">{price}</strong>
          <span className="text-xs font-light text-gray-600"> / {billing}</span>
        </span>
        <span className="text-[10px] font-light text-gray-600">
          {description}
        </span>
      </div>
      <div className="flex flex-col space-y-3">
        {features.map((item) => (
          <div key={item} className="flex space-x-2">
            <div className="bg-primary p-0.5 rounded-full flex items-center justify-center">
              <Check className="size-3 text-white" />
            </div>
            <span className="text-xs font-light text-gray-600">{item}</span>
          </div>
        ))}
      </div>
      <PageButton text={buttonText} light={!selected} />
    </div>
  );
};

const LandingPricing = () => {
  const [plan, setPlan] = useState<string>("University");

  const { inView, ref } = useInviewCustom();

  return (
    <div
      ref={ref}
      className={`flex flex-col my-24 opacity-0 ${inView && "slide-right"}`}
    >
      <div className="flex flex-col space-y-3 max-w-150 px-6 text-center mx-auto">
        <h2 className="text-black font-semibold text-3xl">
          Simple, Transparent Pricing
        </h2>
        <p className="text-sm text-gray-600 font-extralight">
          Choose the plan that fits your academic journey.
        </p>
      </div>
      <div className="mx-auto flex-wrap justify-center items-center flex gap-8 mt-12">
        {PRICING_INFO.map((item) => (
          <PricingCard
            onClick={() => setPlan(item.name)}
            key={item.name}
            name={item.name}
            price={item.price}
            billing={item.billing}
            description={item.description}
            popular={item.popular}
            buttonText={item.buttonText}
            features={item.features}
            selected={plan === item.name}
          />
        ))}
      </div>
    </div>
  );
};

export default LandingPricing;
