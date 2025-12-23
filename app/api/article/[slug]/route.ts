import prisma from "@/libs/prisma";
import { Prisma } from "@/generated/prisma/client";
import * as z from "zod";
import { slugSchema } from "@/libs/strValidatorHelper";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  let articleDB;
  const { slug } = await params;
  const parsedSlug = slugSchema.safeParse(slug);
  if (!parsedSlug.success) {
    return Response.json({ error: "Slug tidak valid" }, { status: 400 });
  }

  // perlu validasi jwt ga? keanya ga perlu kalau cuma untuk melihat artikel? ya ga sih
  // kecuali edit, tambah, komen, dan lain lain

  try {
    articleDB = await prisma.article.findUnique({
      where: {
        slug: parsedSlug.data,
      },
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

  if (!articleDB) {
    return Response.json({ error: "Artikel tidak ditemukan" }, { status: 404 });
  }

  return Response.json(articleDB);
}
