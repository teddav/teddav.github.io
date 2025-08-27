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
              <span key={tag} className="bg-gray-100 px-3 py-1 rounded text-sm">
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="mt-6 flex items-center gap-3">
          <span className="text-base text-gray-600">Enjoyed this? Share it:</span>
          <button
            onClick={() => {
              const url = encodeURIComponent(window.location.href);
              const text = encodeURIComponent(`Great article by @0xteddav !\n${content.title}`);
              window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, "_blank");
            }}
            className="inline-flex items-center gap-1.5 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-200"
          >
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.665 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
            </svg>
            Share
          </button>
        </div>
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
