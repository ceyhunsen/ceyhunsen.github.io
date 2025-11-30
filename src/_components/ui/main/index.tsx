import { PropsWithChildren } from "react";
import styles from "./main.module.css";

/**
 * @description Component for displaying a styled `<main>` tag.
 * @param props Children to be displayed in the `<main>`.
 * @returns `<main>` tag with the children.
 */
export function Main(props: PropsWithChildren) {
  return <main className={styles.main}>{props.children}</main>;
}
