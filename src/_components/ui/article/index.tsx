import styles from "./article.module.css";
import { PropsWithChildren } from "react";

/**
 * @description Component for displaying a styled `<article>` tag.
 * @param props Children to be displayed in the `<article>`.
 * @returns `<article>` tag with the children.
 */
export default function Article(props: PropsWithChildren) {
  return <article className={styles.article}>{props.children}</article>;
}
