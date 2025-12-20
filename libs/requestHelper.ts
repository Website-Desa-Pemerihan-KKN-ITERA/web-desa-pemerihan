import * as z from "zod";

type ValidationResult<T> =
  | { success: true; data: T }
  | { success: false; error: any };

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
      error: z.treeifyError(result.error),
    };
  }
}
