import { getArticleData } from "@/services/getArticleData-articlePage";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [article, imageUrl] = await getArticleData(slug);
  if (!article) {
    return Response.json(
      {
        error: "Database error",
      },
      {
        status: 500,
      },
    );
  }

  return (
    <>
      <div className="flex justify-center">
        <div className="w-1/2 mt-10">
          <h1 className="font-bold text-5xl mb-5">
            <div dangerouslySetInnerHTML={{ __html: article?.title ?? "" }} />
          </h1>
          {imageUrl ? <img src={imageUrl} className="w-full h-auto object-contain" /> : <div>gk ada gambar</div>}
          {/* ini merender content artikel dari db sebagai html, rentan xss, jadi hati-hati*/}
          <div dangerouslySetInnerHTML={{ __html: article?.content ?? "" }} />
        </div>
      </div>
    </>
  );
}
