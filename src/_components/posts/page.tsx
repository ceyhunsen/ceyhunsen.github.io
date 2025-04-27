/**
 * @file
 * @description A post page components.
 */

import "@/_components/posts/posts.css";
import { Post } from "@/_components/posts/read";
import rehypeStringify from "rehype-stringify";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

export async function PostContent(post: Post) {
  const processedContent = await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeStringify)
    .process(post.content);

  const htmlContent = processedContent.toString();

  return (
    <div>
      <header>
        <h1>{post.title}</h1>
        <div className="date">
          <time>{post.date}</time>
        </div>
      </header>

      <article dangerouslySetInnerHTML={{ __html: htmlContent }}></article>
    </div>
  );
}
