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
      className={`lift sheet relative flex cursor-pointer flex-col justify-between gap-8 p-7 ${
        selected
          ? "border-primary bg-primary text-primary-foreground ring-4 ring-highlight/60"
          : ""
      }`}
    >
      {popular && (
        <span className="absolute right-5 top-5 rounded-md bg-highlight px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-foreground">
          Most popular
        </span>
      )}

      <div className="flex flex-col gap-2">
        <strong className="text-sm font-semibold">{name}</strong>
        <span className="flex items-baseline gap-1">
          <strong className="tabular text-5xl font-bold tracking-tight">
            {price}$
          </strong>
          <span
            className={`text-sm ${selected ? "text-primary-foreground/70" : "text-muted-foreground"}`}
          >
            / {billing}
          </span>
        </span>
        <span
          className={`text-sm ${selected ? "text-primary-foreground/70" : "text-muted-foreground"}`}
        >
          {description}
        </span>
      </div>

      <ul
        className={`flex flex-col gap-3 border-t pt-6 ${selected ? "border-primary-foreground/20" : "border-border"}`}
      >
        {features.map((item) => (
          <li key={item} className="flex items-start gap-2.5 text-sm">
            <Check
              className={`mt-0.5 size-4 shrink-0 ${selected ? "text-highlight" : "text-foreground"}`}
              strokeWidth={2.25}
            />
            <span
              className={
                selected ? "text-primary-foreground/85" : "text-foreground/80"
              }
            >
              {item}
            </span>
          </li>
        ))}
      </ul>

      <div className={selected ? "[&_button]:border-highlight [&_button]:bg-highlight [&_button]:text-foreground [&_button:hover]:bg-highlight-soft" : ""}>
        <PageButton text={buttonText} light={!selected} size="lg" />
      </div>
    </div>
  );
};

const LandingPricing = () => {
  const [plan, setPlan] = useState<string>("Pro");

  const { inView, ref } = useInviewCustom();

  return (
    <section
      id="pricing"
      ref={ref}
      className={`mx-auto mt-32 w-full max-w-6xl scroll-mt-24 px-5 lg:px-8 ${inView ? "reveal" : ""}`}
    >
      <div className="flex max-w-xl flex-col gap-4">
        <h2 className="text-balance text-3xl font-bold tracking-tight md:text-4xl">
          Simple, Transparent <span className="marker">Pricing</span>
        </h2>
        <p className="text-base text-muted-foreground">
          Choose the plan that fits your academic journey.
        </p>
      </div>

      <div className="mt-12 grid items-stretch gap-6 md:grid-cols-2 lg:max-w-4xl">
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
    </section>
  );
};

export default LandingPricing;
