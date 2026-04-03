import * as z from "zod";
import { JwtPayload } from "jsonwebtoken";
import { validateBody } from "@/helpers/requestHelper";
import { validateJwtAuthHelper } from "@/helpers/authHelper";
import { deleteImgInBucket } from "@/libs/awsS3Action";
import { getShopItemList, saveShopItem } from "@/services/shopItemServices";
import { ERROR_STATUS_CODE_MAPPER } from "@/helpers/httpErrorsHelper";

const MAX_IMAGES = 5;

const ShopItemSchema = z.object({
  name: z.string().min(2),
  price: z.int().min(3),
  contact: z.string().startsWith("08").min(10).max(13),
  description: z.string(),
  owner: z.string(),
  imagesUrl: z.array(z.string()).max(MAX_IMAGES),
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
    const result = await validateBody(req, ShopItemSchema);
    if (!result.success) {
      const { imagesUrl } = result.error.body as Partial<
        z.infer<typeof ShopItemSchema>
      >;
      if (Array.isArray(imagesUrl)) {
        await deleteImgInBucket(imagesUrl);
      }
      return Response.json(
        { error: result.error },
        { status: result.error.status },
      );
    }

    const decodedJwt = await validateJwtAuthHelper(
      req.headers.get("authorization"),
    );
    if (!decodedJwt.success) {
      return Response.json(
        { error: decodedJwt.error, success: decodedJwt.success },
        { status: decodedJwt.error.status },
      );
    }

    const payload = decodedJwt.data as MyJwtPayload;

    // Business logic
    const save = await saveShopItem(
      payload.data.userId,
      result.data.name,
      result.data.price,
      result.data.contact,
      result.data.owner,
      result.data.description,
      result.data.imagesUrl,
    );

    if (!save.success) {
      return Response.json(
        { message: save.message },
        { status: ERROR_STATUS_CODE_MAPPER[save.error].statusCode },
      );
    }

    return Response.json(
      { message: "Item berhasil diupload" },
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

    // Business logic
    const itemList = await getShopItemList(page, limit);
    if (!itemList.success) {
      return Response.json(
        {
          error: itemList.error,
          message: itemList.message,
          meta: itemList.meta,
        },
        { status: ERROR_STATUS_CODE_MAPPER[itemList.error].statusCode },
      );
    }

    return Response.json({
      success: true,
      data: itemList.itemList,
      meta: {
        page,
        limit,
        totalItems: itemList.dataCount,
        totalPages: itemList.totalPages,
        hasNextPage: page < itemList.totalPages,
        hasPrevPage: page > 1,
      },
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
