export default function Header() {
  return (
    <header className="top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-yellow-400 rounded-full flex items-center justify-center font-bold text-lg">
              🌾
            </div>
            <div className="hidden sm:block">
              <h1 className="font-bold text-gray-800">Desa Pemerihan</h1>
              <p className="text-xs text-gray-600">Kabupaten Pesisir Barat</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <a
              href="/"
              className="text-gray-700 hover:text-green-700 font-medium"
            >
              Beranda
            </a>
            <a
              href="/tentang"
              className="text-gray-700 hover:text-green-700 font-medium"
            >
              Tentang
            </a>
            <a
              href="/shop"
              className="text-gray-700 hover:text-green-700 font-medium"
            >
              Produk UMKM
            </a>
            <a
              href="/umkm"
              className="text-gray-700 hover:text-green-700 font-medium"
            >
              UMKM (deprecated)
            </a>
            <a
              href="/article"
              className="text-gray-700 hover:text-green-700 font-medium"
            >
              Artikel
            </a>
            <a
              href="/artikel"
              className="text-gray-700 hover:text-green-700 font-medium"
            >
              Artikel (deprecated)
            </a>
            <a
              href="/lokasi"
              className="text-gray-700 hover:text-green-700 font-medium"
            >
              Lokasi
            </a>
          </nav>

          <button className="md:hidden text-gray-700">
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
          </button>
        </div>
      </div>
    </header>
  );
}
