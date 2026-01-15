import Link from "next/link";

export default function Footer() {
  return (
    <footer
      style={{ background: "linear-gradient(to right, #654321, #4a2f1a)" }}
      className="text-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row justify-between items-start gap-10 mb-10">
          <div className="max-w-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center text-lg shadow-lg">
                🌾
              </div>
              <div>
                <h3 className="font-bold text-xl tracking-wide">
                  Desa Pemerihan
                </h3>
                <p className="text-amber-200 text-xs uppercase tracking-wider">
                  Kabupaten Pesisir Barat
                </p>
              </div>
            </div>
            <p className="text-amber-50/80 text-sm leading-relaxed mb-6">
              Mewujudkan desa yang mandiri, sejahtera, dan berkelanjutan.
            </p>
            <div className="text-sm text-amber-50/70 space-y-1">
              <p>Jl Desa Pemerihan No. 123, Kab. Matus, Jatim</p>
              <p>info@desapemerihan.id • (0341) 555-0123</p>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-amber-200 mb-4 text-sm uppercase tracking-wider">
              Menu
            </h4>
            <ul className="space-y-3 text-sm text-amber-50">
              <li>
                <Link
                  href="/"
                  className="hover:text-white hover:translate-x-1 transition-all inline-block"
                >
                  Beranda
                </Link>
              </li>
              <li>
                <Link
                  href="/tentang"
                  className="hover:text-white hover:translate-x-1 transition-all inline-block"
                >
                  Tentang
                </Link>
              </li>
              <li>
                <Link
                  href="/umkm"
                  className="hover:text-white hover:translate-x-1 transition-all inline-block"
                >
                  Produk UMKM
                </Link>
              </li>
              <li>
                <Link
                  href="/berita"
                  className="hover:text-white hover:translate-x-1 transition-all inline-block"
                >
                  Informasi Publik
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-amber-900/50 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-amber-50/60 text-xs text-center md:text-left">
            © 2025 Pemerintah Desa Pemerihan. All rights reserved.
          </p>

          <div>
            <Link
              href="/admin/dashboard/article"
              className="flex text-amber-50/40 hover:text-white text-xs transition-colors items-center gap-2"
            >
              <span>Login Admin</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
