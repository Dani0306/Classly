"use client";

import { ArrowDown } from "lucide-react";
import PageButton from "../shared/PageButton";
import { useRouter } from "next/navigation";
import { User } from "@supabase/supabase-js";
import { useModal } from "@/providers/AppModalProvider";
import ModalContainer from "../modal/ModalContainer";
import LoginModal from "../auth/LoginModal";

const LandingHero = ({ user }: { user: User | null }) => {
  const { openModal } = useModal();
  const router = useRouter();

  const handleRedirect = () => {
    if (user) router.push("/app/today");
    else
      openModal(
        <ModalContainer>
          <LoginModal />
        </ModalContainer>,
      );
  };

  return (
    <section className="mx-auto grid w-full max-w-7xl gap-16 px-5 pb-10 pt-14 md:pt-20 lg:grid-cols-12 lg:gap-10 lg:px-10">
      <div className="flex flex-col lg:col-span-7">
        <h1 className="flex flex-col text-[clamp(2.5rem,7vw,5.75rem)] font-extrabold leading-[0.95] tracking-[-0.035em] text-ink">
          <span className="note tape relative w-fit max-w-full px-5 pb-6 pt-7 sm:px-7 sm:pb-7 sm:pt-8 is-yellow [transform:rotate(-2.5deg)]">
            Turn messy notes
          </span>
          <span className="note tape relative -mt-3 w-fit max-w-full self-end px-5 pb-6 pt-7 sm:px-7 sm:pb-7 sm:pt-8 is-pink [transform:rotate(2deg)] mr-2 sm:mr-4 lg:-mt-6 lg:ml-[12%] lg:mr-0 lg:self-start lg:whitespace-nowrap">
            into mastery
          </span>
        </h1>

        <div className="mt-10 flex flex-col gap-8 sm:flex-row sm:items-start">
          <p className="note max-w-sm p-6 text-base leading-relaxed [transform:rotate(-1deg)]">
            The AI-powered workspace that transforms lectures and handwritten
            notes into organized study guides instantly, spend less time
            formatting and more time learning
          </p>
          <div className="flex flex-wrap gap-3 sm:mt-8 sm:[transform:rotate(1deg)]">
            <PageButton
              onClick={handleRedirect}
              text="Start For Free"
              size="lg"
            />
            <PageButton
              onClick={() =>
                document
                  .getElementById("pricing")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              text="Explore Plans"
              size="lg"
              light
            />
          </div>
        </div>
      </div>

      {/* The mechanism: a scribbled note becomes a clean summary. */}
      <div className="flex flex-col items-center gap-4 lg:col-span-5 lg:pt-6">
        <div className="note tape w-full max-w-sm p-6 text-[15px] leading-relaxed is-blue [transform:rotate(3deg)]">
          <small className="mb-3 block text-xs font-bold tracking-wide">
            Biology · your note
          </small>
          mitosis = cell divides, <s className="opacity-60">prophase</s>{" "}
          prophase chromosomes{" "}
          <span className="underline decoration-wavy decoration-ink/50 underline-offset-4">
            condense??
          </span>{" "}
          then metaphase line up middle, anaphase pull apart (ask prof!!),
          telophase → 2 nuclei
        </div>

        <span className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
          <ArrowDown className="size-4" />
          Classly AI
        </span>

        <div className="note tape drop-in w-full max-w-sm p-6 text-[15px] leading-relaxed [transform:rotate(-2deg)]">
          <strong className="mb-3 block text-xl font-bold tracking-tight">
            Mitosis in four phases
          </strong>
          <ul className="flex flex-col gap-1">
            <li>
              <b>Prophase:</b> chromosomes <span className="marker">condense</span>.
            </li>
            <li>
              <b>Metaphase:</b> they align at the <span className="marker">center</span>.
            </li>
            <li>
              <b>Anaphase:</b> sister chromatids <span className="marker">separate</span>.
            </li>
            <li>
              <b>Telophase:</b> <span className="marker">two nuclei</span> form.
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default LandingHero;
