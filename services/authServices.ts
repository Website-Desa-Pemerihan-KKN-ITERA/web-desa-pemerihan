import bcrypt from "bcryptjs";
import { ErrorStatus } from "@/helpers/httpErrorsHelper";
import {
  createUser,
  deleteUserById,
  findUniqueUserByName,
  findUserById,
  updateUserPassword,
} from "@/repository/authRepository";
import { JWTSign } from "@/helpers/jwtHelper";
import { User } from "@/generated/prisma/client";

type loginResult =
  | {
      success: true;
      token: string;
    }
  | {
      success: false;
      message: string;
      error: ErrorStatus;
    };

export async function login(
  username: string,
  userPassword: string,
): Promise<loginResult> {
  // checking if the user is in the db or not
  const userDb = await findUniqueUserByName(username);
  if (!userDb || !userDb.password) {
    return {
      success: false,
      error: "USER_NOT_FOUND",
      message: "Username not found",
    };
  }

  // Comparing password from user request body to
  // password stored in the db using bcrypt library
  const pwMatches = await bcrypt.compare(userPassword, userDb.password);
  if (!pwMatches) {
    return {
      success: false,
      error: "INVALID_PASSWORD",
      message: "Incorrect password",
    };
  }

  const token = JWTSign(userDb.id, userDb.name);

  return {
    success: true,
    token: token,
  };
}

type registerUserResult =
  | { success: true }
  | { success: false; error: ErrorStatus; message: string };

export async function registerUser(
  username: string,
  password: string,
): Promise<registerUserResult> {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const dbResult = await createUser(username, hashedPassword);
  if (!dbResult.success) {
    if (dbResult.code === "UNIQUE_CONSTRAINT_FAILED") {
      return {
        success: false,
        error: "USERNAME_ALREADY_EXISTS",
        message: "Username already exists.",
      };
    }
    return {
      success: false,
      error: "DATABASE_ERROR",
      message: "An unexpected database error occurred.",
    };
  }

  return { success: true };
}

type changePasswordResult =
  | { success: true }
  | { success: false; error: ErrorStatus; message: string };

export async function changePassword(
  username: string,
  currentPassword: string,
  newPassword: string,
): Promise<changePasswordResult> {
  const user = await findUniqueUserByName(username);
  if (!user || !user.password) {
    return {
      success: false,
      error: "USER_NOT_FOUND",
      message: "Invalid username or password.",
    };
  }

  const passwordMatches = await bcrypt.compare(currentPassword, user.password);
  if (!passwordMatches) {
    return {
      success: false,
      error: "INVALID_PASSWORD",
      message: "Incorrect password.",
    };
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  const dbResult = await updateUserPassword(username, hashedPassword);
  if (!dbResult.success) {
    return {
      success: false,
      error: "DATABASE_ERROR",
      message: "An unexpected database error occurred.",
    };
  }

  return { success: true };
}

type deleteAccountResult =
  | { success: true; data: User }
  | { success: false; error: ErrorStatus; message: string };

export async function deleteAccount(id: number): Promise<deleteAccountResult> {
  const account = await findUserById(id);
  if (!account) {
    return {
      success: false,
      error: "ACCOUNT_NOT_FOUND",
      message: "Akun admin tidak ditemukan.",
    };
  }

  const dbResult = await deleteUserById(id);
  if (!dbResult.success) {
    return {
      success: false,
      error: "DATABASE_ERROR",
      message: "An unexpected database error occurred.",
    };
  }

  return { success: true, data: dbResult.data };
}
