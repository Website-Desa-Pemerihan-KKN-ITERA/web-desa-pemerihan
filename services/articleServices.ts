import { Article } from "@/generated/prisma/client";
import { countArticle, findArticleList } from "@/repository/articleRepository";
import prisma from "@/libs/prisma";
import { Prisma } from "@/generated/prisma/client";
import { generateSlug } from "@/helpers/generateSlugHelper";

type getArticleListResult =
  | {
      success: true;
      articleList: Article[];
      dataCount: number;
      totalPages: number;
    }
  | {
      success: false;
      error: string;
      message: string;
      meta: { page: number; totalPages: number };
      status: number;
    };

export async function getArticleList(
  page: number,
  limit: number,
): Promise<getArticleListResult> {
  const skip = (page - 1) * limit;

  let articleList: Article[] = [];
  let dataCount = 0;

  try {
    articleList = await findArticleList(skip, limit);
    dataCount = await countArticle();
  } catch (err) {
    throw err;
  }

  const totalPages = Math.ceil(dataCount / limit);

  if (page > totalPages && dataCount > 0) {
    return {
      success: false,
      error: "Page not found",
      message: `Only ${totalPages} page available.`,
      meta: { page, totalPages },
      status: 404,
    };
  }

  return {
    success: true,
    articleList,
    dataCount,
    totalPages,
  };
}

type saveArticleResult =
  | {
      success: true;
    }
  | {
      success: false;
      error: SaveArticleErrorCode;
      message: string;
    };

type SaveArticleErrorCode =
  | "USER_NOT_FOUND"
  | "SLUG_ALREADY_EXISTS"
  | "DATABASE_ERROR";

export async function saveArticle(
  userId: number,
  title: string,
  content: string,
  featuredImageUrl: string,
  shortDescription: string,
): Promise<saveArticleResult> {
  // checking if the user are in the db
  const userExists = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!userExists) {
    return {
      success: false,
      error: "USER_NOT_FOUND",
      message: "The specified user was not found.",
    };
  }

  // generate slug from title
  const finalSlug = generateSlug(title);

  // check if slug is already exist and throw error
  const checkSlugExist = await prisma.article.findUnique({
    where: {
      slug: finalSlug,
    },
  });
  if (checkSlugExist) {
    return {
      success: false,
      error: "SLUG_ALREADY_EXISTS",
      message:
        "The generated slug already exists. Please use a different title.",
    };
  }

  // push new article to db
  try {
    await prisma.article.create({
      data: {
        title: title,
        slug: finalSlug,
        content: content,
        featuredImageUrl: featuredImageUrl,
        shortDescription: shortDescription,
      },
    });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      switch (err.code) {
        case "P2002": // unique constraint
          return {
            success: false,
            error: "SLUG_ALREADY_EXISTS",
            message: "A record with the same unique field already exists.",
          };

        default:
          return {
            success: false,
            error: "DATABASE_ERROR",
            message: "An unexpected database error occurred.",
          };
      }
    }
  }

  return {
    success: true,
  };
}
