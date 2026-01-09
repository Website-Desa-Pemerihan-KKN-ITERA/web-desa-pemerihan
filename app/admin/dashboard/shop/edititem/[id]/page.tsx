import { notFound } from "next/navigation";
import { getShopItemDataById } from "@/services/getShopItemDataById-dashboardEditShop";
import EditShopItemForm from "@/ui/editShopItemForm";

export default async function EditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const itemId = parseInt(resolvedParams.id);

  if (isNaN(itemId)) {
    return notFound();
  }

  const [item, imageUrl] = await getShopItemDataById(itemId);

  if (!item) {
    return notFound();
  }

  const initialData = {
    id: item.id,
    name: item.name,
    price: Number(item.price),
    contact: item.contact,
    description: item.description,
    previewUrl: imageUrl,
  };

  return <EditShopItemForm initialData={initialData} />;
}
