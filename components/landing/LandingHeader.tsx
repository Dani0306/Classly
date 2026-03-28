"use client";

import React, { useState } from "react";
import ImageComponent from "../shared/ImageComponent";
import PageButton from "../shared/PageButton";
import { LogIn, User as UserIcon, Menu, X } from "lucide-react";
import { useInviewCustom } from "@/hooks/shared/useInViewCustom";
import { useModal } from "@/providers/AppModalProvider";
import ModalContainer from "../modal/ModalContainer";
import LoginModal from "../auth/LoginModal";
import { User } from "@supabase/supabase-js";

const LandingHeader = ({ user }: { user: User | null }) => {
  const [isOpen, setIsOpen] = useState(false);

  const { openModal } = useModal();

  const { ref, inView } = useInviewCustom();

  const showLoginModal = () => {
    openModal(
      <ModalContainer size="sm">
        <LoginModal />
      </ModalContainer>,
    );
  };

  return (
    <header ref={ref} className="relative">
      <nav
        className={`flex items-center py-6 justify-between px-4 lg:px-8 ${inView && "fade-in"} opacity-0`}
      >
        {/* Logo */}
        <div className="md:min-w-50">
          <ImageComponent className="w-10 h-12" alt="Logo" src="/logo.png" />
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:inline">
          <ul className="flex space-x-6">
            <li className="cursor-pointer hover:scale-105 transition-all duration-200 font-light text-sm">
              Features
            </li>
            <li className="cursor-pointer hover:scale-105 transition-all duration-200 font-light text-sm">
              Pricing
            </li>
            <li className="cursor-pointer hover:scale-105 transition-all duration-200 font-light text-sm">
              Testimonials
            </li>
          </ul>
        </div>

        {/* Desktop Buttons */}
        <div className="hidden md:flex space-x-3">
          <PageButton
            onClick={showLoginModal}
            text="Sign In"
            icon={UserIcon}
            light
            size="md"
          />
          <PageButton text="Get Started" icon={LogIn} size="md" />
        </div>

        <div className="md:hidden">
          <span className="text-xl font-bold">Classly</span>
        </div>

        {/* Mobile Menu Button */}
        <button onClick={() => setIsOpen(true)} className="md:hidden p-2">
          <Menu size={24} />
        </button>
      </nav>

      {/* Overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-72 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <ImageComponent className="w-8 h-10" alt="Logo" src="/logo.png" />
          <button onClick={() => setIsOpen(false)}>
            <X size={22} />
          </button>
        </div>

        <ul className="flex flex-col space-y-6 p-6 text-sm font-light">
          <li className="cursor-pointer hover:text-green-500 transition-colors">
            Features
          </li>
          <li className="cursor-pointer hover:text-green-500 transition-colors">
            Pricing
          </li>
          <li className="cursor-pointer hover:text-green-500 transition-colors">
            Testimonials
          </li>
        </ul>

        <div className="p-6 flex flex-col space-y-4">
          <PageButton
            onClick={showLoginModal}
            text="Sign In"
            icon={UserIcon}
            light
          />
          <PageButton text="Get Started" icon={LogIn} />
        </div>
      </div>
    </header>
  );
};

export default LandingHeader;
