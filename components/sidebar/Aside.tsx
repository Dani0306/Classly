"use client";

import React, { useState } from "react";
import Sidebar from "./Sidebar";
import { User } from "@supabase/supabase-js";
import { Menu } from "lucide-react";

const Aside = ({
  children,
  user,
}: {
  children: React.ReactNode;
  user: User;
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <aside
        style={{
          width: sidebarOpen ? "280px" : "0px", // desktop: collapses width
          transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)", // mobile: slides out
        }}
        className="fixed md:relative z-40 h-full bg-white transition-[width,transform] duration-300 ease-in-out shrink-0 overflow-hidden"
      >
        <Sidebar user={user} isMobile />
      </aside>

      {/* Backdrop */}
      <div
        onClick={() => setSidebarOpen(false)}
        className="fixed inset-0 z-30 bg-black/30 md:hidden transition-opacity duration-300"
        style={{
          opacity: sidebarOpen ? 1 : 0,
          pointerEvents: sidebarOpen ? "auto" : "none",
        }}
      />

      {/* Main area */}
      <div className="relative flex-1 overflow-hidden">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute top-4 left-4 z-50 p-2 rounded-lg bg-white/80 backdrop-blur-sm shadow-sm hover:bg-white transition-colors cursor-pointer"
        >
          <Menu className="size-5" />
        </button>
        <main className="h-full overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
};

export default Aside;
