/**
 * @file
 * @author Ceyhun Şen
 * @description Dynamic route for displaying gallery images. It handles
 * pagination and generates static parameters for each page.
 * */

import GalleryPage, { getGalleryTotalPages } from "@/_components/gallery_page";
import { Metadata } from "next";

type Params = {
  params: Promise<{
    page: string[];
  }>;
};

export async function generateStaticParams() {
  const totalPages = getGalleryTotalPages();
  // Empty element for the `gallery/` page without a page number.
  const params: any[] = [{ page: [] }];

  for (let i = 1; i <= totalPages; i++) {
    params.push({ page: [i.toString()] });
  }

  return params;
}

export async function generateMetadata(): Promise<Metadata> {
  const title = `Gallery | Ceyhun Şen`;

  return {
    title,
  };
}

export default async function Index(props: Params) {
  let params = (await props.params).page;

  // Default to the first page if no page number is provided.
  let page = 1;

  if (params && !isNaN(Number(params[0]))) {
    page = Number(params[0]);
  }

  return GalleryPage(page);
}
