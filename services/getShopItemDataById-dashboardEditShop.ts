import prisma from "@/libs/prisma";
import { getPresignedDownloadUrl } from "@/libs/awsS3Action";
import { ShopItems } from "@/generated/prisma/client";

type ShopItemResult = [ShopItems | null, (string | null)[]];

export async function getShopItemData(id: number): Promise<ShopItemResult> {
  try {
    const itemShop = await prisma.shopItems.findUnique({
      where: { id: id },
    });

    if (!itemShop) {
      return [null, [null]];
    }

    const uploadPromises = itemShop.imagesUrl.map(async (currentFile) => {
      let imageUrl = null;
      if (itemShop.imagesUrl) {
        const result = await getPresignedDownloadUrl(currentFile);
        if (result.success && result.url) {
          imageUrl = result.url;
        }
      }
      return imageUrl;
    });

    const imageUrlArray = await Promise.all(uploadPromises);
    console.log(imageUrlArray);

    return [itemShop, imageUrlArray];
  } catch (error) {
    console.error("Error getting article:", error);
    return [null, [null]];
  }
}
