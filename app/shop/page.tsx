"use client";
import { useEffect, useState } from "react";
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
  description: string;
  imagesUrl: string[];
}

type PaginationMeta = {
  currentPage: number;
  totalPages: number;
  totalItems: number;
};

export default function Page() {
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

      // mapping ke seluruh item image url untuk dibuatkan presigneddownload
      const collectedImages = data.data.map(
        (item: ShopItem) => item.imagesUrl[0],
      );
      setImgArr(collectedImages);

      // getShopItemImages(data.data.)
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

  return (
    <div className="container max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Daftar Produk</h1>

      {/* Loading State Skeleton (Sederhana) */}
      {isLoading && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-pulse">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-64 bg-gray-200 rounded-xl"></div>
          ))}
        </div>
      )}

      {/* Grid Layout untuk Card */}
      {!isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-16">
          {shopItems.map((item, i) => (
            <div
              key={item.slug}
              className="group bg-white transition-all duration-300 overflow-hidden flex flex-col"
            >
              {/* Action Button */}
              <Link
                href={`/shop/${item.slug}`} // Sesuaikan dengan routing detail page Anda
              >
                {/* Bagian Image - Mengambil index 0 */}
                <div className="relative aspect-square rounded-xl bg-gray-100 overflow-hidden">
                  {item.imagesUrl && item.imagesUrl.length > 0 ? (
                    <img
                      src={imgDownloadArr[i]!}
                      alt={item.name}
                      className="w-full h-full hover:rounded-xl object-cover group-hover:scale-105 transition-transform duration-100"
                    />
                  ) : (
                    // Fallback jika tidak ada gambar
                    <div className="flex items-center justify-center w-full h-full text-gray-400">
                      <span className="text-sm">No Image</span>
                    </div>
                  )}
                </div>

                {/* Bagian Konten */}
                <div className="py-4 px-2 flex flex-col flex-grow">
                  {/* Nama Produk (Truncate jika terlalu panjang) */}
                  <h3
                    className="font-medium text-gray-800 mb-1 truncate"
                    title={item.name}
                  >
                    {item.name}
                  </h3>

                  {/* Harga */}
                  <p className="font-bold text-lg mb-2">
                    {formatRupiah(item.price)}
                  </p>

                  {/* Deskripsi Singkat */}
                  <p className="text-sm text-gray-600 line-clamp-2 mb-4 flex-grow">
                    {item.description}
                  </p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}

      {/* Nomor Halaman dengan Logic Ellipsis dan tombol next */}
      <div className="flex justify-center mt-5 gap-1">
        <div className="flex gap-1">
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

      {/* Empty State */}
      {!isLoading && shopItems.length === 0 && (
        <div className="text-center py-10 text-gray-500">
          Belum ada produk yang tersedia.
        </div>
      )}
    </div>
  );
}
