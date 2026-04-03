import * as z from "zod";
import { validateBody } from "@/helpers/requestHelper";
import { validateJwtAuthHelper } from "@/helpers/authHelper";
import { deleteImgInBucket } from "@/libs/awsS3Action";
import { deleteArticle, updateArticle } from "@/services/articleServices";
import { ERROR_STATUS_CODE_MAPPER } from "@/helpers/httpErrorsHelper";

const ArticleSchema = z.object({
  title: z.string().min(5),
  content: z.string().min(5),
  shortDescription: z.string().min(5),
  featuredImageUrl: z.string().optional(),
});

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const articleId = parseInt(id);
    if (isNaN(articleId)) {
      return Response.json(
        { error: "ID Artikel tidak valid" },
        { status: 400 },
      );
    }

    const result = await validateBody(req, ArticleSchema);
    if (!result.success) {
      const { featuredImageUrl } = result.error.body as Partial<
        z.infer<typeof ArticleSchema>
      >;
      if (typeof featuredImageUrl === "string") {
        await deleteImgInBucket([featuredImageUrl]);
      }
      return Response.json(
        { error: result.error },
        { status: result.error.status },
      );
    }

    const jwt = await validateJwtAuthHelper(req.headers.get("authorization"));
    if (!jwt.success) {
      return Response.json({ error: jwt.error }, { status: jwt.error.status });
    }

    // Bussiness logic
    const update = await updateArticle(
      articleId,
      result.data.title,
      result.data.content,
      result.data.shortDescription,
      result.data.featuredImageUrl,
    );
    if (!update.success) {
      return Response.json(
        { message: update.message },
        { status: ERROR_STATUS_CODE_MAPPER[update.error].statusCode },
      );
    }

    return Response.json({ message: "Update berhasil", data: update.data });
  } catch (err) {
    console.error(err);
    return Response.json(
      {
        error: "Internal Server Error",
        message: "An unexpected error occurred while processing the request.",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const articleId = parseInt(id);
    if (isNaN(articleId)) {
      return Response.json(
        { error: "ID Artikel tidak valid" },
        { status: 400 },
      );
    }

    const jwt = await validateJwtAuthHelper(req.headers.get("authorization"));
    if (!jwt.success) {
      return Response.json({ error: jwt.error }, { status: jwt.error.status });
    }

    // Bussiness logic
    const result = await deleteArticle(articleId);
    if (!result.success) {
      return Response.json(
        { message: result.message },
        { status: ERROR_STATUS_CODE_MAPPER[result.error].statusCode },
      );
    }

    return Response.json({
      message: "Artikel berhasil dihapus",
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    return Response.json(
      {
        error: "Internal Server Error",
        message: "An unexpected error occurred while processing the request.",
      },
      { status: 500 },
    );
  }
}
