"use client";
import Link from "next/link";
import DashboardSidebar from "@/ui/dashboardSidebar";
import { PiArticleMedium } from "react-icons/pi";
import { useEffect, useState } from "react";

export default function ArticleDashboard() {
  const [articles, setArticles] = useState<any>([]);

  const getArticleData = async () => {
    try {
      const res = await fetch(
        "http://localhost:3000/api/article?page=1&limit=10",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (!res.ok) {
        throw new Error("Request failed");
      }

      const data = await res.json();
      console.log(data);
      setArticles(data.data);

      localStorage.setItem("auth", data.token);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getArticleData();
  }, []);

  return (
    <div className="flex flex-col md:flex-row min-h-dvh bg-white">
      <DashboardSidebar />

      <main className="flex-1 p-5 md:p-8 overflow-x-hidden">
        <div className="font-bold text-xl mb-6">Article</div>

        <div className="mb-6 flex">
          <Link prefetch={false} href="/admin/dashboard/article/addarticle">
            <span className="flex items-center gap-2 rounded-2xl py-2 px-4 bg-blue-50 text-blue-700 font-bold cursor-pointer hover:bg-blue-100 text-sm transition-colors">
              <PiArticleMedium className="text-xl" />
              Tulis Artikel Baru
            </span>
          </Link>
        </div>

        {articles.map((article: any) => (
          <div key={article.id} className="flex flex-col gap-4 mb-5">
            <div className="border rounded-lg p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm">
              <div>
                <p className="text-gray-700 truncate max-w-md font-bold">
                  {article.title}
                </p>
              </div>

              <div className="flex gap-3 text-sm font-medium">
                <Link
                  href={`/admin/dashboard/article/editarticle/${article.id}`}
                  className="px-3 py-1 text-blue-600 hover:bg-blue-50 rounded border border-transparent hover:border-blue-100"
                >
                  Edit
                </Link>
                <button className="px-3 py-1 text-red-600 hover:bg-red-50 rounded">
                  Hapus
                </button>
              </div>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}
