"use client";

import { whatsappRedirect } from "@/helpers/whatsappRedirect";
import { IoLocationSharp } from "react-icons/io5";

interface TourSpot {
  name: string;
  entryFee: number;
  slug: string;
  contact: string;
  owner: string;
  description: string;
  mapsUrl: string;
  openDay: string[];
  imagesUrl: string[];
}

interface WhatsAppButtonProps {
  tourSpot: TourSpot;
}

export default function MapsRedirectButton({ tourSpot }: WhatsAppButtonProps) {
  return (
    <button
      onClick={() => {
        const url = tourSpot.mapsUrl;
        window.open(url, "_blank");
      }}
      className="flex justify-center items-center gap-1 mt-3 w-full bg-[#000000] hover:bg-slate-800 text-white font-medium py-3 px-4 rounded-2xl transition-colors"
    >
      <IoLocationSharp className="text-xl" />
      <span>Maps</span>
    </button>
  );
}
