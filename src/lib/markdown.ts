import remarkGfm from "remark-gfm";
import { unified } from "unified";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import remarkMath from "remark-math";
import rehypeKatex, { Options as KatexOptions } from "rehype-katex";
import rehypeHighlight from "rehype-highlight";
import { common } from "lowlight";
import { toc } from "mdast-util-toc";
import { toHast } from "mdast-util-to-hast";
import { Root } from "mdast";
import { Root as HastRoot } from "hast";
import { VFile } from "vfile";
import { toHtml } from "hast-util-to-html";

// Shared KaTeX options so the table of contents renders math identically to the body.
const katexOptions: KatexOptions = {
  strict: false,
  trust: true,
  macros: {
    "\\eqref": "\\href{#1}{}",
  },
  errorColor: " #cc0000",
};

// remark-math has already parsed `$...$` in headings into math nodes by the time this
// transformer runs, so the TOC hast contains `<code class="math-inline">` nodes. We run
// rehype-katex over that hast to render the math (otherwise the raw LaTeX shows up in the TOC).
function remarkTocPlugin() {
  return (tree: Root, file: VFile) => {
    const result = toc(tree, { maxDepth: 4 });
    if (result.map) {
      const hast = toHast(result.map) as HastRoot;
      rehypeKatex(katexOptions)(hast, file);
      file.data.toc = toHtml(hast);
    }
  };
}

export async function parseMarkdown(content: string) {
  return unified()
    .use(remarkParse)
    .use(remarkTocPlugin)
    .use(remarkGfm)
    .use(remarkMath)
    .use(remarkRehype, { allowDangerousHtml: true })
    // rehypeSlug must run BEFORE rehypeKatex: it derives heading ids from the raw heading
    // text (matching the TOC slugs). If it ran after KaTeX, the rendered math would leak into
    // the id and break the TOC anchor links.
    .use(rehypeSlug)
    .use(rehypeKatex, katexOptions)
    .use(rehypeAutolinkHeadings, {
      behavior: "append",
      content: (arg) => ({
        type: "element",
        tagName: "a",
        properties: {
          href: `#${String(arg.properties?.id)}`,
          className: "anchor-link",
          style: "margin-left: 4px; opacity: 0; transition: opacity 0.2s; text-decoration: none; color: #6b7280;",
        },
        children: [{ type: "text", value: "#" }],
      }),
    })
    .use(rehypeHighlight, { languages: { ...common } })
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(content);
}
