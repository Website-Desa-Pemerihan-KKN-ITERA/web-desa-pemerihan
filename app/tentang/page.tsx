"use client";

import { Users, MapPin, Camera, Target, Eye } from "lucide-react";

export default function TentangPage() {
  // Gallery Images Data
  const galleryImages = [
    {
      src: "https://images.unsplash.com/photo-1593857389276-7c794900c90f?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      alt: "Traditional Village House",
      caption: "Rumah Adat Desa",
    },
    {
      src: "https://images.unsplash.com/photo-1516298773066-c48f8e9bd92b?w=800&auto=format&fit=crop",
      alt: "Honey Farm",
      caption: "Peternakan Madu",
    },
    {
      src: "https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=800&auto=format&fit=crop",
      alt: "Mosque",
      caption: "Masjid Desa",
    },
    {
      src: "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=800&auto=format&fit=crop",
      alt: "Village Office",
      caption: "Kantor Desa",
    },
    {
      src: "https://images.unsplash.com/photo-1497250681960-ef046c08a56e?w=800&auto=format&fit=crop",
      alt: "Health Center",
      caption: "Puskesmas",
    },
    {
      src: "https://images.unsplash.com/photo-1511497584788-876760111969?w=800&auto=format&fit=crop",
      alt: "Forest View",
      caption: "Hutan Damar",
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
                Desa Pemerihan merupakan salah satu desa yang terletak di
                Kecamatan Bengkunat, Kabupaten Pesisir Barat. Dikenal dengan
                kekayaan alamnya yang melimpah, desa ini tumbuh berdampingan
                dengan hutan tropis yang asri dan menjadi rumah bagi berbagai
                flora dan fauna khas Lampung.
              </p>
              <p>
                Nama Pemerihan sendiri berasal dari kata yang memiliki makna
                historis bagi masyarakat setempat. Desa ini berdiri sejak
                puluhan tahun yang lalu dengan komitmen kuat untuk menjaga
                kelestarian alam sambil terus berkembang. Tradisi masyarakat
                dalam mengelola hutan Damar dan peternakan madu Apikalis menjadi
                ciri khas yang membedakan desa ini dengan wilayah lainnya.
              </p>
              <p>
                Dengan kebersamaan dan gotong royong yang tinggi, Desa Pemerihan
                terus melangkah maju untuk mewujudkan desa yang mandiri,
                sejahtera, dan berkelanjutan berbasis potensi alam dan kearifan
                lokal yang telah diwariskan turun-temurun.
              </p>
            </div>
          </div>
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=800&auto=format&fit=crop"
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
                Terwujudnya Desa Pemerihan sebagai desa yang{" "}
                <span className="font-bold text-[#2D5A27]">mandiri</span> dalam
                pengelolaan sumber daya,{" "}
                <span className="font-bold text-[#2D5A27]">sejahtera</span>{" "}
                dalam perekonomian masyarakat, dan{" "}
                <span className="font-bold text-[#2D5A27]">berkelanjutan</span>{" "}
                dalam menjaga kelestarian lingkungan dengan mengoptimalkan
                potensi alam yang melimpah serta melestarikan kearifan lokal
                yang telah diwariskan secara turun-temurun untuk kesejahteraan
                generasi mendatang.
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
                  <span>Meningkatkan kewenangan desa berbasis masyarakat</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#2D5A27] font-bold">•</span>
                  <span>Melaksanakan inovasi dan kewirausahaan lokal</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#2D5A27] font-bold">•</span>
                  <span>
                    Membangun kesadaran ekologi dan kelestarian lingkungan
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#2D5A27] font-bold">•</span>
                  <span>Mengembangkan UMKM lokal berbasis potensi desa</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#2D5A27] font-bold">•</span>
                  <span>
                    Meningkatkan kualitas hidup dan kesejahteraan masyarakat
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics / Infographic Section */}
      <section className="bg-gradient-to-r from-[#2D5A27] to-[#1e4019] py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {/* Population */}
            <div className="text-center text-white">
              <div className="w-20 h-20 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                <Users className="w-10 h-10" />
              </div>
              <div className="text-5xl font-bold mb-2 font-['Montserrat']">
                2,847
              </div>
              <div className="text-green-100 text-lg font-['Inter']">
                Jumlah Penduduk
              </div>
            </div>

            {/* Area */}
            <div className="text-center text-white">
              <div className="w-20 h-20 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                <MapPin className="w-10 h-10" />
              </div>
              <div className="text-5xl font-bold mb-2 font-['Montserrat']">
                15.2
              </div>
              <div className="text-green-100 text-lg font-['Inter']">
                Luas Wilayah (km²)
              </div>
            </div>

            {/* Tourist Destinations */}
            <div className="text-center text-white">
              <div className="w-20 h-20 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                <Camera className="w-10 h-10" />
              </div>
              <div className="text-5xl font-bold mb-2 font-['Montserrat']">
                8
              </div>
              <div className="text-green-100 text-lg font-['Inter']">
                Destinasi Wisata
              </div>
            </div>
          </div>
        </div>
      </section>

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
