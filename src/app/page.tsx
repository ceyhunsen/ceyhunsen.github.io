import { PostItem } from "@/_components/posts/item";
import { getPostByCategory } from "@/_components/posts/read";
import { Params } from "next/dist/server/request/params";

export default function Home(props: Params) {
  let highlightedPosts = [
    getPostByCategory("blog", "i-crashed-my-motorcycle-and-broke-my-wrist"),
    getPostByCategory("travel-logs", "riva-avenue"),
    getPostByCategory("travel-logs", "bangkok"),
    getPostByCategory("technical-writings", "c-compiling-basics"),
  ];

  return (
    <div>
      <header>
        <h1>Welcome</h1>
      </header>

      <article>
        <p>
          I am Ceyhun. I am a computer engineer, a motorcyclist and a traveller
          based in İstanbul/Türkiye.
        </p>

        <p>
          This is my personal website. Here, I share my technical
          knowledge/portfolio, travel experiences and other kinds of personal
          stuff. To know more about me, you can check out the{" "}
          <a href="/about">about me</a> page or{" "}
          <a href="/ceyhun_sen_resume.pdf">my resume</a>.
        </p>

        <h2>Highlighted Posts</h2>

        {highlightedPosts.map((post) => (
          <PostItem props={props} post={post} key={post.title} />
        ))}
      </article>
    </div>
  );
}
