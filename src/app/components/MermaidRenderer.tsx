"use client";

import { useEffect } from "react";
import mermaid from "mermaid";

export default function MermaidRenderer() {
  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      theme: "default",
      securityLevel: "loose",
      fontFamily: "Arial, sans-serif",
    });

    // Find all mermaid blocks and render them
    const mermaidBlocks = document.querySelectorAll(".language-mermaid");
    mermaidBlocks.forEach((block, index) => {
      mermaid.render(`mermaid-${index}`, block.textContent || "").then(({ svg }) => {
        block.innerHTML = svg;
      });
    });
  }, []);

  return null;
}
