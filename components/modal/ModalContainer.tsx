import { useModal } from "@/providers/AppModalProvider";
import { X } from "lucide-react";
import React from "react";

type ModalProps = {
  size?: "lg" | "md" | "sm" | "xs";
  children: React.ReactNode;
};

const ModalContainer = ({ size = "md", children }: ModalProps) => {
  const { closeModal } = useModal();

  return (
    <div
      className={`w-full h-screen relative overflow-hidden no-scrollbar bg-white shadow-xl ${
        size === "lg"
          ? "md:w-200 lg:w-275 md:h-175"
          : size === "md"
            ? "md:w-162.5 md:h-150"
            : size === "sm"
              ? "md:w-112.5 md:h-137.5"
              : "md:w-100 md:h-112.5"
      } glassmorphism md:rounded-2xl`}
    >
      <X
        onClick={closeModal}
        className="cursor-pointer text-black size-5 sticky top-4 left-4"
      />
      {children}
    </div>
  );
};

export default ModalContainer;
