/**
 * @file
 * @author Ceyhun Şen
 * @description Dynamic route for displaying categories and their posts. It
 * handles both the category listing and individual post display based on the
 * URL structure.
 * */

import {
  getAllPostsByCategory,
  getPostByCategory,
} from "@/_components/posts/list_posts_by_category";
import { PostContent } from "@/_components/posts/post_content";
import ListPostsByCategory, {
  getTotalPostPages,
  isPageNumber,
} from "@/_components/posts/list_posts_by_category";
import { Metadata } from "next";
import { notFound } from "next/navigation";

const CATEGORIES = {
  blog: "Blog",
  "technical-writings": "Technical Writings",
  "travel-logs": "Travel Logs",
};

export type Params = {
  params: Promise<{
    posts: string[];
  }>;
};

export async function generateStaticParams() {
  const params: any[] = [];

  for (const category of Object.keys(CATEGORIES)) {
    const posts = getAllPostsByCategory(category);
    params.push({
      posts: [category],
    });

    // Generate a static parameter for each post in the category.
    for (const post of posts) {
      params.push({
        posts: [category, post.name],
      });
    }

    // Generate a static parameter for each page in the category.
    const totalPages = getTotalPostPages(category);
    for (let i = 1; i <= totalPages; i++) {
      params.push({
        posts: [category, i.toString()],
      });
    }
  }

  return params;
}

export async function generateMetadata(props: Params): Promise<Metadata> {
  const params = (await props.params).posts;
  const category = params[0];
  const post = params[1];

  const TITLE = `Ceyhun Şen`;
  let title = `${CATEGORIES[category as keyof typeof CATEGORIES]} | ${TITLE}`;

  if (post && !isPageNumber(post)) {
    const postItem = getPostByCategory(category, post);

    if (!postItem) {
      return notFound();
    }

    title = `${postItem.title} | ${TITLE}`;
  }

  return {
    title,
  };
}

export default async function Index(props: Params) {
  const params = (await props.params).posts;
  const category = params[0];
  const categoryItem = params[1];

  if (categoryItem) {
    // If the item is a page number, display the posts in the category with
    // pagination.
    if (isPageNumber(categoryItem)) {
      return ListPostsByCategory(
        category,
        CATEGORIES[category as keyof typeof CATEGORIES],
        Number(categoryItem)
      );
    }
    // If the item is a post entry, display the post contents.
    else {
      const postItem = getPostByCategory(category, categoryItem);

      if (!postItem) {
        return notFound();
      }

      return PostContent(postItem);
    }
  }

  // If there is no item entry, display the first page of the category's posts
  // list.
  return ListPostsByCategory(
    category,
    CATEGORIES[category as keyof typeof CATEGORIES],
    1
  );
}
