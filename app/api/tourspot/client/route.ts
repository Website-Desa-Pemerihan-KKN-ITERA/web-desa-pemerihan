import * as z from "zod";
import prisma from "@/libs/prisma";
import { Prisma } from "@/generated/prisma/client";

const listPagingSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

/////////
// GET //
/////////
export async function GET(req: Request) {
  let tourSpotList;
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
    [tourSpotList, dataCount] = await prisma.$transaction([
      prisma.location.findMany({
        skip: skip,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.location.count(),
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

  const safeLocation = tourSpotList?.map(({ id, ...rest }) => rest);

  return Response.json({
    success: true,
    data: safeLocation,
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
