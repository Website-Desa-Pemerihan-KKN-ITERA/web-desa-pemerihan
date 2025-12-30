import Link from "next/link";
import { MdArticle, MdSwitchAccount } from "react-icons/md";
import { FaShop } from "react-icons/fa6";

export default function DashboardSidebar() {
  return (
    <aside className="bg-[#333446] text-[#EAEFEF] flex flex-col gap-2 p-4 w-full md:w-64 md:min-h-dvh shrink-0 transition-all">
      <div className="my-4 font-bold text-2xl">Dashboard</div>

      <nav className="flex flex-col gap-4">
        <Link
          href={"/admin/dashboard/article"}
          className="flex items-center gap-3 px-2 py-2 hover:bg-[#252634] rounded-md transition-colors"
        >
          <MdArticle size={20} />
          <span>Artikel</span>
        </Link>

        <Link
          href={"/admin/dashboard/shop"}
          className="flex items-center gap-3 px-2 py-2 hover:bg-[#252634] rounded-md transition-colors"
        >
          <FaShop size={18} />
          <span>Toko</span>
        </Link>

        <Link
          href={"/admin/dashboard/accounts"}
          className="flex items-center gap-3 px-2 py-2 hover:bg-[#252634] rounded-md transition-colors"
        >
          <MdSwitchAccount size={20} />
          <span>Akun</span>
        </Link>
      </nav>
    </aside>
  );
}
