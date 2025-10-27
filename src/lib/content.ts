import fs from "fs";
import path from "path";
import { parseMarkdown } from "./markdown";
import matter from "gray-matter";

export enum ContentType {
  article = "articles",
  notes = "notes",
}

export interface ContentMetadata {
  slug: string;
  title: string;
  subtitle?: string;
  date: string;
  tags?: string[];
  authors?: string;
  summary?: string;
  thumbnail?: string;
}

export interface ContentProps {
  slug: string;
  title: string;
  subtitle?: string;
  date: string;
  tags?: string[];
  authors?: string;
  content: string;
  toc: string;
}

const basePath = path.join(process.cwd(), "content");

export function getContentList(contentType: ContentType): ContentMetadata[] {
  const directory = path.join(basePath, contentType);
  const filenames = fs.readdirSync(directory);

  const files = filenames
    .filter((filename) => filename.endsWith(".md"))
    .map((filename) => {
      const filePath = path.join(directory, filename);
      const fileContents = fs.readFileSync(filePath, "utf8");
      const { data } = matter(fileContents);

      return {
        slug: filename.replace(/\.md$/, ""),
        title: data.title || "Untitled",
        subtitle: data.subtitle,
        date: data.date,
        tags: data.tags || [],
        authors: data.authors,
        summary: data.summary,
        thumbnail: data.thumbnail,
      };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return files;
}

export async function getContent(slug: string, contentType: ContentType): Promise<ContentProps | null> {
  try {
    const directory = path.join(basePath, contentType);
    const filePath = path.join(directory, `${slug}.md`);
    const fileContents = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(fileContents);

    const processedContent = await parseMarkdown(content);
    const contentHtml = processedContent.toString();

    return {
      slug,
      title: data.title,
      subtitle: data.subtitle,
      date: data.date,
      tags: data.tags || [],
      authors: data.authors,
      content: contentHtml,
      toc: processedContent.data.toc as string,
    };
  } catch (error) {
    console.error(error);
    return null;
  }
}
