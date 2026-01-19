import { notFound } from "next/navigation";
import { getArticleDataById } from "@/services/getArticleDataById-dashboardEditArticle";
import EditArticleForm from "@/components/nonShared/editArticleForm";

export default async function EditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const articleId = parseInt(resolvedParams.id);

  if (isNaN(articleId)) {
    return notFound();
  }

  const [article, imageUrl] = await getArticleDataById(articleId);

  if (!article) {
    return notFound();
  }

  const initialData = {
    id: article.id,
    title: article.title,
    content: article.content,
    shortDescription: article.shortDescription,
    previewUrl: imageUrl,
  };

  return <EditArticleForm initialData={initialData} />;
}
