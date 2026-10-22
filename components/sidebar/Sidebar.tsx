"use client";

import { links } from "@/data/sidebar/links";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "../shared/Logo";
import { UserCard } from "../user/UserCard";
import { User } from "@supabase/supabase-js";
import { pathnameIncludes } from "@/utils/fn";

export default function Sidebar({ user }: { user: User; isMobile?: boolean }) {
  const pathname = usePathname();

  return (
    <aside
      className={`flex flex-col h-full w-70 pt-16 md:pt-4 pb-4`}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 h-14 shrink-0">
        <Logo />
      </div>

      {/* Nav links */}
      <nav className="flex flex-col gap-1 px-4 mt-4 flex-1">
        {links.map(({ label, href, icon: Icon, keywords }) => {
          const active = pathnameIncludes(pathname, keywords);
          return (
            <Link
              key={href}
              href={href}
              className={`
                press flex items-center gap-3 px-3.5 py-2.5 rounded-[3px] text-sm
                group
                ${
                  active
                    ? "note is-yellow font-semibold [transform:rotate(-1deg)]"
                    : "text-muted-foreground hover:text-foreground hover:bg-surface-muted"
                }
              `}
            >
              <Icon
                width={16}
                height={16}
                className={`shrink-0 transition-colors duration-200
                  ${active ? "text-ink" : "text-muted-foreground group-hover:text-foreground"}
                `}
              />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* User profile */}
      <UserCard user={user} />
    </aside>
  );
}
