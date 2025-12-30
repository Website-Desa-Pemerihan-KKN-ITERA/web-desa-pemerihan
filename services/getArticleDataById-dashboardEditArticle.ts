import prisma from "@/libs/prisma";
import { getPresignedDownloadUrl } from "@/libs/awsS3Action";
import { Prisma } from "@/generated/prisma/client";

type ArticleResult = [Prisma.ArticleGetPayload<{}> | null, string | null];

export async function getArticleDataById(id: number): Promise<ArticleResult> {
  try {
    const article = await prisma.article.findUnique({
      where: { id: id },
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
    console.error("Error fetching article by ID:", error);
    return [null, null];
  }
}
