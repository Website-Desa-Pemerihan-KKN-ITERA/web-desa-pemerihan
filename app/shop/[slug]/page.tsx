import { getShopItemData } from "@/services/getShopItemData-shopPage";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [shopItem, imageUrl] = await getShopItemData(slug);

  // Perbaikan: Jangan return Response.json di dalam Page Component (ini untuk API route).
  // Sebaiknya return UI Error atau notFound().
  if (!shopItem) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">
            Produk Tidak Ditemukan
          </h2>
          <p className="text-gray-500">
            Maaf, data produk tidak tersedia di database.
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

  {/*imageUrl, shopItem, formattedPrice*/}
  return (
      <div className="flex h-screen w-screen justify-center bg-white py-[4%]">
        <div className="flex portrait:flex-col portrait:items-center w-[70%] portrait:w-[90%] overflow-hidden rounded-2xl shadow-2xl">
          <div className="w-[50%] portrait:w-[100%] portrait:h-[40%]">
            <img src={imageUrl} alt={shopItem.name} className="h-full w-full object-contain"/>
          </div>

          <div className="p-8 lg:p-10 flex flex-col w-[50%] portrait:w-[100%] justify-top bg-white">
              <div className="inline-flex items-center gap-2 mb-6 self-start bg-amber-100 px-4 py-2 rounded-full">
                <span className="text-amber-700">⭐</span>
                <span className="text-sm font-bold text-amber-800 uppercase">Produk Unggulan</span>
              </div>
              
              <h3 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
                {shopItem.name}
              </h3>

              <p className="text-black-600 mb-6 leading-relaxed bg-[#fafafa]">
                {formattedPrice}
              </p>
              
              <p className="text-gray-600 mb-6 leading-relaxed">
                {shopItem.description}
              </p>

              {/*
              <div className="space-y-3 mb-6">
                <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-amber-200 rounded-full flex items-center justify-center flex-shrink-0 text-xl">
                        {}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-800 mb-1">{}</h4>
                        <p className="text-gray-600 text-sm">{}</p>
                      </div>
                    </div>
                  </div>
              </div>
              */}

              {/* Contact Seller Box */}
              <div className="bg-green-700 text-white rounded-xl p-6 mt-4">
                <div className="flex items-center gap-3 mb-4">
                  <div>
                    <p className="text-xs text-green-200">Hubungi Penjual</p>
                  </div>
                </div>
                <a
                  href={`https://wa.me/${shopItem.contact}?text=Halo,%20saya%20tertarik%20dengan%20${encodeURIComponent(shopItem.name)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-white text-green-700 font-bold py-3 rounded-lg hover:bg-green-50 transition"
                >
                  <svg className="w-5 h-5" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                    <path d="M476.9 161.1C435 119.1 379.2 96 319.9 96C197.5 96 97.9 195.6 97.9 318C97.9 357.1 108.1 395.3 127.5 429L96 544L213.7 513.1C246.1 530.8 282.6 540.1 319.8 540.1L319.9 540.1C442.2 540.1 544 440.5 544 318.1C544 258.8 518.8 203.1 476.9 161.1zM319.9 502.7C286.7 502.7 254.2 493.8 225.9 477L219.2 473L149.4 491.3L168 423.2L163.6 416.2C145.1 386.8 135.4 352.9 135.4 318C135.4 216.3 218.2 133.5 320 133.5C369.3 133.5 415.6 152.7 450.4 187.6C485.2 222.5 506.6 268.8 506.5 318.1C506.5 419.9 421.6 502.7 319.9 502.7zM421.1 364.5C415.6 361.7 388.3 348.3 383.2 346.5C378.1 344.6 374.4 343.7 370.7 349.3C367 354.9 356.4 367.3 353.1 371.1C349.9 374.8 346.6 375.3 341.1 372.5C308.5 356.2 287.1 343.4 265.6 306.5C259.9 296.7 271.3 297.4 281.9 276.2C283.7 272.5 282.8 269.3 281.4 266.5C280 263.7 268.9 236.4 264.3 225.3C259.8 214.5 255.2 216 251.8 215.8C248.6 215.6 244.9 215.6 241.2 215.6C237.5 215.6 231.5 217 226.4 222.5C221.3 228.1 207 241.5 207 268.8C207 296.1 226.9 322.5 229.6 326.2C232.4 329.9 268.7 385.9 324.4 410C359.6 425.2 373.4 426.5 391 423.9C401.7 422.3 423.8 410.5 428.4 397.5C433 384.5 433 373.4 431.6 371.1C430.3 368.6 426.6 367.2 421.1 364.5z"/>
                  </svg>
                  Chat Sekarang
                </a>
              </div>
            </div>
        </div>
      </div>
    );
  }
