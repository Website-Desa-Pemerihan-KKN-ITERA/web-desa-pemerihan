import { validateBody } from "@/helpers/requestHelper";
import { validateJwtAuthHelper } from "@/helpers/authHelper";
import * as z from "zod";
import { JwtPayload } from "jsonwebtoken";
import { deleteImgInBucket } from "@/libs/awsS3Action";
import { getTourSpotList, saveTourSpot } from "@/services/tourSpotServices";
import { ERROR_STATUS_CODE_MAPPER } from "@/helpers/httpErrorsHelper";

const MAX_IMAGES = 5;

const TourSpotSchema = z.object({
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

const listPagingSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

interface MyJwtPayload extends JwtPayload {
  data: {
    userId: number;
    username: string;
  };
}

export async function POST(req: Request) {
  try {
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

    const decodedJwt = await validateJwtAuthHelper(
      req.headers.get("authorization"),
    );
    if (!decodedJwt.success) {
      return Response.json(
        { error: decodedJwt.error },
        { status: decodedJwt.error.status },
      );
    }

    const payload = decodedJwt.data as MyJwtPayload;

    // Business logic
    const save = await saveTourSpot(
      payload.data.userId,
      result.data.name,
      result.data.entryFee,
      result.data.contact,
      result.data.owner,
      result.data.openTimeFrom,
      result.data.openTimeTo,
      result.data.openDay,
      result.data.mapsLink,
      result.data.description,
      result.data.imagesUrl,
    );

    if (!save.success) {
      return Response.json(
        { message: save.message },
        { status: ERROR_STATUS_CODE_MAPPER[save.error].statusCode },
      );
    }

    return Response.json(
      { message: "tour spot berhasil diupload" },
      { status: 200 },
    );
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

export async function GET(req: Request) {
  try {
    const decodedJwt = await validateJwtAuthHelper(
      req.headers.get("authorization"),
    );
    if (!decodedJwt.success) {
      return Response.json(
        { error: decodedJwt.error, success: decodedJwt.success },
        { status: decodedJwt.error.status },
      );
    }

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

    // Business logic
    const tourSpotList = await getTourSpotList(page, limit);
    if (!tourSpotList.success) {
      return Response.json(
        {
          error: tourSpotList.error,
          message: tourSpotList.message,
          meta: tourSpotList.meta,
        },
        { status: ERROR_STATUS_CODE_MAPPER[tourSpotList.error].statusCode },
      );
    }

    return Response.json({
      success: true,
      data: tourSpotList.tourSpotList,
      meta: {
        page,
        limit,
        totalItems: tourSpotList.dataCount,
        totalPages: tourSpotList.totalPages,
        hasNextPage: page < tourSpotList.totalPages,
        hasPrevPage: page > 1,
      },
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
