import { getArticleData } from "@/services/getArticleData-articlePage";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [article, imageUrl] = await getArticleData(slug);

  // Error Handling UI (bukan JSON response)
  if (!article) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <div className="text-center px-4">
          <h1 className="text-4xl font-bold text-gray-200 mb-2">404</h1>
          <p className="text-gray-500">
            Artikel yang Anda cari tidak ditemukan.
          </p>
        </div>
      </div>
    );
  }

  return (
    // Container utama dengan background putih bersih
    <main className="min-h-screen bg-white">
      <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        {/* HEADER: Judul Artikel */}
        <header className="mb-10 text-center">
          {/* Menggunakan div wrapper untuk dangerous HTML, tapi di-styling seperti H1 */}
          <div
            className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl md:text-5xl leading-tight mb-6"
            dangerouslySetInnerHTML={{ __html: article?.title ?? "" }}
          />

          {/* Opsional: Area untuk Tanggal/Author jika ada datanya nanti */}
          {/* <div className="text-gray-500 text-sm">Diposting oleh Admin</div> */}
        </header>

        {/* FEATURED IMAGE */}
        <div className="mb-10 overflow-hidden rounded-xl bg-gray-50 border border-gray-100">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt="Article cover"
              className="w-full h-auto object-cover max-h-[500px]"
            />
          ) : (
            // Placeholder minimalis jika tidak ada gambar
            <div className="flex h-64 w-full items-center justify-center bg-gray-50 text-gray-400">
              <span className="text-sm italic">Tidak ada gambar sampul</span>
            </div>
          )}
        </div>

        {/* CONTENT BODY */}
        <div
          className="prose prose-lg max-w-none prose-neutral break-words whitespace-normal
                     prose-headings:font-bold prose-headings:text-gray-900 
                     prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
                     prose-img:rounded-lg prose-img:shadow-md"
          dangerouslySetInnerHTML={{ __html: article?.content ?? "" }}
        />
      </article>
    </main>
  );
}
