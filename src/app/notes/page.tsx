import { getContentList, ContentType } from "@/lib/content";
import ListContentItem from "@/lib/components/ListContentItem";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Notes",
};

export default function ContentPage() {
  const contentList = getContentList(ContentType.notes);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Content</h1>
        <p className="text-xl text-gray-600">Various writings, reports, and other content.</p>
      </div>

      {contentList.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            No notes found. Add markdown files to the <code className="bg-gray-100 px-2 py-1 rounded">notes/</code> directory.
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {contentList.map((item) => (
            <ListContentItem key={item.slug} item={item} path="notes" />
          ))}
        </div>
      )}
    </div>
  );
}
