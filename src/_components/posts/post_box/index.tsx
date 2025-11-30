import { LOCALE, Post } from "../post_content";
import styles from "./post_box.module.css";
import post_content_styles from "../post_content/post_content.module.css";
import { getImageDimensionsFromSrc } from "@/_components/image/dimensions";
import { downloadImage, isPathAnURL } from "@/_components/image/downloader";

/**
 * @description Component for displaying a single post.
 *
 * @param post Post metadata.
 *
 * @returns Post box with metadata.
 */
export async function PostBox({ post }: { post: Post }) {
  // If cover is specified, check if it is URL and handle paths for the both
  // cases.
  let src = null;
  if (post.cover) {
    if (isPathAnURL(post.cover)) {
      await downloadImage(
        post.cover,
        `public/images/posts/${post.category}/${post.name}`,
        `cover`
      );

      src = `/images/posts/${post.category}/${post.name}/cover`;
    } else {
      src = `/posts/${post.category}/${post.name}/${post.cover}`;
    }
  }

  let dimensions = { width: 800, height: 600 };
  if (src) {
    dimensions = await getImageDimensionsFromSrc(`public/${src}`);
  }

  return (
    <div className={styles.box}>
      <a href={"/" + post.category + "/" + post.name}>
        {src && (
          <div className={styles.image_container}>
            <img
              src={src}
              alt={post.title}
              width={dimensions.width}
              height={dimensions.height}
              style={{ width: "100%", height: "auto" }}
              loading="lazy"
            />
          </div>
        )}

        <h2 className={styles.title}>{post.title}</h2>

        {post.last_visit &&
        new Date(post.last_visit).toLocaleDateString(LOCALE) !==
          new Date(post.date).toLocaleDateString(LOCALE) ? (
          <div className={post_content_styles.date}>
            <time>
              Last visit: {new Date(post.last_visit).toLocaleDateString(LOCALE)}
            </time>
            <br />
            <time>
              First time visited:{" "}
              {new Date(post.date).toLocaleDateString(LOCALE)}
            </time>
          </div>
        ) : (
          <div className={post_content_styles.date}>
            <time>{new Date(post.date).toLocaleDateString(LOCALE)}</time>
          </div>
        )}

        {post.tags &&
          post.tags.map((tag) => {
            return (
              <div className={styles.tag_box} key={tag}>
                <span>{tag}</span>
              </div>
            );
          })}

        {post.description && (
          <p className={styles.description}>{post.description}</p>
        )}
      </a>
    </div>
  );
}
