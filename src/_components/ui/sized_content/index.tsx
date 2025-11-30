import { PropsWithChildren } from "react";
import styles from "./sized_content.module.css";

/**
 * @description Component for displaying a styled `<div>` tag that contains the
 * main content of an article.
 * @param props Children to be displayed in the `<div>`.
 * @returns `<div>` tag with the children.
 */
export function SizedContent(props: PropsWithChildren) {
  return <div className={styles.article_content}>{props.children}</div>;
}
