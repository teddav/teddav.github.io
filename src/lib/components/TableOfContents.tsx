"use client";

import { useEffect, useRef } from "react";

export default function TableOfContents({ toc }: { toc: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const links = Array.from(
      container.querySelectorAll<HTMLAnchorElement>('a[href^="#"]'),
    );
    const ids = new Set(
      links.map((link) => decodeURIComponent(link.hash.slice(1))),
    );
    const headings = Array.from(
      container
        .closest("article")!
        .querySelectorAll<HTMLElement>(".article-body :is(h1, h2, h3, h4)[id]"),
    ).filter((heading) => ids.has(heading.id));
    let activeId: string | undefined;
    let frame = 0;

    const update = () => {
      frame = 0;
      let current: HTMLElement | undefined = headings[0];
      for (const heading of headings) {
        if (heading.getBoundingClientRect().top > 160) break;
        current = heading;
      }
      if (
        window.scrollY + window.innerHeight >=
        document.documentElement.scrollHeight - 2
      ) {
        current = headings.at(-1);
      }
      if (current?.id === activeId) return;
      activeId = current?.id;
      for (const link of links) {
        if (decodeURIComponent(link.hash.slice(1)) === activeId) {
          link.setAttribute("aria-current", "location");
          const scroller =
            link.closest(".toc-desktop") ?? link.closest(".toc-links");
          if (scroller && link.getClientRects().length) {
            const bounds = scroller.getBoundingClientRect();
            const item = link.getBoundingClientRect();
            scroller.scrollTop +=
              Math.min(0, item.top - bounds.top) +
              Math.max(0, item.bottom - bounds.bottom);
          }
        } else {
          link.removeAttribute("aria-current");
        }
      }
    };
    const scheduleUpdate = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    window.addEventListener("hashchange", scheduleUpdate);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      window.removeEventListener("hashchange", scheduleUpdate);
    };
  }, [toc]);

  return (
    <div className="article-toc" ref={containerRef}>
      <nav className="toc-desktop" aria-label="Table of contents">
        <p className="toc-title">On this page</p>
        <div className="toc-links" dangerouslySetInnerHTML={{ __html: toc }} />
      </nav>
      <details className="toc-mobile">
        <summary>Contents</summary>
        <nav
          aria-label="Table of contents"
          className="toc-links"
          onClick={(event) => {
            const link = (event.target as Element).closest("a");
            if (link) {
              event.currentTarget.closest("details")!.open = false;
              const heading = document.getElementById(
                decodeURIComponent(link.hash.slice(1)),
              );
              heading?.setAttribute("tabindex", "-1");
              heading?.focus({ preventScroll: true });
            }
          }}
          dangerouslySetInnerHTML={{ __html: toc }}
        />
      </details>
    </div>
  );
}
