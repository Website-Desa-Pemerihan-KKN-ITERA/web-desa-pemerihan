import {
  countArticle,
  findArticleList,
  findUniqueUser,
  pushArticle,
} from "@/repository/articleRepository";
import { Article } from "@/generated/prisma/client";
import { getArticleList, saveArticle } from "./articleServices";
import { generateSlug } from "@/helpers/generateSlugHelper";

jest.mock("@/repository/articleRepository", () => ({
  countArticle: jest.fn(),
  findArticleList: jest.fn(),
  findUniqueUser: jest.fn(),
  pushArticle: jest.fn(),
}));

jest.mock("@/helpers/generateSlugHelper", () => ({
  generateSlug: jest.fn(),
}));

describe("getArticleList Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return article list and success metadata in normal scenario", async () => {
    const mockArticles = [
      { id: "1", title: "Artikel 1" },
      { id: "2", title: "Artikel 2" },
    ] as unknown as Article[];

    const mockDataCount = 5;
    const page = 1;
    const limit = 2;

    (findArticleList as jest.Mock).mockResolvedValue(mockArticles);
    (countArticle as jest.Mock).mockResolvedValue(mockDataCount);

    const result = await getArticleList(page, limit);

    expect(findArticleList).toHaveBeenCalledWith(0, 2); // skip = (1 - 1) * 2 = 0
    expect(countArticle).toHaveBeenCalledTimes(1);

    expect(result).toEqual({
      success: true,
      articleList: mockArticles,
      dataCount: mockDataCount,
      totalPages: 3, // Math.ceil(5 / 2) = 3
    });
  });

  it("should return 404 response if page exceeds total pages", async () => {
    const mockDataCount = 5;
    const page = 4;
    const limit = 2;

    (findArticleList as jest.Mock).mockResolvedValue([]);
    (countArticle as jest.Mock).mockResolvedValue(mockDataCount);

    const result = await getArticleList(page, limit);

    expect(result).toEqual({
      success: false,
      error: "Page not found",
      message: "Only 3 page available.",
      meta: { page: 4, totalPages: 3 },
      status: 404,
    });
  });

  it("should return success with empty array if database is empty (dataCount = 0)", async () => {
    const page = 2;
    const limit = 10;

    (findArticleList as jest.Mock).mockResolvedValue([]);
    (countArticle as jest.Mock).mockResolvedValue(0);

    const result = await getArticleList(page, limit);

    expect(result).toEqual({
      success: true,
      articleList: [],
      dataCount: 0,
      totalPages: 0,
    });
  });

  it("should throw error if database (repository) execution fails", async () => {
    const dbError = new Error("Database connection lost");
    (findArticleList as jest.Mock).mockRejectedValue(dbError);

    await expect(getArticleList(1, 10)).rejects.toThrow(
      "Database connection lost",
    );
  });
});

describe("saveArticle Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return success true if all processes succeed", async () => {
    (findUniqueUser as jest.Mock).mockResolvedValue({ id: 1 });
    (generateSlug as jest.Mock).mockReturnValue("test-slug");
    (pushArticle as jest.Mock).mockResolvedValue({ success: true });

    const result = await saveArticle(
      1,
      "Test Title",
      "Test Content",
      "image.jpg",
      "short desc",
    );

    expect(findUniqueUser).toHaveBeenCalledWith(1);
    expect(generateSlug).toHaveBeenCalledWith("Test Title");
    expect(pushArticle).toHaveBeenCalledWith(
      "Test Title",
      "test-slug",
      "Test Content",
      "image.jpg",
      "short desc",
    );

    expect(result).toEqual({
      success: true,
    });
  });

  it("should return USER_NOT_FOUND if user does not exist", async () => {
    (findUniqueUser as jest.Mock).mockResolvedValue(null);

    const result = await saveArticle(
      999,
      "Test Title",
      "Test Content",
      "image.jpg",
      "short desc",
    );

    expect(result).toEqual({
      success: false,
      error: "USER_NOT_FOUND",
      message: "The specified user was not found.",
    });

    expect(pushArticle).not.toHaveBeenCalled();
  });

  it("should return SLUG_ALREADY_EXISTS if unique constraint error occurs", async () => {
    (findUniqueUser as jest.Mock).mockResolvedValue({ id: 1 });
    (generateSlug as jest.Mock).mockReturnValue("duplicate-slug");
    (pushArticle as jest.Mock).mockResolvedValue({
      success: false,
      code: "UNIQUE_CONSTRAINT_FAILED",
    });

    const result = await saveArticle(
      1,
      "Test Title",
      "Test Content",
      "image.jpg",
      "short desc",
    );

    expect(result).toEqual({
      success: false,
      error: "SLUG_ALREADY_EXISTS",
      message: "A record with the same unique field already exists.",
    });
  });

  it("should return DATABASE_ERROR if error other than unique constraint occurs", async () => {
    (findUniqueUser as jest.Mock).mockResolvedValue({ id: 1 });
    (generateSlug as jest.Mock).mockReturnValue("test-slug");
    (pushArticle as jest.Mock).mockResolvedValue({
      success: false,
      code: "UNKNOWN_ERROR",
    });

    const result = await saveArticle(
      1,
      "Test Title",
      "Test Content",
      "image.jpg",
      "short desc",
    );

    expect(result).toEqual({
      success: false,
      error: "DATABASE_ERROR",
      message: "An unexpected database error occurred.",
    });
  });

  it("should throw error if dependency throws exception", async () => {
    const error = new Error("DB connection failed");
    (findUniqueUser as jest.Mock).mockRejectedValue(error);

    await expect(
      saveArticle(1, "Test", "Content", "img.jpg", "desc"),
    ).rejects.toThrow("DB connection failed");
  });
});
