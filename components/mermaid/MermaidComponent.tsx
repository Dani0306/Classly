"use client";

import { useEffect, useRef } from "react";
import mermaid from "mermaid";
import { cleanMermaidCode } from "@/utils/fn";

const MermaidDiagram = ({ code }: { code: string }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current || !code) return;

    const render = async () => {
      try {
        const clean = cleanMermaidCode(code);
        mermaid.initialize({ startOnLoad: false, theme: "default" });
        const { svg } = await mermaid.render("mermaid-diagram", clean);
        if (ref.current) ref.current.innerHTML = svg;
      } catch (err) {
        console.error("Mermaid render error:", err);
        if (ref.current) {
          ref.current.innerHTML = `<p style="color:red;font-size:12px;">Failed to render diagram.</p>`;
        }
      }
    };

    render();
  }, [code]);

  return <div ref={ref} className="w-full" />;
};

export default MermaidDiagram;
