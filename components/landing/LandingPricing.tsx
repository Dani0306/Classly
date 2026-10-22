"use client";

import { Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { User } from "@supabase/supabase-js";
import PageButton from "../shared/PageButton";
import ModalContainer from "../modal/ModalContainer";
import LoginModal from "../auth/LoginModal";
import { useModal } from "@/providers/AppModalProvider";
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
  onChoose,
}: {
  name: string;
  price: number;
  billing: string;
  description: string;
  popular: boolean;
  buttonText: string;
  features: string[];
  onChoose: () => void;
}) => {
  return (
    <div
      className={`note tape tilt relative flex flex-col justify-between gap-8 p-8 ${popular ? "is-yellow" : ""}`}
    >
      {popular && (
        <span className="absolute right-6 top-6 rounded-[3px] bg-ink px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-note-yellow">
          Most popular
        </span>
      )}

      <div className="flex flex-col gap-2">
        <strong className="text-sm font-bold">{name}</strong>
        <span className="flex items-baseline gap-1">
          <strong className="tabular text-6xl font-extrabold tracking-[-0.04em]">
            {price}$
          </strong>
          <span className="text-sm text-ink/70">/ {billing}</span>
        </span>
        <span className="text-sm text-ink/70">{description}</span>
      </div>

      <ul className="flex flex-col gap-3 border-t border-ink/15 pt-6">
        {features.map((item) => (
          <li key={item} className="flex items-start gap-2.5 text-sm">
            <Check className="mt-0.5 size-4 shrink-0" strokeWidth={2.5} />
            <span className="text-ink/85">{item}</span>
          </li>
        ))}
      </ul>

      <PageButton
        onClick={onChoose}
        text={buttonText}
        light={!popular}
        size="lg"
      />
    </div>
  );
};

const LandingPricing = ({ user }: { user: User | null }) => {
  const { inView, ref } = useInviewCustom();
  const { openModal } = useModal();
  const router = useRouter();

  // Plans start the same way as "Start For Free": sign in, then the app.
  // Upgrading to Pro happens in Settings once signed in.
  const handleChoose = () => {
    if (user) router.push("/app/settings");
    else
      openModal(
        <ModalContainer size="sm">
          <LoginModal />
        </ModalContainer>,
      );
  };

  return (
    <section
      id="pricing"
      ref={ref}
      className={`mx-auto mt-32 grid w-full max-w-7xl scroll-mt-24 gap-14 px-5 lg:grid-cols-12 lg:gap-10 lg:px-10 ${inView ? "reveal" : ""}`}
    >
      <div className="flex flex-col gap-4 lg:sticky lg:top-28 lg:col-span-4 lg:self-start">
        <h2 className="text-balance text-4xl font-extrabold tracking-[-0.03em] md:text-5xl">
          Simple, Transparent Pricing
        </h2>
        <p className="text-base text-muted-foreground">
          Choose the plan that fits your academic journey.
        </p>
      </div>

      <div className="wall grid items-stretch gap-10 md:grid-cols-2 lg:col-span-8">
        {PRICING_INFO.map((item) => (
          <PricingCard
            key={item.name}
            name={item.name}
            price={item.price}
            billing={item.billing}
            description={item.description}
            popular={item.popular}
            buttonText={item.buttonText}
            features={item.features}
            onChoose={handleChoose}
          />
        ))}
      </div>
    </section>
  );
};

export default LandingPricing;
