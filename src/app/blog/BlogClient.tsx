"use client";

import { useState } from "react";

import TagFilter from "@/lib/components/TagFilter";
import ListContentItem from "@/lib/components/ListContentItem";

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
