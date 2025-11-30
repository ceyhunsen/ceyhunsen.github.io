import Article from "@/_components/ui/article";
import Header from "@/_components/ui/header";
import { SizedContent } from "@/_components/ui/sized_content";

export default function Index() {
  return (
    <SizedContent>
      <Header>
        <h1>Contact Me</h1>
      </Header>

      <Article>
        <h1>Primary Contact Information</h1>
        <ul>
          <li>
            E-mail:{" "}
            <a href="mailto:ceyhuusen@gmail.com" target="_blank">
              ceyhuusen@gmail.com
            </a>
          </li>
          <li>
            LinkedIn:{" "}
            <a href="https://www.linkedin.com/in/ceyhun-sen/" target="_blank">
              linkedin.com/in/ceyhun-sen
            </a>
          </li>
          <li>
            Telegram:{" "}
            <a href="https://t.me/CeyhunSen" target="_blank">
              t.me/CeyhunSen
            </a>
          </li>
        </ul>

        <h1>Portfolio</h1>
        <ul>
          <li>
            Github:{" "}
            <a href="https://github.com/ceyhunsen/" target="_blank">
              github.com/ceyhunsen
            </a>
          </li>
        </ul>

        <h1>Social Media</h1>
        <ul>
          <li>
            Instagram:{" "}
            <a href="https://www.instagram.com/ceyhusen/" target="_blank">
              instagram.com/ceyhusen
            </a>
          </li>
          <li>
            YouTube:{" "}
            <a href="https://www.youtube.com/@ceyhu_sen/" target="_blank">
              youtube.com/@ceyhu_sen
            </a>
          </li>
          <li>
            Reddit:{" "}
            <a href="https://www.reddit.com/user/cleyclun/" target="_blank">
              reddit.com/user/cleyclun
            </a>
          </li>
          <li>
            X:{" "}
            <a href="https://x.com/ceyhusen/" target="_blank">
              x.com/ceyhusen
            </a>
          </li>
        </ul>

        <h1>Other</h1>
        <ul>
          <li>
            Spotify:{" "}
            <a
              href="https://open.spotify.com/user/mw9ifhrrbmj8sl3h98i7ndcp6?si=3057975b13744f20/"
              target="_blank"
            >
              Ceyhun Şen
            </a>
          </li>
          <li>
            Steam:{" "}
            <a href="https://steamcommunity.com/id/cleyclun/" target="_blank">
              steamcommunity.com/id/cleyclun
            </a>
          </li>
          <li>
            Xbox:{" "}
            <a href="https://www.xbox.com/play/user/cleyclun" target="_blank">
              xbox.com/play/user/cleyclun
            </a>
          </li>
        </ul>
      </Article>
    </SizedContent>
  );
}
