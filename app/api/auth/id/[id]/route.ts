import prisma from "@/libs/prisma";
import { Prisma } from "@/generated/prisma/client";
import { validateJwtAuthHelper } from "@/helpers/authHelper";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const accountId = parseInt(id);
  if (isNaN(accountId)) {
    return Response.json(
      { error: "ID Akun admin tidak valid" },
      { status: 400 },
    );
  }

  const jwt = await validateJwtAuthHelper(req.headers.get("authorization"));
  if (!jwt.success) {
    return Response.json({ error: jwt.error }, { status: jwt.error.status });
  }

  try {
    const account = await prisma.user.findUnique({
      where: { id: accountId },
    });
    if (!account) {
      throw new Error("Akun nya tidak ada");
    }
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

  try {
    const deletedAccount = await prisma.user.delete({
      where: { id: accountId },
    });

    return Response.json({
      message: "Akun admin berhasil dihapus",
      data: deletedAccount,
    });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      switch (err.code) {
        case "P2025":
          return Response.json(
            { error: "Akun admin tidak ditemukan" },
            { status: 404 },
          );
        default:
          return Response.json(
            { error: "Database nya error", code: err.code },
            { status: 500 },
          );
      }
    }
    return Response.json(
      { error: "Terjadi kesalahan internal server" },
      { status: 500 },
    );
  }
}
