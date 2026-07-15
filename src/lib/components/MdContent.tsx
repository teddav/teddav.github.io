"use client";

import { ContentProps } from "@/lib/content";
import MermaidRenderer from "./MermaidRenderer";
import TableOfContents from "./TableOfContents";
import { TwitterIcon } from "@/lib/components/Icons";

export default function MdContent({ content }: { content: ContentProps }) {
  return (
    <>
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">{content.title}</h1>
        {content.subtitle && <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">{content.subtitle}</p>}
        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-500">
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
              <span key={tag} className="bg-gray-100 dark:bg-gray-700 dark:text-gray-200 px-3 py-1 rounded text-sm">
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="mt-6 text-base text-gray-600 dark:text-gray-400">
          Enjoyed this article?
          <br />
          <button
            onClick={() => {
              const url = encodeURIComponent(window.location.href);
              const text = encodeURIComponent(`Great article by @0xteddav !\n${content.title}\n`);
              window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, "_blank");
            }}
            className="inline-flex items-baseline gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-500 hover:underline font-medium transition-colors duration-200 cursor-pointer"
          >
            <TwitterIcon className="w-4 h-4" />
            Share it on Twitter
          </button>{" "}
          to help others discover it! 🥰
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
