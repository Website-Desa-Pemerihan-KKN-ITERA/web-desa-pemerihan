import prisma from "@/libs/prisma";
import { Prisma } from "@/generated/prisma/client";

export async function findShopItemList(skip: number, limit: number) {
  return await prisma.shopItems.findMany({
    skip,
    take: limit,
    orderBy: { createdAt: "desc" },
  });
}

export async function countShopItems() {
  return await prisma.shopItems.count();
}

export async function findUniqueUser(userId: number) {
  return await prisma.user.findUnique({
    where: { id: userId },
  });
}

export async function findShopItemById(id: number) {
  return await prisma.shopItems.findUnique({ where: { id } });
}

export async function findShopItemBySlug(slug: string) {
  return await prisma.shopItems.findUnique({ where: { slug } });
}

export async function pushShopItem(data: {
  name: string;
  slug: string;
  price: number;
  owner: string;
  contact: string;
  description: string;
  imagesUrl: string[];
}) {
  try {
    await prisma.shopItems.create({ data });
    return { success: true as const };
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      switch (err.code) {
        case "P2002":
          return {
            success: false as const,
            code: "UNIQUE_CONSTRAINT_FAILED" as const,
          };
        default:
          return { success: false as const, code: "DATABASE_ERROR" as const };
      }
    }
    console.error("pushShopItem DB Error:", err);
    return { success: false as const, code: "DB_UNKNOWN_ERROR" as const };
  }
}

export async function updateShopItemById(
  id: number,
  data: {
    name: string;
    slug: string;
    price: number;
    owner: string;
    contact: string;
    description: string;
    imagesUrl: string[];
  },
) {
  try {
    const updated = await prisma.shopItems.update({ where: { id }, data });
    return { success: true as const, data: updated };
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      switch (err.code) {
        case "P2025":
          return { success: false as const, code: "NOT_FOUND" as const };
        default:
          return { success: false as const, code: "DATABASE_ERROR" as const };
      }
    }
    console.error("updateShopItemById DB Error:", err);
    return { success: false as const, code: "DB_UNKNOWN_ERROR" as const };
  }
}

export async function deleteShopItemById(id: number) {
  try {
    const deleted = await prisma.shopItems.delete({ where: { id } });
    return { success: true as const, data: deleted };
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      switch (err.code) {
        case "P2025":
          return { success: false as const, code: "NOT_FOUND" as const };
        default:
          return { success: false as const, code: "DATABASE_ERROR" as const };
      }
    }
    console.error("deleteShopItemById DB Error:", err);
    return { success: false as const, code: "DB_UNKNOWN_ERROR" as const };
  }
}
