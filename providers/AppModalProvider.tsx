"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { createPortal } from "react-dom";

type CtxType = {
  openModal: (node: React.ReactNode) => void;
  closeModal: () => void;
};

const Ctx = createContext<CtxType | undefined>(undefined);

export default function AppModalProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [node, setNode] = useState<React.ReactNode | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const openModal = (node: React.ReactNode) => {
    setIsOpen(true);
    setNode(node);
  };

  const closeModal = () => {
    setIsOpen(false);
    setNode(null);
  };

  const value: CtxType = {
    openModal,
    closeModal,
  };

  //* BLOCK OVERFLOW WHILE MODAL IS OPENED

  useEffect(() => {
    if (!isOpen) return;

    const prev = document.documentElement.style.overflow;

    document.documentElement.style.overflow = "hidden";

    return () => {
      document.documentElement.style.overflow = prev;
    };
  }, [isOpen]);

  // * CLOSING THE MODAL ON PRESSING "ESCAPE"

  useEffect(() => {
    if (!isOpen) return;

    const fn = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeModal();
      }
    };

    window.addEventListener("keydown", fn);

    return () => window.removeEventListener("keydown", fn);
  }, [isOpen]);

  return (
    <Ctx.Provider value={value}>
      {children}
      {isOpen &&
        createPortal(
          <BackDrop onClose={closeModal}>{node}</BackDrop>,
          document.body,
        )}
    </Ctx.Provider>
  );
}

export const useModal = () => {
  const ctx = useContext(Ctx);

  if (!ctx)
    throw new Error(
      "To call this context you must use this component with the context provider.",
    );

  return ctx;
};

function BackDrop({
  onClose,
  children,
}: {
  onClose: () => void;
  children: React.ReactNode;
}) {
  const [interactive, setInteractive] = useState<boolean>(false);

  useEffect(() => {
    const timer = setTimeout(() => setInteractive(true), 120);
    return () => clearTimeout(timer);
  }, []);

  const onBackDropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive) return;

    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      onMouseDown={onBackDropClick}
      className={`
    fixed inset-0 z-99999
    flex items-center justify-center

      bg-black/50
    backdrop-blur-xl
    ${interactive ? "pointer-events-auto" : "pointer-events-none"}
  `}
      role="dialog"
      aria-modal="true"
    >
      {children}
    </div>
  );
}
