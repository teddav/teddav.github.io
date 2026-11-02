import Link from "next/link";
import type { ContentProps } from "@/lib/content";
import MermaidRenderer from "./MermaidRenderer";
import TableOfContents from "./TableOfContents";
import { TwitterIcon } from "@/lib/components/Icons";

export default function MdContent({
  content,
  permalink,
}: {
  content: ContentProps;
  permalink: string;
}) {
  const isNote = permalink.startsWith("/notes/");
  const shareParams = new URLSearchParams({
    url: `https://teddav.github.io${permalink}`,
    text: `Great article by @0xteddav!\n${content.title}`,
  });

  return (
    <article className={`article-layout${content.toc ? " has-toc" : ""}`}>
      <header className="article-header">
        <Link href={isNote ? "/notes" : "/blog"} className="article-back">
          <span aria-hidden="true">←</span>{" "}
          {isNote ? "All notes" : "All articles"}
        </Link>
        <h1>{content.title}</h1>
        {content.subtitle && (
          <p className="article-subtitle">{content.subtitle}</p>
        )}
        <div className="article-meta">
          <time dateTime={new Date(content.date).toISOString()}>
            {new Date(content.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
              timeZone: "UTC",
            })}
          </time>
          {content.authors && <span>by {content.authors}</span>}
        </div>
        {content.tags && content.tags.length > 0 && (
          <ul className="article-tags" aria-label="Tags">
            {content.tags.map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>
        )}
      </header>

      {content.toc && (
        <TableOfContents key={`toc-${permalink}`} toc={content.toc} />
      )}

      <div
        id="article-body"
        className="article-body prose prose-gray dark:prose-invert"
        dangerouslySetInnerHTML={{ __html: content.content }}
      />
      <MermaidRenderer key={`diagrams-${permalink}`} />

      <footer className="article-footer">
        <p>Enjoyed this {isNote ? "note" : "article"}?</p>
        <a
          href={`https://twitter.com/intent/tweet?${shareParams}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <TwitterIcon className="w-4 h-4" /> Share it on Twitter
        </a>
      </footer>
    </article>
  );
}
