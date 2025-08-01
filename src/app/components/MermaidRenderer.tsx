"use client";

import { useEffect } from "react";
import mermaid from "mermaid";

export default function MermaidRenderer() {
  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: "default",
      securityLevel: "loose",
      fontFamily: "Arial, sans-serif",
    });

    const renderMermaid = async () => {
      //   const mermaidBlocks = document.querySelectorAll<HTMLElement>(".language-mermaid");
      //   mermaidBlocks.forEach((block, index) => {
      //     if (block.dataset.rendered !== "true") {
      //       mermaid.render(`mermaid-${index}`, block.textContent || "").then(({ svg }) => {
      //         console.log("svg", svg);
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
  }, []);

  return null;
}
