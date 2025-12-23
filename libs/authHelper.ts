import jwt, { JwtPayload } from "jsonwebtoken";
import { AUTH_CONFIG } from "@/libs/JWTConfig";

type ValidationError = {
  message: string;
  code: string;
  status: number;
  details?: unknown;
};

type ValidationResult =
  | { success: true; data: string | JwtPayload }
  | { success: false; error: ValidationError };

export async function validateJwtAuthHelper(
  authHeader: string | null,
): Promise<ValidationResult> {
  let token: string;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.error("Token tidak valid atau tidak ditemukan");
    return {
      success: false,
      error: {
        message: "Token tidak valid atau tidak ditemukan",
        code: "INVALID_TOKEN",
        status: 401,
      },
    };
  } else {
    token = authHeader.split(" ")[1];
  }

  // verifying the jwt
  let decodedUser;
  try {
    decodedUser = jwt.verify(token, AUTH_CONFIG.JWT_SECRET);
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      return {
        success: false,
        error: {
          message: "Token sudah kadaluwarsa",
          code: "TOKEN_EXPIRED",
          status: 401,
        },
      };
    } else if (err instanceof jwt.JsonWebTokenError) {
      return {
        success: false,
        error: {
          message: "Token tidak valid",
          code: "INVALID_TOKEN",
          status: 401,
        },
      };
    } else {
      return {
        success: false,
        error: {
          message: "Internal Server Error saat Auth",
          code: "INTERNAL_SERVER_ERROR",
          status: 500,
        },
      };
    }
  }
  console.log(decodedUser);

  return {
    success: true,
    data: decodedUser,
  };
}
