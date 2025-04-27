/**
 * Read operations for posts.
 */

import fs from "fs";
import matter from "gray-matter";
import { join } from "path";

export type Post = {
  name: string;
  title: string;
  category: string;
  date: string;
  cover?: string;
  description: string;
  tags?: string[];
  content: string;
  preview?: boolean;
};

/**
 * Returns the directory path for the given post category.
 *
 * @param category The category of the posts (also the directory).
 *
 * @returns Absolute directory path for the posts in the given category.
 */
function getDirectory(category: string): string {
  return join(process.cwd(), "/public/posts/" + category);
}

/**
 * Returns the post details.
 *
 * @param category The category of the post.
 * @param post The name of the post file.
 *
 * @returns The post details including title, date, cover image, description, and content.
 */
export function getPostByCategory(category: string, post: string) {
  const postsDirectory = getDirectory(category);

  const strippedPostName = post.replace(/\.mdx$/, "");
  const fullPath = join(postsDirectory, `${strippedPostName}/index.mdx`);

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  return {
    ...data,
    name: strippedPostName,
    content,
    category: category,
  } as Post;
}

/**
 * Returns all posts in a category.
 */
export function getAllPosts(folder: string): Post[] {
  const postsDirectory = getDirectory(folder);
  let postNames = fs.readdirSync(postsDirectory);

  // Get all posts and sort them by date in descending order.
  let posts = postNames
    .map((postName) => getPostByCategory(folder, postName))
    .sort((post1, post2) => (post1.date > post2.date ? -1 : 1));

  return posts;
}
