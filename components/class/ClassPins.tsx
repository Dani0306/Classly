"use client";

import Image from "next/image";
import {
  FileText,
  FileType,
  Globe,
  Image as ImageGlyph,
  Loader2,
  LucideIcon,
  Paperclip,
  Pin,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { linkHost } from "@/lib/pins";
import { ClassPin } from "@/types";
import { isImageFile, isPdfFile, isWordFile } from "@/utils/fn";
import { useState } from "react";
import { useModal } from "@/providers/AppModalProvider";
import { useDeletePin } from "@/hooks/pins/useDeletePin";
import ModalContainer from "../modal/ModalContainer";
import ConfirmModal from "../modal/ConfirmModal";
import PageButton from "../shared/PageButton";
import PinModal from "./PinModal";

type Face = { label: string; Icon: LucideIcon; paper?: string };

const faceFor = (pin: ClassPin): Face => {
  if (pin.kind === "link") {
    const host = linkHost(pin.url);
    // A link pinned without a name is already titled by its host.
    const label = host === pin.title ? "Link" : host;
    return { label, Icon: Globe, paper: "bg-note-blue" };
  }
  if (isImageFile(pin.url)) return { label: "Picture", Icon: ImageGlyph };
  if (isPdfFile(pin.url))
    return { label: "PDF", Icon: FileText, paper: "bg-note-pink" };
  if (isWordFile(pin.url)) return { label: "Word", Icon: FileType };
  return { label: "File", Icon: Paperclip };
};

/** A red pushpin holding the card to the wall. */
const Pushpin = () => (
  <span
    aria-hidden
    className="absolute left-1/2 top-2 z-10 size-3.5 -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_35%_30%,#ff9b9b,#e0303a_55%,#99121d)] shadow-[0_3px_3px_-1px_rgba(0,0,0,0.5)]"
  />
);

const PinCard = ({
  pin,
  onUnpin,
  pending,
}: {
  pin: ClassPin;
  onUnpin: () => void;
  pending: boolean;
}) => {
  const { label, Icon, paper } = faceFor(pin);
  const image = pin.kind === "file" && isImageFile(pin.url);

  return (
    <li className="group relative">
      <a
        href={pin.url}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "note tilt flex h-full flex-col overflow-hidden outline-none",
          pending && "pointer-events-none opacity-50",
        )}
      >
        <Pushpin />

        <div
          className={cn(
            "relative grid h-24 place-items-center",
            paper ?? "bg-ink/[0.06]",
          )}
        >
          {image ? (
            <Image
              src={pin.url}
              alt=""
              fill
              sizes="(min-width: 1280px) 200px, (min-width: 640px) 33vw, 50vw"
              className="object-cover"
            />
          ) : (
            <Icon className="size-7 text-ink/80" strokeWidth={1.75} />
          )}
        </div>

        <div className="flex min-w-0 flex-col gap-0.5 px-3 py-2.5">
          <span className="line-clamp-2 text-[13px] font-bold leading-snug tracking-tight text-ink">
            {pin.title}
          </span>
          <span className="truncate text-[11px] text-ink/55">{label}</span>
        </div>
      </a>

      <button
        type="button"
        onClick={onUnpin}
        disabled={pending}
        aria-label={`Unpin ${pin.title}`}
        className="press absolute -right-2 -top-2 z-20 grid size-7 cursor-pointer place-items-center rounded-full bg-ink text-note-paper shadow-md outline-none transition-opacity focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-ring [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100"
      >
        {pending ? (
          <Loader2 className="size-3.5 animate-spin" />
        ) : (
          <X className="size-3.5" strokeWidth={2.5} />
        )}
      </button>
    </li>
  );
};

/**
 * The class's pinboard: links, documents and pictures that matter for the
 * whole term, kept apart from the day-to-day materials below.
 */
const ClassPins = ({
  pins,
  classId,
  className,
}: {
  pins: ClassPin[];
  classId: string;
  className: string;
}) => {
  const { openModal, closeModal } = useModal();
  const { deletePinFn, isPending } = useDeletePin();
  const [unpinningId, setUnpinningId] = useState<string | null>(null);

  const remove = (id: string) => {
    setUnpinningId(id);
    deletePinFn(id);
  };

  const openPinModal = () =>
    openModal(
      <ModalContainer size="sm">
        <PinModal classId={classId} className={className} />
      </ModalContainer>,
    );

  // A link is easy to pin again, so it goes at once. A file is deleted with
  // its pin, so ask first.
  const unpin = (pin: ClassPin) => {
    if (pin.kind === "link") return remove(pin.id);

    openModal(
      <ModalContainer size="xs">
        <ConfirmModal
          message={`Unpinning "${pin.title}" also deletes the file.`}
          onConfirm={() => {
            remove(pin.id);
            closeModal();
          }}
        />
      </ModalContainer>,
    );
  };

  return (
    <section aria-labelledby="pinned-heading" className="flex flex-col gap-5">
      <div className="flex items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h2
            id="pinned-heading"
            className="flex items-center gap-2 text-lg font-bold tracking-tight"
          >
            Pinned
            {pins.length > 0 && (
              <span className="tabular text-sm font-semibold text-muted-foreground">
                {pins.length}
              </span>
            )}
          </h2>
          <p className="text-sm text-muted-foreground">
            Links, documents and pictures you&apos;ll need all term.
          </p>
        </div>

        {pins.length > 0 && (
          <PageButton
            text="Pin"
            icon={Pin}
            size="sm"
            light
            onClick={openPinModal}
          />
        )}
      </div>

      {pins.length === 0 ? (
        <button
          type="button"
          onClick={openPinModal}
          className="group flex w-full cursor-pointer flex-col items-center gap-3 rounded-[3px] border-2 border-dashed border-border px-6 py-8 text-center outline-none transition-colors hover:border-muted-foreground/50 focus-visible:ring-2 focus-visible:ring-ring sm:flex-row sm:text-left"
        >
          <span className="note tape is-yellow grid size-11 shrink-0 place-items-center [transform:rotate(-3deg)]">
            <Pin className="size-5 text-ink" />
          </span>
          <span className="flex flex-col gap-0.5">
            <span className="text-sm font-semibold text-foreground">
              Nothing pinned yet
            </span>
            <span className="text-xs text-muted-foreground">
              Pin the syllabus, the course website or a formula sheet so
              it&apos;s always one click away.
            </span>
          </span>
          <span className="text-xs font-semibold text-foreground underline decoration-border underline-offset-4 group-hover:decoration-foreground sm:ml-auto">
            Pin something
          </span>
        </button>
      ) : (
        <ul className="wall grid grid-cols-2 gap-x-4 gap-y-6 pt-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {pins.map((pin) => (
            <PinCard
              key={pin.id}
              pin={pin}
              pending={isPending && unpinningId === pin.id}
              onUnpin={() => unpin(pin)}
            />
          ))}
        </ul>
      )}
    </section>
  );
};

export default ClassPins;
