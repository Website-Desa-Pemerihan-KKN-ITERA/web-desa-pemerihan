import * as z from "zod";
import { JwtPayload } from "jsonwebtoken";
import { validateBody } from "@/helpers/requestHelper";
import { validateJwtAuthHelper } from "@/helpers/authHelper";
import { deleteImgInBucket } from "@/libs/awsS3Action";
import { getArticleList, saveArticle } from "@/services/articleServices";

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

//////////
// POST //
//////////
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

    try {
      const save = await saveArticle(
        payload.data.userId,
        result.data.title,
        result.data.content,
        result.data.featuredImageUrl,
        result.data.shortDescription,
      );

      if (!save.success) {
        let httpStatus = 500;
        if (save.error === "USER_NOT_FOUND") httpStatus = 404;
        if (save.error === "SLUG_ALREADY_EXISTS") httpStatus = 409;

        return Response.json({ message: save.message }, { status: httpStatus });
      }
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

/////////
// GET //
/////////
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
