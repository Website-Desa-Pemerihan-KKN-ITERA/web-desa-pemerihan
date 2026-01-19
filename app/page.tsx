import { MapPin, Phone, Mail } from "lucide-react";
import NewsSection from "@/components/nonShared/newsSection";

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

          <div className="max-w-4xl mx-auto">
            <div className="rounded-2xl overflow-hidden shadow-xl border-4 border-amber-600">
              <div
                className="relative w-full bg-black"
                style={{ paddingBottom: "56.25%" }}
              >
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src="https://www.youtube.com/embed/wB8AArJG6BE"
                  title="Video Desa Pemerihan"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Produk Unggulan Desa */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Title */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
              Produk Unggulan Desa
            </h2>
            <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto">
              Produk berkualitas dari UMKM lokal yang dikerjakan dengan penuh
              dedikasi oleh masyarakat desa
            </p>
          </div>

          {/* Featured Product 1 - Madu Apikalis */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl shadow-2xl overflow-hidden mb-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              {/* Left - Product Image */}
              <div className="relative h-[450px] lg:h-auto">
                <img
                  src="/images/Madu.webp"
                  alt="Madu Apikalis"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Right - Product Details */}
              <div className="p-8 lg:p-10 flex flex-col justify-center bg-white">
                <div className="inline-flex items-center gap-2 mb-6 self-start bg-amber-100 px-4 py-2 rounded-full">
                  <span className="text-amber-700">⭐</span>
                  <span className="text-sm font-bold text-amber-800 uppercase">
                    Produk Unggulan
                  </span>
                </div>

                <h3 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
                  Madu Apikalis
                </h3>

                <p className="text-gray-600 mb-6 leading-relaxed">
                  Madu murni berkualitas premium yang dihasilkan dari lebah
                  lokal di hutan desa kami. Dipanen dengan metode tradisional
                  yang menjaga keaslian dan khasiatnya.
                </p>

                {/* Features Boxes */}
                <div className="space-y-3 mb-6">
                  <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-amber-200 rounded-full flex items-center justify-center flex-shrink-0 text-xl">
                        🍯
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-800 mb-1">
                          Konsumsi Kesehatan
                        </h4>
                        <p className="text-gray-600 text-sm">
                          Kaya antioksidan, meningkatkan imunitas, dan menjaga
                          kesehatan tubuh secara alami
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-amber-200 rounded-full flex items-center justify-center flex-shrink-0 text-xl">
                        ✨
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-800 mb-1">
                          Masker Kosmetik Alami
                        </h4>
                        <p className="text-gray-600 text-sm">
                          Melembabkan kulit, mengurangi jerawat, dan memberikan
                          nutrisi alami untuk wajah bercahaya
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Seller Box */}
                <div className="bg-green-700 text-white rounded-xl p-6 mt-4">
                  <div className="flex items-center gap-3 mb-4">
                    <img
                      src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces"
                      alt="Ibu Siti Nurhaliza"
                      className="w-12 h-12 rounded-full object-cover border-2 border-white"
                    />
                    <div>
                      <p className="text-xs text-green-200">Hubungi Penjual</p>
                      <h4 className="font-bold text-lg">Ibu Siti Nurhaliza</h4>
                    </div>
                  </div>
                  <a
                    href="https://wa.me/6281234567890?text=Halo,%20saya%20tertarik%20dengan%20Madu%20Apikalis"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 bg-white text-green-700 font-bold py-3 rounded-lg hover:bg-green-50 transition"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 640 640"
                    >
                      <path d="M476.9 161.1C435 119.1 379.2 96 319.9 96C197.5 96 97.9 195.6 97.9 318C97.9 357.1 108.1 395.3 127.5 429L96 544L213.7 513.1C246.1 530.8 282.6 540.1 319.8 540.1L319.9 540.1C442.2 540.1 544 440.5 544 318.1C544 258.8 518.8 203.1 476.9 161.1zM319.9 502.7C286.7 502.7 254.2 493.8 225.9 477L219.2 473L149.4 491.3L168 423.2L163.6 416.2C145.1 386.8 135.4 352.9 135.4 318C135.4 216.3 218.2 133.5 320 133.5C369.3 133.5 415.6 152.7 450.4 187.6C485.2 222.5 506.6 268.8 506.5 318.1C506.5 419.9 421.6 502.7 319.9 502.7zM421.1 364.5C415.6 361.7 388.3 348.3 383.2 346.5C378.1 344.6 374.4 343.7 370.7 349.3C367 354.9 356.4 367.3 353.1 371.1C349.9 374.8 346.6 375.3 341.1 372.5C308.5 356.2 287.1 343.4 265.6 306.5C259.9 296.7 271.3 297.4 281.9 276.2C283.7 272.5 282.8 269.3 281.4 266.5C280 263.7 268.9 236.4 264.3 225.3C259.8 214.5 255.2 216 251.8 215.8C248.6 215.6 244.9 215.6 241.2 215.6C237.5 215.6 231.5 217 226.4 222.5C221.3 228.1 207 241.5 207 268.8C207 296.1 226.9 322.5 229.6 326.2C232.4 329.9 268.7 385.9 324.4 410C359.6 425.2 373.4 426.5 391 423.9C401.7 422.3 423.8 410.5 428.4 397.5C433 384.5 433 373.4 431.6 371.1C430.3 368.6 426.6 367.2 421.1 364.5z" />
                    </svg>
                    Chat Sekarang
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Button Produk Lainnya */}
          <div className="text-center">
            <a
              href="/umkm"
              className="inline-flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white font-semibold px-8 py-3 rounded-full transition"
            >
              Lihat Produk Lainnya
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </a>
          </div>
        </div>
      </section>

      <NewsSection />

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
