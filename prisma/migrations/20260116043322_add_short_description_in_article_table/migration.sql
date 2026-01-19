/*
  Warnings:

  - You are about to drop the column `additional_images` on the `Article` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "ShopItems_name_key";

-- AlterTable
ALTER TABLE "Article" DROP COLUMN "additional_images",
ADD COLUMN     "short_description" TEXT NOT NULL DEFAULT '';
