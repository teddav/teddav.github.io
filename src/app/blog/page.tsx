import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Link from "next/link";

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

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Articles</h1>
        <p className="text-gray-600">Exploring cryptography, algebra, and the fascinating world of zero-knowledge proofs.</p>
      </div>

      <div className="space-y-6">
        {articles.map((article) => (
          <article key={article.slug} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <Link href={`/blog/${article.slug}`} className="block">
              <h2 className="text-xl font-semibold text-gray-900 mb-2 hover:text-blue-600">{article.title}</h2>
              {article.subtitle && <p className="text-gray-600 mb-3">{article.subtitle}</p>}
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>{new Date(article.date).toLocaleDateString()}</span>
                {article.tags && article.tags.length > 0 && (
                  <div className="flex gap-2">
                    {article.tags.map((tag) => (
                      <span key={tag} className="bg-gray-100 px-2 py-1 rounded text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
