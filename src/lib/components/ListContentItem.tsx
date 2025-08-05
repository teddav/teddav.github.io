import Link from "next/link";

import { ContentMetadata } from "@/lib/content";

interface ListContentItemProps {
  item: ContentMetadata;
  path: "blog" | "notes";
}

export default function ListContentItem({ item, path }: ListContentItemProps) {
  return (
    <Link href={`/${path}/${item.slug}`} className="block">
      <article
        key={item.slug}
        className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-all duration-150 active:scale-99 cursor-pointer"
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-2 hover:text-blue-600">{item.title}</h2>
        {item.subtitle && <p className="text-gray-600 mb-3">{item.subtitle}</p>}
        <div className="mt-3 mb-2">
          <span className="text-sm text-gray-500">
            {new Date(item.date).toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>

        <div className="flex items-start justify-between text-sm text-gray-500">
          <div className="flex gap-1 flex-wrap min-w-0">
            {item.tags &&
              item.tags.length > 0 &&
              item.tags.map((tag) => (
                <span key={tag} className="bg-gray-100 px-2 py-1 rounded text-xs flex-shrink-0 whitespace-nowrap">
                  {tag}
                </span>
              ))}
          </div>
        </div>
      </article>
    </Link>
  );
}
