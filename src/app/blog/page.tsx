import { getContentList, ContentType } from "@/lib/content";
import BlogClient from "./BlogClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog",
};

export default function BlogPage() {
  const articles = getContentList(ContentType.article);
  return <BlogClient articles={articles} />;
}
