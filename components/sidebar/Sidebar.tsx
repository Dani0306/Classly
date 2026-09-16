"use client";

import { links } from "@/data/sidebar/links";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "../shared/Logo";
import { UserCard } from "../user/UserCard";
import { User } from "@supabase/supabase-js";

export default function Sidebar({ user }: { user: User; isMobile?: boolean }) {
  const pathname = usePathname();

  return (
    <aside
      className={`flex flex-col h-full w-70 pt-16 md:pt-4 pb-4 bg-[#ccc]/30`}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 h-14 shrink-0">
        <Logo />
      </div>

      {/* Nav links */}
      <nav className="flex flex-col gap-1 px-4 mt-4 flex-1">
        {links.map(({ label, href, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`
                flex items-center gap-3 px-4 py-2.5 rounded-3xl text-sm
                transition-all duration-200 group
                ${
                  active
                    ? "bg-primary/20 text-green-700 font-medium"
                    : "text-foreground-muted hover:text-foreground hover:bg-background-muted"
                }
              `}
            >
              <Icon
                width={16}
                height={16}
                className={`shrink-0 transition-colors duration-200
                  ${active ? "text-gold" : "text-foreground-faint group-hover:text-foreground-muted"}
                `}
              />
              {label}
              {active && (
                <span className="ml-auto w-1 h-4 rounded-full bg-gold" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User profile */}
      <UserCard user={user} />
    </aside>
  );
}
