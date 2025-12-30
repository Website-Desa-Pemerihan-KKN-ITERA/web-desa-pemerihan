import prisma from "@/libs/prisma";
import { Prisma } from "@/generated/prisma/client";
import * as z from "zod";
import { validateBody } from "@/libs/requestHelper";
import { validateJwtAuthHelper } from "@/libs/authHelper";
import { generateSlug } from "@/libs/generateSlugHelper";

const ArticleSchema = z.object({
  title: z.string().min(5),
  content: z.string().min(5),
  featuredImageUrl: z.string().optional(),
});

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  let oldArticle;
  let newSlug;

  const articleId = parseInt(id);
  if (isNaN(articleId)) {
    return Response.json({ error: "ID Artikel tidak valid" }, { status: 400 });
  }

  const result = await validateBody(req, ArticleSchema);
  if (!result.success) {
    return Response.json(
      { error: result.error },
      { status: result.error.status },
    );
  }

  const jwt = await validateJwtAuthHelper(req.headers.get("authorization"));
  if (!jwt.success) {
    return Response.json({ error: jwt.error }, { status: jwt.error.status });
  }

  try {
    oldArticle = await prisma.article.findUnique({
      where: { id: articleId },
    });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      switch (err.code) {
        default:
          return Response.json(
            { error: "Database nya error", code: err.code },
            { status: 500 },
          );
      }
    }
  }

  if (!oldArticle) {
    return Response.json({ error: "Artikel tidak ditemukan" }, { status: 404 });
  }

  newSlug = oldArticle.slug;
  if (result.data.title !== oldArticle.title) {
    newSlug = generateSlug(result.data.title);

    const checkSlug = await prisma.article.findUnique({
      where: { slug: newSlug },
    });

    if (checkSlug && checkSlug.id !== articleId) {
      return Response.json(
        {
          error: "Judul ini menghasilkan slug yang sudah dipakai artikel lain",
        },
        { status: 409 },
      );
    }
  }
  try {
    const updatedArticle = await prisma.article.update({
      where: { id: articleId },
      data: {
        title: result.data.title,
        content: result.data.content,
        slug: newSlug,
        featuredImageUrl:
          result.data.featuredImageUrl || oldArticle.featuredImageUrl,
      },
    });

    return Response.json({
      message: "Update berhasil",
      data: updatedArticle,
    });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      switch (err.code) {
        default:
          return Response.json(
            { error: "Database nya error", code: err.code },
            { status: 500 },
          );
      }
    }
  }
}
