import { validateBody } from "@/libs/requestHelper";
import { validateJwtAuthHelper } from "@/libs/authHelper";
import * as z from "zod";
import { JwtPayload } from "jsonwebtoken";
import prisma from "@/libs/prisma";
import { Prisma } from "@/generated/prisma/client";
import { generateSlug } from "@/libs/generateSlugHelper";

const ShopItem = z.object({
  name: z.string(),
  price: z.int(),
  contact: z.string(),
  description: z.string(),
  imagesUrl: z.array(z.string()),
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
  // validate body
  const result = await validateBody(req, ShopItem);
  if (!result.success) {
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
      { error: decodedJwt.error },
      { status: decodedJwt.error.status },
    );
  }

  // get the payload from jwt
  const payload = decodedJwt.data as MyJwtPayload;

  // checking if the user are in the db
  const userExists = await prisma.user.findUnique({
    where: { id: payload.data.userId },
  });

  if (!userExists) {
    return Response.json(
      { error: "User tidak valid / tidak ditemukan" },
      { status: 404 },
    );
  }

  // generate slug from title
  let finalSlug = generateSlug(result.data.name);

  // push new item to db
  try {
    await prisma.shopItems.create({
      data: {
        name: result.data.name,
        slug: finalSlug,
        price: result.data.price,
        contact: result.data.contact,
        description: result.data.description,
        imagesUrl: result.data.imagesUrl,
      },
    });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      switch (err.code) {
        case "P2002": // unique constraint
          return Response.json(
            { error: "Item name already exists" },
            { status: 409 },
          );

        default:
          return Response.json(
            { error: "Database error", err, code: err.code },
            { status: 500 },
          );
      }
    }
  }

  // finally send success response
  return Response.json({ message: "Item berhasil diupload" }, { status: 200 });
}

const listPagingSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

/////////
// GET //
/////////
export async function GET(req: Request) {
  // validate the jwt token
  console.log(req.headers);
  const decodedJwt = await validateJwtAuthHelper(
    req.headers.get("authorization"),
  );
  if (!decodedJwt.success) {
    return Response.json(
      { error: decodedJwt.error, success: decodedJwt.success },
      { status: decodedJwt.error.status },
    );
  }

  let articleList;
  let dataCount = 0;
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
  const skip = (page - 1) * limit;

  try {
    [articleList, dataCount] = await prisma.$transaction([
      prisma.shopItems.findMany({
        skip: skip,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.shopItems.count(),
    ]);
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      switch (err.code) {
        default:
          return Response.json(
            { error: "Database error", err, code: err.code },
            { status: 500 },
          );
      }
    }
  }

  const totalPages = Math.ceil(dataCount / limit);

  if (page > totalPages && dataCount > 0) {
    return Response.json(
      {
        error: "Halaman tidak ditemukan",
        message: `Hanya tersedia ${totalPages} halaman.`,
        meta: {
          page,
          totalPages,
        },
      },
      { status: 404 },
    );
  }

  return Response.json({
    success: true,
    data: articleList,
    meta: {
      page,
      limit,
      totalItems: dataCount,
      totalPages,
      hasNextPage: page < totalPages, // untuk mempermudah frontend nanti
      hasPrevPage: page > 1, // misal ada tombol next/pref page gitu bisa pakai boolean dari sini
    },
  });
}
