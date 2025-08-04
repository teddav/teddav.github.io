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

    return () => observer.disconnect();
  }, []);

  return activeId;
}

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
      {/* Mobile */}
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

        {isOpen && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
            <div className="toc-mobile prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: toc }} />
          </div>
        )}
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block lg:fixed lg:top-24 lg:left-8 lg:w-64">
        {isOpen ? (
          <div className="bg-gray-50 rounded-lg p-4 border sticky top-24">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Table of Contents</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                title="Hide table of contents"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div ref={desktopTocRef} className="toc-desktop prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: toc }} />
          </div>
        ) : (
          <>
            <button
              onClick={() => setIsOpen(true)}
              className="bg-gray-50 hover:bg-gray-100 border rounded-lg p-2 transition-colors"
              title="Show table of contents"
            >
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </>
        )}
      </div>
    </>
  );
}
