"use client";

import { CARDS_INFO } from "@/data/landing/features";
import { useInviewCustom } from "@/hooks/shared/useInViewCustom";
import { BookOpen } from "lucide-react";

/** Example contents for one class, as the app groups them. Illustrative only. */
const CLASS_NOTES = [
  { type: "Note", title: "Cell membranes", tape: "var(--note-paper)", tilt: "-1.5deg" },
  { type: "Summary", title: "Mitosis in four phases", tape: "var(--note-blue)", tilt: "1deg" },
  { type: "Quiz", title: "Cell cycle · 10 questions", tape: "var(--note-pink)", tilt: "-0.5deg" },
  { type: "Homework", title: "Lab report · due Thu", tape: "var(--note-lime)", tilt: "1.5deg" },
];

const LandingCards = () => {
  const { inView, ref } = useInviewCustom();

  return (
    <section
      id="features"
      ref={ref}
      className={`mx-auto mt-28 w-full max-w-7xl scroll-mt-24 px-5 lg:px-10 ${inView ? "reveal" : ""}`}
    >
      <div className="flex max-w-xl flex-col gap-4">
        <h2 className="text-balance text-4xl font-extrabold tracking-[-0.03em] md:text-5xl">
          Streamline Your Learning
        </h2>
        <p className="text-base leading-relaxed text-muted-foreground">
          Powerful AI tools designed to help students excel without the
          busywork. Focus on concepts, and let Classly handle the structure.
        </p>
      </div>

      <div className="mt-16 grid gap-16 lg:grid-cols-12 lg:gap-10">
        {/* One class, its contents pinned beneath it. */}
        <div className="lg:col-span-7">
          <div className="note tape is-yellow flex w-fit items-center gap-3 px-6 py-4 [transform:rotate(-1.5deg)]">
            <BookOpen className="size-5" strokeWidth={2.25} />
            <span className="text-2xl font-extrabold tracking-tight">
              Biology
            </span>
          </div>

          <ul className="mt-8 grid gap-x-5 gap-y-8 border-l-2 border-dashed border-border pl-6 sm:grid-cols-2">
            {CLASS_NOTES.map((item) => (
              <li
                key={item.title}
                style={
                  {
                    "--tape": item.tape,
                    "--tilt": item.tilt,
                  } as React.CSSProperties
                }
                className="note tape tilt flex items-baseline justify-between gap-3 p-5 pt-6"
              >
                <strong className="text-base font-bold tracking-tight">
                  {item.title}
                </strong>
                <span className="shrink-0 rounded-[3px] bg-ink/8 px-2 py-0.5 text-xs font-semibold text-ink/70">
                  {item.type}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* What the AI does with them, as one written list. */}
        <ul className="note tape flex flex-col self-start p-8 lg:col-span-5 [transform:rotate(1deg)]">
          {CARDS_INFO.map((item) => (
            <li
              key={item.title}
              className="flex gap-4 border-b border-ink/15 py-6 first:pt-2 last:border-0 last:pb-2"
            >
              <item.icon className="mt-1 size-5 shrink-0" strokeWidth={2} />
              <div className="flex flex-col gap-1.5">
                <h3 className="text-lg font-bold tracking-tight">
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-ink/75">
                  {item.description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default LandingCards;
