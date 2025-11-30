/**
 * @file image.tsx
 * @description Components for handling images.
 */

import { getImageDimensionsFromSrc } from "@/_components/image/dimensions";

/**
 * @description A component that displays an image with a caption.
 *
 * @param {string} source - Source URL of the image.
 * @param {string} caption - Caption (also alt) for the image.
 * @param {boolean} lazy - Whether to load the image lazily. Defaults to true.
 */
export default async function ImageWithCaption({
  source,
  caption,
  lazy = true,
}: {
  source: string;
  caption: string;
  lazy?: boolean;
}) {
  const dimensions = await getImageDimensionsFromSrc(`public/${source}`);

  return (
    <figure>
      <img
        src={source}
        alt={caption}
        width={dimensions.width}
        height={dimensions.height}
        style={{ width: "100%", height: "auto" }}
        {...(lazy ? { loading: "lazy" } : {})}
      />
      <figcaption>{caption}</figcaption>
    </figure>
  );
}
