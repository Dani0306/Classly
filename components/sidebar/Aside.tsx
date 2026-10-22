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
    <div className="board flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside
        style={{
          width: sidebarOpen ? "280px" : "0px", // desktop: collapses width
          transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)", // mobile: slides out
        }}
        className="fixed md:relative z-40 h-full border-r border-border bg-board transition-[width,transform] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] shrink-0 overflow-hidden"
      >
        <Sidebar user={user} isMobile />
      </aside>

      {/* Backdrop */}
      <div
        onClick={() => setSidebarOpen(false)}
        className="fixed inset-0 z-30 bg-black/50 md:hidden transition-opacity duration-300"
        style={{
          opacity: sidebarOpen ? 1 : 0,
          pointerEvents: sidebarOpen ? "auto" : "none",
        }}
      />

      {/* Main area */}
      <div className="relative flex-1 overflow-hidden">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
          className="press absolute top-4 left-4 z-50 cursor-pointer rounded-[3px] border border-border bg-surface p-2 hover:bg-surface-muted"
        >
          <Menu className="size-5" />
        </button>
        <main className="h-full overflow-y-auto p-5 md:p-8">{children}</main>
      </div>
    </div>
  );
};

export default Aside;
