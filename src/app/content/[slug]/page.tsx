import { notFound } from "next/navigation";
import { getContent, ContentType } from "@/lib/content";
import MdContent from "@/app/components/MdContent";

interface ContentPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ContentPage({ params }: ContentPageProps) {
  const { slug } = await params;
  const content = await getContent(slug, ContentType.other);

  if (!content) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <article className="lg:ml-80">
        <MdContent content={content} />
      </article>
    </div>
  );
}
