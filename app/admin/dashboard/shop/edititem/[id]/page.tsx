import { notFound } from "next/navigation";
import { getShopItemDataById } from "@/services/getShopItemDataById-dashboardEditShop";

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
        contact: item.contact,
        description: item.description,
        previewUrl: imageUrl,
    };

    //    return <EditArticleForm initialData={initialData} />;
}

// name: name,
// price: price,
// contact: contact,
// description: description,
// featuredImageUrl: objectName,
