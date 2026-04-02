"use client";
import { useState, useEffect } from "react";
import { getImages } from "@/helpers/presignedDownloadHelper";
import Link from "next/link";
import { IoTimeOutline } from "react-icons/io5";
import { FaRegCalendarAlt } from "react-icons/fa";

interface Tourspot {
  name: string;
  entryFee: number;
  contact: string;
  owner: string;
  openTimeFrom: string;
  openTimeTo: string; // no less than function so i dont handle case where openTimeTo are less than openTimeFrom,
  openDay: string[];
  description: string;
  imagesUrl: string[];
  slug: string;
}

export default function TopTourspot() {
  const [tourspot, setTourspot] = useState<Tourspot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [imgArr, setImgArr] = useState<string[]>([]);
  const [imgDownloadArr, setImgDownloadArr] = useState<(string | null)[]>([]);

  // Fetch presigned URLs for images
  useEffect(() => {
    if (imgArr.length === 0) return;

    const getPresigned = async () => {
      const url = await getImages(imgArr);
      setImgDownloadArr(url);
    };
    getPresigned();
  }, [imgArr]);

  // Fetch Tourspot from API
  useEffect(() => {
    async function fetchTourspot() {
      try {
        const response = await fetch("/api/tourspot/client?page=1&limit=4");
        const result = await response.json();

        if (result.success && result.data) {
          const collectedImages = result.data.map(
            (tourspot: Tourspot) => tourspot.imagesUrl[0],
          );
          setImgArr(collectedImages);
          setTourspot(result.data);
          console.log(result.data);
        }
      } catch (error) {
        console.error("Error fetching tourspot:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchTourspot();
  }, []);

  return (
    <section className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-2">
          Lokasi Wisata
        </h2>
        <p className="text-center text-gray-600 mb-12">
          Tempat Wisata Terbaik Desa Pemerihan
        </p>

        {isLoading ? (
          <TourspotSkeleton />
        ) : tourspot.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Belum ada wisata tersedia</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {tourspot.map((ts, index) => (
              <Link
                href={`/location/${ts.slug}`}
                key={index}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-100"
              >
                {/* Image */}
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={imgDownloadArr[index] || "/images/placeholder.jpg"}
                    alt={ts.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-100"
                  />

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                </div>

                {/* Content */}
                <div className="p-4 space-y-2">
                  {/* Title on image */}
                  <div className="">
                    <h3
                      className="text-black font-semibold text-lg truncate"
                      title={ts.name}
                    >
                      {ts.name}
                    </h3>
                  </div>
                  {/* Jam buka */}
                  <div className="flex items-center gap-2 font-semibold text-sm text-gray-600">
                    <IoTimeOutline className="text-lg text-amber-600" />
                    <span>
                      {new Date(ts.openTimeFrom).toLocaleTimeString("id-ID", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                      })}{" "}
                      -{" "}
                      {new Date(ts.openTimeTo).toLocaleTimeString("id-ID", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                      })}{" "}
                      WIB
                    </span>
                  </div>

                  {/* Hari buka */}
                  <div className="flex items-start gap-2 text-sm text-gray-700">
                    <FaRegCalendarAlt className="text-lg text-amber-600 mt-0.5" />
                    <div className="flex flex-wrap gap-1">
                      {ts.openDay.map((day, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full text-xs"
                        >
                          {day}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Link href="/location">
            <button className="cursor-pointer bg-amber-600 text-white font-semibold px-8 py-3 rounded-full hover:bg-amber-700 transition">
              Lihat Semua Lokasi Wisata →
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}

function TourspotSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-2xl overflow-hidden shadow-sm"
        >
          {/* Image skeleton */}
          <div className="aspect-square bg-gray-200 animate-pulse" />

          {/* Content */}
          <div className="p-4 space-y-3">
            {/* Title */}
            <div className="h-5 w-3/4 bg-gray-200 rounded animate-pulse" />

            {/* Time */}
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 bg-gray-200 rounded-full animate-pulse" />
              <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
            </div>

            {/* Days */}
            <div className="flex items-start gap-2">
              <div className="h-5 w-5 bg-gray-200 rounded-full animate-pulse mt-0.5" />
              <div className="flex flex-wrap gap-2">
                <div className="h-5 w-10 bg-gray-200 rounded-full animate-pulse" />
                <div className="h-5 w-12 bg-gray-200 rounded-full animate-pulse" />
                <div className="h-5 w-8 bg-gray-200 rounded-full animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
