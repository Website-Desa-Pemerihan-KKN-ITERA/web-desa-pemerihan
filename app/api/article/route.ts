import * as z from "zod";
import { JwtPayload } from "jsonwebtoken";
import { validateBody } from "@/helpers/requestHelper";
import { validateJwtAuthHelper } from "@/helpers/authHelper";
import { deleteImgInBucket } from "@/libs/awsS3Action";
import { getArticleList, saveArticle } from "@/services/articleServices";
import { ERROR_STATUS_CODE_MAPPER } from "@/helpers/httpErrorsHelper";

const Article = z.object({
  title: z.string().min(5),
  content: z.string().min(5),
  featuredImageUrl: z.string().min(5),
  shortDescription: z.string().min(5),
});

const listPagingSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

interface MyJwtPayload extends JwtPayload {
  data: {
    userId: number;
    username: string;
  };
}

export async function POST(req: Request) {
  try {
    // validate body
    const result = await validateBody(req, Article);

    if (!result.success) {
      const { featuredImageUrl } = result.error.body as Partial<
        z.infer<typeof Article>
      >;

      if (typeof featuredImageUrl === "string") {
        await deleteImgInBucket([featuredImageUrl]);
      }
      return Response.json(
        { error: result.error },
        { status: result.error.status },
      );
    }

    // validate the jwt token
    const decodedJwt = await validateJwtAuthHelper(
      req.headers.get("authorization"),
    );
    if (!decodedJwt.success) {
      return Response.json(
        { error: decodedJwt.error, success: decodedJwt.success },
        { status: decodedJwt.error.status },
      );
    }

    // get the payload from jwt
    const payload = decodedJwt.data as MyJwtPayload;

    // Bussiness logic
    const save = await saveArticle(
      payload.data.userId,
      result.data.title,
      result.data.content,
      result.data.featuredImageUrl,
      result.data.shortDescription,
    );

    if (!save.success) {
      return Response.json(
        { message: save.message },
        { status: ERROR_STATUS_CODE_MAPPER[save.error].statusCode },
      );
    }

    // finally send success response
    return Response.json(
      { message: "Article berhasil diupload" },
      { status: 200 },
    );
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

export async function GET(req: Request) {
  try {
    // validate the jwt token
    const decodedJwt = await validateJwtAuthHelper(
      req.headers.get("authorization"),
    );
    if (!decodedJwt.success) {
      return Response.json(
        { error: decodedJwt.error, success: decodedJwt.success },
        { status: decodedJwt.error.status },
      );
    }

    const { searchParams } = new URL(req.url);

    const queryParams = {
      page: searchParams.get("page"),
      limit: searchParams.get("limit"),
    };

    const result = listPagingSchema.safeParse(queryParams);
    if (!result.success) {
      return Response.json(
        { error: z.treeifyError(result.error) },
        { status: 422 },
      );
    }
    const { page, limit } = result.data;

    // Bussiness Logic
    const articleList = await getArticleList(page, limit);
    if (!articleList.success) {
      return Response.json(
        {
          error: articleList.error,
          message: articleList.message,
          meta: articleList.meta,
        },
        { status: articleList.status },
      );
    }

    return Response.json(
      {
        data: articleList.articleList,
        meta: {
          page,
          limit,
          totalItems: articleList.dataCount,
          totalPages: articleList.totalPages,
          hasNextPage: page < articleList.totalPages,
          hasPrevPage: page > 1,
        },
      },
      { status: 200 },
    );
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
