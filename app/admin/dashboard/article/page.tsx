"use client";
import Link from "next/link";
import DashboardSidebar from "@/components/nonShared/dashboardSidebar";
import { PiArticleMedium } from "react-icons/pi";
import { Suspense, useEffect, useState } from "react";
import { CiTrash } from "react-icons/ci";
import { MdOutlineModeEdit } from "react-icons/md";
import { timeFormatter } from "@/helpers/timeFormatterToID";
import { RiExpandDiagonalLine } from "react-icons/ri";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { ChevronRight } from "lucide-react";
import {
  createPageUrl,
  generatePagination,
} from "@/helpers/pageNumberingUiHelper";

interface Article {
  id: number;
  createdAt: string;
  title: string;
  slug: string;
  featuredImageUrl: string;
  content: string;
}

function ArticleDashboard() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [meta, setMeta] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  });

  const router = useRouter();
  const page = Number(searchParams.get("page")) || 1;

  useEffect(() => {
    getArticleData();
  }, [page]);

  const getArticleData = async () => {
    setIsLoading(true);
    const token = localStorage.getItem("auth");
    try {
      const res = await fetch(`/api/article?page=${page}&limit=5`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      // if success != true, fallback user to login page
      if (!data.success) {
        router.push("/auth/login");
        return;
      }

      // error handling
      if (!res.ok) {
        throw new Error("Request failed");
      }

      setArticles(data.data);
      if (data.meta) {
        setMeta({
          currentPage: page,
          totalPages: data.meta.totalPages,
          totalItems: data.meta.totalItems,
        });
      }
      console.log(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    const token = localStorage.getItem("auth");
    try {
      const res = await fetch(`/api/article/id/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      // error handling
      if (!res.ok) {
        throw new Error("Request failed");
      }

      // running get shop data again to refresh data without refreshing all page
      getArticleData();
    } catch (err) {
      console.error(err);
    }
  };

  const paginationList = generatePagination(meta.currentPage, meta.totalPages);

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

        {isLoading ? (
          <ArticleListSkeleton />
        ) : articles.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            Belum ada artikel di halaman ini.
          </div>
        ) : (
          articles.map((article) => (
            <div key={article.id} className="flex flex-col gap-4 mb-5">
              <div className="border border-[#ACACAF] rounded-2xl px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <p className="text-gray-700 truncate max-w-md text-xl font-bold">
                    {article.title}
                  </p>
                  <p className="text-gray-700 truncate max-w-md text-sm">
                    Dibuat pada:
                  </p>
                  <p className="text-gray-700 truncate max-w-md text-sm">
                    {timeFormatter(article.createdAt)}
                  </p>
                </div>

                <div className="flex gap-1 text-sm font-medium">
                  <Link
                    href={`/article/${article.slug}`}
                    className="px-3 py-1 text-xl text-[#40a02b] hover:bg-green-50 rounded border border-transparent"
                  >
                    <RiExpandDiagonalLine />
                  </Link>
                  <Link
                    href={`/admin/dashboard/article/editarticle/${article.id}`}
                    className="px-3 py-1 text-xl text-[#1e66f5] hover:bg-blue-50 rounded border border-transparent"
                  >
                    <MdOutlineModeEdit />
                  </Link>
                  <button
                    className="px-3 py-1 text-xl text-[#e64553] hover:bg-red-50 rounded"
                    onClick={() => handleDelete(article.id)}
                  >
                    <CiTrash />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}

        {/* Pagination */}
        <div className="flex justify-center mt-5 gap-1">
          <div className="flex gap-1">
            {paginationList.map((pageNum, index) => {
              if (pageNum === "...") {
                return (
                  <span
                    key={`dots-${index}`}
                    className="w-10 h-10 flex items-center justify-center text-gray-400"
                  >
                    ...
                  </span>
                );
              }

              return (
                <Link
                  key={pageNum}
                  href={createPageUrl(pageNum, searchParams, pathname)}
                  className={`w-10 h-10 flex items-center justify-center rounded-lg border text-sm font-medium transition-colors ${
                    pageNum === page
                      ? "bg-yellow-400 text-gray-700 border-yellow-400"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {pageNum}
                </Link>
              );
            })}
          </div>

          <Link
            href={createPageUrl(page + 1, searchParams, pathname)}
            prefetch={false}
            className={`p-2 rounded-lg border ${
              page >= meta.totalPages
                ? "pointer-events-none opacity-50 bg-gray-100 text-gray-400"
                : "bg-white text-gray-700 hover:bg-gray-50 border-gray-300"
            }`}
            aria-disabled={page >= meta.totalPages}
          >
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </main>
    </div>
  );
}

function ArticleListSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex flex-col gap-4 mb-5">
          <div className="border border-[#ACACAF] rounded-2xl px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex-1 space-y-3">
              <div className="h-6 bg-gray-300 rounded w-1/3" />
              <div className="h-4 bg-gray-200 rounded w-1/4" />
              <div className="h-4 bg-gray-200 rounded w-2/5" />
            </div>
            <div className="flex gap-1">
              <div className="w-10 h-10 bg-gray-200 rounded" />
              <div className="w-10 h-10 bg-gray-200 rounded" />
              <div className="w-10 h-10 bg-gray-200 rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Page() {
  return (
    <Suspense>
      <ArticleDashboard />
    </Suspense>
  );
}
