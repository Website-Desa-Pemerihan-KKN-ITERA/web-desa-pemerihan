import {
  countArticle,
  deleteArticleById,
  findArticleById,
  findArticleBySlug,
  findArticleList,
  findUniqueUser,
  pushArticle,
  updateArticleById,
} from "@/repository/articleRepository";
import { Article } from "@/generated/prisma/client";
import {
  deleteArticle,
  getArticleList,
  saveArticle,
  updateArticle,
} from "./articleServices";
import { generateSlug } from "@/helpers/generateSlugHelper";
import { deleteImgInBucket } from "@/libs/awsS3Action";

jest.mock("@/repository/articleRepository", () => ({
  countArticle: jest.fn(),
  deleteArticleById: jest.fn(),
  findArticleById: jest.fn(),
  findArticleBySlug: jest.fn(),
  findArticleList: jest.fn(),
  findUniqueUser: jest.fn(),
  pushArticle: jest.fn(),
  updateArticleById: jest.fn(),
}));

jest.mock("@/helpers/generateSlugHelper", () => ({
  generateSlug: jest.fn(),
}));

jest.mock("@/libs/awsS3Action", () => ({
  deleteImgInBucket: jest.fn(),
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
      error: "PAGE_NOT_FOUND",
      message: "Only 3 page available.",
      meta: { page: 4, totalPages: 3 },
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

describe("deleteArticle Service", () => {
  const mockArticle = {
    id: 1,
    title: "Test Article",
    slug: "test-article",
    content: "Test content",
    shortDescription: "Short desc",
    featuredImageUrl: "old-image.jpg",
    createdAt: new Date(),
  } as Article;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return success with deleted article data", async () => {
    (findArticleById as jest.Mock).mockResolvedValue(mockArticle);
    (deleteImgInBucket as jest.Mock).mockResolvedValue(undefined);
    (deleteArticleById as jest.Mock).mockResolvedValue({
      success: true,
      data: mockArticle,
    });

    const result = await deleteArticle(1);

    expect(findArticleById).toHaveBeenCalledWith(1);
    expect(deleteImgInBucket).toHaveBeenCalledWith([
      mockArticle.featuredImageUrl,
    ]);
    expect(deleteArticleById).toHaveBeenCalledWith(1);
    expect(result).toEqual({ success: true, data: mockArticle });
  });

  it("should return ARTICLE_NOT_FOUND if article does not exist", async () => {
    (findArticleById as jest.Mock).mockResolvedValue(null);

    const result = await deleteArticle(1);

    expect(result).toEqual({
      success: false,
      error: "ARTICLE_NOT_FOUND",
      message: "Artikel tidak ditemukan.",
    });
    expect(deleteImgInBucket).not.toHaveBeenCalled();
    expect(deleteArticleById).not.toHaveBeenCalled();
  });

  it("should return DATABASE_ERROR if repository delete fails", async () => {
    (findArticleById as jest.Mock).mockResolvedValue(mockArticle);
    (deleteImgInBucket as jest.Mock).mockResolvedValue(undefined);
    (deleteArticleById as jest.Mock).mockResolvedValue({
      success: false,
      code: "DATABASE_ERROR",
    });

    const result = await deleteArticle(1);

    expect(result).toEqual({
      success: false,
      error: "DATABASE_ERROR",
      message: "An unexpected database error occurred.",
    });
  });
});

describe("updateArticle Service", () => {
  const mockArticle = {
    id: 1,
    title: "Old Title",
    slug: "old-title",
    content: "Old content",
    shortDescription: "Old short desc",
    featuredImageUrl: "old-image.jpg",
    createdAt: new Date(),
  } as Article;

  const mockUpdatedArticle = {
    ...mockArticle,
    title: "New Title",
    slug: "new-title",
    content: "New content",
    shortDescription: "New short desc",
  } as Article;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return success without changing slug when title is unchanged", async () => {
    (findArticleById as jest.Mock).mockResolvedValue(mockArticle);
    (updateArticleById as jest.Mock).mockResolvedValue({
      success: true,
      data: mockArticle,
    });

    const result = await updateArticle(
      1,
      mockArticle.title,
      "New content",
      "New short desc",
    );

    expect(generateSlug).not.toHaveBeenCalled();
    expect(findArticleBySlug).not.toHaveBeenCalled();
    expect(updateArticleById).toHaveBeenCalledWith(1, {
      title: mockArticle.title,
      content: "New content",
      slug: mockArticle.slug,
      shortDescription: "New short desc",
      featuredImageUrl: mockArticle.featuredImageUrl,
    });
    expect(result).toEqual({ success: true, data: mockArticle });
  });

  it("should return success and generate new slug when title changes", async () => {
    (findArticleById as jest.Mock).mockResolvedValue(mockArticle);
    (generateSlug as jest.Mock).mockReturnValue("new-title");
    (findArticleBySlug as jest.Mock).mockResolvedValue(null);
    (updateArticleById as jest.Mock).mockResolvedValue({
      success: true,
      data: mockUpdatedArticle,
    });

    const result = await updateArticle(
      1,
      "New Title",
      "New content",
      "New short desc",
    );

    expect(generateSlug).toHaveBeenCalledWith("New Title");
    expect(findArticleBySlug).toHaveBeenCalledWith("new-title");
    expect(updateArticleById).toHaveBeenCalledWith(1, {
      title: "New Title",
      content: "New content",
      slug: "new-title",
      shortDescription: "New short desc",
      featuredImageUrl: mockArticle.featuredImageUrl,
    });
    expect(result).toEqual({ success: true, data: mockUpdatedArticle });
  });

  it("should delete old image and use new image URL when featuredImageUrl is provided", async () => {
    (findArticleById as jest.Mock).mockResolvedValue(mockArticle);
    (updateArticleById as jest.Mock).mockResolvedValue({
      success: true,
      data: { ...mockArticle, featuredImageUrl: "new-image.jpg" },
    });
    (deleteImgInBucket as jest.Mock).mockResolvedValue(undefined);

    const result = await updateArticle(
      1,
      mockArticle.title,
      "New content",
      "New short desc",
      "new-image.jpg",
    );

    expect(updateArticleById).toHaveBeenCalledWith(1, {
      title: mockArticle.title,
      content: "New content",
      slug: mockArticle.slug,
      shortDescription: "New short desc",
      featuredImageUrl: "new-image.jpg",
    });
    expect(deleteImgInBucket).toHaveBeenCalledWith([
      mockArticle.featuredImageUrl,
    ]);
    expect(result).toEqual({
      success: true,
      data: { ...mockArticle, featuredImageUrl: "new-image.jpg" },
    });
  });

  it("should not delete old image when no new featuredImageUrl is provided", async () => {
    (findArticleById as jest.Mock).mockResolvedValue(mockArticle);
    (updateArticleById as jest.Mock).mockResolvedValue({
      success: true,
      data: mockArticle,
    });

    await updateArticle(1, mockArticle.title, "New content", "New short desc");

    expect(deleteImgInBucket).not.toHaveBeenCalled();
  });

  it("should return ARTICLE_NOT_FOUND if article does not exist", async () => {
    (findArticleById as jest.Mock).mockResolvedValue(null);

    const result = await updateArticle(
      999,
      "New Title",
      "New content",
      "New short desc",
    );

    expect(result).toEqual({
      success: false,
      error: "ARTICLE_NOT_FOUND",
      message: "Artikel tidak ditemukan.",
    });
    expect(updateArticleById).not.toHaveBeenCalled();
  });

  it("should return SLUG_ALREADY_EXISTS if new slug conflicts with a different article", async () => {
    (findArticleById as jest.Mock).mockResolvedValue(mockArticle);
    (generateSlug as jest.Mock).mockReturnValue("conflicting-slug");
    (findArticleBySlug as jest.Mock).mockResolvedValue({
      id: 99,
      slug: "conflicting-slug",
    });

    const result = await updateArticle(
      1,
      "Conflicting Title",
      "New content",
      "New short desc",
    );

    expect(result).toEqual({
      success: false,
      error: "SLUG_ALREADY_EXISTS",
      message: "Judul ini menghasilkan slug yang sudah dipakai artikel lain.",
    });
    expect(updateArticleById).not.toHaveBeenCalled();
  });

  it("should not treat slug conflict as error when the slug belongs to the same article", async () => {
    (findArticleById as jest.Mock).mockResolvedValue(mockArticle);
    (generateSlug as jest.Mock).mockReturnValue("old-title");
    (findArticleBySlug as jest.Mock).mockResolvedValue(mockArticle); // same id
    (updateArticleById as jest.Mock).mockResolvedValue({
      success: true,
      data: mockArticle,
    });

    const result = await updateArticle(
      1,
      "Old Title Slightly Different",
      "New content",
      "New short desc",
    );

    expect(result).toEqual({ success: true, data: mockArticle });
  });

  it("should return DATABASE_ERROR if repository update fails", async () => {
    (findArticleById as jest.Mock).mockResolvedValue(mockArticle);
    (updateArticleById as jest.Mock).mockResolvedValue({
      success: false,
      code: "DATABASE_ERROR",
    });

    const result = await updateArticle(
      1,
      mockArticle.title,
      "New content",
      "New short desc",
    );

    expect(result).toEqual({
      success: false,
      error: "DATABASE_ERROR",
      message: "An unexpected database error occurred.",
    });
    expect(deleteImgInBucket).not.toHaveBeenCalled();
  });
});
