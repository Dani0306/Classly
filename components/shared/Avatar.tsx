"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

const FALLBACK_SRC = "/avatar-placeholder.svg";

// Hosts allowed by next.config.ts. Everything else has to skip the optimizer:
// /_next/image answers 400 for a hostname that is not in remotePatterns.
const isOptimizable = (src: string) => {
  if (src.startsWith("/")) return true;

  try {
    const { protocol, hostname } = new URL(src);

    return (
      protocol === "https:" &&
      (hostname === "lh3.googleusercontent.com" ||
        hostname.endsWith(".supabase.co"))
    );
  } catch {
    return false;
  }
};

const Avatar = ({
  src,
  name,
  size = 64,
  className,
}: {
  src?: string;
  name?: string;
  size?: number;
  className?: string;
}) => {
  // Tracking which URL failed (rather than a boolean) means an edited avatar
  // URL gets a fresh chance to load without an effect to reset the flag.
  const [failedSrc, setFailedSrc] = useState<string | null>(null);

  const failed = !!src && failedSrc === src;

  const initials = (name ?? "")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const resolvedSrc = src && !failed ? src : failed ? FALLBACK_SRC : "";

  return (
    <div
      style={{ width: size, height: size }}
      className={cn(
        "relative grid shrink-0 place-items-center overflow-hidden rounded-full border border-border bg-surface-muted",
        className,
      )}
    >
      {resolvedSrc ? (
        <Image
          src={resolvedSrc}
          alt={name ? `${name}'s avatar` : "Avatar"}
          fill
          sizes={`${size}px`}
          className="object-cover"
          unoptimized={!isOptimizable(resolvedSrc)}
          onError={() => setFailedSrc(src ?? null)}
        />
      ) : (
        <span className="text-sm font-medium text-muted-foreground">
          {initials || "?"}
        </span>
      )}
    </div>
  );
};

export default Avatar;
