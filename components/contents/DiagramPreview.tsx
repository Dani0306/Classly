"use client";

import { useState } from "react";
import { ArrowUpRight, Download, ImageOff, Maximize2, Minimize2 } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Diagrams were saved with a `content-files` URL while the image lives in the
 * `diagrams` bucket. Point those rows at the right bucket when they're shown.
 */
const resolveDiagramUrl = (url: string) =>
  url.replace("/public/content-files/", "/public/diagrams/");

const DiagramPreview = ({ url, title }: { url: string; title: string }) => {
  const src = resolveDiagramUrl(url);

  const [status, setStatus] = useState<"loading" | "ready" | "failed">("loading");
  const [actualSize, setActualSize] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const download = async () => {
    setDownloading(true);
    try {
      // A cross-origin `download` link would just navigate, so fetch the file.
      const blob = await (await fetch(src)).blob();
      const href = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = href;
      link.download = `${title.replace(/[^\p{L}\p{N}]+/gu, "-")}.png`;
      link.click();
      URL.revokeObjectURL(href);
    } catch {
      window.open(src, "_blank", "noreferrer");
    } finally {
      setDownloading(false);
    }
  };

  if (status === "failed") {
    return (
      <div className="flex flex-col items-start gap-3 rounded-[3px] border-2 border-dashed border-ink/15 px-6 py-10 text-sm text-ink/70">
        <ImageOff className="size-5" />
        <p>This diagram image couldn&apos;t be loaded. Delete it and make a new one from the note.</p>
      </div>
    );
  }

  return (
    <figure className="flex flex-col gap-3">
      <div
        className={cn(
          "relative overflow-auto rounded-[3px] border border-ink/15 bg-white",
          actualSize ? "max-h-[70vh]" : "aspect-[4/3]",
        )}
      >
        {status === "loading" && (
          <div className="absolute inset-0 animate-pulse bg-ink/[0.05] motion-reduce:animate-none" />
        )}
        {/* A plain img: the size is the model's, and "actual size" needs the natural one. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={title}
          onLoad={() => setStatus("ready")}
          onError={() => setStatus("failed")}
          className={cn(
            "transition-opacity duration-200",
            status === "ready" ? "opacity-100" : "opacity-0",
            actualSize ? "max-w-none" : "size-full object-contain",
          )}
        />
      </div>

      <figcaption className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-semibold text-ink/75">
        <button
          type="button"
          onClick={() => setActualSize((v) => !v)}
          disabled={status !== "ready"}
          className="press inline-flex cursor-pointer items-center gap-1.5 rounded-[3px] py-1 hover:text-ink disabled:cursor-default disabled:opacity-50"
        >
          {actualSize ? <Minimize2 className="size-3.5" /> : <Maximize2 className="size-3.5" />}
          {actualSize ? "Fit to sheet" : "Actual size"}
        </button>
        <button
          type="button"
          onClick={download}
          disabled={status !== "ready" || downloading}
          className="press inline-flex cursor-pointer items-center gap-1.5 rounded-[3px] py-1 hover:text-ink disabled:cursor-default disabled:opacity-50"
        >
          <Download className="size-3.5" />
          {downloading ? "Saving..." : "Download"}
        </button>
        <a
          href={src}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 py-1 underline underline-offset-4 hover:text-ink"
        >
          Open in new tab
          <ArrowUpRight className="size-3.5" />
        </a>
      </figcaption>
    </figure>
  );
};

export default DiagramPreview;
