import { Location } from "@/generated/prisma/client";
import {
  countTourSpots,
  deleteTourSpotById,
  findTourSpotById,
  findTourSpotBySlug,
  findTourSpotList,
  findUniqueUser,
  pushTourSpot,
  updateTourSpotById,
} from "@/repository/tourSpotRepository";
import { generateSlug } from "@/helpers/generateSlugHelper";
import { ErrorStatus } from "@/helpers/httpErrorsHelper";
import { deleteImgInBucket } from "@/libs/awsS3Action";
import { mergeImages } from "@/helpers/imgReplaceCompare";

const MAX_IMAGES = 5;

type GetTourSpotListResult =
  | {
      success: true;
      tourSpotList: Location[];
      dataCount: number;
      totalPages: number;
    }
  | {
      success: false;
      error: ErrorStatus;
      message: string;
      meta: { page: number; totalPages: number };
    };

export async function getTourSpotList(
  page: number,
  limit: number,
): Promise<GetTourSpotListResult> {
  const skip = (page - 1) * limit;

  const tourSpotList = await findTourSpotList(skip, limit);
  const dataCount = await countTourSpots();

  const totalPages = Math.ceil(dataCount / limit);

  if (page > totalPages && dataCount > 0) {
    return {
      success: false,
      error: "PAGE_NOT_FOUND",
      message: `Only ${totalPages} page available.`,
      meta: { page, totalPages },
    };
  }

  return { success: true, tourSpotList, dataCount, totalPages };
}

type SaveTourSpotErrorCode =
  | "USER_NOT_FOUND"
  | "SLUG_ALREADY_EXISTS"
  | "DATABASE_ERROR";

type SaveTourSpotResult =
  | { success: true }
  | { success: false; error: SaveTourSpotErrorCode; message: string };

export async function saveTourSpot(
  userId: number,
  name: string,
  entryFee: number,
  contact: string,
  owner: string,
  openTimeFrom: string,
  openTimeTo: string,
  openDay: string[],
  mapsUrl: string,
  description: string,
  imagesUrl: string[],
): Promise<SaveTourSpotResult> {
  const userExists = await findUniqueUser(userId);
  if (!userExists) {
    return {
      success: false,
      error: "USER_NOT_FOUND",
      message: "The specified user was not found.",
    };
  }

  const slug = generateSlug(name);

  let dialNum = contact;
  if (dialNum.startsWith("0")) {
    dialNum = "62" + dialNum.slice(1);
  }

  const dbResult = await pushTourSpot({
    name,
    entryFee,
    slug,
    contact: dialNum,
    owner,
    openTimeFrom,
    openTimeTo,
    openDay,
    description,
    mapsUrl,
    imagesUrl,
  });

  if (!dbResult.success) {
    if (dbResult.code === "UNIQUE_CONSTRAINT_FAILED") {
      return {
        success: false,
        error: "SLUG_ALREADY_EXISTS",
        message: "A record with the same unique field already exists.",
      };
    }
    return {
      success: false,
      error: "DATABASE_ERROR",
      message: "An unexpected database error occurred.",
    };
  }

  return { success: true };
}

type TourSpotResult =
  | { success: true; data: Location }
  | { success: false; error: ErrorStatus; message: string };

export async function updateTourSpot(
  id: number,
  name: string,
  entryFee: number,
  contact: string,
  owner: string,
  openTimeFrom: string,
  openTimeTo: string,
  openDay: string[],
  mapsUrl: string,
  description: string,
  imagesUrl: string[],
): Promise<TourSpotResult> {
  const oldLocation = await findTourSpotById(id);
  if (!oldLocation) {
    return {
      success: false,
      error: "TOUR_SPOT_NOT_FOUND",
      message: "Tour spot tidak ditemukan.",
    };
  }

  let newSlug = oldLocation.slug;
  if (name !== oldLocation.name) {
    newSlug = generateSlug(name);
    const slugConflict = await findTourSpotBySlug(newSlug);
    if (slugConflict && slugConflict.id !== id) {
      return {
        success: false,
        error: "SLUG_ALREADY_EXISTS",
        message: "Judul ini menghasilkan slug yang sudah dipakai artikel lain.",
      };
    }
  }

  const { imageArr, imageDelArr } = mergeImages(
    MAX_IMAGES,
    imagesUrl,
    oldLocation.imagesUrl,
  );

  let dialNum = contact;
  if (dialNum.startsWith("0")) {
    dialNum = "62" + dialNum.slice(1);
  }

  const dbResult = await updateTourSpotById(id, {
    name,
    entryFee,
    slug: newSlug,
    contact: dialNum,
    owner,
    openTimeFrom,
    openTimeTo,
    openDay,
    description,
    mapsUrl,
    imagesUrl: imageArr,
  });

  if (!dbResult.success) {
    return {
      success: false,
      error: "DATABASE_ERROR",
      message: "An unexpected database error occurred.",
    };
  }

  if (imageDelArr.length > 0) {
    await deleteImgInBucket(imageDelArr);
  }

  return { success: true, data: dbResult.data };
}

export async function deleteTourSpot(id: number): Promise<TourSpotResult> {
  const item = await findTourSpotById(id);
  if (!item) {
    return {
      success: false,
      error: "TOUR_SPOT_NOT_FOUND",
      message: "Tour spot tidak ditemukan.",
    };
  }

  await deleteImgInBucket(item.imagesUrl);

  const dbResult = await deleteTourSpotById(id);
  if (!dbResult.success) {
    return {
      success: false,
      error: "DATABASE_ERROR",
      message: "An unexpected database error occurred.",
    };
  }

  return { success: true, data: dbResult.data };
}
