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
  featuredImageUrl: z.string().min(5),
  // additionalImages: z.array(z.string().min(5)),
});

interface MyJwtPayload extends JwtPayload {
  data: {
    userId: number;
    username: string;
  };
}

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

  // push new item to db
  try {
    await prisma.shopItems.create({
      data: {
        name: result.data.name,
        slug: "",
        price: result.data.price,
        contact: result.data.contact,
        description: result.data.description,
        featuredImageUrl: result.data.featuredImageUrl,
        //additionalImages: result.data.additionalImages,
      },
    });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      switch (err.code) {
        case "P2002": // unique constraint
          return Response.json(
            { error: "Username already exists" },
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
