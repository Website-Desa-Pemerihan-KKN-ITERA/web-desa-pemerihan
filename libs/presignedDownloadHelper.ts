import { getPresignedDownloadUrl } from "@/libs/awsS3Action";

type ShopItemResult = (string | null)[];

export async function getShopItemData(
  imgUrls: string[],
): Promise<ShopItemResult> {
  try {
    if (!imgUrls) {
      return [null];
    }

    const uploadPromises = imgUrls.map(async (currentFile) => {
      let imageUrl = null;
      if (imgUrls) {
        const result = await getPresignedDownloadUrl(currentFile);
        if (result.success && result.url) {
          imageUrl = result.url;
        }
      }
      return imageUrl;
    });

    const imageUrlArray = await Promise.all(uploadPromises);
    console.log(imageUrlArray);

    return imageUrlArray;
  } catch (error) {
    console.error("Error getting article:", error);
    return [null];
  }
}
