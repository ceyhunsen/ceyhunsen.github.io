import path from "path";
import { notFound } from "next/navigation";
import PagingButtons from "@/_components/posts/paging_button";
import styles from "./gallery_page.module.css";
import Header from "@/_components/ui/header";
import createOptimizedImage from "@/_components/image/optimizer";
import { getImageDimensionsFromSrc } from "@/_components/image/dimensions";
import { downloadImage } from "@/_components/image/downloader";

/**
 * @description List of Google Drive photo IDs to download.
 * */
const photoIDs = ["addidshere"];

const galleryDirectory = "public/gallery";
const thumbnailSize = 600;
const imagePerPage = 15;

export function getGalleryTotalPages() {
  return Math.ceil(photoIDs.length / imagePerPage);
}

/**
 * @description Downloads images from Google Drive to the gallery directory.
 *
 * @returns Array of paths to the downloaded images.
 * */
async function downloadImages(page: number): Promise<string[]> {
  let paths: string[] = [];
  const photoIDsToDownload = photoIDs.slice(
    (page - 1) * imagePerPage,
    page * imagePerPage
  );

  for (const photoID of photoIDsToDownload) {
    const imageUrl = `https://drive.usercontent.google.com/download?id=${photoID}`;
    const fileName = `${photoID}.jpg`;
    const outputPath = path.join(galleryDirectory, fileName);

    await downloadImage(imageUrl, galleryDirectory, fileName);

    paths.push(outputPath);
  }

  return paths;
}

/**
 * @description Creates thumbnails for images in the gallery directory.
 *
 * @returns Array of paths to the created thumbnails.
 * */
async function createThumbnails(page: number): Promise<string[]> {
  const thumbnailDir = `${galleryDirectory}/thumbnails`;
  const thumbnails: string[] = [];

  const photoIDsToDownload = photoIDs.slice(
    (page - 1) * imagePerPage,
    page * imagePerPage
  );

  for (const photoID of photoIDsToDownload) {
    const fileName = `${photoID}.jpg`;
    const inputPath = path.join(galleryDirectory, fileName);

    const outputPath = await createOptimizedImage(inputPath, thumbnailDir, 70, {
      height: thumbnailSize,
    });

    thumbnails.push(outputPath);
  }

  return thumbnails;
}

export default async function GalleryPage(page: number) {
  const pageNumber = page;
  if (isNaN(pageNumber) || pageNumber < 1) {
    return notFound();
  }

  const images = await downloadImages(pageNumber);
  const thumbnails = await createThumbnails(pageNumber);
  const dimensions = await Promise.all(
    thumbnails.map((image) => getImageDimensionsFromSrc(image))
  );

  return (
    <div>
      <Header>
        <h1>Gallery</h1>
      </Header>

      <div className={styles.box}>
        {images.map((image, i) => (
          <a
            className={styles.link}
            href={`/gallery/${path.basename(image)}`}
            target="_blank"
            rel="noopener noreferrer"
            key={image}
          >
            <img
              className={styles.image}
              style={{ maxHeight: thumbnailSize }}
              src={`/${path.relative(
                process.cwd() + "/public",
                thumbnails[i]
              )}`}
              alt={`Gallery image: ${path.basename(image)}`}
              width={dimensions[i].width}
              height={dimensions[i].height}
              loading="lazy"
              key={image}
            />
          </a>
        ))}
      </div>

      <PagingButtons
        category="gallery"
        currentPage={page}
        totalPages={getGalleryTotalPages()}
      />
    </div>
  );
}
