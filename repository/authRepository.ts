import prisma from "@/libs/prisma";
import { Prisma } from "@/generated/prisma/client";

export async function findUniqueUserByName(username: string) {
  return await prisma.user.findUnique({
    where: { name: username },
  });
}

export async function findUserById(id: number) {
  return await prisma.user.findUnique({
    where: { id },
  });
}

export async function createUser(username: string, hashedPassword: string) {
  try {
    await prisma.user.create({
      data: { name: username, password: hashedPassword },
    });
    return { success: true as const };
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      switch (err.code) {
        case "P2002":
          return { success: false as const, code: "UNIQUE_CONSTRAINT_FAILED" };
        default:
          return { success: false as const, code: "DATABASE_ERROR" };
      }
    }
    console.error("createUser DB Error:", err);
    return { success: false as const, code: "DB_UNKNOWN_ERROR" };
  }
}

export async function updateUserPassword(
  username: string,
  hashedPassword: string,
) {
  try {
    await prisma.user.update({
      where: { name: username },
      data: { password: hashedPassword },
    });
    return { success: true as const };
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      return { success: false as const, code: "DATABASE_ERROR" };
    }
    console.error("updateUserPassword DB Error:", err);
    return { success: false as const, code: "DB_UNKNOWN_ERROR" };
  }
}

export async function deleteUserById(id: number) {
  try {
    const deleted = await prisma.user.delete({
      where: { id },
    });
    return { success: true as const, data: deleted };
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      switch (err.code) {
        case "P2025":
          return { success: false as const, code: "NOT_FOUND" };
        default:
          return { success: false as const, code: "DATABASE_ERROR" };
      }
    }
    console.error("deleteUserById DB Error:", err);
    return { success: false as const, code: "DB_UNKNOWN_ERROR" };
  }
}
