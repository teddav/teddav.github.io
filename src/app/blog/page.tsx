import fs from "fs";
import path from "path";
import matter from "gray-matter";
import BlogClient from "./BlogClient";

interface Article {
  slug: string;
  title: string;
  subtitle?: string;
  date: string;
  tags?: string[];
  authors?: string;
}

function getArticles(): Article[] {
  const articlesDirectory = path.join(process.cwd(), "articles");
  const filenames = fs.readdirSync(articlesDirectory);

  const articles = filenames
    .filter((filename) => filename.endsWith(".md"))
    .map((filename) => {
      const filePath = path.join(articlesDirectory, filename);
      const fileContents = fs.readFileSync(filePath, "utf8");
      const { data } = matter(fileContents);

      return {
        slug: filename.replace(/\.md$/, ""),
        title: data.title || "Untitled",
        subtitle: data.subtitle,
        date: data.date,
        tags: data.tags || [],
        authors: data.authors,
      };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return articles;
}

export default function BlogPage() {
  const articles = getArticles();

  return <BlogClient articles={articles} />;
}
