import styles from "./footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <p>Ceyhun Şen, {new Date().getFullYear()}</p>
    </footer>
  );
}
