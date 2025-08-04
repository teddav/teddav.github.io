"use client";

import { useState, useMemo } from "react";

interface Article {
  slug: string;
  title: string;
  subtitle?: string;
  date: string;
  tags?: string[];
  authors?: string;
}

interface TagFilterProps {
  articles: Article[];
  onFilteredArticles: (articles: Article[]) => void;
}

export default function TagFilter({ articles, onFilteredArticles }: TagFilterProps) {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Get all unique tags from articles
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    articles.forEach((article) => {
      article.tags?.forEach((tag) => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, [articles]);

  // Filter articles based on selected tags
  const filteredArticles = useMemo(() => {
    if (selectedTags.length === 0) {
      return articles;
    }
    return articles.filter((article) => article.tags?.some((tag) => selectedTags.includes(tag)));
  }, [articles, selectedTags]);

  // Update parent component when filtered articles change
  useMemo(() => {
    onFilteredArticles(filteredArticles);
  }, [filteredArticles, onFilteredArticles]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  };

  const clearAllTags = () => {
    setSelectedTags([]);
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Filter by tags</h2>
        {selectedTags.length > 0 && (
          <button onClick={clearAllTags} className="text-sm text-gray-500 hover:text-gray-700 underline">
            Clear all
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {allTags.map((tag) => (
          <button
            key={tag}
            onClick={() => toggleTag(tag)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 ${
              selectedTags.includes(tag) ? "bg-blue-600 text-white shadow-md" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {tag}
            {selectedTags.includes(tag) && <span className="ml-1 text-xs">×</span>}
          </button>
        ))}
      </div>

      {selectedTags.length > 0 && (
        <div className="mt-3 text-sm text-gray-600">
          Showing {filteredArticles.length} article{filteredArticles.length !== 1 ? "s" : ""}
          with {selectedTags.length > 1 ? "any of the selected" : "the"} tag{selectedTags.length > 1 ? "s" : ""}
        </div>
      )}
    </div>
  );
}
