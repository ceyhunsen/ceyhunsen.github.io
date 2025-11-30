import fs from "fs";
import http from "http";
import https from "https";
import path, { join } from "path";
import sharp, { FormatEnum } from "sharp";

/**
 * @description Downloads an image from a given URL and saves it to the
 * specified destination.
 *
 * @param src - The source URL of the image to download.
 * @param destination - The directory where the image should be saved.
 * @param [fallbackFilename] - Optional fallback filename to use if the
 * Content-Disposition header does not provide a filename. If this is specified,
 * and a file with this name already exists in the destination directory, image
 * dowload will be skipped regardless.
 *
 * @returns A promise that resolves when the image is downloaded
 * and saved, or rejects if an error occurs.
 * @throws If the image cannot be downloaded or saved.
 */
export async function downloadImage(
  src: string,
  destination: string,
  fallbackFilename?: string
): Promise<void> {
  // Create output directory if it doesn't exist
  if (!fs.existsSync(destination)) {
    fs.mkdirSync(destination, { recursive: true });
  }

  // Return early if the image with fallback name already exists to save
  // bandwidth.
  if (
    fallbackFilename &&
    fs.existsSync(path.join(destination, fallbackFilename))
  ) {
    return;
  }

  // Convert Google Drive share links to direct download links.
  if (
    src.startsWith("https://drive.google.com/file/d/") &&
    src.endsWith("/view?usp=drive_link")
  ) {
    src = src.replace(
      "https://drive.google.com/file/d/",
      "https://drive.usercontent.google.com/download?id="
    );
    src = src.replace("/view?usp=drive_link", "");
  }

  return new Promise((resolve, reject) => {
    const protocol = src.startsWith("https") ? https : http;

    protocol
      .get(src, (response: http.IncomingMessage) => {
        if (response.statusCode !== 200) {
          reject(new Error(`Failed to download image: ${response.statusCode}`));
          return;
        }

        let filename = fallbackFilename;

        // Try to get `filename` from Content-Disposition header
        const contentDisposition = response.headers["content-disposition"];
        if (contentDisposition) {
          const match = contentDisposition.match(/filename="?([^"]+)"?/);
          if (match && match[1]) {
            filename = match[1];
          }
        }

        // If no filename was found and fallback is not provided, return error.
        if (!filename) {
          reject(
            new Error("No filename could be determined for the image download.")
          );
          return;
        }

        let filePath = path.join(destination, filename);

        // Check if the image already exists
        if (fs.existsSync(filePath)) {
          resolve();
          return;
        }

        const fileStream = fs.createWriteStream(filePath);
        response.pipe(fileStream);

        fileStream.on("finish", () => {
          fileStream.close();
          resolve();
        });

        fileStream.on("error", (error: any) => {
          fs.unlink(destination, () => reject(error));
        });
      })
      .on("error", (error: any) => {
        reject(error);
      });
  });
}

/**
 * @description Checks if a given path is an URL.
 *
 * @param path - The path to check.
 *
 * @returns True if the path is an URL, false otherwise.
 */
export function isPathAnURL(path: string): boolean {
  return /^https?:\/\//.test(path);
}

/**
 * @description Converts a given string to underscored file name. This could be
 * useful for downloaded images.
 *
 * @example If "file name.png" is given, "file_name.png" will be returned.
 *
 * @param alt - `alt` element of an `img`.
 *
 * @returns Altered file name.
 */
export function convertAltNameToUnderscored(alt: string): string {
  return alt.replace(/[&\/\\#,+()$~%'":*?<>{} ]/g, "_");
}

/**
 * @description Determines an image's extension.
 *
 * @param src - Relative path to image, from project root directory.
 *
 * @returns Image extension.
 */
export async function determineImageExtension(
  src: string
): Promise<keyof FormatEnum> {
  let image = join(process.cwd(), src);
  return (await sharp(image).metadata()).format;
}
