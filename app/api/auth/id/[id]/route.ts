import { validateJwtAuthHelper } from "@/helpers/authHelper";
import { deleteAccount } from "@/services/authServices";
import { ERROR_STATUS_CODE_MAPPER } from "@/helpers/httpErrorsHelper";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
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

    // Bussiness logic
    const result = await deleteAccount(accountId);
    if (!result.success) {
      return Response.json(
        { message: result.message },
        { status: ERROR_STATUS_CODE_MAPPER[result.error].statusCode },
      );
    }

    return Response.json({
      message: "Akun admin berhasil dihapus",
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    return Response.json(
      {
        error: "Internal Server Error",
        message: "An unexpected error occurred while processing the request.",
      },
      { status: 500 },
    );
  }
}
