"use client";

import { useState } from "react";
import { CloudUpload, Link2, Loader2, Type } from "lucide-react";
import { cn } from "@/lib/utils";
import { normalizeLink } from "@/lib/pins";
import { useCreatePin } from "@/hooks/pins/useCreatePin";
import ModalTitle from "../modal/ModalTitle";
import Input from "../shared/Input";
import PageButton from "../shared/PageButton";
import FileInput from "../files/FileInput";

type Mode = "link" | "file";

const MODES: { value: Mode; label: string }[] = [
  { value: "link", label: "Link" },
  { value: "file", label: "File or picture" },
];

const PinModal = ({
  classId,
  className,
}: {
  classId: string;
  className: string;
}) => {
  const [mode, setMode] = useState<Mode>("link");
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [invalid, setInvalid] = useState(false);

  const { isPending, pinLinkFn, pinFilesFn } = useCreatePin(classId);

  const handlePinLink = () => {
    if (isPending) return;
    if (!normalizeLink(url)) {
      setInvalid(true);
      return;
    }
    pinLinkFn(url, title);
  };

  return (
    <div className="flex h-full flex-col gap-7">
      <ModalTitle
        title={`Pin to ${className}`}
        description="Keep it on the class all term: the syllabus, the course site, a formula sheet."
      />

      <div
        role="group"
        aria-label="What to pin"
        className="flex w-fit rounded-[3px] border border-border bg-surface-muted p-0.5"
      >
        {MODES.map(({ value, label }) => (
          <button
            key={value}
            type="button"
            aria-pressed={mode === value}
            onClick={() => setMode(value)}
            className={cn(
              "cursor-pointer rounded-[2px] px-3.5 py-1.5 text-xs font-semibold outline-none focus-visible:ring-2 focus-visible:ring-ring",
              mode === value
                ? "bg-note-yellow text-ink"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {mode === "link" ? (
        <form
          className="flex flex-col gap-5"
          onSubmit={(e) => {
            e.preventDefault();
            handlePinLink();
          }}
        >
          <div className="flex flex-col gap-1.5">
            <Input
              label="Web address"
              name="pin-url"
              placeholder="course.university.edu/syllabus"
              icon={Link2}
              value={url}
              setValue={(value) => {
                setUrl(value);
                setInvalid(false);
              }}
            />
            {invalid && (
              <p role="alert" className="text-xs text-destructive">
                That doesn&apos;t look like a web address. Try something like
                example.com/page.
              </p>
            )}
          </div>

          <Input
            label="Name (optional)"
            name="pin-title"
            placeholder="Defaults to the site's address"
            icon={Type}
            value={title}
            setValue={setTitle}
          />

          <div className="flex justify-end">
            <PageButton
              text={isPending ? "Pinning ..." : "Pin link"}
              disabled={isPending || !url.trim()}
            />
          </div>
        </form>
      ) : (
        <FileInput onDrop={(files) => !isPending && pinFilesFn(files)}>
          <div
            className={cn(
              "flex min-h-56 cursor-pointer flex-col items-center justify-center gap-3 rounded-[3px] border-2 border-dashed border-border px-6 text-center transition-colors hover:border-foreground/30 hover:bg-surface-muted",
              isPending && "pointer-events-none opacity-70",
            )}
          >
            {isPending ? (
              <Loader2 className="size-8 animate-spin text-muted-foreground" />
            ) : (
              <CloudUpload className="size-8 text-muted-foreground" />
            )}
            <p className="text-sm font-semibold text-foreground">
              {isPending
                ? "Uploading ..."
                : "Drop files here, or click to choose"}
            </p>
            <p className="text-xs text-muted-foreground">
              Pictures, PDFs and Word documents, up to 5 MB each.
            </p>
          </div>
        </FileInput>
      )}
    </div>
  );
};

export default PinModal;
