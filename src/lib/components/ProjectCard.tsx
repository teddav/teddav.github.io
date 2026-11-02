"use client";

import type { TProject } from "@/projects";
import { ExternalLink } from "./ExternalLink";
import TagsComponent from "./Tags";

export default function ProjectCard({ title, description, href, tags, badge, details, startDate, endDate }: TProject) {
  const formatDate = (date: Date) => date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    timeZone: "UTC",
  });

  let dateText = formatDate(startDate);
  if (endDate) {
    dateText = endDate === "present"
      ? `since ${formatDate(startDate)}`
      : `${formatDate(startDate)} – ${formatDate(endDate)}`;
  }

  const anchorId = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  return (
    <article id={anchorId} className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#333] rounded-lg p-5 sm:p-6 group scroll-mt-24">
      <header className="mb-4">
        <div className="flex items-start gap-3">
          <h3 className="min-w-0 flex-1 text-xl font-semibold leading-snug text-gray-900 dark:text-gray-100 break-words">
            {href ? (
              <ExternalLink href={href} className="text-blue-700 dark:text-blue-300 hover:underline underline-offset-4">
                {title}
              </ExternalLink>
            ) : title}
            {badge && <span className="ml-2 text-base" aria-hidden="true">{badge}</span>}
          </h3>
          <a
            href={`#${anchorId}`}
            className="mt-1 shrink-0 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
            aria-label="Link to this project"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </a>
        </div>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{dateText}</p>
      </header>
      <p className="text-gray-700 dark:text-gray-200 leading-relaxed">{description}</p>
      {details && <div className="mt-3 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{details}</div>}
      {tags && tags.length > 0 && (
        <footer className="mt-5 pt-4 border-t border-gray-100 dark:border-gray-800 flex flex-wrap gap-1.5">
          <TagsComponent tags={tags} />
        </footer>
      )}
    </article>
  );
}
