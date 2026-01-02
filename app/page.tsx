"use client";

import Image from "next/image";
import { useState } from 'react';
import Link from "next/link";
import { CiMail } from "react-icons/ci";
import { BsFillTelephoneFill, BsMailbox } from "react-icons/bs";
import { PiSealCheckFill } from "react-icons/pi";
import { FaStar } from "react-icons/fa";
import { FaStarHalfAlt } from "react-icons/fa";
import { FaRegStar } from "react-icons/fa";
import { FaShoppingCart } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { FaClock } from "react-icons/fa6";
import { FaArrowRight } from "react-icons/fa6";
import { FaMountainSun } from "react-icons/fa6";
import { FaCalendarCheck } from "react-icons/fa";
import { FaFacebookF } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa6";
import { FaYoutube } from "react-icons/fa6";
import { IoMdMail } from "react-icons/io";
import { IoMenu } from "react-icons/io5";
import { MdOpenInNew } from "react-icons/md";

type Pejabat = {
  nama: string;
  jabatan: string;
  image: string;
};

type Produk = {
  nama: string;
  long_desc: string;
  short_desc: string;
  advantage: string[];
  star: number;
  review: number;
  price: number;
  disc: number;
};

type News = {
  news_type: string;
  date: string;
  title: string;
  desc: string;
};

const formatTanggal = (date: string) => {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
};

const data: Pejabat[] = [
  { nama: "Bapak Surya Wijaya", jabatan: "Kepala Desa", image: "" },
  { nama: "Bapak Ahmad Fauzi", jabatan: "Sekretaris Desa", image: "" },
  { nama: "Ibu Siti Nurhaliza", jabatan: "Kaur Keuangan", image: "" },
  { nama: "Bapak Bambang Susilo", jabatan: "Kepala Dusun", image: "" },
  { nama: "Bapak Bambang Susilo", jabatan: "Kepala Dusun", image: "" },
  { nama: "Bapak Bambang Susilo", jabatan: "Kepala Dusun", image: "" },
  { nama: "Bapak Bambang Susilo", jabatan: "Kepala Dusun", image: "" },
];

const produkData: Produk[] = [
  {
    nama: "Serum Wajah Glow",
    long_desc:
      "Serum wajah dengan kandungan niacinamide dan hyaluronic acid untuk membantu mencerahkan kulit, menjaga kelembapan, serta membuat kulit tampak lebih sehat dan bercahaya.",
    short_desc: "Serum pencerah dan pelembap wajah.",
    advantage: [
      "Mencerahkan kulit",
      "Melembapkan intensif",
      "Tekstur ringan",
      "Cepat menyerap",
    ],
    star: 5,
    review: 124,
    price: 120000,
    disc: 20,
  },
  {
    nama: "Facial Wash Gentle",
    long_desc:
      "Sabun cuci wajah dengan formula lembut yang membantu membersihkan kotoran tanpa membuat kulit kering atau terasa tertarik.",
    short_desc: "Pembersih wajah lembut untuk semua jenis kulit.",
    advantage: [
      "Tidak membuat kulit kering",
      "Cocok untuk kulit sensitif",
      "pH seimbang",
    ],
    star: 4,
    review: 87,
    price: 45000,
    disc: 10,
  },
  {
    nama: "Moisturizer Aloe",
    long_desc:
      "Krim pelembap berbahan dasar aloe vera untuk membantu menenangkan kulit, mengurangi kemerahan, dan menjaga hidrasi sepanjang hari.",
    short_desc: "Pelembap aloe untuk kulit sensitif.",
    advantage: ["Menenangkan kulit", "Cepat meresap", "Tidak lengket"],
    star: 4,
    review: 65,
    price: 75000,
    disc: 15,
  },
  {
    nama: "Sunscreen SPF 50",
    long_desc:
      "Tabir surya dengan perlindungan SPF 50 PA++++ untuk melindungi kulit dari sinar UVA dan UVB serta mencegah penuaan dini.",
    short_desc: "Perlindungan maksimal dari sinar matahari.",
    advantage: [
      "SPF tinggi",
      "Ringan di kulit",
      "Tidak meninggalkan white cast",
    ],
    star: 5,
    review: 210,
    price: 90000,
    disc: 25,
  },
  {
    nama: "Toner Hydrating",
    long_desc:
      "Toner dengan kandungan hyaluronic acid untuk membantu menghidrasi kulit dan mempersiapkan kulit sebelum tahap skincare berikutnya.",
    short_desc: "Toner hidrasi untuk semua jenis kulit.",
    advantage: ["Melembapkan", "Menyegarkan kulit", "Bebas alkohol"],
    star: 4,
    review: 92,
    price: 60000,
    disc: 0,
  },
];

const newsData: News[] = [
  {
    news_type: "Pengumuman",
    date: "2025-01-05",
    title: "Pembagian Bantuan Sosial Tahap I",
    desc: "Pemerintah desa akan melaksanakan pembagian bantuan sosial tahap pertama kepada warga yang terdaftar sebagai penerima manfaat.",
  },
  {
    news_type: "Kegiatan",
    date: "2025-01-12",
    title: "Gotong Royong Bersih Desa",
    desc: "Seluruh warga diimbau untuk berpartisipasi dalam kegiatan gotong royong membersihkan lingkungan desa.",
  },
  {
    news_type: "Berita",
    date: "2025-01-20",
    title: "Peresmian Balai Desa Baru",
    desc: "Balai desa baru resmi digunakan sebagai pusat pelayanan masyarakat dan kegiatan pemerintahan desa.",
  },
  {
    news_type: "Pengumuman",
    date: "2025-02-01",
    title: "Pendaftaran Bantuan UMKM",
    desc: "Pendaftaran bantuan UMKM dibuka bagi pelaku usaha desa untuk mendorong pertumbuhan ekonomi lokal.",
  },
  {
    news_type: "Kegiatan",
    date: "2025-02-10",
    title: "Pelatihan Digitalisasi UMKM",
    desc: "Pelatihan digitalisasi UMKM akan diselenggarakan untuk meningkatkan kemampuan pemasaran online pelaku usaha desa.",
  },
];

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  return (
    <div>
      {/*////// development bar to navigating to admin dashboard, just for development, we'll remove it on production */}
      <div className="bg-[#333446] flex justify-end py-5 px-10 text-[#EAEFEF]">
        <div className="flex">
          <Link prefetch={false} href="/admin/dashboard">
            <span className="flex items-center gap-2 rounded-2xl py-2 px-4 bg-[#F0F0F0] text-[#333446] font-bold cursor-pointer hover:bg-[#ACADAD] text-sm transition-colors">
              <MdOpenInNew className="text-xl" />
              <p>Masuk ke Dashboard</p>
            </span>
          </Link>
        </div>
      </div>
      {/*////// development bar to navigating to admin dashboard, just for development, we'll remove it on production */}

      <div className="flex flex-row justify-between bg-[#FFFDE1] h-[10vh] w-[100vw] text-[clamp(12px,1.2vw,15px)]">
        {/* Logo */}
        <div className="flex items-center w-[50%] landscape:w-[32%] h-[100%] portrait:md:w-[42%]">
          <div className="flex ml-[20%] portrait:ml-[10%] w-[100%] md:w-[80%] h-[100%] gap-[3%]">
            <div className="flex justify-center items-center w-auto h-[100%]">
              <div className="flex justify-center items-center h-[50%] md:h-[70%] aspect-square bg-yellow-500 rounded-full">
                <FaMountainSun className="h-[50%] w-auto" />
              </div>
            </div>
            <div className="flex flex-col w-[70%] h-full">
              <div className="flex items-end h-1/2 portrait:text-[clamp(10px,1.1vh,15px)] portrait:md:text-[clamp(15px,2vh,20px)]">
                <b>Desa Sejahtera</b>
              </div>
              <div className="h-1/2 portrait:text-[clamp(10px,1.1vh,15px)] portrait:md:text-[clamp(15px,2vh,20px)]">
                Kabupaten Makmur
              </div>
            </div>
          </div>
        </div>

        {/* Menu */}
        <div className="hidden md:flex flex-row justify-center items-center w-[44%]">
          <div className="flex flex-row justify-center items-center gap-[2%] h-[100%] w-[100%]">
            {["Beranda", "Tentang", "Pejabat", "UMKM", "Artikel", "Lokasi"].map(
              (item) => (
                <div
                  key={item}
                  className="flex justify-center items-center w-auto h-[100%] portrait:text-[clamp(15px,1.3vh,18px)]"
                >
                  {item}
                </div>
              ),
            )}
          </div>
        </div>
        <div className="flex md:hidden justify-center items-center h-[100%] w-[15%] cursor-pointer" onClick={() => setIsSidebarOpen(true)}>
          <IoMenu className="h-[30%] w-auto" />
        </div>

        {/* Sidebar */}
        <div className={`sidebar fixed right-0 top-0 h-screen w-[60vw] bg-[#747175] z-50 transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <button onClick={() => setIsSidebarOpen(false)} className="absolute top-4 right-4 text-white text-2xl">
            ×
          </button>
          Sidebar content
        </div>

        {isSidebarOpen && (<div className="fixed inset-0 bg-black/50 z-40" onClick={() => setIsSidebarOpen(false)}/>)}
      </div>
      <div className="flex flex-row justify-center items-center landscape:h-[90vh] portrait:w-[100vw] portrait:aspect-[2/1.25]">
        Image
      </div>
      <div className="flex flex-col gap-[2%] bg-[#F5F2F2] landscape:h-[100vh] portrait:w-[100vw] portrait:aspect-[2/2.5] portrait:sm:aspect-[2/1.15] text-[clamp(12px,1.2vw,15px)]">
        <div className="flex flex-col border-red-500 h-[20%] w-[100%] portrait:h-[15%]">
          <div className="flex h-[45%] w-[100%]"></div>
          <div className="flex justify-center items-center h-auto w-[100%] text-[#452829] text-[clamp(12px,2vw,40px)] portrait:text-[clamp(12px,2vh,40px)]">
            <b>Selayang Pandang</b>
          </div>
          <div className="flex justify-center border-black h-[15%] w-[100%] mt-[0.5%]">
            <div className="flex bg-[#E9B63B] h-[15%] w-[7%] rounded-[5px]"></div>
          </div>
        </div>
        <div className="flex flex-row justify-center items-start border-red-500 border-[1px] h-[100%] sm:h-[80%] w-[100%]">
          <div className="flex flex-col sm:flex-row justify-center items-center border-blue-500 h-[90%] w-[90%]">
            <div className="flex flex-col justify-center items-center border-black-500 border-[1px] h-[50%] sm:h-[100%] w-[100%] sm:w-[50%]">
              <div className="flex flex-col border-red-500 border-[1px] h-[100%] w-[100%]">
                <div className="flex h-[20%] w-[100%] text-[#452829] text-[clamp(12px,1.2vw,20px)]">
                  <b>Visi Desa</b>
                </div>
                <div className="flex h-[80%] w-[100%]">Blabla</div>
              </div>
              <div className="flex flex-col border-red-500 border-[1px] h-[100%] w-[100%]">
                <div className="flex h-[20%] w-[100%] text-[#452829] text-[clamp(12px,1.2vw,20px)]">
                  <b>Visi Desa</b>
                </div>
                <div className="flex h-[80%] w-[100%]">Blabla</div>
              </div>
              <div className="flex flex-row border-red-500 border-[1px] h-[100%] w-[100%]"></div>
            </div>
            <div className="relative flex-row border-red-500 border-[1px] h-[50%] sm:h-[100%] w-[100%] sm:w-[50%]">
              <div className="absolute top-0 right-0 w-[95%] h-[95%] border-blue-500 border-[5px]"></div>
              <div className="absolute bottom-[0%] left-[0%] w-[30%] h-[15%] border-green-500 border-[5px]"></div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col landscape:h-[80vh] portrait:w-[100%] portrait:aspect-[2/2.5] portrait:md:aspect-[2/1]">
        <div className="flex flex-col items-center h-[30%] w-[100%]">
          <div className="flex justify-center items-end h-[65%] w-[100%] text-[#452829] text-[clamp(12px,2vw,40px)] portrait:text-[clamp(12px,2vh,40px)]">
            <b>Pejabat dan Pengurus Desa</b>
          </div>
          <div className="flex bg-[#E9B63B] h-[2%] w-[8%] rounded-[5px] mt-[1%]"></div>
          <div className="flex justify-center items-center h-[33%] w-[100%] p-[5%] sm:p-0 text-center portrait:text-[clamp(12px,1.3vh,18px)]">
            Tim kepemimpinan desa yang berdedikasi untuk melayani dan memajukan
            kesejahteraan masyarakat
          </div>
        </div>
        <div className="flex justify-center items-center h-[70%]">
          <div className="flex flex-col sm:flex-row items-center gap-[2%] overflow-x-auto snap-x snap-mandatory px-4 scrollbar-hide w-[80%] h-[70%]">
            <div className="flex sm:hidden start-snap"></div>
            {data.map((item, i) => (
              <div
                key={i}
                className="flex justify-center items-center flex-shrink-0 landscape:lg:w-[23.7%] w-[70%] portrait:lg:w-[32.5%] md:w-[32.5%] sm:w-[50%] h-[90%]"
              >
                <div className="flex flex-col gap-[1%] justify-center items-center rounded-xl shadow-[0_3px_16px_rgba(0,0,0,0.12)] p-3 text-center h-[100%] w-full">
                  <div className="flex justify-center items-center w-[40%] aspect-square rounded-full border-2 border-yellow-400">
                    Image
                  </div>
                  <div className="font-semibold text-[#452829] text-[clamp(12px,1.2vw,30px)]">
                    {item.nama}
                  </div>
                  <div className="text-sm text-gray-500">{item.jabatan}</div>
                  <div className="flex justify-center items-center gap-3 h-[20%] w-[40%]">
                    <div className="flex bg-[#57595B] justify-center items-center rounded-full w-[50%] aspect-square">
                      <div className="flex w-[50%] h-[50%]">
                        <CiMail className="h-[100%] w-[100%]" />
                      </div>
                    </div>
                    <div className="flex bg-[#57595B] justify-center items-center rounded-full w-[50%] aspect-square">
                      <div className="flex w-[50%] h-[50%]">
                        <BsFillTelephoneFill className="h-[100%] w-[100%]" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div className="flex sm:hidden start-snap"></div>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center landscape:h-[150vh] portrait:w-[100%] portrait:aspect-[1/4] portrait:lg:aspect-[5/4.5] portrait:md:aspect-[1/1.15] portrait:sm:aspect-[1/1.8] bg-[#FFF8DE]">
        <div className="flex flex-col items-center h-[100%] w-[90%]">
          <div className="flex flex-col h-[67%] w-[100%] gap-[2%]">
            <div className="flex flex-col items-center h-[30%] w-[100%] gap-[3%] sm:gap-0">
              <div className="flex justify-center items-end h-[40%] sm:h-[65%] w-[100%] text-[#452829] text-[clamp(12px,2vw,40px)] portrait:text-[clamp(12px,2vh,40px)]">
                <b>Produk Unggulan Desa</b>
              </div>
              <div className="flex bg-[#E9B63B] h-[2%] w-[8%] rounded-[5px] mt-[1%]"></div>
              <div className="flex justify-center items-center h-[33%] w-[100%] text-center">
                Produk berkualitas dari UMKM lokal yang dikelola dengan penuh
                dedikasi oleh masyarakat desa
              </div>
            </div>
            <div className="flex flex-col sm:flex-row h-[70%] w-[100%] rounded-2xl bg-white shadow-[0_3px_16px_rgba(0,0,0,0.20)]">
              <div className="relative w-[100%] h-[50%] sm:w-[50%] sm:h-[100%]">
                <div className="absolute w-[100%] h-[100%]">
                  <div className="flex justify-center items-center h-[100%] w-[100%]">
                    Image
                  </div>
                </div>
                <div className="absolute top-5 left-5 w-[40%] md:w-[30%] h-[10%] md:h-[7%] bg-[#FFD41D] text-[clamp(12px,1.1vw,15px)] rounded-full">
                  <div className="flex justify-center items-center h-[100%] w-[100%] text-[clamp(10px,1vw,15px)]">
                    PRODUK UNGGULAN
                  </div>
                </div>
              </div>
              <div className="flex justify-center items-center w-[100%] h-[100%] sm:w-[50%]">
                <div className="flex flex-col h-[90%] w-[90%]">
                  <div className="flex h-[7%]">
                    <div className="flex justify-center items-center bg-[#A8BBA3] w-[30%] md:w-[25%] h-[100%] rounded-sm text-[#452829] font-bold p-[1px]  text-[clamp(10px,1vw,15px)]">
                      Produk Alami
                    </div>
                  </div>
                  <div className="flex items-center h-[14%] text-[#452829] text-[clamp(12px,2vw,40px)] font-bold">
                    {produkData[1].nama}
                  </div>
                  <div className="flex h-[25%] text-gray-500">
                    {produkData[1].long_desc}
                  </div>
                  <div className="flex flex-col h-[25%]">
                    {produkData[1].advantage.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center flex-row h-[25%] gap-[5px]"
                      >
                        <PiSealCheckFill className="text-[#AA2B1D]" />
                        <div className="flex">{item}</div>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-row gap-2 h-[5%]">
                    <div className="flex flex-row gap-[5px]">
                      {Array.from({ length: 5 }).map((_, index) => {
                        if (produkData[1].star >= index + 1) {
                          return (
                            <FaStar
                              key={index}
                              className="h-[100%] w-auto text-yellow-500"
                            />
                          );
                        } else if (produkData[1].star >= index + 0.5) {
                          return (
                            <FaStarHalfAlt
                              key={index}
                              className="h-[100%] w-auto text-yellow-500"
                            />
                          );
                        } else {
                          return (
                            <FaRegStar
                              key={index}
                              className="h-[100%] w-auto text-yellow-500"
                            />
                          );
                        }
                      })}
                    </div>
                    <div className="text-gray-500">
                      ({produkData[1].review}) Ulasan
                    </div>
                  </div>
                  <div className="flex flex-row gap-2 items-center h-[12%]">
                    <div className="flex items-center font-bold text-[#452829] text-[clamp(20px,1.7vw,30px)]">
                      Rp.{produkData[1].price}
                    </div>
                    <div className="flex items-center text-gray-500 text-[clamp(12px,1.2vw,20px)] line-through">
                      Rp.{produkData[1].price * (1 - produkData[1].disc / 100)}
                    </div>
                    <div className="flex items-center justify-center w-[15%] sm:w-[10%] h-[40%] bg-[#AA2B1D] rounded-md text-white text-[clamp(12px,1.2vw,20px)]">
                      -{produkData[1].disc}%
                    </div>
                  </div>
                  <div className="flex flex-row justify-center items-center gap-2 h-[12%] bg-[#AA2B1D] rounded-md">
                    <FaShoppingCart className="text-white" />
                    <div className="text-white">Beli Sekarang</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-row items-center h-[33%] w-[100%]">
            <div className="flex items-center gap-6 portrait:lg:gap-6 portrait:sm:gap-4 overflow-x-auto snap-x snap-mandatory px-4 scrollbar-hide w-[100%] h-[100%]">
              <div className="hidden start-snap"></div>
              {produkData.map((item, i) => (
                <div
                  key={i}
                  className="flex justify-center items-center flex-shrink-0 landscape:w-[32%] portrait:w-[100%] portrait:lg:w-[32%] portrait:sm:w-[49%] h-[100%]"
                >
                  <div className="flex flex-col gap-2 justify-center items-center rounded-xl shadow-[0_3px_16px_rgba(0,0,0,0.12)] p-3 text-center h-[90%] w-full aspect-[3/4] bg-white">
                    <div className="flex justify-center items-center w-[95%] h-[60%] rounded-2xl border-2 border-yellow-400">
                      Image
                    </div>
                    <div className="flex flex-col justify-between items-center h-[40%] w-[100%]">
                      <div className="flex flex-col h-[60%] w-[100%] items-center">
                        <div className="flex items-left w-[95%] font-semibold text-[#452829]">
                          {item.nama}
                        </div>
                        <div className="flex items-left w-[95%] text-sm text-gray-500 text-left">
                          {item.short_desc}
                        </div>
                      </div>
                      <div className="flex flex-row justify-between items-center gap-3 h-[40%] w-[95%]">
                        <div className="flex font-bold text-[#452829] text-[clamp(20px,1.7vw,30px)]">
                          Rp. {item.price}
                        </div>
                        <div className="flex justify-center items-center bg-[#FFD41D] h-[60%] w-[20%] rounded-md text-[clamp(15px,1.2vw,20px)]">
                          <div className="">Lihat</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center landscape:h-[140vh] portrait:w-[100%] portrait:aspect-[1/3.2] portrait:lg:aspect-[5/4.5] portrait:md:aspect-[1/1.2] portrait:sm:aspect-[1/1.8] gap-[2%]">
        <div className="flex flex-col items-center h-[15%] sm:h-[20%] w-[100%]">
          <div className="flex justify-center items-end h-[40%] sm:h-[65%] w-[100%] text-[#452829] text-[clamp(12px,2vw,40px)] portrait:text-[clamp(12px,2vh,40px)]">
            <b>Lokasi Desa</b>
          </div>
          <div className="flex bg-[#E9B63B] h-[2%] w-[8%] rounded-[5px] mt-[1%]"></div>
          <div className="flex justify-center items-center h-[58%] sm:h-[33%] w-[100%] text-center p-[2%] sm:p-0">
            Temukan kami di kawasan yang mudah diakses dengan pemandangan alam
            yang menakjubkan
          </div>
        </div>
        <div className="flex flex-col h-[85%] sm:h-[73%] w-[90%]">
          <div className="flex flex-col items-center justify-center gap-2 bg-gray-500 rounded-md aspect-square sm:h-[65%] w-[100%] shadow-[0_3px_16px_rgba(0,0,0,0.4)]">
            <div className="flex justify-center items-center bg-[#452829] rounded-full h-[13%] aspect-square">
              <FaLocationDot className="text-yellow-500 w-[45%] h-auto" />
            </div>
            <div className="flex justify-center h-auto w-[100%] text-[#452829] text-[clamp(12px,1.4vw,30px)]">
              <b>Lokasi Desa</b>
            </div>
            <div className="flex">Kecamatan Makmur, Kabupaten Makmur</div>
            <div className="flex flex-row justify-center items-center gap-2 w-[100%] h-auto">
              <FaLocationDot className="text-[#452829] w-[1.5%] h-auto" />
              <div>Some coordinate....</div>
            </div>
          </div>
          <div className="flex flex-row items-center h-[65%] sm:h-[35%] w-[100%]">
            <div className="flex flex-col sm:flex-row justify-between items-center h-[100%] w-[100%]">
              <div className="flex justify-center items-center flex-shrink-0 w-[100%] sm:w-[32%] h-[32%] sm:h-[100%]">
                <div className="flex flex-col gap-2 justify-center items-start rounded-xl shadow-[0_3px_16px_rgba(0,0,0,0.12)] p-3 h-[90%] w-full aspect-[3/4] bg-white">
                  <div className="flex justify-center items-center bg-yellow-500 rounded-full h-[20%] aspect-square">
                    <FaLocationDot className="text-[#452829] w-[45%] h-auto" />
                  </div>
                  <div className="flex items-left w-[95%] font-semibold text-[#452829]">
                    Alamat
                  </div>
                  <div className="flex w-[100%] text-sm text-gray-500">
                    Lorem Ipsum Dolor Sit Amet Lorem Ipsum Dolor Sit Amet Lorem
                    Ipsum Dolor Sit Amet Lorem Ipsum Dolor Sit Amet Lorem Ipsum
                    Dolor Sit Amet Lorem Ipsum Dolor Sit Amet
                  </div>
                </div>
              </div>
              <div className="flex justify-center items-center flex-shrink-0 w-[100%] sm:w-[32%] h-[32%] sm:h-[100%]">
                <div className="flex flex-col gap-2 justify-center items-start rounded-xl shadow-[0_3px_16px_rgba(0,0,0,0.12)] p-3 h-[90%] w-full aspect-[3/4] bg-white">
                  <div className="flex justify-center items-center bg-yellow-500 rounded-full h-[20%] aspect-square">
                    <BsFillTelephoneFill className="text-[#452829] w-[45%] h-auto" />
                  </div>
                  <div className="flex items-left w-[95%] font-semibold text-[#452829]">
                    Kontak
                  </div>
                  <div className="flex w-[100%] text-sm text-gray-500">
                    Lorem Ipsum Dolor Sit Amet Lorem Ipsum Dolor Sit Amet Lorem
                    Ipsum Dolor Sit Amet Lorem Ipsum Dolor Sit Amet Lorem Ipsum
                    Dolor Sit Amet Lorem Ipsum Dolor Sit Amet
                  </div>
                </div>
              </div>
              <div className="flex justify-center items-center flex-shrink-0 w-[100%] sm:w-[32%] h-[32%] sm:h-[100%]">
                <div className="flex flex-col gap-2 justify-center items-start rounded-xl shadow-[0_3px_16px_rgba(0,0,0,0.12)] p-3 h-[90%] w-full aspect-[3/4] bg-white">
                  <div className="flex justify-center items-center bg-yellow-500 rounded-full h-[20%] aspect-square">
                    <FaClock className="text-[#452829] w-[45%] h-auto" />
                  </div>
                  <div className="flex items-left w-[95%] font-semibold text-[#452829]">
                    Alamat
                  </div>
                  <div className="flex w-[100%] text-sm text-gray-500">
                    Lorem Ipsum Dolor Sit Amet Lorem Ipsum Dolor Sit Amet Lorem
                    Ipsum Dolor Sit Amet Lorem Ipsum Dolor Sit Amet Lorem Ipsum
                    Dolor Sit Amet Lorem Ipsum Dolor Sit Amet
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center landscape:h-[100vh] portrait:w-[100%] portrait:aspect-[1/2] portrait:lg:aspect-[3/1.8] portrait:md:aspect-[3/2.5] portrait:sm:aspect-[1/1.2] bg-[#F5F2F2]">
        <div className="flex flex-col items-center h-[20%] w-[100%]">
          <div className="flex justify-center items-end h-[40%] sm:h-[65%] w-[100%] text-[#452829] text-[clamp(12px,2vw,40px)] portrait:text-[clamp(12px,2vh,40px)]">
            <b>Kabar Desa</b>
          </div>
          <div className="flex bg-[#E9B63B] h-[2%] w-[8%] rounded-[5px] mt-[1%]"></div>
          <div className="flex justify-center items-center h-[58%] sm:h-[33%] w-[100%] text-center p-[3%] sm:p-0">
            Berita terkini dan artikel menarik seputar perkembangan dan kegiatan
            di Desa Sejahtera
          </div>
        </div>
        <div className="flex flex-row h-[65%] w-[100%] sm:w-[90%]">
          <div className="flex flex-row items-center h-[100%] w-[100%]">
            <div className="flex items-center gap-6 overflow-x-auto snap-x snap-mandatory px-4 scrollbar-hide w-[100%] h-[100%]">
              <div className="hidden start-snap"></div>
              {newsData.map((item, i) => (
                <div
                  key={i}
                  className="flex justify-center items-center flex-shrink-0 landscape:w-[32%] portrait:lg:w-[32%] portrait:md:w-[49%] h-[100%]"
                >
                  <div className="flex flex-col justify-start items-center rounded-xl shadow-[0_3px_16px_rgba(0,0,0,0.12)] h-[90%] w-full aspect-[3/4] bg-white">
                    <div className="flex justify-center items-center w-[100%] h-[60%] rounded-t-xl border-1 border-yellow-400">
                      Image
                    </div>
                    <div className="flex flex-col justify-between gap-1 p-3 w-[100%] h-[40%]">
                      <div className="flex flex-row gap-3 items-left w-[100%] h-[15%]">
                        <div className="flex justify-center items-center bg-yellow-500 h-[100%] w-[35%] rounded-full font-semibold text-[#452829] text-[clamp(11px,1.1vw,14px)]">
                          {item.news_type}
                        </div>
                        <div className="flex text-gray-500 text-[clamp(11px,1.1vw,14px)]">
                          {formatTanggal(item.date)}
                        </div>
                      </div>
                      <div className="flex font-semibold text-[#452829] text-[clamp(12px,1.3vw,20px)]">
                        {item.title}
                      </div>
                      <div className="flex text-gray-500 text-[clamp(12px,1.1vw,15px)]">
                        {item.desc}
                      </div>
                      <div className="flex flex-row items-baseline gap-2">
                        <div className="text-[#452829] text-[clamp(11px,1.3vw,15px)] font-semibold">
                          Baca Selengkapnya
                        </div>
                        <FaArrowRight className="text-[#452829] translate-y-[25%]" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex justify-center items-center h-[15%] sm:h-[15%] w-[100%]">
          <div className="flex justify-center items-center bg-[#AA2B1D] gap-3 rounded-xl h-[55%] w-[55%] sm:w-[25%]">
            <div className="text-white text-[clamp(12px,1.1vw,15px)]">Lihat Semua Artikel</div>
            <FaArrowRight className="text-white" />
          </div>
        </div>
      </div>
      <div className="flex flex-col bg-[#3B060A] landscape:h-[100vh] portrait:w-[100%] portrait:aspect-[1/2.8] portrait:sm:aspect-[2/1.3]">
        <div className="flex flex-col justify-center h-[25%] sm:h-[43%] bg-[#B87C4C]">
          <div className="flex flex-col justify-center items-center text-center gap-3 h-[65%]">
            <div className="flex font-bold text-[clamp(12px,2.3vw,40px)] portrait:text-[clamp(12px,2.3vh,40px)] text-white">
              Kunjungi Desa Sejahtera
            </div>
            <div className="flex text-[clamp(12px,1.5vw,20px)] portrait:text-[clamp(12px,1.5vh,20px)] text-yellow-500">
              Lorem Ipsum DOlor SIt AMet adispiscis consectetur elit
            </div>
            <div className="flex flex-row items-center justify-between gap-3 h-[40%] landscape:w-[35%] portrait:w-[80%] portrait:sm:w-[45%]">
              <div className="flex flex-row justify-center items-center h-[90%] w-[60%] gap-2 rounded-xl bg-yellow-500">
                <FaCalendarCheck className="text-brown-500" />
                <div className="text-brown-500 font-semibold text-[clamp(10px,1.2vw,18px)] portrait:text-[clamp(10px,1.2vh,18px)]">
                  Jadwalkan Kunjungan
                </div>
              </div>
              <div className="flex flex-row justify-center items-center h-[90%] w-[40%] border-white border-2 gap-2 rounded-xl bg-white/30">
                <BsFillTelephoneFill className="text-white" />
                <div className="text-white font-semibold text-[clamp(10px,1.2vw,18px)] portrait:text-[clamp(10px,1.2vh,18px)]">
                  Hubungi Kami
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="h-[1px] bg-[#D9CFC7]"></div>
        <div className="flex flex-col justify-center items-center h-[75%] w-[100%]">
          <div className="flex flex-col h-[100%] w-[90%]">
            <div className="flex flex-col gap-[2%] sm:flex-row h-[90%] sm:h-[80%] w-[100%] pt-5 sm:pt-7">
              <div className="flex flex-col h-[25%] sm:h-[100%] w-[100%] sm:w-[25%]">
                <div className="flex flex-row landscape:gap-[8%] portrait:gap-[3%] portrait:sm:gap-[15%] h-[50%] sm:h-[30%] w-[100%]">
                  <div className="flex justify-center items-center w-[15%] sm:w-[20%] aspect-square">
                    <div className="flex justify-center items-center sm:h-[50%] h-[50%] aspect-square bg-yellow-500 rounded-full">
                      <FaMountainSun className="h-[50%] w-auto" />
                    </div>
                  </div>
                  <div className="flex flex-col h-[100%] w-[80%]">
                    <div className="flex items-end font-semibold h-[50%] w-[100%] text-white text-[clamp(20px,1.5vw,30px)] sm:text-[clamp(12px,1.5vw,30px)]">
                      Desa Sejahtera
                    </div>
                    <div className="flex sm:h-[50%] w-[100%] text-yellow-500 portrait:text-[clamp(15px,1vw,15px)] portrait:sm:text-[clamp(10px,1.5vw,30px)] text-[clamp(10px,1.5vw,15px)]">
                      Kabupaten Makmur
                    </div>
                  </div>
                </div>
                <div className="flex justify-left h-[50%] sm:h-[70%] items-start text-[#D9CFC7] text-[clamp(10px,1vw,15px)] portrait:text-[clamp(15px,1vw,20px)] portrait:sm:text-[clamp(10px,1.5vw,30px)] pt-3">
                  Lorem Ipsum Dolor Sit Amet Lorem Ipsum Dolor Sit Amet Lorem
                  Ipsum Dolor Sit Amet
                </div>
              </div>
              <div className="flex flex-col gap-3 sm:gap-7 h-[25%] sm:h-[100%] w-[100%] sm:w-[25%]">
                <div className="flex items-end text-white h-[15%] font-semibold text-[clamp(12px,1.5vw,30px)] portrait:text-[clamp(15px,1vw,20px)] portrait:sm:text-[clamp(12px,1.5vw,30px)]">
                  Navigasi
                </div>
                <div className="flex flex-col gap-2 h-auto w-[100%]">
                  <div className="flex text-[#D9CFC7] text-[clamp(10px,1.2vw,18px)] portrait:text-[clamp(15px,1vw,20px)] portrait:sm:text-[clamp(10px,1.5vw,30px)]">
                    Beranda
                  </div>
                  <div className="flex text-[#D9CFC7] text-[clamp(10px,1.2vw,18px)] portrait:text-[clamp(15px,1vw,20px)] portrait:sm:text-[clamp(10px,1.5vw,30px)]">
                    Tentang Desa
                  </div>
                  <div className="flex text-[#D9CFC7] text-[clamp(10px,1.2vw,18px)] portrait:text-[clamp(15px,1vw,20px)] portrait:sm:text-[clamp(10px,1.5vw,30px)]">
                    Pejabat Desa
                  </div>
                  <div className="flex text-[#D9CFC7] text-[clamp(10px,1.2vw,18px)] portrait:text-[clamp(15px,1vw,20px)] portrait:sm:text-[clamp(10px,1.5vw,30px)]">
                    Produk UMKM
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-3 sm:gap-7 h-[25%] sm:h-[100%] w-[100%] sm:w-[25%]">
                <div className="flex items-end text-white h-[15%] font-semibold text-[clamp(12px,1.5vw,30px)] portrait:text-[clamp(15px,1vw,20px)] portrait:sm:text-[clamp(12px,1.5vw,30px)]">
                  Layanan
                </div>
                <div className="flex flex-col gap-2 h-auto w-[100%]">
                  <div className="flex text-[#D9CFC7] text-[clamp(10px,1.2vw,18px)] portrait:text-[clamp(15px,1vw,20px)] portrait:sm:text-[clamp(10px,1.5vw,30px)]">
                    Administrasi Desa
                  </div>
                  <div className="flex text-[#D9CFC7] text-[clamp(10px,1.2vw,18px)] portrait:text-[clamp(15px,1vw,20px)] portrait:sm:text-[clamp(10px,1.5vw,30px)]">
                    Pengaduan Masyarakat
                  </div>
                  <div className="flex text-[#D9CFC7] text-[clamp(10px,1.2vw,18px)] portrait:text-[clamp(15px,1vw,20px)] portrait:sm:text-[clamp(10px,1.5vw,30px)]">
                    Informasi Publik
                  </div>
                  <div className="flex text-[#D9CFC7] text-[clamp(10px,1.2vw,18px)] portrait:text-[clamp(15px,1vw,20px)] portrait:sm:text-[clamp(10px,1.5vw,30px)]">
                    Perizinan
                  </div>
                </div>
              </div>
              <div className="flex flex-col h-[25%] sm:h-[100%] w-[100%] sm:w-[25%]">
                <div className="flex items-end text-white h-[15%] font-semibold text-[clamp(12px,1.5vw,30px)] portrait:text-[clamp(15px,1vw,20px)] portrait:sm:text-[clamp(12px,1.5vw,30px)]">
                  Kontak Kami
                </div>
                <div className="flex items-center h-[100%] sm:h-[85%]">
                  <div className="flex flex-col landscape:gap-3 portrait:lg:gap-3 portrait:gap-1.5 h-[80%] w-[100%]">
                    <div className="flex flex-row items-center gap-3 h-[25%]">
                      <FaLocationDot className="h-[80%] aspect-square text-yellow-500" />
                      <div className="text-[#D9CFC7] text-[clamp(10px,1vw,15px)] portrait:text-[clamp(15px,1vw,20px)] portrait:sm:text-[clamp(10px,1.5vw,30px)]">
                        Jl. Raya Sejahtera No. 123, Kab. Makmur
                      </div>
                    </div>
                    <div className="flex flex-row items-center gap-3 h-[25%]">
                      <BsFillTelephoneFill className="h-[80%] aspect-square text-yellow-500" />
                      <div className="text-[#D9CFC7] text-[clamp(10px,1vw,15px)] portrait:text-[clamp(15px,1vw,20px)] portrait:sm:text-[clamp(10px,1.5vw,30px)]">
                        Jl. Raya Sejahtera No. 123, Kab. Makmur
                      </div>
                    </div>
                    <div className="flex flex-row items-center gap-3 h-[25%]">
                      <IoMdMail className="h-[80%] aspect-square text-yellow-500" />
                      <div className="text-[#D9CFC7] text-[clamp(10px,1vw,15px)] portrait:text-[clamp(15px,1vw,20px)] portrait:sm:text-[clamp(10px,1.5vw,30px)]">
                        Jl. Raya Sejahtera No. 123, Kab. Makmur
                      </div>
                    </div>
                    <div className="flex flex-row gap-3 h-[25%]">
                      <div className="flex justify-center items-center bg-white/30 rounded-full h-[100%] aspect-square">
                        <FaFacebookF className="landscape:h-[85%] portrait:lg:h-[85%] portrait:md:h-[60%] text-white text-[clamp(10px,1.2vw,15px)] portrait:text-[clamp(15px,1vw,20px)]" />
                      </div>
                      <div className="flex justify-center items-center bg-white/30 rounded-full h-[100%] aspect-square">
                        <FaInstagram className="landscape:h-[85%] portrait:lg:h-[85%] portrait:md:h-[60%] text-white text-[clamp(10px,1.5vw,20px)] portrait:text-[clamp(15px,1vw,20px)]" />
                      </div>
                      <div className="flex justify-center items-center bg-white/30 rounded-full h-[100%] aspect-square">
                        <FaYoutube className="landscape:h-[85%] portrait:lg:h-[85%] portrait:md:h-[60%] text-white text-[clamp(10px,1.5vw,20px)] portrait:text-[clamp(15px,1vw,20px)]" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="h-[1px] w-[100%] bg-white"></div>
            <div className="flex justify-center items-center h-[10%] sm:h-[20%] w-[100%] text-white text-[clamp(10px,1.5vw,20px)]">
              © 2025 Desa Sejahtera. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
