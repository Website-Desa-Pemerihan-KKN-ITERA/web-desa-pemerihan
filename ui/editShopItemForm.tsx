"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { getPresignedUploadUrl } from "@/libs/awsS3Action";
import { IoSave } from "react-icons/io5";
import { LuImagePlus, LuPencil } from "react-icons/lu";

interface ShopItemFormProps {
  initialData: {
    id: number;
    name: string;
    price: number;
    contact: string;
    description: string;
    previewUrl: string | null;
  };
}

export default function EditShopItemForm({ initialData }: ShopItemFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(initialData.name);
  const [price, setPrice] = useState(initialData.price);
  const [contact, setContact] = useState(initialData.contact);
  const [description, setDescription] = useState(initialData.description);

  const [file, setFile] = useState<File | null>(null);

  const currentImagePreview = file
    ? URL.createObjectURL(file)
    : initialData.previewUrl;

  const handleCustomClick = () => {
    fileInputRef.current?.click();
  };

  const handleUpdateItem = async (objectName: string | null) => {
    try {
      const token = localStorage.getItem("auth");

      const res = await fetch(
        `http://localhost:3000/api/shopitem/id/${initialData.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: name,
            price: price,
            contact: contact,
            description: description,
            featuredImageUrl: objectName || undefined,
          }),
        },
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Request failed");
      }

      alert("Item berhasil diperbarui!");
      router.push("/admin/dashboard/shop");
      router.refresh();
    } catch (err: any) {
      alert("Gagal memperbarui: " + err.message);
      console.error(err);
    }
  };

  const handleProcess = async () => {
    try {
      let uploadedObjectName = null;

      if (file) {
        const { success, url, objectName, error } = await getPresignedUploadUrl(
          file.name,
          file.type,
        );

        if (!success || !url || !objectName) {
          throw new Error(error || "Gagal mendapatkan URL upload");
        }

        const uploadRes = await fetch(url, {
          method: "PUT",
          body: file,
          headers: {
            "Content-Type": file.type,
          },
        });

        if (!uploadRes.ok) {
          throw new Error("Gagal upload ke Minio");
        }

        uploadedObjectName = objectName;
      }

      await handleUpdateItem(uploadedObjectName);
    } catch (err: any) {
      console.error(err);
      alert("Terjadi kesalahan sistem saat upload");
    }
  };

  return (
    <div className="m-10">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Edit Barang</h1>

      {/* Input nama barang */}
      <div className="flex flex-col mb-5">
        <p>Nama Barang:</p>
        <input
          className="border px-2 py-1 border-gray-300 w-1/2 rounded" /* keanya bagus pake rounded wkwkwk */
          value={name}
          placeholder="Nama Barang"
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      {/* Input harga barang */}
      <div className="flex flex-col mb-5">
        <p>Harga:</p>
        <input
          className="border px-2 py-1 border-gray-300 w-1/3 rounded"
          type="number"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
        />
      </div>

      {/* Input Contact penjual */}
      <div className="flex flex-col mb-5">
        <p>Nomor Whatsapp:</p>
        <input
          className="border px-2 py-1 border-gray-300 w-1/3 rounded"
          placeholder="081234567890"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
        />
      </div>

      {/* Input gambar (Hidden) */}
      <div className="flex flex-col mb-5">
        <p className="mb-2">Gambar:</p>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={(e) => {
            const selectedFile = e.target.files?.[0];
            setFile(selectedFile || null);
          }}
          className="hidden"
        />

        {/* Custom Image Preview & Trigger */}
        <div className="relative w-fit group">
          {currentImagePreview ? (
            <div
              onClick={handleCustomClick}
              className="cursor-pointer relative overflow-hidden rounded-2xl w-40 h-40 border border-slate-200"
            >
              <img
                src={currentImagePreview}
                alt="Preview"
                className="w-full h-full object-cover hover:scale-105 transition duration-300"
              />
              {/* Overlay icon edit saat hover */}
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                <LuPencil className="text-white text-2xl" />
              </div>
            </div>
          ) : (
            <div
              className="flex items-center justify-center text-sm text-slate-400
                    bg-slate-50 w-32 h-32 rounded-2xl border border-slate-200 cursor-pointer
                    flex-col hover:bg-slate-100 transition"
              onClick={handleCustomClick}
            >
              <LuImagePlus className="text-2xl mb-2" />
              <span>Upload</span>
            </div>
          )}
          <p className="text-xs text-gray-500 mt-2">
            {file ? "Gambar baru terpilih" : "Menggunakan gambar lama"}
          </p>
        </div>
      </div>

      {/* Input deskripsi */}
      <div className="flex flex-col gap-2 mb-5">
        <p>Deskripsi barang:</p>
        <textarea
          className="border px-2 py-1 border-gray-300 w-full md:w-1/2 rounded min-h-[100px]"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      {/* Tombol Simpan */}
      <div className="my-5 flex justify-end md:w-1/2">
        <div
          className="rounded-2xl text-sm px-4 py-2 bg-blue-600 text-white
          font-bold cursor-pointer hover:bg-blue-700 transition shadow-md"
          onClick={handleProcess}
        >
          <div className="flex items-center gap-2">
            <p>Simpan Perubahan</p>
            <IoSave />
          </div>
        </div>
      </div>
    </div>
  );
}
