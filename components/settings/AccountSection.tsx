"use client";

import { useTransition } from "react";
import { AppUser } from "@/types";
import { signOut } from "@/actions/user";
import PageButton from "../shared/PageButton";
import SettingsSection from "./SettingsSection";
import { ShieldCheck, LogOut, CalendarDays } from "lucide-react";

const AccountSection = ({ profile }: { profile: AppUser }) => {
  const [isPending, startTransition] = useTransition();

  const memberSince = new Date(profile.created_at).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const handleSignOut = () => {
    startTransition(async () => {
      await signOut();
    });
  };

  return (
    <SettingsSection
      title="Account"
      description="Your Classly account details and session."
      icon={ShieldCheck}
    >
      <div className="flex items-center gap-2 rounded-2xl border border-border bg-surface-muted px-4 py-3">
        <CalendarDays className="size-4 shrink-0 text-muted-foreground/60" />
        <span className="text-xs font-light text-foreground/70">
          Member since{" "}
          <strong className="font-semibold text-foreground">
            {memberSince}
          </strong>
        </span>
      </div>

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-1">
          <span className="text-sm font-semibold text-foreground">
            Sign out
          </span>
          <span className="text-xs font-light text-foreground/60">
            End your session on this device.
          </span>
        </div>
        <PageButton
          onClick={handleSignOut}
          text={isPending ? "Signing out ..." : "Sign out"}
          icon={LogOut}
          size="md"
          light
          disabled={isPending}
        />
      </div>
    </SettingsSection>
  );
};

export default AccountSection;
