"use client";

import { Rocket } from "lucide-react";
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
    if (user) router.push("/app/dashboard");
    else
      openModal(
        <ModalContainer>
          <LoginModal />
        </ModalContainer>,
      );
  };

  return (
    <div
      ref={ref}
      className={`flex flex-col items-center space-y-9 mt-18 ${inView && "slide-up"} opacity-0`}
    >
      <div className="rounded-3xl items-center flex space-x-2 py-2 px-4 text-xs font-medium text-[#1e9014] bg-green-300/60">
        <Rocket className="size-4" />
        <span>NEXT-GEN LEARNING</span>
      </div>

      <h1 className="text-4xl md:text-6xl font-bold text-center text-black">
        Turn messy notes <br />
        <span className="text-primary">into mastery</span>
      </h1>

      <p className="font-light text-gray-600 text-sm md:text-base text-center max-w-150 px-6">
        The AI-powered workspace that transforms lectures and handwritten notes
        into organized study guides instantly, spend less time formatting and
        more time learning
      </p>

      <div className="flex items-center space-x-4">
        <PageButton onClick={handleRedirect} text="Start For Free" size="lg" />
        <PageButton text="View Demo" size="lg" light />
      </div>

      <div className="w-full max-w-260 rounded-2xl aspect-video mx-auto mt-4">
        <ImageComponent
          src="/screen1.png"
          alt="screen"
          className="w-full h-full object-contain rounded-2xl"
        />
      </div>
    </div>
  );
};

export default LandingHero;
