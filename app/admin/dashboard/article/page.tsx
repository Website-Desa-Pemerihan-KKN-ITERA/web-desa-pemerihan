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
    <div className="flex flex-col md:flex-row min-h-dvh bg-[#FFFFFF]">
      <DashboardSidebar />

      <main className="flex-1 p-5 md:p-8 overflow-x-hidden">
        <div className="font-bold text-4xl text-[#333446] mb-6">Artikel</div>

        <div className="mb-6 flex">
          <Link prefetch={false} href="/admin/dashboard/article/addarticle">
            <span className="flex items-center gap-2 rounded-2xl py-2 px-4 bg-[#F0F0F0] text-[#333446] font-bold cursor-pointer hover:bg-[#ACADAD] text-sm transition-colors">
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
                  className="px-3 py-1 text-[#1e66f5] hover:bg-blue-50 rounded border border-transparent"
                >
                  Edit
                </Link>
                <button className="px-3 py-1 text-[#e64553] hover:bg-red-50 rounded">
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
