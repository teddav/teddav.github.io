import { notFound } from "next/navigation";
import { getContent, ContentType, getContentList } from "@/lib/content";
import MdContent from "@/lib/components/MdContent";
import type { Metadata } from "next";

interface ContentPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: ContentPageProps): Promise<Metadata> {
  const { slug } = await params;
  const content = getContentList(ContentType.notes).filter((c) => c.slug === slug)[0];

  if (!content) {
    return {
      title: "Note not found",
    };
  }

  return {
    title: content.title,
  };
}

export async function generateStaticParams() {
  const content = getContentList(ContentType.notes);
  return content.map((c) => ({
    slug: c.slug,
  }));
}

export default async function ContentPage({ params }: ContentPageProps) {
  const { slug } = await params;
  const content = await getContent(slug, ContentType.notes);

  if (!content) {
    notFound();
  }

  return <MdContent content={content} permalink={`/notes/${slug}/`} />;
}
