import "./navigation.css";

export default function navigationPane() {
  return (
    <nav>
      <div>
        <a id="logo" href="/">
          Ceyhun Şen
        </a>
      </div>

      <div>
        <a href="/technical-writings">Technical Writings</a>
        <br />
        <a href="/travel-logs">Travel Logs</a>
        <br />
        <a href="/blog">Blog</a>
        <br />
        <a href="/about">About</a>
        <br />
      </div>

      <div>
        <a id="resume" href="/assets/ceyhun_sen_resume.pdf" target="_blank">
          Resume
        </a>
      </div>
    </nav>
  );
}
