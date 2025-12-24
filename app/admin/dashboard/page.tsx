import ArticleDashboard from "./article"

export default function page() {
  return (
    <>
      <div className="flex min-h-dvh">
        <div className="bg-slate-700 px-4 text-white">
          <div className="mt-5 font-bold text-xl">
            Dashboard
          </div>
          <div className="mt-5 cursor-pointer">
            --- Artikel
          </div>
          <div className="mt-5 cursor-pointer">
            --- Toko
          </div>
          <div className="mt-5 cursor-pointer">
            --- Akun
          </div>
        </div>
        <div className="flex-1">
          <ArticleDashboard />
        </div>
      </div>
    </>
  )
}
