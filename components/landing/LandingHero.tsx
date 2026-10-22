"use client";

import PageButton from "../shared/PageButton";
import ImageComponent from "../shared/ImageComponent";
import { useInviewCustom } from "@/hooks/shared/useInViewCustom";
import { useRouter } from "next/navigation";
import { User } from "@supabase/supabase-js";
import { useModal } from "@/providers/AppModalProvider";
import ModalContainer from "../modal/ModalContainer";
import LoginModal from "../auth/LoginModal";

const LandingHero = ({ user }: { user: User | null }) => {
  const { ref, inView } = useInviewCustom();
  const { openModal } = useModal();
  const router = useRouter();

  const handleRedirect = () => {
    if (user) router.push("/app/classes");
    else
      openModal(
        <ModalContainer>
          <LoginModal />
        </ModalContainer>,
      );
  };

  return (
    <section
      ref={ref}
      className={`mx-auto w-full max-w-6xl px-5 pb-8 pt-16 md:pt-24 lg:px-8 ${inView ? "reveal" : ""}`}
    >
      <h1 className="max-w-4xl text-balance text-5xl font-bold leading-[1.02] tracking-tight text-foreground md:text-7xl">
        Turn messy notes <span className="marker">into mastery</span>
      </h1>

      <div className="mt-8 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <p className="max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
          The AI-powered workspace that transforms lectures and handwritten
          notes into organized study guides instantly, spend less time
          formatting and more time learning
        </p>

        <div className="flex shrink-0 items-center gap-3">
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

      <div className="sheet mt-14 overflow-hidden p-2 md:p-3">
        <div className="aspect-video w-full overflow-hidden rounded-md border border-border-soft bg-surface-muted">
          <ImageComponent
            src="/screen.png"
            alt="Classly workspace showing a class and its contents"
            className="h-full w-full object-contain"
          />
        </div>
      </div>
    </section>
  );
};

export default LandingHero;
