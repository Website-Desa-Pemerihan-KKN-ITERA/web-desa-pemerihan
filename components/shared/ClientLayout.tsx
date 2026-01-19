// components/shared/ClientLayout.tsx
"use client"; // [PENTING] Menandakan ini berjalan di sisi client

import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // [KONFIGURASI] Daftar rute yang TIDAK ingin menampilkan Header & Footer
  // Contoh: Halaman login, register, atau halaman error khusus
  const disableLayout = [
    "/auth/login",
    "/auth/register",
    "/admin/dashboard",
    "/admin/dashboard/accounts",
    "/admin/dashboard/article",
    "/admin/dashboard/article/addarticle",
    "/admin/dashboard/article/editarticle",
    "/admin/dashboard/shop",
    "/admin/dashboard/shop/addItem",
    "/admin/dashboard/shop/edititem",
  ];

  // Cek apakah pathname saat ini ada di daftar disableLayout
  const isLayoutDisabled = disableLayout.includes(pathname);

  // Jika Anda ingin mengecualikan sub-rute (misal: semua di bawah /admin/...)
  // const isLayoutDisabled = disableLayout.includes(pathname) || pathname.startsWith("/admin");

  return (
    <>
      {/* Tampilkan Header HANYA jika tidak di-disable */}
      {!isLayoutDisabled && <Header />}

      {/* Konten utama halaman (Page) selalu dirender */}
      {children}

      {/* Tampilkan Footer HANYA jika tidak di-disable */}
      {<Footer />}
    </>
  );
}
