import { getAllPosts, getPostByCategory } from "@/_components/posts/read";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import "@/_components/posts/posts.css";
import { PostContent } from "@/_components/posts/page";

const category = "blog";

export default async function Index(props: Params) {
  const params = await props.params;
  const post = getPostByCategory(category, params.post);

  if (!post) {
    return notFound();
  }

  return PostContent(post);
}

type Params = {
  params: Promise<{
    post: string;
  }>;
};

export async function generateMetadata(props: Params): Promise<Metadata> {
  const params = await props.params;
  const post = getPostByCategory(category, params.post);

  if (!post) {
    return notFound();
  }

  const CMS_NAME = "ceyhunsen.me";
  const title = `${post.title} | ${CMS_NAME}`;

  return {
    title,
  };
}

export async function generateStaticParams() {
  const posts = getAllPosts(category);

  return posts.map((post) => ({
    post: post.name,
  }));
}
