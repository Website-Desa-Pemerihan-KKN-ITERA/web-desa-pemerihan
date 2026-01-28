import prisma from "@/libs/prisma";
import { Prisma } from "@/generated/prisma/client";
import * as z from "zod";
import { validateBody } from "@/helpers/requestHelper";
import { validateJwtAuthHelper } from "@/helpers/authHelper";
import { generateSlug } from "@/helpers/generateSlugHelper";
import { deleteImgInBucket } from "@/libs/awsS3Action";
import { mergeImages } from "@/helpers/imgReplaceCompare";

const MAX_IMAGES = 5;

const TourSpot = z.object({
  name: z.string().min(1),
  entryFee: z.number(),
  contact: z.string().min(10).max(13),
  owner: z.string().min(1),
  openTimeFrom: z.iso.datetime(),
  openTimeTo: z.iso.datetime(), // no less than function so i dont handle case where openTimeTo are less than openTimeFrom,
  openDay: z.array(z.string()),
  description: z.string(),
  mapsUrl: z.string(),
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
  let oldLocation;
  let newSlug;

  const locationId = parseInt(id);
  if (isNaN(locationId)) {
    return Response.json({ error: "ID location tidak valid" }, { status: 400 });
  }

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

  const jwt = await validateJwtAuthHelper(req.headers.get("authorization"));
  if (!jwt.success) {
    return Response.json({ error: jwt.error }, { status: jwt.error.status });
  }

  try {
    oldLocation = await prisma.location.findUnique({
      where: { id: locationId },
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

  if (!oldLocation) {
    return Response.json(
      { error: "Tour spot tidak ditemukan" },
      { status: 404 },
    );
  }

  newSlug = oldLocation.slug;
  if (result.data.name !== oldLocation.name) {
    newSlug = generateSlug(result.data.name);

    const checkSlug = await prisma.location.findUnique({
      where: { slug: newSlug },
    });

    if (checkSlug && checkSlug.id !== locationId) {
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
    oldLocation.imagesUrl,
  );

  if (imageDelArr?.length > 0) {
    await deleteImgInBucket(imageDelArr);
  }

  let dialNum = result.data.contact;
  if (dialNum.startsWith("0")) {
    dialNum = "62" + dialNum.slice(1);
  }

  try {
    const updatedLocation = await prisma.location.update({
      where: { id: locationId },
      data: {
        name: result.data.name,
        entryFee: result.data.entryFee,
        slug: newSlug,
        contact: dialNum,
        owner: result.data.owner,
        openTimeFrom: result.data.openTimeFrom,
        openTimeTo: result.data.openTimeTo,
        openDay: result.data.openDay,
        mapsUrl: result.data.mapsUrl,
        description: result.data.description,
        imagesUrl: imageArr,
      },
    });

    return Response.json({
      message: "Update berhasil",
      data: updatedLocation,
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

  const locationId = parseInt(id);
  if (isNaN(locationId)) {
    return Response.json({ error: "ID location tidak valid" }, { status: 400 });
  }

  const jwt = await validateJwtAuthHelper(req.headers.get("authorization"));
  if (!jwt.success) {
    return Response.json({ error: jwt.error }, { status: jwt.error.status });
  }

  try {
    const tourSpot = await prisma.location.findUnique({
      where: { id: locationId },
    });
    if (!tourSpot) {
      throw new Error("tour spot nya kosong");
    }
    await deleteImgInBucket(tourSpot.imagesUrl);
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
    const deletedLocation = await prisma.location.delete({
      where: { id: locationId },
    });

    return Response.json({
      message: "location berhasil dihapus",
      data: deletedLocation,
    });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      switch (err.code) {
        case "P2025":
          return Response.json(
            { error: "tour spot tidak ditemukan" },
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
