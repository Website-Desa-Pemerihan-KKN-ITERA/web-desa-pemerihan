import { MapPin } from "lucide-react";
import NewsSection from "@/components/nonShared/newsSection";
import TopProducts from "@/components/nonShared/topProducts";
import TopTourspot from "@/components/nonShared/topTourspot";
import Image from "next/image";

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
              {/* Penjelasan Desa */}
              <div>
                <p className="text-gray-600 leading-relaxed">
                  Desa Pemerihan terletak di Kecamatan Bengkunat, Kabupaten
                  Pesisir Barat, dan merupakan desa penyangga Taman Nasional
                  Bukit Barisan Selatan (TNBBS) yang termasuk dalam Warisan
                  Dunia UNESCO. Desa ini juga menjadi gerbang masuk Kabupaten
                  Pesisir Barat, dengan akses sekitar 2 jam dari Krui dan 3 jam
                  40 menit dari Bandar Lampung. Desa Pemerihan terdiri atas 7
                  dusun dengan jumlah penduduk sekitar 7.721 jiwa dan luas
                  wilayah ±1.515,89 hektare.
                </p>
                <br />
                <p className="text-gray-600 leading-relaxed">
                  Desa Pemerihan merupakan wilayah pesisir dengan topografi
                  perbukitan dan panorama hutan TNBBS yang kaya keanekaragaman
                  hayati. Potensi tersebut dikembangkan melalui pariwisata
                  unggulan Elephant Camp, paket wisata minat khusus jungle
                  tracking di zona pemanfaatan TNBBS, serta wisata edukasi Kebun
                  Madu Sultan di Dusun Srimulyo II.
                </p>
              </div>
            </div>

            {/* Right Column - Image */}
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/gajah.jpg"
                  alt="Logo"
                  width={800}
                  height={600}
                  className="w-full h-auto"
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
          <div className="max-w-7xl mx-auto">
            <div className="rounded-2xl overflow-hidden shadow-xl">
              <div
                className="relative w-full bg-black"
                style={{ paddingBottom: "56.25%" }}
              >
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src="https://www.youtube.com/embed/jrV17BRT6qM"
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
