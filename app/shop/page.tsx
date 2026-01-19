"use client";
import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import {
  createPageUrl,
  generatePagination,
} from "@/helpers/pageNumberingUiHelper";
import { usePathname, useSearchParams } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { getShopItemImages } from "@/helpers/presignedDownloadHelper";
import formatRupiah from "@/helpers/rupiahFormat";

interface ShopItem {
  createdAt: string;
  name: string;
  price: number;
  slug: string;
  contact: string;
  owner: string;
  description: string;
  imagesUrl: string[];
}

type PaginationMeta = {
  currentPage: number;
  totalPages: number;
  totalItems: number;
};

function ShopContent() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const page = Number(searchParams.get("page")) || 1;

  const [shopItems, setShopItems] = useState<ShopItem[]>([]);
  const [imgArr, setImgArr] = useState<string[]>([]);
  const [imgDownloadArr, setImgDownloadArr] = useState<(string | null)[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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

  const getShopData = async () => {
    setIsLoading(true);
    const token = localStorage.getItem("auth");

    try {
      const res = await fetch(`/api/shopitem/client?page=${page}&limit=12`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Gagal mengambil data");
      }

      const collectedImages = data.data.map(
        (item: ShopItem) => item.imagesUrl[0],
      );
      setImgArr(collectedImages);
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
      setIsLoading(false);
    }
  };

  const paginationList = generatePagination(meta.currentPage, meta.totalPages);

  // Jika sedang loading data API (Client Side Fetching)
  if (isLoading) {
    return <ShopListSkeleton />;
  }

  // Jika data kosong
  if (!isLoading && shopItems.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        Belum ada produk yang tersedia.
      </div>
    );
  }

  return (
    <>
      {/* Grid Layout untuk Card */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-10 lg:gap-16">
        {shopItems.map((item, i) => (
          <div
            key={item.slug}
            className="group bg-white transition-all duration-300 overflow-hidden flex flex-col"
          >
            <Link href={`/shop/${item.slug}`} prefetch={false}>
              {/* Bagian Image */}
              <div className="relative aspect-square rounded-xl bg-gray-100 overflow-hidden">
                {imgDownloadArr[i] ? (
                  <img
                    src={imgDownloadArr[i]}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-100"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full text-gray-400">
                    <span className="text-sm">Loading...</span>
                  </div>
                )}
              </div>

              {/* Bagian Konten */}
              <div className="pb-4 pt-1 flex flex-col flex-grow">
                <p
                  className="font-medium text-gray-600 truncate mb-0 leading-tight"
                  title={item.name}
                >
                  {item.name}
                </p>
                <p className="font-bold mt-0 leading-tight">
                  {formatRupiah(item.price)}
                </p>
                <p className="text-sm text-gray-600 line-clamp-2 flex-grow mt-1">
                  {item.owner}
                </p>
              </div>
            </Link>
          </div>
        ))}
      </div>

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
    </>
  );
}

export default function Page() {
  return (
    <div className="container max-w-7xl mx-auto px-4 py-8">
      {/* Judul Render Langsung (Static) */}
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Daftar Produk</h1>

      {/* Konten Dinamis (Wrapped in Suspense) */}
      <Suspense fallback={<ShopListSkeleton />}>
        <ShopContent />
      </Suspense>
    </div>
  );
}

function ShopListSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-pulse">
      {[...Array(12)].map((_, i) => (
        <div key={i} className="h-64 bg-gray-200 rounded-xl"></div>
      ))}
    </div>
  );
}
