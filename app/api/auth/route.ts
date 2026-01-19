import { validateJwtAuthHelper } from "@/helpers/authHelper";
import * as z from "zod";
import prisma from "@/libs/prisma";
import { Prisma } from "@/generated/prisma/client";

const listPagingSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

export async function GET(req: Request) {
  const decodedJwt = await validateJwtAuthHelper(
    req.headers.get("authorization"),
  );
  if (!decodedJwt.success) {
    return Response.json(
      { error: decodedJwt.error, success: decodedJwt.success },
      { status: decodedJwt.error.status },
    );
  }

  let accountList;
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
    [accountList, dataCount] = await prisma.$transaction([
      prisma.user.findMany({
        skip: skip,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.user.count(),
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

  const accountListRet = accountList?.map(
    ({ password, createdAt, ...rest }) => rest,
  );

  return Response.json({
    success: true,
    data: accountListRet,
    meta: {
      page,
      limit,
      totalItems: dataCount,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  });
}
