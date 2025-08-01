import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { notFound } from "next/navigation";
import { parseMarkdown } from "@/lib/markdown";
import MermaidRenderer from "../../components/MermaidRenderer";
import TableOfContents from "../../components/TableOfContents";
import Link from "next/link";

interface ArticlePageProps {
  params: {
    slug: string;
  };
}

async function getArticle(slug: string) {
  try {
    const articlesDirectory = path.join(process.cwd(), "articles");
    const filePath = path.join(articlesDirectory, `${slug}.md`);
    const fileContents = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(fileContents);

    const processedContent = await parseMarkdown(content);
    const contentHtml = processedContent.toString();

    return {
      slug,
      title: data.title,
      subtitle: data.subtitle,
      date: data.date,
      tags: data.tags || [],
      authors: data.authors,
      content: contentHtml,
      toc: processedContent.data.toc,
    };
  } catch (error) {
    console.error(error);
    return null;
  }
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const article = await getArticle(params.slug);

  if (!article) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <article className="lg:ml-80">
        <div className="mb-6">
          <Link href="/blog" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Articles
          </Link>
        </div>
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{article.title}</h1>
          {article.subtitle && <p className="text-xl text-gray-600 mb-4">{article.subtitle}</p>}
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span>
              {new Date(article.date).toLocaleDateString(undefined, {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
            {article.authors && <span>by {article.authors}</span>}
          </div>
          {article.tags && article.tags.length > 0 && (
            <div className="flex gap-2 mt-4">
              {article.tags.map((tag: string) => (
                <span key={tag} className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        <TableOfContents toc={article.toc as string} />

        <div
          className="prose prose-lg prose-gray max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-blue-600 prose-strong:text-gray-900 prose-code:text-gray-800 prose-pre:bg-gray-50 prose-pre:border prose-pre:border-gray-200 prose-blockquote:border-l-4 prose-blockquote:border-gray-300 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-700"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
        <MermaidRenderer />
      </article>
    </div>
  );
}
