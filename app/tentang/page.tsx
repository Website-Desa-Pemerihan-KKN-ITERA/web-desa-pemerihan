"use client";

import { Users, MapPin, Camera, Target, Eye } from "lucide-react";

export default function TentangPage() {
  // Gallery Images Data
  const galleryImages = [
    {
      src: "images/Lapangan Kantor Desa.webp",
      alt: "Lapangan Kantor Desa",
      caption: "Lapangan Kantor Desa",
    },
    {
      src: "/images/tnbbs.jpeg",
      alt: "TNBBS",
      caption: "Taman Nasional Bukit Barisan Selatan",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Background Image */}
      <section
        className="relative h-[400px] md:h-[500px] bg-cover bg-center"
        style={{
          backgroundImage: "url(/images/Hero.webp)",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/40"></div>
        <div className="relative h-full flex flex-col items-center justify-center text-white px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-center font-['Montserrat']">
            Mengenal Desa Pemerihan
          </h1>
          <p className="text-lg md:text-xl text-green-50 font-['Inter']">
            Kabupaten Bengkunat, Pesisir Barat, Lampung
          </p>
        </div>
      </section>

      {/* History Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 font-['Montserrat']">
              Sejarah Desa
            </h2>
            <div className="space-y-4 text-gray-600 leading-relaxed font-['Inter']">
              <p>
                Desa atau yang kerap disebut Pekon Pemerihan bermula dari
                wilayah Cawang Ara yang mulai dibuka pada tahun 1960 oleh tujuh
                orang perintis, yaitu Ahmad Sofian, Tanrejo, Joremi, Faderi,
                Kamdani, Istanto, dan Yamin. Seiring bertambahnya pendatang pada
                tahun 1970, kawasan ini berkembang menjadi wilayah permukiman
                dan perkebunan. Pada tahun 1975, berdasarkan sosialisasi Petugas
                Pelestarian Alam (PPA), Cawang Ara ditetapkan sebagai bagian
                dari Kawasan Suaka Margasatwa Bukit Barisan Selatan (SMBBS).
              </p>
              <p>
                Pada periode 1984 hingga 2010, Cawang Ara berstatus sebagai
                dusun di bawah Pekon Sukamarga, Kecamatan Bangkunat, Kabupaten
                Lampung Barat. Pembangunan infrastruktur mulai dilakukan, antara
                lain pembangunan Sekolah Dasar pada tahun 1985 serta peningkatan
                jalan Sanggi–Bengkunat sejak tahun 1990 hingga akhirnya diaspal
                pada tahun 2007. Pembangunan tersebut menjadi dasar bagi
                pertumbuhan permukiman dan tata pemerintahan pekon.
              </p>
              <p>
                Pada tahun 2010, Pekon Pemerihan resmi berdiri sebagai pekon
                definitif. Selanjutnya, pada tahun 2012, terbentuk Kabupaten
                Pesisir Barat sehingga Pekon Pemerihan menjadi bagian dari
                kabupaten baru tersebut. Dalam perkembangannya, masyarakat
                mengalami perubahan komoditas pertanian dari kopi, lada, dan
                kakao ke tanaman jagung dan pepaya akibat serangan hama dan
                penyakit yang sulit dikendalikan.
              </p>
            </div>
          </div>
          <div className="relative">
            <img
              src="/images/Hero.webp"
              alt="Village Landscape"
              className="rounded-xl shadow-lg w-full h-[400px] object-cover"
            />
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-[#2D5A27] rounded-xl opacity-20"></div>
          </div>
        </div>
      </section>

      {/* Vision & Mission Section */}
      <section className="bg-gray-50 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Vision Card */}
            <div className="bg-white border-2 border-[#2D5A27] rounded-xl p-8 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-[#2D5A27] rounded-lg flex items-center justify-center">
                  <Eye className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-[#2D5A27] font-['Montserrat']">
                  Visi
                </h3>
              </div>
              <p className="text-gray-700 text-lg leading-relaxed font-['Inter']">
                Pekon Pemerihan menjadi desa yang mandiri, sejahtera, dan
                berdaya saing melalui pengembangan ekowisata berbasis masyarakat
                yang berkelanjutan, dengan mengoptimalkan potensi alam, budaya,
                dan kearifan lokal secara lestari, sekaligus mendukung upaya
                konservasi lingkungan dan peningkatan kualitas hidup masyarakat.
              </p>
            </div>

            {/* Mission Card */}
            <div className="bg-green-50 border-2 border-[#2D5A27] rounded-xl p-8 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-[#2D5A27] rounded-lg flex items-center justify-center">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-[#2D5A27] font-['Montserrat']">
                  Misi
                </h3>
              </div>
              <ul className="space-y-3 text-gray-700 font-['Inter']">
                <li className="flex gap-3">
                  <span className="text-[#2D5A27] font-bold">•</span>
                  <span>
                    Pemberdayaan masyarakat dengan tujuan untuk meningkatkan
                    produktivitas dan keanekaragaman usaha yang ada.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#2D5A27] font-bold">•</span>
                  <span>
                    Terpenuhinya sarana dan fasilitas untuk mendukung
                    peningkatan ekonomi desa.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#2D5A27] font-bold">•</span>
                  <span>
                    Membangun dan memperkuat institusi yang mendukung rantai
                    produksi dan pemasaran.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#2D5A27] font-bold">•</span>
                  <span>
                    Mengoptimalkan sumber daya manusia sebagai dasar pertumbuhan
                    ekonomi desa.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics / Infographic Section
        <section className="bg-gradient-to-r from-[#2D5A27] to-[#1e4019] py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              <div className="text-center text-white">
                <div className="w-20 h-20 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                  <Users className="w-10 h-10" />
                </div>
                <div className="text-5xl font-bold mb-2 font-['Montserrat']">
                  7.721
                </div>
                <div className="text-green-100 text-lg font-['Inter']">
                  Jumlah Penduduk
                </div>
              </div>

              <div className="text-center text-white">
                <div className="w-20 h-20 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                  <MapPin className="w-10 h-10" />
                </div>
                <div className="text-5xl font-bold mb-2 font-['Montserrat']">
                  15.16
                </div>
                <div className="text-green-100 text-lg font-['Inter']">
                  Luas Wilayah (km²)
                </div>
              </div>

              <div className="text-center text-white">
                <div className="w-20 h-20 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                  <Camera className="w-10 h-10" />
                </div>
                <div className="text-5xl font-bold mb-2 font-['Montserrat']">
                  4
                </div>
                <div className="text-green-100 text-lg font-['Inter']">
                  Destinasi Wisata
                </div>
              </div>
            </div>
          </div>
        </section>
      */}

      {/* Gallery Section */}
      <section className="bg-gray-50 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 font-['Montserrat']">
              Galeri & Fasilitas Desa
            </h2>
            <p className="text-gray-600 font-['Inter']">
              Keindahan Alam dan Fasilitas Desa Pemerihan
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryImages.map((image, index) => (
              <div
                key={index}
                className="relative group overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-300"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <p className="text-lg font-semibold font-['Inter']">
                      {image.caption}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
