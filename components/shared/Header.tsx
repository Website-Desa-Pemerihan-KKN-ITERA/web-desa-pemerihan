"use client";
import { useState } from "react";
import Link from "next/link";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
}

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo Section */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center font-bold text-lg text-gray-900 shadow-sm">
              🌾
            </div>
            <div>
              <h1 className="font-bold text-gray-900 tracking-wide text-lg leading-tight">
                Desa Pemerihan
              </h1>
              <p className="text-[10px] text-gray-500 uppercase tracking-wider font-medium">
                Kabupaten Pesisir Barat
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <NavLink href="/">Beranda</NavLink>
            <NavLink href="/tentang">Tentang</NavLink>
            <NavLink href="/shop">Produk UMKM</NavLink>
            <NavLink href="/article">Artikel</NavLink>
            <NavLink href="/lokasi">Lokasi</NavLink>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
          >
            {isOpen ? (
              // Icon X (Close)
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              // Icon Hamburger (Menu)
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-gray-100 shadow-lg absolute w-full left-0 top-full">
          <nav className="flex flex-col px-4 py-4 space-y-2">
            <MobileNavLink href="/">Beranda</MobileNavLink>
            <MobileNavLink href="/tentang">Tentang</MobileNavLink>
            <MobileNavLink href="/shop">Produk UMKM</MobileNavLink>
            <MobileNavLink href="/article">Artikel</MobileNavLink>
            <MobileNavLink href="/lokasi">Lokasi</MobileNavLink>
          </nav>
        </div>
      )}
    </header>
  );
}

// Komponen link untuk Desktop
function NavLink({ href, children }: NavLinkProps) {
  return (
    <Link
      href={href}
      className="text-sm font-medium text-gray-600 hover:text-green-700 transition-colors"
    >
      {children}
    </Link>
  );
}

// Komponen link untuk Mobile (lebih besar area kliknya)
function MobileNavLink({ href, children }: NavLinkProps) {
  return (
    <Link
      href={href}
      className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-green-700 hover:bg-gray-50 rounded-md transition-colors"
    >
      {children}
    </Link>
  );
}
