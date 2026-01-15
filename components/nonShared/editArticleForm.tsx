"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import "react-quill-new/dist/quill.snow.css";
import { getPresignedUploadUrl } from "@/libs/awsS3Action";
import { IoSave } from "react-icons/io5";

const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
  loading: () => <p>Loading Editor...</p>,
});

interface ArticleFormProps {
  initialData: {
    id: number;
    title: string;
    content: string;
    previewUrl: string | null;
  };
}

export default function EditArticleForm({ initialData }: ArticleFormProps) {
  const router = useRouter();

  const [value, setValue] = useState(initialData.content);
  const [title, setTitle] = useState(initialData.title);
  const [file, setFile] = useState<File | null>(null);

  const currentImagePreview = file
    ? URL.createObjectURL(file)
    : initialData.previewUrl;

  const handleUpdateArticle = async (objectName: string | null) => {
    try {
      const token = localStorage.getItem("auth");

      const res = await fetch(`/api/article/id/${initialData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: title,
          content: value,
          featuredImageUrl: objectName || undefined,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Request failed");
      }

      alert("Artikel berhasil diperbarui!");
      router.push("/admin/dashboard/article");
      router.refresh();
    } catch (err) {
      alert("Gagal memperbarui data");
      console.error(err);
    }
  };
  console.log(file?.size);
  const handleProcess = async () => {
    try {
      let uploadedObjectName = null;
      if (!file) {
        await handleUpdateArticle(null);
        return;
      }

      const result = await getPresignedUploadUrl(
        file.name,
        file.type,
        file.size,
      );

      if (!result.success) {
        throw new Error(result.error.message);
      }

      const { url, objectName } = result.data;

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

      await handleUpdateArticle(uploadedObjectName);
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan sistem");
    }
  };

  return (
    <div className="m-10">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Edit Artikel</h1>

      <div className="flex items-center gap-5 mb-5">
        <p className="min-w-[100px]">Judul:</p>
        <input
          className="border px-2 py-1 border-gray-300 w-full rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-2 mb-5">
        <div className="flex items-center gap-5">
          <p className="min-w-[100px]">Gambar:</p>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              setFile(e.target.files?.[0] || null);
            }}
            className="flex-1 block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>

        <div className="pl-[120px]">
          {currentImagePreview ? (
            <div className="relative w-fit">
              <p className="text-xs text-gray-500 mb-1">Preview saat ini:</p>
              <img
                src={currentImagePreview}
                alt="Preview"
                className="h-40 object-cover rounded border border-gray-200"
              />
            </div>
          ) : (
            <p className="text-sm text-gray-400 italic">Belum ada gambar</p>
          )}
        </div>
      </div>

      <p className="mb-2">Isi artikel:</p>
      <div className="bg-white">
        <ReactQuill theme="snow" value={value} onChange={setValue} />
      </div>

      <div className="my-5 flex justify-end">
        <div
          className="rounded-2xl text-sm px-4 py-2 bg-blue-600 text-white font-bold cursor-pointer hover:bg-blue-700 transition-colors shadow-md"
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
