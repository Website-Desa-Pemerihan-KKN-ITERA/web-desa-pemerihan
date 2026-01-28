import LocationGallery from "@/components/nonShared/locationGallery";
import MapsRedirectButton from "@/components/nonShared/mapsRedirectButton";
import WhatsAppButtonTourSpot from "@/components/nonShared/whatsAppButtonTourSpot";
import { getTourSpotData } from "@/services/getTourSpotData-tourSpotPage";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [tourSpotData, imagesUrl] = await getTourSpotData(slug);

  if (!tourSpotData) {
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
  console.log(tourSpotData);

  const formattedPrice = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(Number(tourSpotData.entryFee));

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <article className="mx-auto md:max-w-6xl bg-white rounded-xl overflow-hidden border border-gray-100">
        <div className="gap-8 p-6">
          <LocationGallery
            images={imagesUrl as string[]}
            productName={tourSpotData.name}
          />

          {/* Bagian informasi */}
          <div className="justify-between mt-5">
            <header>
              <h1 className="text-3xl font-bold text-gray-900">
                {tourSpotData.name}
              </h1>

              <div className="flex flex-col justify-around">
                {/* [UBAH DISINI] Box Informasi: Style Bersih (Pills & Badges) */}
                <div className="flex flex-col md:flex-row gap-8 border-gray-100 py-3">
                  {/* Bagian Jam Operasional */}
                  <div className="flex-1 items-center justify-center">
                    <h3 className="text-xs font-bold text-gray-400 uppercase">
                      Biaya masuk:
                    </h3>
                    <p className="text-2xl font-bold mb-4">{formattedPrice}</p>
                    {/* Bagian kontak */}
                    <h3 className="text-xs font-bold text-gray-400 uppercase mt-5">
                      Kontak:
                    </h3>
                    <div>
                      <div className="mt-1">
                        <address className="bg-gray-50 p-4 rounded-lg border border-gray-200 not-italic">
                          <p className="text-sm text-gray-500 mb-1">
                            Hubungi lebih lanjut:
                          </p>
                          <p className="text-lg font-semibold text-gray-800 break-all">
                            {tourSpotData.owner}
                          </p>
                          <p className="text-sm font-semibold text-gray-500 break-all">
                            +{tourSpotData.contact}
                          </p>
                          <div className="sm:flex gap-2">
                            <WhatsAppButtonTourSpot tourSpot={tourSpotData} />
                            <MapsRedirectButton tourSpot={tourSpotData} />
                          </div>
                        </address>
                      </div>
                    </div>
                  </div>

                  {/* Bagian Hari Buka */}
                  <div className="flex-1">
                    <h3 className="text-xs font-bold text-gray-400 uppercase mb-1">
                      Hari Buka:
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {tourSpotData.openDay.map((item, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-blue-50 text-blue-700 border border-blue-100"
                        >
                          {item}
                        </span>
                      ))}
                    </div>

                    <h3 className="text-xs font-bold text-gray-400 uppercase mb-1 mt-5">
                      Jam Operasional:
                    </h3>
                    <div className="inline-flex items-center bg-gray-50 px-4 py-3 rounded-lg border border-gray-200">
                      {/* Ikon Jam Kecil */}
                      <svg
                        className="w-5 h-5 text-gray-500 mr-2.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span className="text-gray-700 font-bold text-lg">
                        <time
                          dateTime={tourSpotData.openTimeFrom.toISOString()}
                        >
                          {tourSpotData.openTimeFrom.toLocaleTimeString(
                            "id-ID",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: false,
                            },
                          )}
                        </time>{" "}
                        -{" "}
                        <time dateTime={tourSpotData.openTimeTo.toISOString()}>
                          {tourSpotData.openTimeTo.toLocaleTimeString("id-ID", {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: false,
                          })}
                        </time>{" "}
                        <span className="text-sm text-gray-500 ml-1">WIB</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </header>

            {/* Bagian deskripsi */}
            <section aria-label="Deskripsi Produk" className="mb-6 pt-6">
              <h3 className="font-medium text-gray-900">Deskripsi:</h3>
              <div className="mt-1 prose-sm text-gray-600 whitespace-pre-line leading-relaxed">
                {tourSpotData.description ||
                  "Tidak ada deskripsi untuk produk ini."}
              </div>
            </section>
          </div>
        </div>
      </article>
    </main>
  );
}
