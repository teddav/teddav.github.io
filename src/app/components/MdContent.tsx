"use client";

import { ContentProps } from "@/lib/content";
import MermaidRenderer from "./MermaidRenderer";
import TableOfContents from "./TableOfContents";

export default function MdContent({ content }: { content: ContentProps }) {
  return (
    <>
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{content.title}</h1>
        {content.subtitle && <p className="text-xl text-gray-600 mb-4">{content.subtitle}</p>}
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span>
            {new Date(content.date).toLocaleDateString(undefined, {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
          {content.authors && <span>by {content.authors}</span>}
        </div>
        {content.tags && content.tags.length > 0 && (
          <div className="flex gap-2 mt-4">
            {content.tags.map((tag: string) => (
              <span key={tag} className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                {tag}
              </span>
            ))}
          </div>
        )}
      </header>

      <TableOfContents toc={content.toc as string} />

      <div
        className="prose prose-lg prose-gray max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-blue-600 prose-strong:text-gray-900 prose-code:text-gray-800 prose-pre:bg-gray-50 prose-pre:border prose-pre:border-gray-200 prose-blockquote:border-l-4 prose-blockquote:border-gray-300 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-700 break-words overflow-wrap-anywhere"
        dangerouslySetInnerHTML={{ __html: content.content }}
      />
      <MermaidRenderer />
    </>
  );
}
