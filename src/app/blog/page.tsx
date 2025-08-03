import { getContentList, ContentType } from "@/lib/content";
import BlogClient from "./BlogClient";

export default function BlogPage() {
  const articles = getContentList(ContentType.article);
  return <BlogClient articles={articles} />;
}
