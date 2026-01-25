"use client";

import { FaWhatsapp } from "react-icons/fa";
import { whatsappRedirect } from "@/helpers/whatsappRedirect";

interface TourSpot {
  name: string;
  entryFee: number;
  slug: string;
  contact: string;
  owner: string;
  description: string;
  openDay: string[];
  imagesUrl: string[];
}

interface WhatsAppButtonProps {
  tourSpot: TourSpot;
}

export default function WhatsAppButtonTourSpot({
  tourSpot,
}: WhatsAppButtonProps) {
  return (
    <button
      onClick={() => {
        const url = whatsappRedirect(
          tourSpot.name,
          tourSpot.contact,
          tourSpot.owner,
        );
        window.open(url, "_blank");
      }}
      className="flex justify-center items-center gap-1 mt-3 w-full bg-[#075e54] hover:bg-slate-800 text-white font-medium py-3 px-4 rounded-lg transition-colors"
    >
      <FaWhatsapp className="text-xl" />
      <span>Chat Lebih Lanjut</span>
    </button>
  );
}
