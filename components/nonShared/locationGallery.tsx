"use client";

import { useState, useEffect } from "react";

interface ProductGalleryProps {
  images: string[] | null;
  productName: string;
}

export default function LocationGallery({
  images,
  productName,
}: ProductGalleryProps) {
  const safeImages = images || [];

  const [activeImage, setActiveImage] = useState<string | null>(
    safeImages.length > 0 ? safeImages[0] : null,
  );

  // State untuk mengontrol apakah Modal/Lightbox terbuka
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Effect: Mencegah scroll pada body saat modal terbuka (UX Improvement)
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    // Cleanup function
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isModalOpen]);

  return (
    <div className="flex flex-col gap-4">
      {/* --- GAMBAR UTAMA --- */}
      <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center group">
        {activeImage ? (
          <div
            className="w-full h-full cursor-zoom-in relative"
            onClick={() => setIsModalOpen(true)} // Trigger buka modal
          >
            <img
              src={activeImage}
              alt={productName}
              className="h-full w-full object-cover transition-all duration-300 group-hover:scale-105"
            />
            {/* Hint icon hover */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center">
              <span className="opacity-0 group-hover:opacity-100 bg-black/50 text-white text-xs px-2 py-1 rounded-md transition-opacity">
                Klik untuk memperbesar
              </span>
            </div>
          </div>
        ) : (
          <div className="text-gray-400 flex flex-col items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span className="text-sm font-medium">Gambar tidak tersedia</span>
          </div>
        )}
      </div>

      {/* --- THUMBNAIL GALLERY --- */}
      {safeImages.length > 0 && (
        <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
          {safeImages.map((img, index) => (
            <div
              key={index}
              onClick={() => setActiveImage(img)}
              className={`
                relative aspect-square w-full cursor-pointer overflow-hidden rounded-md border-2 
                transition-all duration-200 hover:opacity-100
                ${
                  activeImage === img
                    ? "border-blue-600 opacity-100 ring-1 ring-blue-600"
                    : "border-transparent opacity-60 hover:border-gray-300"
                }
              `}
            >
              <img
                src={img}
                alt={`${productName} ${index + 1}`}
                className="h-full w-full object-cover"
              />
            </div>
          ))}
        </div>
      )}

      {/* --- MODAL / LIGHTBOX (Overlay Fullscreen) --- */}
      {isModalOpen && activeImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={() => setIsModalOpen(false)} // Klik background untuk tutup
        >
          {/* Tombol Close di Pojok Kanan Atas */}
          <button
            onClick={() => setIsModalOpen(false)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Gambar Fullscreen */}
          <div className="relative w-full h-full flex items-center justify-center">
            <img
              src={activeImage}
              alt={productName}
              className="max-h-full max-w-full object-contain shadow-2xl rounded-sm"
              onClick={(e) => e.stopPropagation()} // Mencegah modal tertutup saat gambar diklik
            />
          </div>
        </div>
      )}
    </div>
  );
}
