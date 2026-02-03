import { validateBody } from "@/helpers/requestHelper";
import { validateJwtAuthHelper } from "@/helpers/authHelper";
import * as z from "zod";
import { JwtPayload } from "jsonwebtoken";
import prisma from "@/libs/prisma";
import { Prisma } from "@/generated/prisma/client";
import { generateSlug } from "@/helpers/generateSlugHelper";
import { deleteImgInBucket } from "@/libs/awsS3Action";

const MAX_IMAGES = 5;

const TourSpot = z.object({
  name: z.string().min(1),
  entryFee: z.number(),
  contact: z.string().min(10).max(13).startsWith("08"),
  owner: z.string().min(1),
  openTimeFrom: z.iso.datetime(),
  openTimeTo: z.iso.datetime(), // no less than function so i dont handle case where openTimeTo are less than openTimeFrom,
  openDay: z.array(z.string()),
  mapsLink: z.string(),
  description: z.string(),
  imagesUrl: z.array(z.string()).max(MAX_IMAGES),
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
  const result = await validateBody(req, TourSpot);
  if (!result.success) {
    const { imagesUrl } = result.error.body as Partial<
      z.infer<typeof TourSpot>
    >;
    if (Array.isArray(imagesUrl)) {
      await deleteImgInBucket(imagesUrl);
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
  const finalSlug = generateSlug(result.data.name);

  let dialNum = result.data.contact;
  if (dialNum.startsWith("0")) {
    dialNum = "62" + dialNum.slice(1);
  }

  try {
    await prisma.location.create({
      data: {
        name: result.data.name,
        entryFee: result.data.entryFee,
        slug: finalSlug,
        contact: dialNum,
        owner: result.data.owner,
        openTimeFrom: result.data.openTimeFrom,
        openTimeTo: result.data.openTimeTo,
        openDay: result.data.openDay,
        description: result.data.description,
        mapsUrl: result.data.mapsLink,
        imagesUrl: result.data.imagesUrl,
      },
    });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      switch (err.code) {
        case "P2002": // unique constraint
          return Response.json(
            { error: "tour spot name already exists" },
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
  return Response.json(
    { message: "tour spot berhasil diupload" },
    { status: 200 },
  );
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

  return Response.json({
    success: true,
    data: tourSpotList,
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
