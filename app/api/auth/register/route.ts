import * as z from "zod";
import { validateBody } from "@/helpers/requestHelper";
import { validateJwtAuthHelper } from "@/helpers/authHelper";
import { registerUser } from "@/services/authServices";
import { ERROR_STATUS_CODE_MAPPER } from "@/helpers/httpErrorsHelper";

const fromRequest = z.object({
  username: z.string().min(5),
  password: z.string().min(5),
});

export async function POST(req: Request) {
  try {
    const result = await validateBody(req, fromRequest);
    if (!result.success) {
      return Response.json(
        { error: result.error },
        { status: result.error.status },
      );
    }

    const jwt = await validateJwtAuthHelper(req.headers.get("authorization"));
    if (!jwt.success) {
      return Response.json({ error: jwt.error }, { status: jwt.error.status });
    }

    // Bussiness logic
    const register = await registerUser(
      result.data.username,
      result.data.password,
    );
    if (!register.success) {
      return Response.json(
        { message: register.message },
        { status: ERROR_STATUS_CODE_MAPPER[register.error].statusCode },
      );
    }

    return Response.json({ message: "User Berhasil Dibuat" });
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
