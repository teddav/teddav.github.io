"use client";

import { useEffect, useId, useRef } from "react";
import { useColorSchemeContext } from "@/lib/contexts/ColorSchemeContext";

export default function MermaidRenderer() {
  const { isDarkMode } = useColorSchemeContext();
  const sources = useRef(new Map<HTMLElement, string>());
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");

  useEffect(() => {
    const blocks = Array.from(
      document.querySelectorAll<HTMLElement>(
        ".article-body code.language-mermaid",
      ),
    );
    if (!blocks.length) return;
    for (const block of blocks) {
      if (!sources.current.has(block))
        sources.current.set(block, block.textContent || "");
    }
    let cancelled = false;

    const showError = (block: HTMLElement) => {
      block.textContent = sources.current.get(block)!;
      block.parentElement?.classList.remove("mermaid");
      block.parentElement?.setAttribute(
        "data-error",
        "Diagram unavailable; source shown below.",
      );
      block.parentElement?.setAttribute(
        "aria-label",
        "Diagram could not be rendered; source shown instead",
      );
    };

    const render = async () => {
      const { default: mermaid } = await import("mermaid");
      if (cancelled) return;
      mermaid.initialize({
        startOnLoad: false,
        theme: isDarkMode ? "dark" : "default",
        securityLevel: "strict",
        fontFamily: "Arial, sans-serif",
        flowchart: { useMaxWidth: false },
        sequence: { useMaxWidth: false },
        suppressErrorRendering: true,
      });
      for (const [index, block] of blocks.entries()) {
        if (cancelled) return;
        const source = sources.current.get(block)!;
        try {
          const { svg } = await mermaid.render(
            `diagram-${id}-${index}`,
            source,
          );
          if (cancelled || !block.isConnected) return;
          block.innerHTML = svg;
          block.parentElement?.classList.add("mermaid");
          block.parentElement?.removeAttribute("aria-label");
          block.parentElement?.removeAttribute("data-error");
        } catch (error) {
          if (cancelled || !block.isConnected) return;
          showError(block);
          console.error("Could not render Mermaid diagram", error);
        }
      }
    };

    render().catch((error) => {
      if (!cancelled) {
        blocks.forEach(showError);
        console.error(
          "Could not load Mermaid; diagram source is still available",
          error,
        );
      }
    });
    return () => {
      cancelled = true;
    };
  }, [isDarkMode, id]);

  return null;
}
