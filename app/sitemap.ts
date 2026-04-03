import {
  findManyArticleSlug,
  findManyLocationSlug,
  findManyShopSlug,
} from "@/repository/articleRepository";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articleSlug = await findManyArticleSlug();
  const shopItemSlug = await findManyShopSlug();
  const locationSlug = await findManyLocationSlug();

  const articleUrls = articleSlug.map((item) => ({
    url: `https://pemerihan.id/article/${item.slug}`,
  }));

  const shopUrls = shopItemSlug.map((item) => ({
    url: `https://pemerihan.id/shop/${item.slug}`,
  }));

  const locationUrls = locationSlug.map((item) => ({
    url: `https://pemerihan.id/location/${item.slug}`,
  }));

  return [...articleUrls, ...shopUrls, ...locationUrls];
}
