import { countArticle, findArticleList } from "@/repository/articleRepository";
import { Article } from "@/generated/prisma/client";
import { getArticleList } from "./articleServices";

jest.mock("@/repository/articleRepository", () => ({
  countArticle: jest.fn(),
  findArticleList: jest.fn(),
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
