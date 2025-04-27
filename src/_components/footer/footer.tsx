import "./footer.css";

export default function footer() {
  return (
    <footer>
      <p>Ceyhun Şen, {new Date().getFullYear()}</p>

      <div>
        <a href="mailto:ceyhuusen@gmail.com" target="_blank">
          <img src="/assets/logos/envelope.svg" />
        </a>
        <a href="https://www.linkedin.com/in/ceyhun-sen/" target="_blank">
          <img src="/assets/logos/linkedin.svg" />
        </a>
        <a href="https://github.com/ceyhunsen" target="_blank">
          <img src="/assets/logos/github.svg" />
        </a>
      </div>
    </footer>
  );
}
