import { PropsWithChildren } from "react";
import styles from "./responsive_iframe.module.css";

/**
 * @description Responsive iframe component: Makes its children iframe
 * responsive to the content width.
 *
 * @returns A div with a class that makes the iframe responsive.
 */
export default function ResponsiveIframe(props: PropsWithChildren) {
  return <div className={styles.iframeWrapper}>{props.children}</div>;
}
