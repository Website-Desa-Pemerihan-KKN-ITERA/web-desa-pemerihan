import prisma from "@/libs/prisma";
import { Prisma } from "@/generated/prisma/client";

export async function findTourSpotList(skip: number, limit: number) {
  return await prisma.location.findMany({
    skip,
    take: limit,
    orderBy: { createdAt: "desc" },
  });
}

export async function countTourSpots() {
  return await prisma.location.count();
}

export async function findUniqueUser(userId: number) {
  return await prisma.user.findUnique({
    where: { id: userId },
  });
}

export async function findTourSpotById(id: number) {
  return await prisma.location.findUnique({ where: { id } });
}

export async function findTourSpotBySlug(slug: string) {
  return await prisma.location.findUnique({ where: { slug } });
}

export async function pushTourSpot(data: {
  name: string;
  entryFee: number;
  slug: string;
  contact: string;
  owner: string;
  openTimeFrom: string;
  openTimeTo: string;
  openDay: string[];
  description: string;
  mapsUrl: string;
  imagesUrl: string[];
}) {
  try {
    await prisma.location.create({ data });
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
    console.error("pushTourSpot DB Error:", err);
    return { success: false as const, code: "DB_UNKNOWN_ERROR" as const };
  }
}

export async function updateTourSpotById(
  id: number,
  data: {
    name: string;
    entryFee: number;
    slug: string;
    contact: string;
    owner: string;
    openTimeFrom: string;
    openTimeTo: string;
    openDay: string[];
    description: string;
    mapsUrl: string;
    imagesUrl: string[];
  },
) {
  try {
    const updated = await prisma.location.update({ where: { id }, data });
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
    console.error("updateTourSpotById DB Error:", err);
    return { success: false as const, code: "DB_UNKNOWN_ERROR" as const };
  }
}

export async function deleteTourSpotById(id: number) {
  try {
    const deleted = await prisma.location.delete({ where: { id } });
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
    console.error("deleteTourSpotById DB Error:", err);
    return { success: false as const, code: "DB_UNKNOWN_ERROR" as const };
  }
}
