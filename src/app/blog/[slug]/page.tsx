import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";

import { getContent, ContentType, getContentList } from "@/lib/content";
import MdContent from "@/lib/components/MdContent";

interface ArticlePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const content = getContentList(ContentType.article).filter((c) => c.slug === slug)[0];

  if (!content) {
    return {
      title: "Article not found",
    };
  }

  return {
    title: content.title,
  };
}

export async function generateStaticParams() {
  const content = getContentList(ContentType.article);
  return content.map((c) => ({
    slug: c.slug,
  }));
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = await getContent(slug, ContentType.article);

  if (!article) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <article className="lg:ml-64 lg:pl-4">
        <div className="mb-6">
          <Link href="/blog" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Articles
          </Link>
        </div>

        <MdContent content={article} />
      </article>
    </div>
  );
}
