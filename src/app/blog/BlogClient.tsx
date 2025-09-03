"use client";

import { useState } from "react";

import TagFilter from "@/lib/components/TagFilter";
import ListContentItem from "@/lib/components/ListContentItem";
import { TwitterIcon } from "@/lib/components/Icons";

interface Article {
  slug: string;
  title: string;
  subtitle?: string;
  date: string;
  tags?: string[];
  authors?: string;
}

interface BlogClientProps {
  articles: Article[];
}

export default function BlogClient({ articles }: BlogClientProps) {
  const [filteredArticles, setFilteredArticles] = useState<Article[]>(articles);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Articles</h1>
        <p className="text-gray-600">Exploring cryptography, algebra, and the fascinating world of zero-knowledge proofs.</p>

        <div className="mt-6 flex items-center gap-3">
          <p className="text-gray-600">If you enjoy the content of my blog, please don&apos;t be selfish!</p>
          <button
            onClick={() => {
              const url = encodeURIComponent(window.location.href);
              const text = encodeURIComponent(`Learning about cryptography? @0xteddav's blog is a goldmine! 🧠\n`);
              window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, "_blank");
            }}
            className="inline-flex items-baseline gap-1 text-blue-600 hover:text-blue-700 hover:underline font-medium transition-colors duration-200 cursor-pointer"
          >
            <TwitterIcon className="w-3.5 h-3.5" />
            Let others know about it!
          </button>
          😁
        </div>
      </div>

      <TagFilter articles={articles} onFilteredArticles={setFilteredArticles} />

      <div className="space-y-6">
        {filteredArticles.map((article) => (
          <ListContentItem key={article.slug} item={article} path="blog" />
        ))}
      </div>
    </div>
  );
}
