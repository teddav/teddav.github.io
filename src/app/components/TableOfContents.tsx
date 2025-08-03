"use client";

import { useState, useEffect, useRef } from "react";

interface TableOfContentsProps {
  toc: string;
}

function useActiveHeading() {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: "0px 0px -70% 0px",
        threshold: 1,
      }
    );

    const headings = document.querySelectorAll("h1, h2, h3, h4, h5, h6");
    headings.forEach((heading) => observer.observe(heading));

    return () => {
      headings.forEach((heading) => observer.unobserve(heading));
    };
  }, []);

  return activeId;
}

// Hook to update active class in TOC
function useTocActiveClass(activeId: string) {
  const updateActiveClass = (element: HTMLElement | null) => {
    if (!element) return;

    element.querySelectorAll(".active").forEach((el) => {
      el.classList.remove("active");
    });

    if (activeId) {
      const activeLink = element.querySelector(`a[href="#${activeId}"]`);
      if (activeLink) {
        activeLink.classList.add("active");
      }
    }
  };

  return updateActiveClass;
}

export default function TableOfContents({ toc }: TableOfContentsProps) {
  const [isOpen, setIsOpen] = useState(true);
  const activeId = useActiveHeading();
  const updateActiveClass = useTocActiveClass(activeId);

  const desktopTocRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    updateActiveClass(desktopTocRef.current);
  }, [activeId, updateActiveClass]);

  return (
    <>
      {/* Mobile TOC Button */}
      <div className="lg:hidden mb-6">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          <span className="font-medium">Table of Contents</span>
          <svg
            className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Mobile TOC Dropdown */}
        {isOpen && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
            <div className="toc-mobile prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: toc }} />
          </div>
        )}
      </div>

      {/* Desktop TOC Sidebar */}
      <div className="hidden lg:block lg:fixed lg:top-24 lg:left-8 lg:w-64 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto">
        <div className="bg-gray-50 rounded-lg p-4 border sticky top-24">
          <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">Table of Contents</h3>
          <div ref={desktopTocRef} className="toc-desktop prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: toc }} />
        </div>
      </div>
    </>
  );
}
