import * as z from "zod";
import { getTourSpotList } from "@/services/tourSpotServices";
import { ERROR_STATUS_CODE_MAPPER } from "@/helpers/httpErrorsHelper";

const listPagingSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

export async function GET(req: Request) {
  try {
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

    const safeLocation = tourSpotList.tourSpotList.map(
      ({ id: _id, ...rest }) => rest,
    );

    return Response.json({
      success: true,
      data: safeLocation,
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
