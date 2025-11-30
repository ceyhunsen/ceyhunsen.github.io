import fs from "fs";
import sharp, { ResizeOptions } from "sharp";
import path from "path";

/**
 * @description Creates an optimized image for a given image.
 * @param {string} input - Path to the input image.
 * @param {string} outputDirectory - Directory where the thumbnail will be saved with the input file name's name.
 * @param {ResizeOptions} resizeOptions - Desired width and/or height of the thumbnail. If not provided, the original width/height is used.
 * @param {number} quality - Quality of the thumbnail. Default is 70.
 * @returns Path of the optimized image.
 */
export default async function createOptimizedImage(
  input: string,
  outputDirectory: string,
  quality: number = 70,
  resizeOptions?: ResizeOptions
): Promise<string> {
  const inputFileName = path.basename(input);
  const outputFileName = `${outputDirectory}/${inputFileName}`.replace(
    /\.[^/.]+$/,
    ".webp"
  );

  // Return early if the optimized image already exists.
  if (fs.existsSync(outputFileName)) {
    return outputFileName;
  }

  if (!fs.existsSync(outputDirectory)) {
    fs.mkdirSync(outputDirectory, { recursive: true });
  }

  const processor = sharp(input);
  const metadata = await processor.metadata();

  const processedImage = resizeOptions
    ? processor.resize(resizeOptions).webp({ quality })
    : processor.webp({ quality });

  // Try to rotate image if it has orientation metadata.
  try {
    if (metadata.orientation) {
      processedImage.rotate();
    }
  } catch (error) {
    throw new Error(`Error processing image ${input}: ${error}`);
  }

  await processedImage.toFile(outputFileName);

  return outputFileName;
}
