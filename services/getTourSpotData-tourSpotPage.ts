import prisma from "@/libs/prisma";
import { getPresignedDownloadUrl } from "@/libs/awsS3Action";
import { Location } from "@/generated/prisma/client";

type ShopItemResult = [Location | null, (string | null)[]];

export async function getTourSpotData(slug: string): Promise<ShopItemResult> {
  try {
    const itemShop = await prisma.location.findUnique({
      where: { slug: slug },
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

    return [itemShop, imageUrlArray];
  } catch (error) {
    console.error("Error getting article:", error);
    return [null, [null]];
  }
}
