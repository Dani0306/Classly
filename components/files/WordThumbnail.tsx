"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import { FileType, Loader2 } from "lucide-react";

type Status = "loading" | "ready" | "failed";

/**
 * First page of a Word file, rendered with docx-preview and scaled to fit its
 * box. The document renders into a shadow root so its styles and the app's
 * can't leak into each other. It loads only once the card nears the viewport,
 * and a legacy .doc (not renderable) or a failed render shows a Word glyph.
 */
const WordThumbnail = ({
  src,
  renderable = true,
}: {
  /** A public URL or a blob: URL for a local file. */
  src: string;
  /** False for .doc, which can't be parsed in the browser. */
  renderable?: boolean;
}) => {
  const hostRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<Status>("loading");

  const { ref: containerRef, inView } = useInView({
    triggerOnce: true,
    rootMargin: "200px",
  });

  useEffect(() => {
    const host = hostRef.current;
    const container = host?.parentElement;

    if (!renderable || !inView || !host || !container) return;

    const controller = new AbortController();
    // StrictMode runs this twice, and a host can only attach one shadow root.
    const root = host.shadowRoot ?? host.attachShadow({ mode: "open" });
    let observer: ResizeObserver | undefined;

    const render = async () => {
      const response = await fetch(src, { signal: controller.signal });

      if (!response.ok) throw new Error(`Fetching ${src}: ${response.status}`);

      const blob = await response.blob();
      const { renderAsync } = await import("docx-preview");

      if (controller.signal.aborted) return;

      const styles = document.createElement("div");
      const body = document.createElement("div");
      root.replaceChildren(styles, body);

      await renderAsync(blob, body, styles, {
        inWrapper: false,
        renderComments: false,
        renderChanges: false,
      });

      if (controller.signal.aborted) return;

      // Each page is a <section>; scale the first one to the box's width.
      const pageWidth = body.querySelector("section")?.offsetWidth || 816;
      const fit = () => {
        host.style.transform = `scale(${container.clientWidth / pageWidth})`;
      };

      fit();
      observer = new ResizeObserver(fit);
      observer.observe(container);

      setStatus("ready");
    };

    render().catch((error) => {
      if (controller.signal.aborted) return;

      console.error("Failed rendering Word preview:", error);
      setStatus("failed");
    });

    return () => {
      controller.abort();
      observer?.disconnect();
      root.replaceChildren();
    };
  }, [src, inView, renderable]);

  return (
    <div ref={containerRef} className="relative h-full w-full overflow-hidden">
      <div
        ref={hostRef}
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 origin-top-left"
      />

      {status !== "ready" && (
        <div className="absolute inset-0 grid place-items-center bg-white">
          {renderable && status === "loading" ? (
            <Loader2 className="size-5 animate-spin text-black/20" />
          ) : (
            <FileType className="size-8 text-blue-700/40" />
          )}
        </div>
      )}
    </div>
  );
};

export default WordThumbnail;
