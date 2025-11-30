import Article from "@/_components/ui/article";
import { SizedContent } from "@/_components/ui/sized_content";
import ImageWithCaption from "@/_components/ui/image_with_caption";
import Link from "next/link";
import Header from "@/_components/ui/header";

export default function Index() {
  let currentYear = new Date().getFullYear();

  return (
    <SizedContent>
      <Header>
        <h1>About Me</h1>
      </Header>

      <Article>
        <ImageWithCaption
          source="assets/about_me.jpg"
          caption="A photo of me, staring into a river in Bangkok, Thailand."
          lazy={false}
        />
        <p>
          I am a computer engineer by profession. I enjoy working on low-level
          software. In college, I was part of a team and took responsibility for
          developing low-level software for our projects. After college, I
          worked on Linux device drivers and BSP (Board Support Package)
          development. These fields are my favorite areas to work in and where
          my expertise lies.
        </p>
        <p>
          I also enjoy working on high-level software if the project is
          interesting. Currently, I work in the blockchain space. My previous
          experiences are detailed in my{" "}
          <a href="/resume/ceyhun_sen_software_engineer_resume.pdf">resume</a>.
        </p>
        <p>
          I also share some of my hobbies here, on this website. I ride my
          motorcycle and take pictures of the scenery I see on the way. These
          pictures and some of the cool routes I discover are shared in my{" "}
          <Link href="/travel-logs">travel logs</Link>. I sometimes write{" "}
          <Link href="/technical-writings">technical articles</Link> about my
          hobbies and work. I also share other miscellaneous topics and thoughts
          on <Link href="/blog">my blog</Link>.
        </p>

        <p>
          Ceyhun Şen&apos;s personal website © {currentYear} by Ceyhun Şen is
          licensed under CC BY 4.0. To view a copy of this license, visit{" "}
          <a
            href="https://creativecommons.org/licenses/by/4.0/"
            target="_blank"
          >
            creativecommons.org/licenses/by/4.0
          </a>
        </p>
      </Article>
    </SizedContent>
  );
}
