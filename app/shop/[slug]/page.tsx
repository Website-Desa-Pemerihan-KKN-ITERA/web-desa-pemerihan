import { getShopItemData } from "@/services/getShopItemData-shopPage";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [shopItem, imagesUrl] = await getShopItemData(slug);

  // Perbaikan: Jangan return Response.json di dalam Page Component (ini untuk API route).
  // Sebaiknya return UI Error atau notFound().
  if (!shopItem) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">
            Produk Tidak Ditemukan atau bermasalah
          </h2>
          <p className="text-gray-500">
            Maaf, data produk tidak tersedia.
          </p>
        </div>
      </div>
    );
  }

  // Helper untuk format Rupiah agar lebih rapi
  const formattedPrice = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(Number(shopItem.price));

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      {/* Container utama agar tidak terlalu lebar di layar besar */}
      <div className="mx-auto max-w-4xl bg-white rounded-xl overflow-hidden border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 md:p-8">
          {/* Kolom Kiri: Gambar */}
          <div className="flex flex-col gap-4">
            <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center">
              {imagesUrl ? (
                <img
                  src={imagesUrl[0] ?? ""}
                  alt={shopItem.name}
                  className="h-full w-full object-cover hover:scale-105 transition-transform duration-300"
                />
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
                  <span className="text-sm font-medium">
                    Gambar tidak tersedia
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Kolom Kanan: Detail Produk */}
          <div className="flex flex-col">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              {shopItem.name}
            </h1>

            <p className="mt-2 text-2xl font-bold text-blue-600">
              {formattedPrice}
            </p>

            <div className="mt-8">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-500 mb-1">Hubungi Penjual:</p>
                <p className="text-lg font-semibold text-gray-800 break-all">
                  {shopItem.contact}
                </p>
                <button className="mt-3 w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-3 px-4 rounded-lg transition-colors">
                  Chat Penjual
                </button>
              </div>
            </div>

            <div className="mt-6 border-t border-gray-100 pt-6">
              <h3 className="text-sm font-medium text-gray-900">Deskripsi</h3>
              <div className="mt-2 prose prose-sm text-gray-600 whitespace-pre-line leading-relaxed">
                {shopItem.description ||
                  "Tidak ada deskripsi untuk produk ini."}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
