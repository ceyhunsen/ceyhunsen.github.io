import styles from "./paging_button.module.css";

/**
 * @description PagingButtons component is for navigating through paginated
 * content for a category. It provides "previous" and "next" buttons to
 * navigate. This assumes that for the number n in the range of 1 to
 * `totalPages`, any `category/n` is a valid URL.
 *
 * @param {Object} props - The properties for the component.
 * @param {string} props.category - The category of the content (e.g., "gallery").
 * @param {number} props.currentPage - The current page number.
 * @param {number} props.totalPages - The total number of pages available.
 * */
export default function PagingButtons({
  category,
  currentPage,
  totalPages,
}: {
  category: string;
  currentPage: number;
  totalPages: number;
}) {
  return (
    <div className={styles.buttons}>
      <a
        {...(currentPage > 1 && { href: `/${category}/${currentPage - 1}` })}
        className={
          currentPage <= 1 ? styles.disabled_button : styles.enabled_button
        }
        aria-label="Previous page"
        aria-disabled={currentPage <= 1}
      >
        ←
      </a>

      <a
        {...(currentPage < totalPages && {
          href: `/${category}/${currentPage + 1}`,
        })}
        className={
          currentPage >= totalPages
            ? styles.disabled_button
            : styles.enabled_button
        }
        aria-label="Next page"
        aria-disabled={currentPage >= totalPages}
      >
        →
      </a>
    </div>
  );
}
