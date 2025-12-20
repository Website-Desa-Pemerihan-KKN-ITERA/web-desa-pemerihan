import bcrypt from "bcryptjs";
import prisma from "@/libs/prisma";
import * as z from "zod";
import { validateBody } from "@/libs/requestHelper";

// zod type validation
const fromRequest = z.object({
  username: z.string().min(5),
  password: z.string().min(5),
  newPassword: z.string().min(5),
});

export async function PUT(req: Request) {
  const result = await validateBody(req, fromRequest);
  if (!result.success) {
    return Response.json(
      { error: result.error },
      { status: result.error.status },
    );
  }

  // query to db to get the user row
  let user;
  try {
    user = await prisma.user.findUnique({
      where: {
        name: result.data.username,
      },
    });

    // handle password or username is valid or not
    if (!user || !user.password) {
      return Response.json(
        { error: "Invalid username or password" },
        { status: 401 },
      );
    }
  } catch (err) {
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }

  // compare the password of user request with the hash in the db in the same user
  const checkPassword = await bcrypt.compare(
    result.data.password,
    user.password,
  ); //bool
  if (checkPassword === false) {
    return Response.json({ error: "Password salah" }, { status: 401 });
  }
  console.log(user);

  try {
    await prisma.user.update({
      where: {
        name: result.data.username,
      },
      data: {
        password: result.data.newPassword,
      },
    });
  } catch {
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }

  return Response.json({
    message: "Password berhasil diubah.",
  });
}
