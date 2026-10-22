"use client";

import { CARDS_INFO } from "@/data/landing/features";
import { useInviewCustom } from "@/hooks/shared/useInViewCustom";

const LandingCards = () => {
  const { inView, ref } = useInviewCustom();

  return (
    <section
      id="features"
      ref={ref}
      className={`mx-auto mt-28 grid w-full max-w-6xl scroll-mt-24 gap-12 px-5 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16 lg:px-8 ${inView ? "reveal" : ""}`}
    >
      <div className="flex flex-col gap-4 lg:sticky lg:top-28 lg:self-start">
        <h2 className="text-balance text-3xl font-bold tracking-tight md:text-4xl">
          Streamline Your <span className="marker">Learning</span>
        </h2>
        <p className="max-w-md text-base leading-relaxed text-muted-foreground">
          Powerful AI tools designed to help students excel without the
          busywork. Focus on concepts, and let Classly handle the structure.
        </p>
      </div>

      <ul className="flex flex-col border-t border-foreground/80">
        {CARDS_INFO.map((item) => (
          <li
            key={item.title}
            className="flex gap-5 border-b border-border py-7"
          >
            <span className="grid size-11 shrink-0 place-items-center rounded-lg border border-foreground/80 bg-surface">
              <item.icon className="size-5" strokeWidth={1.75} />
            </span>
            <div className="flex flex-col gap-1.5">
              <h3 className="text-base font-semibold">{item.title}</h3>
              <p className="max-w-lg text-sm leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default LandingCards;
