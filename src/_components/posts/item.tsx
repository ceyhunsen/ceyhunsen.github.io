/**
 * Item box for posts.
 */

import { getAllPosts, Post } from "./read";
import "./posts.css";
import { Params } from "next/dist/server/request/params";

/**
 * Lists all posts in a category.
 *
 * @param category The category of the posts.
 * @returns A list of post items.
 */
export function ListPostItems({
  props,
  category,
  title,
}: {
  props: Params;
  category: string;
  title: string;
}) {
  const allPosts = getAllPosts(category);

  return (
    <div>
      <header>
        <h1>{title}</h1>
      </header>

      {allPosts.map((post) => (
        <PostItem props={props} post={post} key={post.title} />
      ))}
    </div>
  );
}

/**
 * Displays a single post item.
 *
 * @param post The post to display.
 * @returns A link to the post with title, image, description, and date.
 */
export function PostItem({ props, post }: { props: Params; post: Post }) {
  const postTags = post.tags || [];

  return (
    <div className="box">
      <a href={"/" + post.category + "/" + post.name}>
        {post.cover && (
          <img
            src={"/posts/" + post.category + "/" + post.name + "/" + post.cover}
            alt={post.title}
          />
        )}

        <h2 className="title">{post.title}</h2>

        <div className="date">
          <time>{post.date}</time>
        </div>

        {/* {post.tags && (
          <div className="tags">
            {postTags.map((postTag) => (
              <span key={postTag} className="tag">
                {postTag}
              </span>
            ))}
          </div>
        )} */}

        <p className="description">{post.description}</p>
      </a>
    </div>
  );
}
