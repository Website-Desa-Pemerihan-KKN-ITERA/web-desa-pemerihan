"use client";
import Link from "next/link";
import { Calendar, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { getShopItemImages } from "@/libs/presignedDownloadHelper";
import { useSearchParams, usePathname } from "next/navigation";

// --- [TAMBAHAN] Helper Function untuk logic Ellipsis ---
const generatePagination = (currentPage: number, totalPages: number) => {
  // Jika total halaman sedikit (<= 7), tampilkan semua
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const siblingCount = 1; // Jumlah halaman tetangga di kiri/kanan halaman aktif
  const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
  const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

  // Cek apakah perlu menampilkan titik-titik
  const showLeftDots = leftSiblingIndex > 2;
  const showRightDots = rightSiblingIndex < totalPages - 1;

  // Case 1: Hanya titik di kanan (Posisi user di awal)
  if (!showLeftDots && showRightDots) {
    const leftItemCount = 3 + 2 * siblingCount;
    const leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
    return [...leftRange, "...", totalPages];
  }

  // Case 2: Hanya titik di kiri (Posisi user di akhir)
  if (showLeftDots && !showRightDots) {
    const rightItemCount = 3 + 2 * siblingCount;
    const rightRange = Array.from(
      { length: rightItemCount },
      (_, i) => totalPages - rightItemCount + i + 1,
    );
    return [1, "...", ...rightRange];
  }

  // Case 3: Titik di kiri dan kanan (Posisi user di tengah)
  if (showLeftDots && showRightDots) {
    const middleRange = Array.from(
      { length: rightSiblingIndex - leftSiblingIndex + 1 },
      (_, i) => leftSiblingIndex + i,
    );
    return [1, "...", ...middleRange, "...", totalPages];
  }

  return [];
};
// ------------------------------------------------------

type PaginationMeta = {
  currentPage: number;
  totalPages: number;
  totalItems: number;
};

export default function Page() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const page = Number(searchParams.get("page")) || 1;

  // const [isLoading, setIsLoading] = useState(true);
  const [imgArr, setImgArr] = useState<string[]>([]);
  const [imgDownloadArr, setImgDownloadArr] = useState<(string | null)[]>([]);
  const [shopItems, setShopItems] = useState<any>([]);
  const [meta, setMeta] = useState<PaginationMeta>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  });

  useEffect(() => {
    getShopData();
  }, [page]);

  useEffect(() => {
    if (imgArr.length === 0) return;

    const getPresigned = async () => {
      const url = await getShopItemImages(imgArr);
      setImgDownloadArr(url);
    };
    getPresigned();
  }, [imgArr]);

  console.log("params: ", page);

  const getShopData = async () => {
    // setIsLoading(true);
    const token = localStorage.getItem("auth");

    try {
      const res = await fetch(
        `http://localhost:3000/api/article/client?page=${page}&limit=2`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Gagal mengambil data");
      }

      const collectedImages = data.data.map(
        (item: any) => item.featuredImageUrl,
      );
      setImgArr(collectedImages);

      console.log("data: ", data);
      setShopItems(data.data);

      if (data.meta) {
        setMeta({
          currentPage: page,
          totalPages: data.meta.totalPages,
          totalItems: data.meta.totalItems,
        });
      }
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      // setIsLoading(false);
    }
  };

  const createPageUrl = (newPage: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage.toString());
    return `${pathname}?${params.toString()}`;
  };

  // --- [TAMBAHAN] Generate array halaman ---
  const paginationList = generatePagination(meta.currentPage, meta.totalPages);
  // ----------------------------------------
  //
  console.log(meta);

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-green-50/30">
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            {shopItems.map((article: any, i: any) => (
              <Link
                href={`/article/${article.slug}`}
                key={article.slug}
                className="block group"
              >
                <div className="bg-white rounded-xl border border-slate-200 hover:border-slate-300 transition-all duration-300 overflow-hidden">
                  <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-0">
                    <div className="relative h-64 md:h-auto overflow-hidden">
                      <img
                        src={imgDownloadArr[i]!}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    <div className="p-6 flex flex-col justify-between">
                      <div>
                        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 group-hover:text-[#2D5A27] transition-colors line-clamp-2 font-[family-name:var(--font-montserrat)]">
                          {article.title}
                        </h2>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {new Date(article.createdAt).toLocaleDateString(
                                "id-ID",
                                {
                                  day: "numeric",
                                  month: "long",
                                  year: "numeric",
                                },
                              )}
                            </span>
                          </div>
                        </div>

                        <p className="text-gray-700 leading-relaxed mb-4 line-clamp-2">
                          {article.content}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="flex justify-center mt-5 gap-1">
            {/* Nomor Halaman dengan Logic Ellipsis */}
            <div className="flex gap-1">
              {/* --- [DIUBAH] Mapping menggunakan paginationList --- */}
              {paginationList.map((pageNum, index) => {
                // Render Ellipsis (Titik-titik)
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

                // Render Angka Halaman (Link)
                return (
                  <Link
                    key={pageNum}
                    href={createPageUrl(pageNum)}
                    className={`w-10 h-10 flex items-center justify-center rounded-lg border text-sm font-medium transition-colors ${
                      pageNum === page
                        ? "bg-[#2D5A27] text-white border-[#2D5A27]"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {pageNum}
                  </Link>
                );
              })}
              {/* ------------------------------------------------ */}
            </div>

            {/* Tombol Next (Tidak Berubah) */}
            <Link
              href={createPageUrl(page + 1)}
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
        </div>
      </section>
    </main>
  );
}
