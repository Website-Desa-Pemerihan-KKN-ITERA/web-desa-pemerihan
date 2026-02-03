"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import "react-quill-new/dist/quill.snow.css";
import { getPresignedUploadUrl } from "@/libs/awsS3Action";
import { IoSave } from "react-icons/io5";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
  loading: () => <p>Loading Editor...</p>,
});

interface ArticleFormProps {
  initialData: {
    id: number;
    title: string;
    content: string;
    shortDescription: string;
    previewUrl: string | null;
  };
}

export default function EditArticleForm({ initialData }: ArticleFormProps) {
  const router = useRouter();

  const [value, setValue] = useState(initialData.content);
  const [title, setTitle] = useState(initialData.title);
  const [shortDescription, setShortDescription] = useState(
    initialData.shortDescription,
  );
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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
          shortDescription: shortDescription,
          featuredImageUrl: objectName || undefined,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();

        const message =
          typeof errorData.error === "string"
            ? errorData.error
            : errorData.error?.message || "Request failed";

        throw new Error(message);
      }
      alert("Artikel berhasil diperbarui!");
      router.push("/admin/dashboard/article");
      router.refresh();
    } catch (err) {
      alert("Gagal memperbarui data");
      console.error(err);
      throw err;
    }
  };

  const handleProcess = async () => {
    if (file) {
      // validasi size file di frontend
      const MAX_SIZE_MB = 5;
      const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024; // 5.242.880 MAX_SIZE_BYTE
      const isFileTooLarge = file.size > MAX_SIZE_BYTES;

      if (isFileTooLarge) {
        alert(
          `Salah satu file melebihi ${MAX_SIZE_MB} MB. Harap kompres atau pilih gambar lain.`,
        );
        return;
      }
    }

    if (title.length < 5) {
      alert(`Nama minimal 5 huruf!`);
      return;
    }

    if (shortDescription.length < 5) {
      alert("Deskripsi singkat minimal 5 huruf");
      return;
    }

    if (value.replace(/<(.|\n)*?>/g, "").trim().length < 5) {
      alert("Isi artikel minimal 5 karakter");
      return;
    }

    setIsLoading(true);

    try {
      let uploadedObjectName = null;

      if (!file) {
        await handleUpdateArticle(null);
        return; // Return disini agar tidak lanjut ke upload, finally akan tetap jalan
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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="m-10">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Edit Artikel</h1>

      <div className="flex flex-col mb-5">
        <p className="min-w-[100px]">Judul:</p>
        <input
          className="border px-2 py-1 border-gray-300 w-1/2 disabled:bg-gray-100 disabled:text-gray-500"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={isLoading}
        />
      </div>

      <div className="flex flex-col mb-5">
        <p className="min-w-[100px]">Deskripsi Singkat:</p>
        <input
          className="border px-2 py-1 border-gray-300 w-full disabled:bg-gray-100 disabled:text-gray-500"
          value={shortDescription}
          onChange={(e) => setShortDescription(e.target.value)}
          disabled={isLoading}
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
            disabled={isLoading}
            className="flex-1 block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        <div className="pl-[120px]">
          {currentImagePreview ? (
            <div className="relative w-fit">
              <p className="text-xs text-gray-500 mb-1">Preview saat ini:</p>
              <img
                src={currentImagePreview}
                alt="Preview"
                className={`h-40 object-cover rounded border border-gray-200 transition-opacity ${isLoading ? "opacity-50" : ""}`}
              />
            </div>
          ) : (
            <p className="text-sm text-gray-400 italic">Belum ada gambar</p>
          )}
        </div>
      </div>

      <p className="mb-2">Isi artikel:</p>
      <div
        className={`bg-white transition-opacity ${isLoading ? "pointer-events-none opacity-60" : ""}`}
      >
        <ReactQuill theme="snow" value={value} onChange={setValue} />
      </div>

      <div className="my-5 flex justify-end">
        <div
          className={`rounded-2xl text-sm px-4 py-2 font-bold transition-all shadow-md flex items-center gap-2 ${
            isLoading
              ? "bg-gray-400 text-white cursor-not-allowed shadow-none"
              : "bg-blue-600 text-white cursor-pointer hover:bg-blue-700"
          }`}
          onClick={isLoading ? undefined : handleProcess}
        >
          {isLoading ? (
            <>
              <p>Menyimpan...</p>
              <AiOutlineLoading3Quarters className="animate-spin" />
            </>
          ) : (
            <>
              <p>Simpan Perubahan</p>
              <IoSave />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
