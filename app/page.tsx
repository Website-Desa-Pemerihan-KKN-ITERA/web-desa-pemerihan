import Image from "next/image";

export default function Home() {
  return (
    <div>
      <div className="flex flex-col md:flex-row border-black border-[1px] bg-[#FFFDE1] h-auto md:h-[10vh] text-[clamp(12px,1.2vw,15px)]">
        {/* Logo */}
        <div className="flex justify-center items-center border-green-500 border-[1px] w-full md:w-[32vw] h-[10vh]">
          <div className="flex border-black border-[1px] w-[80%] md:w-[45%] h-full">
            <div className="flex justify-center items-center border-red-500 border-[1px] w-[30%] h-full">
              Logo
            </div>
            <div className="flex flex-col border-green-500 border-[1px] w-[70%] h-full">
              <div className="flex items-end border-red-500 border-[1px] h-1/2"><b>Desa Sejahtera</b></div>
              <div className="border-red-500 border-[1px] h-1/2">Kabupaten Makmur</div>
            </div>
          </div>
        </div>

        {/* Spacer */}
        <div className="hidden md:flex border-blue-500 border-[1px] w-[24vw]"></div>

        {/* Menu */}
        <div className="flex flex-col md:flex-row justify-center items-center border-red-500 border-[1px] w-full md:w-[44vw]">
          {["Beranda","Tentang","Pejabat","UMKM","Artikel","Lokasi"].map(item => (
            <div
              key={item}
              className="flex justify-center items-center border-black border-[1px] w-full md:w-[10%] h-[6vh] md:h-full"
            >
              {item}
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-row justify-center items-center border-red-500 border-[1px] h-[90vh]">Image</div>
      <div className="flex flex-col border-black border-[1px] bg-[#F5F2F2] h-[100vh] text-[clamp(12px,1.2vw,15px)]">
        <div className="flex flex-col border-red-500 h-[20%] w-[100%]">
          <div className="flex border-black h-[45%] w-[100%]"></div>
          <div className="flex justify-center items-center border-black h-[40%] w-[100%] text-[#452829] text-[clamp(12px,2vw,40px)]"><b>Selayang Pandang</b></div>
          <div className="flex justify-center border-black h-[15%] w-[100%]">
            <div className="flex bg-[#E9B63B] h-[15%] w-[7%] rounded-[5px]"></div>
          </div>
        </div>
        <div className="flex flex-row justify-center items-start border-red-500 border-[1px] h-[80%] w-[100%]">
          <div className="flex flex-row justify-center items-center border-blue-500 h-[90%] w-[90%]">
            <div className="flex flex-col justify-center items-center border-black-500 border-[1px] h-[100%] w-[50%]">
              <div className="flex flex-col border-red-500 border-[1px] h-[100%] w-[100%]">
                <div className="flex h-[20%] w-[100%] text-[#452829] text-[clamp(12px,1.2vw,20px)]"><b>Visi Desa</b></div>
                <div className="flex h-[80%] w-[100%]">Blabla</div>
              </div>
              <div className="flex flex-col border-red-500 border-[1px] h-[100%] w-[100%]">
                <div className="flex h-[20%] w-[100%] text-[#452829] text-[clamp(12px,1.2vw,20px)]"><b>Visi Desa</b></div>
                <div className="flex h-[80%] w-[100%]">Blabla</div>
              </div>
              <div className="flex flex-row border-red-500 border-[1px] h-[100%] w-[100%]"></div>
            </div>
            <div className="relative flex-row border-red-500 border-[1px] h-[100%] w-[50%]">
              <div className="absolute top-0 right-0 w-[95%] h-[95%] border-blue-500 border-[5px]">
                Kotak 1
              </div>
              <div className="absolute bottom-[0%] left-[0%] w-[30%] h-[15%] border-green-500 border-[5px]">
                Kotak 2
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
