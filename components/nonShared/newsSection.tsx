"use client";
import { useState, useEffect } from "react";
import { getShopItemImages } from "@/helpers/presignedDownloadHelper";
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
      const url = await getShopItemImages(imgArr);
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

  console.log(newsArticles);
  return (
    <>
      {/* Kabar Desa (News) */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-4">
            Kabar Desa
          </h2>
          <p className="text-center text-gray-600 mb-12">
            Berita terkini dan kegiatan terbaru dari Desa Pemerihan untuk
            kepentingan bersama
          </p>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-green-600 border-r-transparent"></div>
              <p className="text-gray-600 mt-4">Memuat berita...</p>
            </div>
          ) : newsArticles.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Belum ada berita tersedia</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {newsArticles.map((article, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl cursor-pointer border border-slate-200 overflow-hidden hover:shadow-md transition-shadow"
                >
                  <Link href={`/article/${article.slug}`}>
                    <div className="relative">
                      <img
                        src={imgDownloadArr[index] || article.image}
                        alt={article.title}
                        className="w-full h-48 object-cover"
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
            <button className="bg-amber-600 text-white font-semibold px-8 py-3 rounded-full hover:bg-amber-700 transition">
              Lihat Semua Berita →
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
