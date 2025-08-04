import Link from "next/link";

import { ContentMetadata } from "@/lib/content";

interface ListContentItemProps {
  item: ContentMetadata;
  path: "blog" | "content";
}

export default function ListContentItem({ item, path }: ListContentItemProps) {
  return (
    <article key={item.slug} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      <Link href={`/${path}/${item.slug}`} className="block">
        <h2 className="text-xl font-semibold text-gray-900 mb-2 hover:text-blue-600">{item.title}</h2>
        {item.subtitle && <p className="text-gray-600 mb-3">{item.subtitle}</p>}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>
            {new Date(item.date).toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
          {item.tags && item.tags.length > 0 && (
            <div className="flex gap-2">
              {item.tags.map((tag) => (
                <span key={tag} className="bg-gray-100 px-2 py-1 rounded text-xs">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </Link>
    </article>
  );
}
