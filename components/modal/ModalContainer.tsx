import { useModal } from "@/providers/AppModalProvider";
import { X } from "lucide-react";
import React from "react";

type ModalProps = {
  size?: "lg" | "md" | "sm" | "xs";
  children: React.ReactNode;
  defaultPadding?: boolean;
};

const ModalContainer = ({
  size = "md",
  children,
  defaultPadding = true,
}: ModalProps) => {
  const { closeModal } = useModal();

  return (
    <div
      className={`w-full h-screen ${defaultPadding && "p-6 pt-10 md:p-12"} relative overflow-y-auto no-scrollbar bg-white shadow-xl ${
        size === "lg"
          ? "md:w-200 lg:w-275 md:h-180"
          : size === "md"
            ? "md:w-162.5 md:h-175"
            : size === "sm"
              ? "md:w-112.5 md:h-162.5"
              : "md:w-100 md:h-100"
      } glassmorphism md:rounded-2xl`}
    >
      <X
        onClick={closeModal}
        className="cursor-pointer z-50 text-black size-5 absolute top-4 right-4"
      />
      {children}
    </div>
  );
};

export default ModalContainer;
