import { login } from "@/services/authServices";
import bcrypt from "bcryptjs";
import { findUniqueUserByName } from "@/repository/authRepository";
import { JWTSign } from "@/helpers/jwtHelper";

jest.mock("bcryptjs");
jest.mock("@/repository/authRepository");
jest.mock("@/helpers/jwtHelper");

const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;
const mockedFindUser = findUniqueUserByName as jest.Mock;
const mockedJWTSign = JWTSign as jest.Mock;

describe("login service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  type TestCase = {
    name: string;
    input: {
      username: string;
      password: string;
    };
    mock: {
      userDb: {
        id: number;
        name: string;
        password: string;
      } | null;
      passwordMatch?: boolean;
      token?: string;
    };
    expected: {
      success: boolean;
      error?: string;
      message?: string;
      token?: string;
    };
  };

  const testCases: TestCase[] = [
    {
      name: "USER_NOT_FOUND when user does not exist",
      input: {
        username: "faiq",
        password: "123",
      },
      mock: {
        userDb: null,
      },
      expected: {
        success: false,
        error: "USER_NOT_FOUND",
        message: "Username not found",
      },
    },
    {
      name: "INVALID_PASSWORD when password does not match",
      input: {
        username: "faiq",
        password: "123",
      },
      mock: {
        userDb: {
          id: 1,
          name: "faiq",
          password: "hashed",
        },
        passwordMatch: false,
      },
      expected: {
        success: false,
        error: "INVALID_PASSWORD",
        message: "Incorrect password",
      },
    },
    {
      name: "SUCCESS when login is valid",
      input: {
        username: "faiq",
        password: "123",
      },
      mock: {
        userDb: {
          id: 1,
          name: "faiq",
          password: "hashed",
        },
        passwordMatch: true,
        token: "mocked-token",
      },
      expected: {
        success: true,
        token: "mocked-token",
      },
    },
  ];

  it.each(testCases)("$name", async ({ input, mock, expected }) => {
    // setup mock DB
    mockedFindUser.mockResolvedValue(mock.userDb);

    // setup bcrypt
    if (mock.passwordMatch !== undefined) {
      (mockedBcrypt.compare as jest.Mock).mockResolvedValue(mock.passwordMatch);
    }

    // setup JWT
    if (mock.token) {
      mockedJWTSign.mockReturnValue(mock.token);
    }

    const result = await login(input.username, input.password);

    expect(result).toEqual(expected);
  });
});
