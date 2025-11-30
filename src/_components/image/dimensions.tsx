/**
 * @file
 * @author Ceyhun Şen
 * @description Utility functions for getting image dimensions.
 */

import sharp from "sharp";
import { join } from "path";

/**
 * @description Returns the dimensions of an image file for a post.
 *
 * @param category Category of the post.
 * @param name Name of the post.
 * @param cover Name of the cover image file.
 *
 * @returns Dimensions of the image file.
 */
export async function getPostImageDimensions(
  category: string,
  name: string,
  cover: string
) {
  let imageSrc = join("public/posts", category, name, cover);

  return await getImageDimensionsFromSrc(imageSrc);
}

/**
 * @description Get the dimensions of an image file from the given relative path.
 *
 * @param src - Path to the image file (relative to project root) or URL.
 *
 * @return Dimensions of the image file.
 */
export async function getImageDimensionsFromSrc(
  src: string
): Promise<{ width: number; height: number }> {
  try {
    let image = join(process.cwd(), src);
    const metadata = await sharp(image).metadata();

    return {
      width: metadata.autoOrient?.width || metadata.width || 800,
      height: metadata.autoOrient?.height || metadata.height || 600,
    };
  } catch (error) {
    console.error(`Error getting image dimensions (${src}): ${error}`);
    return { width: 800, height: 600 };
  }
}
