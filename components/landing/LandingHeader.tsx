"use client";

import React, { useState } from "react";
import PageButton from "../shared/PageButton";
import Logo from "../shared/Logo";
import { LogIn, User as UserIcon, Menu, X } from "lucide-react";
import { useModal } from "@/providers/AppModalProvider";
import ModalContainer from "../modal/ModalContainer";
import LoginModal from "../auth/LoginModal";
import { User } from "@supabase/supabase-js";

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "Testimonials", href: "#testimonials" },
];

const LandingHeader = ({ user }: { user: User | null }) => {
  const [isOpen, setIsOpen] = useState(false);

  const { openModal } = useModal();

  const showLoginModal = () => {
    openModal(
      <ModalContainer size="sm">
        <LoginModal />
      </ModalContainer>,
    );
  };

  return (
    <header className="board sticky top-0 z-30 border-b border-border">
      <nav className="mx-auto flex h-18 max-w-7xl items-center justify-between px-5 lg:px-10">
        <Logo />

        <ul className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map(({ label, href }) => (
            <li key={href}>
              <a
                href={href}
                className="text-sm text-muted-foreground transition-colors duration-150 hover:text-foreground"
              >
                {label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden gap-2 md:flex">
          <PageButton
            onClick={showLoginModal}
            text="Sign In"
            icon={UserIcon}
            light
            size="md"
          />
          <PageButton
            onClick={user ? undefined : showLoginModal}
            text="Get Started"
            icon={LogIn}
            size="md"
          />
        </div>

        <button
          onClick={() => setIsOpen(true)}
          aria-label="Open menu"
          className="press -mr-2 cursor-pointer rounded-md p-2 md:hidden"
        >
          <Menu size={22} />
        </button>
      </nav>

      <div
        onClick={() => setIsOpen(false)}
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-200 ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <div
        className={`fixed right-0 top-0 z-50 board h-full w-72 border-l border-border shadow-xl transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-border px-5">
          <Logo size="sm" />
          <button
            onClick={() => setIsOpen(false)}
            aria-label="Close menu"
            className="press -mr-2 cursor-pointer rounded-md p-2"
          >
            <X size={20} />
          </button>
        </div>

        <ul className="flex flex-col gap-1 p-4 text-sm">
          {NAV_LINKS.map(({ label, href }) => (
            <li key={href}>
              <a
                href={href}
                onClick={() => setIsOpen(false)}
                className="block rounded-md px-3 py-2.5 transition-colors hover:bg-surface-muted"
              >
                {label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex flex-col gap-3 p-5">
          <PageButton
            onClick={showLoginModal}
            text="Sign In"
            icon={UserIcon}
            light
          />
          <PageButton
            onClick={user ? undefined : showLoginModal}
            text="Get Started"
            icon={LogIn}
          />
        </div>
      </div>
    </header>
  );
};

export default LandingHeader;
