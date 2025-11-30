import Link from "next/link";
import styles from "./nav.module.css";

export default function Nav() {
  return (
    <nav className={styles.nav}>
      <div>
        <Link className={styles.logo} href="/">
          Ceyhun Şen
        </Link>
      </div>

      <div>
        <Link href="/technical-writings">Technical Writings</Link>
        <br />
        <Link href="/travel-logs">Travel Logs</Link>
        <br />
        <Link href="/gallery">Gallery</Link>
        <br />
        <Link href="/blog">Blog</Link>
      </div>

      <div>
        <a
          className={styles.resume}
          href="/resume/ceyhun_sen_software_engineer_resume.pdf"
          target="_blank"
        >
          Resume
        </a>
        <br />
        <Link className={styles.about_contact} href="/about">
          About
        </Link>{" "}
        <Link className={styles.about_contact} href="/contact">
          Contact
        </Link>
      </div>
    </nav>
  );
}
