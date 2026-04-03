import { ShopItems } from "@/generated/prisma/client";
import {
  countShopItems,
  deleteShopItemById,
  findShopItemById,
  findShopItemBySlug,
  findShopItemList,
  findUniqueUser,
  pushShopItem,
  updateShopItemById,
} from "@/repository/shopItemRepository";
import { generateSlug } from "@/helpers/generateSlugHelper";
import { ErrorStatus } from "@/helpers/httpErrorsHelper";
import { deleteImgInBucket } from "@/libs/awsS3Action";
import { mergeImages } from "@/helpers/imgReplaceCompare";

const MAX_IMAGES = 5;

type GetShopItemListResult =
  | {
      success: true;
      itemList: ShopItems[];
      dataCount: number;
      totalPages: number;
    }
  | {
      success: false;
      error: ErrorStatus;
      message: string;
      meta: { page: number; totalPages: number };
    };

export async function getShopItemList(
  page: number,
  limit: number,
): Promise<GetShopItemListResult> {
  const skip = (page - 1) * limit;

  const itemList = await findShopItemList(skip, limit);
  const dataCount = await countShopItems();

  const totalPages = Math.ceil(dataCount / limit);

  if (page > totalPages && dataCount > 0) {
    return {
      success: false,
      error: "PAGE_NOT_FOUND",
      message: `Only ${totalPages} page available.`,
      meta: { page, totalPages },
    };
  }

  return { success: true, itemList, dataCount, totalPages };
}

type SaveShopItemErrorCode =
  | "USER_NOT_FOUND"
  | "SLUG_ALREADY_EXISTS"
  | "DATABASE_ERROR";

type SaveShopItemResult =
  | { success: true }
  | { success: false; error: SaveShopItemErrorCode; message: string };

export async function saveShopItem(
  userId: number,
  name: string,
  price: number,
  contact: string,
  owner: string,
  description: string,
  imagesUrl: string[],
): Promise<SaveShopItemResult> {
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

  const dbResult = await pushShopItem({
    name,
    slug,
    price,
    owner,
    contact: dialNum,
    description,
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

type ShopItemResult =
  | { success: true; data: ShopItems }
  | { success: false; error: ErrorStatus; message: string };

export async function updateShopItem(
  id: number,
  name: string,
  price: number,
  contact: string,
  owner: string,
  description: string,
  imagesUrl: string[],
): Promise<ShopItemResult> {
  const oldItem = await findShopItemById(id);
  if (!oldItem) {
    return {
      success: false,
      error: "SHOP_ITEM_NOT_FOUND",
      message: "Item tidak ditemukan.",
    };
  }

  let newSlug = oldItem.slug;
  if (name !== oldItem.name) {
    newSlug = generateSlug(name);
    const slugConflict = await findShopItemBySlug(newSlug);
    if (slugConflict && slugConflict.id !== id) {
      return {
        success: false,
        error: "SLUG_ALREADY_EXISTS",
        message: "Judul ini menghasilkan slug yang sudah dipakai item lain.",
      };
    }
  }

  const { imageArr, imageDelArr } = mergeImages(
    MAX_IMAGES,
    imagesUrl,
    oldItem.imagesUrl,
  );

  let dialNum = contact;
  if (dialNum.startsWith("0")) {
    dialNum = "62" + dialNum.slice(1);
  }

  const dbResult = await updateShopItemById(id, {
    name,
    slug: newSlug,
    price,
    owner,
    contact: dialNum,
    description,
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

export async function deleteShopItem(id: number): Promise<ShopItemResult> {
  const item = await findShopItemById(id);
  if (!item) {
    return {
      success: false,
      error: "SHOP_ITEM_NOT_FOUND",
      message: "Item tidak ditemukan.",
    };
  }

  await deleteImgInBucket(item.imagesUrl);

  const dbResult = await deleteShopItemById(id);
  if (!dbResult.success) {
    return {
      success: false,
      error: "DATABASE_ERROR",
      message: "An unexpected database error occurred.",
    };
  }

  return { success: true, data: dbResult.data };
}
