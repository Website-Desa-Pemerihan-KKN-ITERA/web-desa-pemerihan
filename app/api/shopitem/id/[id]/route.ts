import * as z from "zod";
import { validateBody } from "@/helpers/requestHelper";
import { validateJwtAuthHelper } from "@/helpers/authHelper";
import { deleteImgInBucket } from "@/libs/awsS3Action";
import { deleteShopItem, updateShopItem } from "@/services/shopItemServices";
import { ERROR_STATUS_CODE_MAPPER } from "@/helpers/httpErrorsHelper";

const MAX_IMAGES = 5;

const ShopItemSchema = z.object({
  name: z.string().min(2),
  price: z.coerce.number().min(3),
  contact: z.string().min(10).max(13),
  owner: z.string(),
  description: z.string(),
  imagesUrl: z.array(z.string()).max(MAX_IMAGES),
});

/////////
// PUT //
/////////
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const itemId = parseInt(id);
    if (isNaN(itemId)) {
      return Response.json({ error: "ID Item tidak valid" }, { status: 400 });
    }

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

    const jwt = await validateJwtAuthHelper(req.headers.get("authorization"));
    if (!jwt.success) {
      return Response.json({ error: jwt.error }, { status: jwt.error.status });
    }

    // Business logic
    const update = await updateShopItem(
      itemId,
      result.data.name,
      result.data.price,
      result.data.contact,
      result.data.owner,
      result.data.description,
      result.data.imagesUrl,
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

////////////
// DELETE //
////////////
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const itemId = parseInt(id);
    if (isNaN(itemId)) {
      return Response.json({ error: "ID Item tidak valid" }, { status: 400 });
    }

    const jwt = await validateJwtAuthHelper(req.headers.get("authorization"));
    if (!jwt.success) {
      return Response.json({ error: jwt.error }, { status: jwt.error.status });
    }

    // Business logic
    const result = await deleteShopItem(itemId);
    if (!result.success) {
      return Response.json(
        { message: result.message },
        { status: ERROR_STATUS_CODE_MAPPER[result.error].statusCode },
      );
    }

    return Response.json({
      message: "Item berhasil dihapus",
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
