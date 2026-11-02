import remarkGfm from "remark-gfm";
import { remarkAlert } from "remark-github-blockquote-alert";
import { unified } from "unified";
import { visitParents } from "unist-util-visit-parents";
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
import { defaultHandlers, toHast } from "mdast-util-to-hast";
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

function rehypeReadingLinks() {
  return (tree: HastRoot) => {
    visitParents(tree, "element", (node, ancestors) => {
      if (node.tagName === "a") {
        const href = String(node.properties.href ?? "");
        if (
          /^(https?:)?\/\//i.test(href) &&
          new URL(href, "https://teddav.github.io").origin !== "https://teddav.github.io"
        ) {
          node.properties.target = "_blank";
          node.properties.rel = ["noopener", "noreferrer"];
        }
      }

      if (node.tagName === "img" && node.properties.src) {
        const existingLink = ancestors.find(
          (ancestor) => ancestor.type === "element" && ancestor.tagName === "a"
        );
        if (existingLink?.type === "element") {
          existingLink.properties.target = "_blank";
          existingLink.properties.rel = ["noopener", "noreferrer"];
          return;
        }
        const parent = ancestors.at(-1)!;
        parent.children.splice(parent.children.indexOf(node), 1, {
          type: "element",
          tagName: "a",
          properties: {
            href: node.properties.src,
            target: "_blank",
            rel: ["noopener", "noreferrer"],
            title: "Open full-size image in a new tab",
          },
          children: [node],
        });
      }
    });
  };
}

export async function parseMarkdown(content: string) {
  return unified()
    .use(remarkParse)
    .use(remarkTocPlugin)
    .use(remarkGfm)
    .use(remarkMath)
    .use(remarkAlert)
    .use(remarkRehype, {
      allowDangerousHtml: true,
      handlers: {
        table(state, node) {
          return {
            type: "element",
            tagName: "div",
            properties: { className: ["table-scroll"], tabIndex: 0, role: "region", ariaLabel: "Scrollable table" },
            children: [defaultHandlers.table(state, node)],
          };
        },
      },
    })
    // rehypeSlug must run BEFORE rehypeKatex: it derives heading ids from the raw heading
    // text (matching the TOC slugs). If it ran after KaTeX, the rendered math would leak into
    // the id and break the TOC anchor links.
    .use(rehypeSlug)
    .use(rehypeKatex, katexOptions)
    .use(rehypeAutolinkHeadings, {
      behavior: "append",
      properties: {
        className: "anchor-link",
        ariaLabel: "Link to this section",
      },
      content: { type: "text", value: "#" },
    })
    .use(rehypeHighlight, { languages: { ...common } })
    .use(rehypeReadingLinks)
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(content);
}
