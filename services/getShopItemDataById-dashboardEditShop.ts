import prisma from "@/libs/prisma";
import { getPresignedDownloadUrl } from "@/libs/awsS3Action";
import { Prisma } from "@/generated/prisma/client";

type ShopItemResult = [Prisma.ShopItemsGetPayload<{}> | null, string | null];

export async function getShopItemData(id: number): Promise<ShopItemResult> {
  try {
    const itemShop = await prisma.shopItems.findUnique({
      where: { id: id },
    });

    if (!itemShop) {
      return [null, null];
    }

    let imageUrl = null;
    if (itemShop.featuredImageUrl) {
      const result = await getPresignedDownloadUrl(itemShop.featuredImageUrl);
      if (result.success && result.url) {
        imageUrl = result.url;
      }
    }
    return [itemShop, imageUrl];
  } catch (error) {
    console.error("Error getting article by ID:", error);
    return [null, null];
  }
}
