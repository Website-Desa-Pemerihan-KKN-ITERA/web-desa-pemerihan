import prisma from "@/libs/prisma";
import { Prisma } from "@/generated/prisma/client";

export async function findArticleList(skip: number, limit: number) {
  return await prisma.article.findMany({
    skip: skip,
    take: limit,
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function countArticle() {
  return await prisma.article.count();
}

export async function findUniqueUser(userId: number) {
  return await prisma.user.findUnique({
    where: { id: userId },
  });
}

export async function findArticleById(id: number) {
  return await prisma.article.findUnique({
    where: { id },
  });
}

export async function deleteArticleById(id: number) {
  try {
    const deleted = await prisma.article.delete({
      where: { id },
    });
    return { success: true as const, data: deleted };
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      switch (err.code) {
        case "P2025":
          return { success: false as const, code: "NOT_FOUND" };
        default:
          return { success: false as const, code: "DATABASE_ERROR" };
      }
    }
    console.error("deleteArticleById DB Error:", err);
    return { success: false as const, code: "DB_UNKNOWN_ERROR" };
  }
}

export async function findArticleBySlug(slug: string) {
  return await prisma.article.findUnique({
    where: { slug },
  });
}

export async function updateArticleById(
  id: number,
  data: {
    title: string;
    content: string;
    slug: string;
    shortDescription: string;
    featuredImageUrl: string;
  },
) {
  try {
    const updated = await prisma.article.update({
      where: { id },
      data,
    });
    return { success: true as const, data: updated };
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      switch (err.code) {
        case "P2025":
          return { success: false as const, code: "NOT_FOUND" };
        default:
          return { success: false as const, code: "DATABASE_ERROR" };
      }
    }
    console.error("updateArticleById DB Error:", err);
    return { success: false as const, code: "DB_UNKNOWN_ERROR" };
  }
}

export async function pushArticle(
  title: string,
  slug: string,
  content: string,
  featuredImageUrl: string,
  shortDescription: string,
) {
  try {
    await prisma.article.create({
      data: {
        title: title,
        slug: slug,
        content: content,
        featuredImageUrl: featuredImageUrl,
        shortDescription: shortDescription,
      },
    });

    return { success: true };
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      switch (err.code) {
        case "P2002": // unique constraint
          return {
            success: false,
            code: "UNIQUE_CONSTRAINT_FAILED",
          };

        default:
          return {
            success: false,
            error: "DATABASE_ERROR",
            message: "An unexpected database error occurred.",
          };
      }
    }
    console.error("pushArticle DB Error:", err);
    return { success: false, code: "DB_UNKNOWN_ERROR" };
  }
}
