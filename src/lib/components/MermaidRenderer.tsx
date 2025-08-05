"use client";

import { useEffect } from "react";
import mermaid from "mermaid";
import { useColorSchemeContext } from "@/lib/contexts/ColorSchemeContext";

export default function MermaidRenderer() {
  const { isDarkMode } = useColorSchemeContext();

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: isDarkMode ? "dark" : "default",
      securityLevel: "loose",
      fontFamily: "Arial, sans-serif",
    });

    const renderMermaid = async () => {
      //   const mermaidBlocks = document.querySelectorAll<HTMLElement>(".language-mermaid");
      //   mermaidBlocks.forEach((block, index) => {
      //     if (block.dataset.rendered !== "true") {
      //       mermaid.render(`mermaid-${index}`, block.textContent || "").then(({ svg }) => {
      //         block.innerHTML = svg;
      //         block.dataset.rendered = "true";
      //       });
      //     }
      //   });

      await mermaid.run({
        nodes: document.querySelectorAll(".language-mermaid"),
        suppressErrors: true,
      });
    };

    renderMermaid();
  }, [isDarkMode]);

  return null;
}
