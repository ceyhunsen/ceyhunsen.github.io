import styles from "./header.module.css";
import { PropsWithChildren } from "react";

/**
 * @description Component for displaying a styled `<header>` tag.
 * @param props Children to be displayed in the `<header>`.
 * @returns `<header>` tag with the children.
 */
export default function Header(props: PropsWithChildren) {
  return <header className={styles.header}>{props.children}</header>;
}
