"use client";

import { TProject } from "@/projects";
import TagsComponent from "./Tags";

export default function ProjectCard({ title, description, href, tags, badge, details, startDate, endDate }: TProject) {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };

  let dateText = formatDate(startDate);
  if (endDate) {
    if (endDate === "present") {
      dateText = `since ${formatDate(startDate)}`;
    } else {
      dateText = `${formatDate(startDate)} - ${formatDate(endDate)}`;
    }
  }

  // Generate a slug from the title for the anchor
  const anchorId = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  return (
    <div id={anchorId} className="bg-white border border-gray-200 rounded-lg p-6 group scroll-mt-4">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-2">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-orange-500 transition-colors">{title}</h3>
            <a
              href={`#${anchorId}`}
              className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-gray-600 ml-1"
              aria-label="Copy link to this project"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                />
              </svg>
            </a>
            {badge && (
              <span className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium border border-green-200">
                {badge}
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500 mb-2 font-medium">{dateText}</p>
          {href && (
            <p className="text-sm text-gray-500 mb-3">
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-start gap-1 hover:text-blue-600 transition-colors break-words group/link"
              >
                <span className="break-normal">{href}</span>
                <svg
                  className="w-3.5 h-3.5 text-gray-400 group-hover/link:text-blue-600 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
            </p>
          )}
        </div>
        <div className="flex gap-1 flex-wrap justify-end ml-4 min-w-0">{tags && <TagsComponent tags={tags} />}</div>
      </div>
      <p className="text-gray-700 mb-4 leading-relaxed">{description}</p>
      {details && <div className="text-gray-700 mb-0 leading-relaxed">{details}</div>}
    </div>
  );
}
