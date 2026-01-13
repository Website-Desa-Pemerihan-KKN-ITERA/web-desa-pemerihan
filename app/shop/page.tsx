"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getShopItemImages } from "@/libs/presignedDownloadHelper";
import formatRupiah from "@/libs/rupiahFormat";

interface ShopItem {
  createdAt: string;
  name: string;
  price: number;
  slug: string;
  contact: string;
  description: string;
  imagesUrl: string[];
}

export default function Page() {
  const [shopItems, setShopItems] = useState<ShopItem[]>([]);
  const [imgArr, setImgArr] = useState<string[]>([]);
  const [imgDownloadArr, setImgDownloadArr] = useState<(string | null)[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getShopData();
  }, []);

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
      const res = await fetch(
        "http://localhost:3000/api/shopitem/client?page=1&limit=10",
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

      // mapping ke seluruh item image url untuk dibuatkan presigneddownload
      const collectedImages = data.data.map((item: any) => item.imagesUrl[0]);
      setImgArr(collectedImages);

      // getShopItemImages(data.data.)
      setShopItems(data.data);
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {shopItems.map((item, i) => (
            <div
              key={item.slug}
              className="group bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col"
            >
              {/* Action Button */}
              <Link
                href={`/shop/${item.slug}`} // Sesuaikan dengan routing detail page Anda
              >
                {/* Bagian Image - Mengambil index 0 */}
                <div className="relative aspect-square bg-gray-100 overflow-hidden">
                  {item.imagesUrl && item.imagesUrl.length > 0 ? (
                    <img
                      src={imgDownloadArr[i]!}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    // Fallback jika tidak ada gambar
                    <div className="flex items-center justify-center w-full h-full text-gray-400">
                      <span className="text-sm">No Image</span>
                    </div>
                  )}
                </div>

                {/* Bagian Konten */}
                <div className="p-4 flex flex-col flex-grow">
                  {/* Nama Produk (Truncate jika terlalu panjang) */}
                  <h3
                    className="font-semibold text-gray-800 text-lg mb-1 truncate"
                    title={item.name}
                  >
                    {item.name}
                  </h3>

                  {/* Harga */}
                  <p className="text-emerald-600 font-bold text-lg mb-2">
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

      {/* Empty State */}
      {!isLoading && shopItems.length === 0 && (
        <div className="text-center py-10 text-gray-500">
          Belum ada produk yang tersedia.
        </div>
      )}
    </div>
  );
}
