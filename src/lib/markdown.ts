import remarkGfm from "remark-gfm";
import { unified } from "unified";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeHighlight from "rehype-highlight";
import { common } from "lowlight";
import { toc } from "mdast-util-toc";
import { toHast } from "mdast-util-to-hast";
import { Root } from "mdast";
import { VFile } from "vfile";
import { toHtml } from "hast-util-to-html";

function remarkTocPlugin() {
  return (tree: Root, file: VFile) => {
    const result = toc(tree, { maxDepth: 4 });
    console.log(result.map);
    if (result.map) {
      const hast = toHast(result.map);
      file.data.toc = toHtml(hast);
    }

    // const { visit } = await import("unist-util-visit");
    // if (result.map) {
    //   // Replace <!-- toc --> HTML comment with ToC
    //   visit(tree, "html", (node, index, parent) => {
    //     console.log(node);
    //     if (node.value.trim() === "<!-- toc -->" && parent) {
    //       parent.children.splice(index, 1, result.map);
    //     }
    //   });
    // }
  };
}

export async function parseMarkdown(content: string) {
  return unified()
    .use(remarkParse)
    .use(remarkTocPlugin)
    .use(remarkGfm)
    .use(remarkMath)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeKatex, {
      strict: false,
      trust: true,
      macros: {
        "\\eqref": "\\href{#1}{}",
      },
      errorColor: " #cc0000",
      throwOnError: false,
      displayMode: false,
    })
    .use(rehypeSlug)
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
