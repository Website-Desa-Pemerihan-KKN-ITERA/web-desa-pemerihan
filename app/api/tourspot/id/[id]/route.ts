import * as z from "zod";
import { validateBody } from "@/helpers/requestHelper";
import { validateJwtAuthHelper } from "@/helpers/authHelper";
import { deleteImgInBucket } from "@/libs/awsS3Action";
import { deleteTourSpot, updateTourSpot } from "@/services/tourSpotServices";
import { ERROR_STATUS_CODE_MAPPER } from "@/helpers/httpErrorsHelper";

const MAX_IMAGES = 5;

const TourSpotSchema = z.object({
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

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const locationId = parseInt(id);
    if (isNaN(locationId)) {
      return Response.json(
        { error: "ID location tidak valid" },
        { status: 400 },
      );
    }

    const result = await validateBody(req, TourSpotSchema);
    if (!result.success) {
      const { imagesUrl } = result.error.body as Partial<
        z.infer<typeof TourSpotSchema>
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
    const update = await updateTourSpot(
      locationId,
      result.data.name,
      result.data.entryFee,
      result.data.contact,
      result.data.owner,
      result.data.openTimeFrom,
      result.data.openTimeTo,
      result.data.openDay,
      result.data.mapsUrl,
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

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const locationId = parseInt(id);
    if (isNaN(locationId)) {
      return Response.json(
        { error: "ID location tidak valid" },
        { status: 400 },
      );
    }

    const jwt = await validateJwtAuthHelper(req.headers.get("authorization"));
    if (!jwt.success) {
      return Response.json({ error: jwt.error }, { status: jwt.error.status });
    }

    // Business logic
    const result = await deleteTourSpot(locationId);
    if (!result.success) {
      return Response.json(
        { message: result.message },
        { status: ERROR_STATUS_CODE_MAPPER[result.error].statusCode },
      );
    }

    return Response.json({
      message: "location berhasil dihapus",
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
