import prisma from "@/libs/prisma";
import { getPresignedDownloadUrl } from "@/libs/minioAction";
import { Prisma } from "@/generated/prisma/client";

type ArticleResult = [Prisma.ArticleGetPayload<{}> | null, string | null];

export async function getArticleData(slug: string): Promise<ArticleResult> {
  try {
    const article = await prisma.article.findUnique({
      where: { slug: slug },
    });

    if (!article) {
      return [null, null];
    }

    let imageUrl = null;
    if (article.featuredImageUrl) {
      const result = await getPresignedDownloadUrl(article.featuredImageUrl);
      if (result.success && result.url) {
        imageUrl = result.url;
      }
    }
    return [article, imageUrl];
  } catch (error) {
    console.error("Error getting article:", error);
    return [null, null];
  }
}
