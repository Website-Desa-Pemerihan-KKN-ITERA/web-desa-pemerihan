import {
  changePassword,
  deleteAccount,
  login,
  registerUser,
} from "@/services/authServices";
import bcrypt from "bcryptjs";
import {
  createUser,
  deleteUserById,
  findUniqueUserByName,
  findUserById,
  updateUserPassword,
} from "@/repository/authRepository";
import { JWTSign } from "@/helpers/jwtHelper";
import { User } from "@/generated/prisma/client";

jest.mock("bcryptjs");
jest.mock("@/repository/authRepository");
jest.mock("@/helpers/jwtHelper");

const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;
const mockedFindUser = findUniqueUserByName as jest.Mock;
const mockedJWTSign = JWTSign as jest.Mock;
const mockedCreateUser = createUser as jest.Mock;
const mockedFindUserById = findUserById as jest.Mock;
const mockedUpdateUserPassword = updateUserPassword as jest.Mock;
const mockedDeleteUserById = deleteUserById as jest.Mock;

describe("login service", () => {
  const mockUser = {
    id: 1,
    name: "faiq",
    password: "hashed-password",
    createdAt: new Date(),
  } as User;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return success with token when credentials are valid", async () => {
    mockedFindUser.mockResolvedValue(mockUser);
    (mockedBcrypt.compare as jest.Mock).mockResolvedValue(true);
    mockedJWTSign.mockReturnValue("mocked-token");

    const result = await login("faiq", "correctpassword");

    expect(mockedFindUser).toHaveBeenCalledWith("faiq");
    expect(mockedBcrypt.compare).toHaveBeenCalledWith(
      "correctpassword",
      mockUser.password,
    );
    expect(mockedJWTSign).toHaveBeenCalledWith(mockUser.id, mockUser.name);
    expect(result).toEqual({ success: true, token: "mocked-token" });
  });

  it("should return USER_NOT_FOUND when user does not exist", async () => {
    mockedFindUser.mockResolvedValue(null);

    const result = await login("unknown", "anypassword");

    expect(result).toEqual({
      success: false,
      error: "USER_NOT_FOUND",
      message: "Username not found",
    });
    expect(mockedBcrypt.compare).not.toHaveBeenCalled();
    expect(mockedJWTSign).not.toHaveBeenCalled();
  });

  it("should return INVALID_PASSWORD when password does not match", async () => {
    mockedFindUser.mockResolvedValue(mockUser);
    (mockedBcrypt.compare as jest.Mock).mockResolvedValue(false);

    const result = await login("faiq", "wrongpassword");

    expect(result).toEqual({
      success: false,
      error: "INVALID_PASSWORD",
      message: "Incorrect password",
    });
    expect(mockedJWTSign).not.toHaveBeenCalled();
  });
});

describe("registerUser service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return success when user is created", async () => {
    mockedBcrypt.genSalt.mockResolvedValue("salt" as never);
    mockedBcrypt.hash.mockResolvedValue("hashed-password" as never);
    mockedCreateUser.mockResolvedValue({ success: true });

    const result = await registerUser("newuser", "password123");

    expect(mockedBcrypt.genSalt).toHaveBeenCalledWith(10);
    expect(mockedBcrypt.hash).toHaveBeenCalledWith("password123", "salt");
    expect(mockedCreateUser).toHaveBeenCalledWith("newuser", "hashed-password");
    expect(result).toEqual({ success: true });
  });

  it("should return USERNAME_ALREADY_EXISTS when username is taken", async () => {
    mockedBcrypt.genSalt.mockResolvedValue("salt" as never);
    mockedBcrypt.hash.mockResolvedValue("hashed-password" as never);
    mockedCreateUser.mockResolvedValue({
      success: false,
      code: "UNIQUE_CONSTRAINT_FAILED",
    });

    const result = await registerUser("existinguser", "password123");

    expect(result).toEqual({
      success: false,
      error: "USERNAME_ALREADY_EXISTS",
      message: "Username already exists.",
    });
  });

  it("should return DATABASE_ERROR when create fails for other reason", async () => {
    mockedBcrypt.genSalt.mockResolvedValue("salt" as never);
    mockedBcrypt.hash.mockResolvedValue("hashed-password" as never);
    mockedCreateUser.mockResolvedValue({
      success: false,
      code: "DB_UNKNOWN_ERROR",
    });

    const result = await registerUser("newuser", "password123");

    expect(result).toEqual({
      success: false,
      error: "DATABASE_ERROR",
      message: "An unexpected database error occurred.",
    });
  });
});

describe("changePassword service", () => {
  const mockUser = {
    id: 1,
    name: "testuser",
    password: "hashed-old-password",
    createdAt: new Date(),
  } as User;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return success when password is changed", async () => {
    mockedFindUser.mockResolvedValue(mockUser);
    (mockedBcrypt.compare as jest.Mock).mockResolvedValue(true);
    mockedBcrypt.genSalt.mockResolvedValue("salt" as never);
    mockedBcrypt.hash.mockResolvedValue("hashed-new-password" as never);
    mockedUpdateUserPassword.mockResolvedValue({ success: true });

    const result = await changePassword("testuser", "oldpass", "newpass");

    expect(mockedFindUser).toHaveBeenCalledWith("testuser");
    expect(mockedBcrypt.compare).toHaveBeenCalledWith(
      "oldpass",
      mockUser.password,
    );
    expect(mockedBcrypt.hash).toHaveBeenCalledWith("newpass", "salt");
    expect(mockedUpdateUserPassword).toHaveBeenCalledWith(
      "testuser",
      "hashed-new-password",
    );
    expect(result).toEqual({ success: true });
  });

  it("should return USER_NOT_FOUND when user does not exist", async () => {
    mockedFindUser.mockResolvedValue(null);

    const result = await changePassword("nobody", "oldpass", "newpass");

    expect(result).toEqual({
      success: false,
      error: "USER_NOT_FOUND",
      message: "Invalid username or password.",
    });
    expect(mockedBcrypt.compare).not.toHaveBeenCalled();
    expect(mockedUpdateUserPassword).not.toHaveBeenCalled();
  });

  it("should return INVALID_PASSWORD when current password is wrong", async () => {
    mockedFindUser.mockResolvedValue(mockUser);
    (mockedBcrypt.compare as jest.Mock).mockResolvedValue(false);

    const result = await changePassword("testuser", "wrongpass", "newpass");

    expect(result).toEqual({
      success: false,
      error: "INVALID_PASSWORD",
      message: "Incorrect password.",
    });
    expect(mockedUpdateUserPassword).not.toHaveBeenCalled();
  });

  it("should return DATABASE_ERROR when update fails", async () => {
    mockedFindUser.mockResolvedValue(mockUser);
    (mockedBcrypt.compare as jest.Mock).mockResolvedValue(true);
    mockedBcrypt.genSalt.mockResolvedValue("salt" as never);
    mockedBcrypt.hash.mockResolvedValue("hashed-new-password" as never);
    mockedUpdateUserPassword.mockResolvedValue({
      success: false,
      code: "DATABASE_ERROR",
    });

    const result = await changePassword("testuser", "oldpass", "newpass");

    expect(result).toEqual({
      success: false,
      error: "DATABASE_ERROR",
      message: "An unexpected database error occurred.",
    });
  });
});

describe("deleteAccount service", () => {
  const mockUser = {
    id: 1,
    name: "testuser",
    password: "hashed-password",
    createdAt: new Date(),
  } as User;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return success with deleted account data", async () => {
    mockedFindUserById.mockResolvedValue(mockUser);
    mockedDeleteUserById.mockResolvedValue({ success: true, data: mockUser });

    const result = await deleteAccount(1);

    expect(mockedFindUserById).toHaveBeenCalledWith(1);
    expect(mockedDeleteUserById).toHaveBeenCalledWith(1);
    expect(result).toEqual({ success: true, data: mockUser });
  });

  it("should return ACCOUNT_NOT_FOUND when account does not exist", async () => {
    mockedFindUserById.mockResolvedValue(null);

    const result = await deleteAccount(999);

    expect(result).toEqual({
      success: false,
      error: "ACCOUNT_NOT_FOUND",
      message: "Akun admin tidak ditemukan.",
    });
    expect(mockedDeleteUserById).not.toHaveBeenCalled();
  });

  it("should return DATABASE_ERROR when delete fails", async () => {
    mockedFindUserById.mockResolvedValue(mockUser);
    mockedDeleteUserById.mockResolvedValue({
      success: false,
      code: "DATABASE_ERROR",
    });

    const result = await deleteAccount(1);

    expect(result).toEqual({
      success: false,
      error: "DATABASE_ERROR",
      message: "An unexpected database error occurred.",
    });
  });
});
