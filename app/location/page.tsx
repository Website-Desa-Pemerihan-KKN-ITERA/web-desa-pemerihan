"use client";
import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import {
  createPageUrl,
  generatePagination,
} from "@/helpers/pageNumberingUiHelper";
import { usePathname, useSearchParams } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { getImages } from "@/helpers/presignedDownloadHelper";
import { IoTimeOutline } from "react-icons/io5";
import { FaRegCalendarAlt } from "react-icons/fa";

interface TourSpot {
  createdAt: string;
  name: string;
  entryFee: number;
  slug: string;
  contact: string;
  owner: string;
  description: string;
  openTimeFrom: string;
  openTimeTo: string;
  openDay: string[];
  imagesUrl: string[];
}

type PaginationMeta = {
  currentPage: number;
  totalPages: number;
  totalItems: number;
};

function TourSpotContent() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const page = Number(searchParams.get("page")) || 1;

  const [tourSpots, setTourSpots] = useState<TourSpot[]>([]);
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
      const url = await getImages(imgArr);
      setImgDownloadArr(url);
    };
    getPresigned();
  }, [imgArr]);

  const getShopData = async () => {
    setIsLoading(true);
    const token = localStorage.getItem("auth");

    try {
      const res = await fetch(`/api/tourspot/client?page=${page}&limit=12`, {
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
        (item: TourSpot) => item.imagesUrl[0],
      );

      setImgArr(collectedImages);
      setTourSpots(data.data);

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
    return <TourSpotListSkeleton />;
  }

  // Jika data kosong
  if (!isLoading && tourSpots.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        Belum ada produk yang tersedia.
      </div>
    );
  }

  return (
    <>
      {/* Grid Layout untuk Card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {tourSpots.map((item, i) => (
          <div
            key={item.slug}
            className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
          >
            <Link href={`/location/${item.slug}`}>
              {/* IMAGE */}
              <div className="relative h-56 overflow-hidden">
                {imgDownloadArr[i] ? (
                  <img
                    src={imgDownloadArr[i]}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 animate-pulse" />
                )}
              </div>

              {/* CONTENT */}
              <div className="p-4 flex flex-col gap-2">
                <h2 className="text-lg font-semibold text-gray-800 line-clamp-1">
                  {item.name}
                </h2>

                {/* Jam buka */}
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <IoTimeOutline className="text-base" />
                  <span>
                    {new Date(item.openTimeFrom).toLocaleTimeString("id-ID", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    })}{" "}
                    -{" "}
                    {new Date(item.openTimeTo).toLocaleTimeString("id-ID", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    })}{" "}
                    WIB
                  </span>
                </div>

                {/* Hari buka */}
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FaRegCalendarAlt />
                  <span className="line-clamp-1">
                    {item.openDay.join(", ")}
                  </span>
                </div>
                {/* Owner */}
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                  Pengelola: {item.owner}
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
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Pariwisata</h1>

      <Suspense fallback={<TourSpotListSkeleton />}>
        <TourSpotContent />
      </Suspense>
    </div>
  );
}

function TourSpotListSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
      {[...Array(12)].map((_, i) => (
        <div key={i} className="h-64 bg-gray-200 rounded-xl"></div>
      ))}
    </div>
  );
}
