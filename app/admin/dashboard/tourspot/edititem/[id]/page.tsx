import { notFound } from "next/navigation";
import EditTourshopForm from "@/components/nonShared/editTourspotForm";
import { getTourspotData } from "@/services/getTourspotDataById-dashboardEditTourspot";

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

  const [item, imageUrls] = await getTourspotData(itemId);

  if (!item) {
    return notFound();
  }

  const initialData = {
    id: item.id,
    name: item.name,
    entryFee: Number(item.entryFee),
    openDay: item.openDay,
    openTimeFrom: item.openTimeFrom,
    openTimeTo: item.openTimeTo,
    contact: item.contact,
    owner: item.owner,
    mapsUrl: item.mapsUrl,
    description: item.description,
    previewUrl: (imageUrls ?? []).filter(
      (url): url is string => typeof url === "string",
    ),
  };

  return <EditTourshopForm initialData={initialData} />;
}
