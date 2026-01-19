import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";

// [TAMBAH] Import ClientLayout yang baru dibuat
import ClientLayout from "@/components/shared/ClientLayout";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Desa Pemerihan - Official Website",
  description: "Portal resmi Desa Pemerihan Kabupaten Pesisir Barat",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${inter.variable} ${montserrat.variable} antialiased`}>
        {/* [UBAH] Gunakan ClientLayout untuk membungkus children */}
        {/* Header dan Footer sekarang diatur di dalam ClientLayout */}
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
