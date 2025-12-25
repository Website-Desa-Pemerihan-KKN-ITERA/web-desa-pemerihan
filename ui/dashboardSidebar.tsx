import { MdArticle } from "react-icons/md";
import { FaShop } from "react-icons/fa6";
import { MdSwitchAccount } from "react-icons/md";
import Link from "next/link";

export default function Page() {
  return (
    <div className="bg-slate-700 px-4 text-white text-xl">
      <div className="mt-5 font-bold text-2xl">Dashboard</div>
      <Link href={"/admin/dashboard/article"} className="mt-5 cursor-pointer flex items-center gap-2">
        <MdArticle />
        <span>Artikel</span>
      </Link>
      <Link href={"/admin/dashboard/shop"} className="mt-5 cursor-pointer flex items-center gap-2">
        <FaShop />
        <span>Toko</span>
      </Link>
      <Link href={"/admin/dashboard/accounts"} className="mt-5 cursor-pointer flex items-center gap-2">
        <MdSwitchAccount />
        <span>Akun</span>
      </Link>
    </div>
  )
}
