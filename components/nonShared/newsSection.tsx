"use client";
import { useState, useEffect } from "react";
import { getImages } from "@/helpers/presignedDownloadHelper";
import Link from "next/link";

interface Article {
  title: string;
  date: string;
  image: string;
  category: string;
  excerpt: string;
  slug: string;
  featuredImageUrl: string;
  shortDescription: string;
  createdAt: string;
  content: string;
}

export default function NewsSection() {
  const [newsArticles, setNewsArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [imgArr, setImgArr] = useState<string[]>([]);
  const [imgDownloadArr, setImgDownloadArr] = useState<(string | null)[]>([]);

  // Helper function to strip HTML tags
  function stripHtml(html: string): string {
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  }

  // Fetch presigned URLs for images
  useEffect(() => {
    if (imgArr.length === 0) return;

    const getPresigned = async () => {
      const url = await getImages(imgArr);
      setImgDownloadArr(url);
    };
    getPresigned();
  }, [imgArr]);

  // Fetch articles from API
  useEffect(() => {
    async function fetchArticles() {
      try {
        const response = await fetch("/api/article/client?page=1&limit=3");
        const result = await response.json();

        if (result.success && result.data) {
          const collectedImages = result.data.map(
            (article: Article) => article.featuredImageUrl,
          );
          setImgArr(collectedImages);

          const parsedArticles = result.data.map((article: Article) => ({
            title: article.title,
            date: new Date(article.createdAt).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            }),
            image: article.featuredImageUrl,
            category: "Berita",
            excerpt: stripHtml(article.content).substring(0, 100) + "...",
            slug: article.slug,
            shortDescription: article.shortDescription,
          }));
          setNewsArticles(parsedArticles);
        }
      } catch (error) {
        console.error("Error fetching articles:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchArticles();
  }, []);

  return (
    <>
      {/* Kabar Desa (News) */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-4">
            Artikel
          </h2>
          <p className="text-center text-gray-600 mb-12">
            Berita terkini dan kegiatan terbaru dari Desa Pemerihan
          </p>

          {isLoading ? (
            <NewsSkeleton />
          ) : newsArticles.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Belum ada artikel tersedia</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {newsArticles.map((article, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl cursor-pointer border border-slate-200 overflow-hidden hover:shadow-md transition-shadow group"
                >
                  <Link href={`/article/${article.slug}`}>
                    <div className="relative">
                      <img
                        src={imgDownloadArr[index] || article.image}
                        alt={article.title}
                        className="w-full h-48 object-cover group-hover:scale-105 duration-100"
                      />
                    </div>
                    <div className="p-6">
                      <div className="text-sm text-gray-500 mb-2">
                        {article.date}
                      </div>
                      <h4 className="font-bold text-gray-800 mb-3 line-clamp-2">
                        {article.title}
                      </h4>
                      <p className="text-gray-600 text-sm line-clamp-3">
                        {article.shortDescription}
                      </p>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link href="/article">
              <button className="cursor-pointer bg-amber-600 text-white font-semibold px-8 py-3 rounded-full hover:bg-amber-700 transition">
                Lihat Semua Artikel →
              </button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function NewsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-xl border border-slate-200 overflow-hidden"
        >
          {/* Image skeleton */}
          <div className="w-full h-48 bg-gray-200 animate-pulse"></div>

          <div className="p-6 space-y-4">
            {/* Date skeleton */}
            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>

            {/* Title skeleton */}
            <div className="space-y-2">
              <div className="h-5 w-full bg-gray-200 rounded animate-pulse"></div>
            </div>

            {/* Description skeleton */}
            <div className="space-y-2">
              <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
