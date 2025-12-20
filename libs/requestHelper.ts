import * as z from "zod";

type ValidationError = {
  message: string;
  code: string;
  status: number;
  details?: unknown;
};

type ValidationResult<T> =
  | { success: true; data: T }
  | { success: false; error: ValidationError };

export async function validateBody<T>(
  req: Request,
  schema: z.Schema<T>,
): Promise<ValidationResult<T>> {
  let body: any;

  try {
    body = await req.json();
  } catch (e) {
    return {
      success: false,
      error: {
        message: "Body Json hilang atau tidak valid",
        code: "INVALID_JSON",
        status: 400,
      },
    };
  }

  const result = schema.safeParse(body);

  if (result.success) {
    return {
      success: true,
      data: result.data,
    };
  } else {
    return {
      success: false,
      error: {
        message: "Validasi gagal",
        code: "VALIDATION_ERROR",
        status: 422,
        details: z.treeifyError(result.error),
      },
    };
  }
}
