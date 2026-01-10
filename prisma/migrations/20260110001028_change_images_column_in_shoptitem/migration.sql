/*
  Warnings:

  - You are about to drop the column `additional_images` on the `ShopItems` table. All the data in the column will be lost.
  - You are about to drop the column `featured_image_url` on the `ShopItems` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ShopItems" DROP COLUMN "additional_images",
DROP COLUMN "featured_image_url",
ADD COLUMN     "images" TEXT[];
