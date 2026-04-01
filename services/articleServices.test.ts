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

  it("harus mengembalikan daftar artikel dan metadata sukses pada skenario normal", async () => {
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

  it("harus mengembalikan response 404 jika halaman (page) melebihi total halaman (totalPages)", async () => {
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

  it("harus mengembalikan sukses dengan array kosong jika database kosong (dataCount = 0)", async () => {
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

  it("harus melempar error (throw) jika eksekusi database (repository) gagal", async () => {
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

  it("harus return success true jika semua proses berhasil", async () => {
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

  it("harus return USER_NOT_FOUND jika user tidak ada", async () => {
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

  it("harus return SLUG_ALREADY_EXISTS jika terjadi unique constraint error", async () => {
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

  it("harus return DATABASE_ERROR jika terjadi error selain unique constraint", async () => {
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

  it("harus throw error jika dependency melempar exception", async () => {
    const error = new Error("DB connection failed");
    (findUniqueUser as jest.Mock).mockRejectedValue(error);

    await expect(
      saveArticle(1, "Test", "Content", "img.jpg", "desc"),
    ).rejects.toThrow("DB connection failed");
  });
});
