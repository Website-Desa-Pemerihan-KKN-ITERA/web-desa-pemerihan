import { notFound } from "next/navigation";
import { getShopItemData } from "@/services/getShopItemDataById-dashboardEditShop";
import EditShopItemForm from "@/components/nonShared/editShopItemForm";

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

  const [item, imageUrls] = await getShopItemData(itemId);

  if (!item) {
    return notFound();
  }

  const initialData = {
    id: item.id,
    name: item.name,
    price: Number(item.price),
    contact: item.contact,
    owner: item.owner,
    description: item.description,
    previewUrl: (imageUrls ?? []).filter(
      (url): url is string => typeof url === "string",
    ),
  };

  return <EditShopItemForm initialData={initialData} />;
}
