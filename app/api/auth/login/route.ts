import * as z from "zod";
import { validateBody } from "@/helpers/requestHelper";
import { login } from "@/services/authServices";
import { ERROR_STATUS_CODE_MAPPER } from "@/helpers/httpErrorsHelper";

const User = z.object({
  username: z.string().min(5),
  password: z.string().min(5),
});

export async function POST(req: Request) {
  try {
    const result = await validateBody(req, User);
    if (!result.success) {
      return Response.json(
        { error: result.error },
        { status: result.error.status },
      );
    }

    // Bussiness logic
    const loginResult = await login(result.data.username, result.data.password);
    if (!loginResult.success) {
      return Response.json(
        { message: loginResult.message },
        { status: ERROR_STATUS_CODE_MAPPER[loginResult.error].statusCode },
      );
    }

    return Response.json(
      {
        message: "Login berhasil",
        token: loginResult.token,
      },
      { status: 200 },
    );
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
