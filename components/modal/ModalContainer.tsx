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
      className={`w-full h-screen ${defaultPadding && "p-6 pt-10 md:p-12"} relative overflow-y-auto no-scrollbar bg-surface shadow-xl ${
        size === "lg"
          ? "md:w-200 lg:w-275 md:h-180"
          : size === "md"
            ? "md:w-162.5 md:h-175"
            : size === "sm"
              ? "md:w-112.5 md:h-162.5"
              : "md:w-100 md:h-100"
      } paper md:rounded-[3px]`}
    >
      <button
        type="button"
        onClick={closeModal}
        aria-label="Close"
        className="press absolute top-3 right-3 z-50 grid size-9 cursor-pointer place-items-center rounded-[3px] text-foreground/70 hover:bg-foreground/5 hover:text-foreground"
      >
        <X className="size-5" />
      </button>
      {children}
    </div>
  );
};

export default ModalContainer;
