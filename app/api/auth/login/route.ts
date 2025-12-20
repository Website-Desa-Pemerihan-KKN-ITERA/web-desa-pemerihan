import bcrypt from "bcryptjs";
import prisma from "@/libs/prisma";
import { Prisma } from "@/generated/prisma/client";
import * as z from "zod";
import jwt from "jsonwebtoken";
import { AUTH_CONFIG } from "@/libs/JWTConfig";
import { validateBody } from "@/libs/requestHelper";

const User = z.object({
  username: z.string().min(5),
  password: z.string().min(5),
});

export async function POST(req: Request) {
  let userDb;

  const result = await validateBody(req, User);
  if (!result.success) {
    return Response.json(
      { error: result.error },
      { status: result.error.status },
    );
  }

  try {
    userDb = await prisma.user.findUnique({
      where: {
        name: result.data.username,
      },
    });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      switch (err.code) {
        default:
          return Response.json(
            { error: "Database nya error", code: err.code },
            { status: 500 },
          );
      }
    }
  }

  if (!userDb || !userDb.password) {
    return Response.json(
      { error: "Username atau Password salah" },
      { status: 401 },
    );
  }

  const pwMatches = await bcrypt.compare(result.data.password, userDb.password);
  if (!pwMatches) {
    return Response.json(
      { error: "Username atau Password salah" },
      { status: 401 },
    );
  }

  const token = jwt.sign(
    {
      exp:
        Math.floor(Date.now() / AUTH_CONFIG.JWT_EXP_DIVIDER) +
        AUTH_CONFIG.JWT_EXP_TIME,
      data: {
        userId: userDb.id,
        username: userDb.name,
      },
    },
    AUTH_CONFIG.JWT_SECRET,
  );

  return Response.json(
    {
      message: "Login berhasil",
      token: token,
    },
    { status: 200 },
  );
}
