/**
 * @file
 * @description A post page components.
 */

import { remark } from "remark";
// import { unified } from "unified";
import "@/_components/posts/posts.css";
import { Post } from "@/_components/posts/read";
import remarkMdx from "remark-mdx";
// import rehypeDocument from "rehype-document";
// import rehypeFormat from "rehype-format";
import rehypeStringify from "rehype-stringify";
import remarkParse from "remark-parse";
import html from "remark-html";
import remarkRehype from "remark-rehype";
// import { read } from "to-vfile";
import { unified } from "unified";
import rehypeDocument from "rehype-document";
import rehypeFormat from "rehype-format";

// import rehypeStringify from "rehype-stringify";

// import { reporter } from "vfile-reporter";

export async function PostContent(post: Post) {
  // const result = await remark().use(html).process(post.content);
  // const content = result.toString();

  // Use gray-matter to parse the post metadata section
  // console.log("Post content:", post.content);
  // const matterResult = matter(post.content);

  // Use remark to convert markdown into HTML string
  // const x = await remark().use(remarkParse).use(html).process(post.content);
  // .use(rehypeDocument)
  // .use(rehypeFormat)
  // .use(rehypeStringify);
  // const file = await unified()
  //   .use(remarkMdx)
  //   .use(remarkRehype)
  //   .use(remarkParse)
  //   // .use(rehypeDocument)
  //   .use(rehypeFormat)
  //   .use(rehypeStringify)
  //   .process(post.content);
  // console.log("File:", file);

  const processedContent = await unified()
    .use(remarkMdx)
    .use(remarkRehype)
    .use(remarkParse)
    .use(rehypeFormat)
    .use(rehypeStringify)
    .process(post.content);
  const contentHtml = processedContent.toString();
  console.log("X:", contentHtml);

  return (
    <div>
      <header>
        <h1>{post.title}</h1>
        <div className="date">
          <time>{post.date}</time>
        </div>
      </header>

      <article dangerouslySetInnerHTML={{ __html: contentHtml }}></article>
    </div>
  );
}
