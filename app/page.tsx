import { MapPin, Phone, Mail } from "lucide-react";
import NewsSection from "@/components/nonShared/newsSection";
import TopProducts from "@/components/nonShared/topProducts";
import TopTourspot from "@/components/nonShared/topTourspot";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section
        className="relative h-[500px] md:h-[600px] bg-cover bg-center"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(/images/Hero.webp)",
        }}
      >
        <div className="relative h-full flex flex-col items-center justify-center text-white px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-center">
            Selamat Datang di
            <br />
            <span className="text-yellow-400">Desa Pemerihan</span>
          </h1>
          <p className="text-lg md:text-xl mb-8 text-center max-w-2xl">
            Kecamatan Bengkunat, Pesisir Barat, Lampung - Indonesia
          </p>
        </div>
      </section>

      {/* Desa Pemerihan Section */}
      <section id="about" className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Title with underline */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
              Desa Pemerihan
            </h2>
            <div className="w-24 h-1 bg-yellow-400 mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-12">
            {/* Left Column - Text Content */}
            <div className="space-y-8">
              {/* Visi Desa */}
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  Visi Desa
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Mewujudkan Desa Sejahtera sebagai desa yang mandiri,
                  sejahtera, dan berkelanjutan dengan memanfaatkan potensi alam
                  dan sumber daya manusia yang berkualitas untuk kesejahteraan
                  bersama.
                </p>
              </div>

              {/* Sejarah Singkat */}
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  Sejarah Singkat
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Desa Sejahtera didirikan pada tahun 1945 dan telah berkembang
                  menjadi salah satu desa percontohan di wilayah Kabupaten
                  Makmur. Dengan luas wilayah 1.250 hektar, desa ini dihuni oleh
                  3.500 jiwa yang mayoritas bermata pencaharian sebagai petani
                  dan pengrajin.
                </p>
              </div>
            </div>

            {/* Right Column - Image */}
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://plus.unsplash.com/premium_photo-1688472616515-6d7dce94a5ab?w=800&auto=format&fit=crop"
                  alt="Rumah Adat Desa Pemerihan"
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Desa */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-4">
            Video Profil Desa Pemerihan
          </h2>
          <p className="text-center text-gray-600 mb-12">
            Saksikan keindahan dan kehidupan masyarakat Desa Pemerihan dalam
            video eksklusif ini
          </p>

          <div className="max-w-7xl mx-auto">
            <div className="rounded-2xl overflow-hidden shadow-xl">
              <div
                className="relative w-full bg-black"
                style={{ paddingBottom: "56.25%" }}
              >
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src="https://www.youtube.com/embed/ECbsWJ7V3BI?si=9AiznK_liyqXOiU2"
                  title="Video Desa Pemerihan"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <NewsSection />
      <TopProducts />
      <TopTourspot />

      {/* Lokasi Desa */}
      <section id="contact" className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-4">
            Lokasi Desa
          </h2>
          <p className="text-center text-gray-600 mb-12">
            Temukan lokasi kami di peta untuk berkunjung dan berkenalan dengan
            Desa Pemerihan
          </p>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
            <div className="aspect-video bg-gray-200 flex items-center justify-center">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63532.486454821694!2d104.39759289999999!3d-5.599427499999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e46fc36d9732b21%3A0x67e2ec59e8907c3f!2sPemerihan%2C%20Bangkunat%2C%20West%20Pesisir%20Regency%2C%20Lampung!5e0!3m2!1sen!2sid!4v1767796562207!5m2!1sen!2sid"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full"
              />
            </div>
            <div className="p-6 text-center bg-gradient-to-r from-green-600 to-green-700 text-white">
              <div className="flex items-center justify-center gap-2 mb-2">
                <MapPin className="w-5 h-5" />
                <h3 className="text-xl font-bold">Desa Pemerihan</h3>
              </div>
              <p className="text-green-100">
                Kecamatan Bengkunat, Kabupaten Pesisir Barat, Provinsi Lampung
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
