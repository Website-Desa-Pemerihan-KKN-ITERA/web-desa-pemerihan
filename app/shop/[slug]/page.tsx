import { getShopItemData } from "@/services/getShopItemData-shopPage";
import ProductGallery from "@/components/nonShared/productGallery";
import { FaWhatsapp } from "react-icons/fa";
import { whatsappRedirect } from "@/helpers/whatsappRedirect";
import WhatsAppButton from "@/components/nonShared/whatsAppButton";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [shopItem, imagesUrl] = await getShopItemData(slug);

  if (!shopItem) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">
            Produk Tidak Ditemukan atau bermasalah
          </h2>
          <p className="text-gray-500">Maaf, data produk tidak tersedia.</p>
        </div>
      </div>
    );
  }

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
          <ProductGallery
            images={imagesUrl as string[]}
            productName={shopItem.name}
          />

          {/* Kolom Kanan: Detail Produk */}
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              {shopItem.name}
            </h1>

            <p className="mt-2 text-3xl font-bold">{formattedPrice}</p>

            <div className="mt-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-500 mb-1">Hubungi Penjual:</p>
                <p className="text-lg font-semibold text-gray-800 break-all">
                  {shopItem.contact}
                </p>

                <WhatsAppButton shopItem={shopItem}/>
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
