"use client";
import Link from "next/link";
import DashboardSidebar from "@/ui/dashboardSidebar"

export default function ArticleDashboard() {
  return (
    <>
      <div className="flex min-h-dvh">
        <DashboardSidebar />

        <div className="mt-5 mx-5 flex-1">
          <div className="font-bold text-xl">Article</div>

          <div className="my-5 flex">
            <Link prefetch={false} href="/admin/dashboard/addarticle">
              <div className="border rounded-2xl py-1 px-2 bg-[#CFEAFF] text-[#008AFC] cursor-pointer hover:bg-[#8CCCFF]">
                <p>Tambah Artikel</p>
              </div>
            </Link>
          </div>

          <div>
            <div className="border p-2 flex justify-between mb-2">
              <p>Artikel 1 sldfkjasf;lsdkajfasd;l</p>

              <div className="flex gap-5">
                <div>Edit</div>
                <div>hapus</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
