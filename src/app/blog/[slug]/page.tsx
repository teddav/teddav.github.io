import { notFound } from "next/navigation";
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

  return <MdContent content={article} permalink={`/blog/${slug}/`} />;
}
