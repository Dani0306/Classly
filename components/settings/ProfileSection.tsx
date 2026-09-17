"use client";

import { useState, useTransition } from "react";
import { AppUser } from "@/types";
import { updateProfile } from "@/actions/user";
import { useToast } from "@/providers/ToastProvider";
import Input from "../shared/Input";
import PageButton from "../shared/PageButton";
import SettingsSection from "./SettingsSection";
import Avatar from "../shared/Avatar";
import { UserRound, Mail, ImageIcon, Check } from "lucide-react";

const ProfileSection = ({ profile }: { profile: AppUser }) => {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const [name, setName] = useState<string>(profile.name ?? "");
  const [imageUrl, setImageUrl] = useState<string>(profile.image_url ?? "");

  const hasChanges =
    name.trim() !== (profile.name ?? "") ||
    imageUrl.trim() !== (profile.image_url ?? "");

  const handleSave = () => {
    if (!name.trim()) {
      toast({ title: "Your name cannot be empty", type: "error" });
      return;
    }

    startTransition(async () => {
      try {
        await updateProfile({ name, image_url: imageUrl });

        toast({
          title: "Profile updated successfully!",
          type: "success",
        });
      } catch {
        toast({
          title: "Something went wrong",
          description: "Failed to update your profile. Please try again.",
          type: "error",
        });
      }
    });
  };

  return (
    <SettingsSection
      title="Profile"
      description="This is how you appear across Classly."
      icon={UserRound}
    >
      <div className="flex items-center gap-4">
        <Avatar src={imageUrl} name={name || profile.email} size={64} />
        <div className="flex flex-col gap-1">
          <span className="text-sm font-semibold text-foreground">
            {name || "Your name"}
          </span>
          <span className="text-xs font-light text-foreground/60">
            {profile.email}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-4 md:flex-row">
        <Input
          name="name"
          label="Display name"
          value={name}
          setValue={setName}
          placeholder="Your name ..."
          icon={UserRound}
        />
        <Input
          name="image_url"
          label="Avatar URL"
          value={imageUrl}
          setValue={setImageUrl}
          placeholder="https://..."
          icon={ImageIcon}
        />
      </div>

      <div className="flex flex-col gap-1.5 w-full">
        <span className="text-xs font-medium text-foreground/70 tracking-wide">
          Email
        </span>
        <div className="flex items-center gap-2 w-full rounded-2xl border border-border bg-surface-muted px-4 py-2.5">
          <Mail className="size-4 shrink-0 text-muted-foreground/60" />
          <span className="truncate text-sm text-muted-foreground">
            {profile.email}
          </span>
        </div>
        <span className="text-[11px] font-light text-foreground/50">
          Your email comes from the account you signed in with and cannot be
          changed here.
        </span>
      </div>

      <div className="flex justify-end">
        <PageButton
          onClick={handleSave}
          text={isPending ? "Saving ..." : "Save changes"}
          icon={Check}
          size="md"
          disabled={isPending || !hasChanges}
        />
      </div>
    </SettingsSection>
  );
};

export default ProfileSection;
