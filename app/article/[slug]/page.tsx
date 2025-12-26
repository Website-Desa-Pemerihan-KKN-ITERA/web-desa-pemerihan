// "use client";
import { Prisma } from "@/generated/prisma/client";
import prisma from "@/libs/prisma";
import { getPresignedDownloadUrl } from "@/libs/minioAction";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let article
  let imageUrl = null; // Variable untuk menampung URL gambar

  try {
    article = await prisma.article.findUniqueOrThrow({
      where: {
        slug: slug,
      },
    });
    console.log("render: ", article)

    if (article.featuredImageUrl) {
      const result = await getPresignedDownloadUrl(article.featuredImageUrl);
      if (result.success) {
        imageUrl = result.url;
      }
    }
    console.log(imageUrl)
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      switch (err.code) {
        case "P2025":
          return Response.json({ error: "User tidak valid" }, { status: 404 });
        default:
          return Response.json({ error: "Database error" }, { status: 500 });
      }
    }
  }

  return (
    <>
      <div className="mx-80 mt-10">
        <h1 className="font-bold text-5xl mb-5">
          <div
            dangerouslySetInnerHTML={{ __html: article?.title ?? "" }}
          />
        </h1>
        {imageUrl ? (
        <img src={imageUrl}/>
        ): (<div>gk ada gambar</div>)
        }
        {/* ini merender content artikel dari db sebagai html, rentan xss, jadi hati-hati*/}
        <div
          dangerouslySetInnerHTML={{ __html: article?.content ?? "" }}
        />

      </div>
    </>
  );
}
