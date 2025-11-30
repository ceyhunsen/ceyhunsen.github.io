import rehypeStringify from "rehype-stringify";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import { visit } from "unist-util-visit";
import rehypeHighlight from "rehype-highlight";
import styles from "./post_content.module.css";
import { SizedContent } from "@/_components/ui/sized_content";
import Article from "@/_components/ui/article";
import Header from "@/_components/ui/header";
import { getImageDimensionsFromSrc } from "@/_components/image/dimensions";
import {
  downloadImage,
  convertAltNameToUnderscored,
  isPathAnURL,
} from "@/_components/image/downloader";

export const LOCALE = "tr-TR";

/**
 * @description A post's content and metadata.
 *
 * @argument name File name of the post.
 * @argument title Display title of the post.
 * @argument description [Optional] Short description of the post.
 * @argument date Release date of the post.
 * @argument date Last visit date for travel logs.
 * @argument category Category of the post.
 * @argument cover [Optional] Cover image of the post.
 * @argument tags [Optional] Tags of the post.
 * @argument content Actual content of the post.
 */
export interface Post {
  name: string;
  title: string;

  date: Date;
  last_visit?: Date;
  category: string;
  description?: string;

  cover?: string;
  tags?: string[];

  content: string;
}

/**
 * @description Transform `<img>` elements to `<figure>` with `<figcaption>`.
 *
 * @returns A transformer function for rehype.
 */
function transformImageToImageWithCaption(options: { post: Post }) {
  return async (tree: any) => {
    const downloadPromises: Promise<void>[] = [];
    const dimesionPromises: Promise<void>[] = [];

    // Download image if the src is an URL. This visiting is being done first,
    // because other modifications require the image to be on the source
    // directory.
    visit(tree, "element", (node, _, _parent) => {
      if (node.tagName === "img") {
        if (isPathAnURL(node.properties.src)) {
          let fileName = convertAltNameToUnderscored(node.properties.alt);
          let destination = `images/posts/${options.post.category}/${options.post.name}`;

          const promise = downloadImage(
            node.properties.src,
            `public/${destination}`,
            fileName
          );

          fileName = `${destination}/${fileName}`;
          node.properties.src = `/${fileName}`;

          downloadPromises.push(promise);
        }
      }
    });
    await Promise.all(downloadPromises);

    // Make the img element a figure with caption.
    visit(tree, "element", (node, _, parent) => {
      if (node.tagName === "img") {
        // Convert parent to figure.
        parent.tagName = "figure";

        // Set image dimensions and loading attribute.
        const promise = getImageDimensionsFromSrc(
          `/public/${node.properties?.src}`
        ).then((dimensions) => {
          node.properties.width = dimensions.width || 800;
          node.properties.height = dimensions.height || 600;
          node.properties.loading = "lazy";
          node.properties.style = "width: 100%; height: auto;";
        });
        dimesionPromises.push(promise);

        // If the image has an alt text, create a figcaption with text in it.
        if (node.properties.alt) {
          const caption = {
            type: "element",
            tagName: "figcaption",
            children: [
              {
                type: "text",
                value: node.properties?.alt || "",
              },
            ],
          };

          parent.children = [node, caption];
        }
      }
    });
    await Promise.all(dimesionPromises);
  };
}

/**
 * @description Component for displaying a post's content and metadata.
 *
 * @param post Post content and metadata.
 *
 * @returns Post page content.
 */
export async function PostContent(post: Post) {
  const processedContent = await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeHighlight)
    .use(rehypeStringify)
    .use(transformImageToImageWithCaption, { post: post })
    .process(post.content);
  const htmlContent = processedContent.toString();

  return (
    <SizedContent>
      <Header>
        <h1>{post.title}</h1>
        {post.last_visit &&
        new Date(post.last_visit).toLocaleDateString(LOCALE) !==
          new Date(post.date).toLocaleDateString(LOCALE) ? (
          <div className={styles.date}>
            <time>
              Last visit: {new Date(post.last_visit).toLocaleDateString(LOCALE)}
            </time>{" "}
            <br />
            <time>
              First time visited:{" "}
              {new Date(post.date).toLocaleDateString(LOCALE)}
            </time>
          </div>
        ) : (
          <div className={styles.date}>
            <time>{new Date(post.date).toLocaleDateString(LOCALE)}</time>
          </div>
        )}
      </Header>

      <Article>
        <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
      </Article>
    </SizedContent>
  );
}
