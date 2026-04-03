import * as z from "zod";
import { validateBody } from "@/helpers/requestHelper";
import { changePassword } from "@/services/authServices";
import { ERROR_STATUS_CODE_MAPPER } from "@/helpers/httpErrorsHelper";

const fromRequest = z.object({
  username: z.string().min(5),
  password: z.string().min(5),
  newPassword: z.string().min(5),
});

export async function PUT(req: Request) {
  try {
    const result = await validateBody(req, fromRequest);
    if (!result.success) {
      return Response.json(
        { error: result.error },
        { status: result.error.status },
      );
    }

    // Bussiness logic
    const change = await changePassword(
      result.data.username,
      result.data.password,
      result.data.newPassword,
    );
    if (!change.success) {
      return Response.json(
        { message: change.message },
        { status: ERROR_STATUS_CODE_MAPPER[change.error].statusCode },
      );
    }

    return Response.json({ message: "Password berhasil diubah." });
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
