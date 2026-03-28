"use client";

import React, { useState } from "react";
import Sidebar from "./Sidebar";
import { User } from "@supabase/supabase-js";
import { Menu } from "lucide-react";
import { useDebounce } from "@/hooks/shared/useDebounce";

const Aside = ({
  children,
  user,
}: {
  children: React.ReactNode;
  user: User;
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const { query, setQuery, value } = useDebounce();

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar — absolute on mobile, relative on md+ */}
      <aside
        className={`
          absolute md:relative z-70 h-full
          bg-white
          transition-[width,transform] duration-300 ease-in-out
          shrink-0 overflow-hidden
          ${sidebarOpen ? "w-70 translate-x-0" : "w-70 -translate-x-full md:w-0 md:translate-x-0"}
        `}
      >
        <Sidebar user={user} />
      </aside>

      {/* Backdrop — only on mobile when sidebar is open */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main area — never shifts on mobile */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <header className="h-max flex items-center p-4 shrink-0 space-x-6">
          <Menu
            className="size-6 cursor-pointer"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          />
        </header>
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
};

export default Aside;
