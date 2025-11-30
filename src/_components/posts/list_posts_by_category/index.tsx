/**
 * @file
 * @author Ceyhun Şen
 * @description Provides a component for displaying posts in a category while
 * handling pagination. It also includes utility functions for managing post
 * categories and pagination.
 * */

import fs from "fs";
import matter from "gray-matter";
import { join } from "path";
import "highlight.js/styles/github-dark.css";
import { Post } from "../post_content";
import { notFound } from "next/navigation";
import PagingButtons from "../paging_button";
import { PostBox } from "../post_box";
import { SizedContent } from "@/_components/ui/sized_content";
import Header from "@/_components/ui/header";

const postsPerPage = 10;

/**
 * @description Get the directory for the given post category.
 *
 * @param category Category name.
 *
 * @returns Absolute (relative to project root) directory for the given category.
 */
function getCategoryDirectory(category: string): string {
  return join(process.cwd(), "/public/posts/" + category);
}

/**
 * @description Get a post's content and metadata.
 *
 * A post must have an `index.md` file in its directory. E.g.:
 * `/public/posts/blog/my-post/index.md`
 *
 * @param category Category of the post.
 * @param name Name of the post file.
 *
 * @returns Post's content and metadata.
 */
export function getPostByCategory(category: string, name: string): Post {
  // Get path to index.md.
  const postDirectory = getCategoryDirectory(category);
  const pathToIndex = join(postDirectory, `${name}/index.md`);

  // Read its content and metadata.
  const fileContents = fs.readFileSync(pathToIndex, "utf8");
  const { data, content } = matter(fileContents);

  return {
    name,
    content,
    category,
    ...data,
  } as Post;
}

/**
 * @description Get all posts in a category.
 *
 * @param category Category of the posts.
 *
 * @returns Contents and metadata of all the posts in the category.
 */
export function getAllPostsByCategory(category: string): Post[] {
  // Get all the post names in the category.
  const postsDirectory = getCategoryDirectory(category);
  const postNames = fs.readdirSync(postsDirectory);

  // Read all the posts and sort them by date in descending order.
  return postNames
    .map((postName) => getPostByCategory(category, postName))
    .sort((post1, post2) => {
      if (category === "travel-logs" && post1.last_visit && post2.last_visit) {
        return post1.last_visit > post2.last_visit ? -1 : 1;
      } else {
        return post1.date > post2.date ? -1 : 1;
      }
    });
}

export function isPageNumber(page: string): boolean {
  return !isNaN(Number(page)) && Number.isInteger(Number(page));
}

export function getTotalPostPages(category: string): number {
  const posts = getAllPostsByCategory(category);

  return Math.ceil(posts.length / postsPerPage);
}

/**
 * @description Component for displaying posts in a specific category with
 * pagination support.
 */
export default async function ListPostsByCategory(
  category: string,
  title: string,
  page: number
) {
  const pageNumber = page;
  if (isNaN(pageNumber) || pageNumber < 1) {
    return notFound();
  }

  const posts = getAllPostsByCategory(category);

  const slicedPosts = posts.slice(
    (page - 1) * postsPerPage,
    page * postsPerPage
  );

  return (
    <SizedContent>
      <Header>
        <h1>{title}</h1>
      </Header>

      {slicedPosts.map((post) => (
        <PostBox post={post} key={post.title} />
      ))}

      <PagingButtons
        category={category}
        currentPage={page}
        totalPages={getTotalPostPages(category)}
      />
    </SizedContent>
  );
}
