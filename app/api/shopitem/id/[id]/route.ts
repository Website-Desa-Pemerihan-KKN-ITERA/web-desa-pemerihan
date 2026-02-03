import prisma from "@/libs/prisma";
import { Prisma } from "@/generated/prisma/client";
import * as z from "zod";
import { validateBody } from "@/helpers/requestHelper";
import { validateJwtAuthHelper } from "@/helpers/authHelper";
import { generateSlug } from "@/helpers/generateSlugHelper";
import { deleteImgInBucket } from "@/libs/awsS3Action";
import { mergeImages } from "@/helpers/imgReplaceCompare";

const MAX_IMAGES = 5;

const ShopItem = z.object({
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
  const { id } = await params;
  let oldItem;
  let newSlug;

  const itemId = parseInt(id);
  if (isNaN(itemId)) {
    return Response.json({ error: "ID Item tidak valid" }, { status: 400 });
  }

  const result = await validateBody(req, ShopItem);
  if (!result.success) {
    const { imagesUrl } = result.error.body as Partial<
      z.infer<typeof ShopItem>
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

  try {
    oldItem = await prisma.shopItems.findUnique({
      where: { id: itemId },
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

  if (!oldItem) {
    return Response.json({ error: "Item tidak ditemukan" }, { status: 404 });
  }

  newSlug = oldItem.slug;
  if (result.data.name !== oldItem.name) {
    newSlug = generateSlug(result.data.name);

    const checkSlug = await prisma.shopItems.findUnique({
      where: { slug: newSlug },
    });

    if (checkSlug && checkSlug.id !== itemId) {
      return Response.json(
        {
          error: "Judul ini menghasilkan slug yang sudah dipakai artikel lain",
        },
        { status: 409 },
      );
    }
  }

  const { imageArr, imageDelArr } = mergeImages(
    MAX_IMAGES,
    result.data.imagesUrl,
    oldItem.imagesUrl,
  );

  let dialNum = result.data.contact;
  if (dialNum.startsWith("0")) {
    dialNum = "62" + dialNum.slice(1);
  }

  try {
    const updatedItem = await prisma.shopItems.update({
      where: { id: itemId },
      data: {
        name: result.data.name,
        description: result.data.description,
        price: result.data.price,
        contact: dialNum,
        owner: result.data.owner,
        slug: newSlug,
        imagesUrl: imageArr,
      },
    });

    // moved here cause i think it is safer to delete after upload success
    if (imageDelArr?.length > 0) {
      await deleteImgInBucket(imageDelArr);
    }

    return Response.json({
      message: "Update berhasil",
      data: updatedItem,
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

////////////
// DELETE //
////////////
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const itemId = parseInt(id);
  if (isNaN(itemId)) {
    return Response.json({ error: "ID Item tidak valid" }, { status: 400 });
  }

  const jwt = await validateJwtAuthHelper(req.headers.get("authorization"));
  if (!jwt.success) {
    return Response.json({ error: jwt.error }, { status: jwt.error.status });
  }

  try {
    const shopItem = await prisma.shopItems.findUnique({
      where: { id: itemId },
    });
    if (!shopItem) {
      throw new Error("Item nya kosong");
    }
    await deleteImgInBucket(shopItem.imagesUrl);
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

  try {
    const deletedItem = await prisma.shopItems.delete({
      where: { id: itemId },
    });

    return Response.json({
      message: "Item berhasil dihapus",
      data: deletedItem,
    });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      switch (err.code) {
        case "P2025":
          return Response.json(
            { error: "Item tidak ditemukan" },
            { status: 404 },
          );
        default:
          return Response.json(
            { error: "Database nya error", code: err.code },
            { status: 500 },
          );
      }
    }
    return Response.json(
      { error: "Terjadi kesalahan internal server" },
      { status: 500 },
    );
  }
}
