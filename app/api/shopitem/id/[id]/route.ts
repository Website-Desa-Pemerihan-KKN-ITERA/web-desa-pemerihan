import prisma from "@/libs/prisma";
import { Prisma } from "@/generated/prisma/client";
import * as z from "zod";
import { validateBody } from "@/libs/requestHelper";
import { validateJwtAuthHelper } from "@/libs/authHelper";
import { generateSlug } from "@/libs/generateSlugHelper";

const ShopItem = z.object({
  name: z.string(),
  price: z.coerce.number(),
  contact: z.string(),
  description: z.string(),
  featuredImageUrl: z.string().min(5).optional(),
});

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
  try {
    const updatedItem = await prisma.shopItems.update({
      where: { id: itemId },
      data: {
        name: result.data.name,
        description: result.data.description,
        price: result.data.price,
        contact: result.data.contact,
        slug: newSlug,
        featuredImageUrl:
          result.data.featuredImageUrl || oldItem.featuredImageUrl,
      },
    });

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
