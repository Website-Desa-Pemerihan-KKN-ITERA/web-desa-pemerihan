"use client";

import { FaWhatsapp } from "react-icons/fa";
import { whatsappRedirect } from "@/helpers/whatsappRedirect";

interface ShopItem {
  name: string;
  price: number;
  slug: string;
  contact: string;
  description: string;
  imagesUrl: string[];
}

interface WhatsAppButtonProps {
  shopItem: ShopItem;
}

export default function WhatsAppButton({ shopItem }: WhatsAppButtonProps) {
  return (
    <button
      onClick={() => {
        const url = whatsappRedirect(
          shopItem.name,
          shopItem.contact,
          null,
        );
        window.open(url, "_blank");
      }}
      className="flex justify-center items-center gap-1 mt-3 w-full bg-[#075e54] hover:bg-slate-800 text-white font-medium py-3 px-4 rounded-lg transition-colors"
    >
      <FaWhatsapp className="text-xl" />
      <span>Chat Penjual</span>
    </button>
  )
}
