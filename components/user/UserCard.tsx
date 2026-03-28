import { User } from "@supabase/supabase-js";
import Image from "next/image";

export function UserCard({ user }: { user: User }) {
  const name: string =
    user.user_metadata?.full_name ??
    user.user_metadata?.name ??
    user.email ??
    "Usuario";

  const email: string = user.email ?? "";

  const avatarUrl: string | undefined =
    user.user_metadata?.avatar_url ?? user.user_metadata?.picture;

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent transition-colors cursor-pointer">
      <div className="relative h-8 w-8 shrink-0 rounded-full overflow-hidden bg-muted flex items-center justify-center">
        {avatarUrl ? (
          <Image
            src={avatarUrl}
            alt={name}
            fill
            className="object-cover"
            sizes="32px"
          />
        ) : (
          <span className="text-xs font-medium">{initials}</span>
        )}
      </div>

      <div className="flex flex-col min-w-0">
        <span className="text-sm font-normal tracking-tight leading-tight truncate">
          {name}
        </span>
        <span className="text-[10px] text-muted-foreground leading-tight truncate font-light">
          {email}
        </span>
      </div>
    </div>
  );
}
