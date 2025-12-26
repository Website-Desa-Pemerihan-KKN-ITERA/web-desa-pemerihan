"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
import { getPresignedUploadUrl } from "@/libs/minioAction";
import { IoSend } from "react-icons/io5";

// kode ini gunanya biar react quill gk dirender secara ssr di development biar gk error
const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
  loading: () => <p>Loading Editor...</p>,
});

export default function Page() {
  const [value, setValue] = useState("");
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleAddArticle = async (objectName: string) => {
    try {
      const token = localStorage.getItem("auth");

      const res = await fetch("http://localhost:3000/api/article", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: title,
          content: value,
          featuredImageUrl: objectName,
          // additionalImages: ["xxxxxx"]
        }),
      });

      if (!res.ok) {
        throw new Error("Request failed");
      }

      alert("Berhasil terkirim");
    } catch (err) {
      alert("Gagal terkirim");
      console.error(err);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    try {
      const { success, url, objectName, error } = await getPresignedUploadUrl(
        file.name,
        file.type,
      );

      if (!success || !url || !objectName) {
        throw new Error(error || "Gagal mendapatkan URL upload");
      }

      // upload to minio (Direct from Browser)
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

      handleAddArticle(objectName);
    } catch (err: any) {
      console.error(err);
    }
  };

  return (
    <>
      <div className="m-10">
        <div className="flex items-center gap-5 mb-5">
          <p>Judul:</p>
          <input
            className="border px-2 py-1 border-gray-300"
            size={50}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-5 mb-5">
          <p>Gambar utama:</p>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              setFile(e.target.files?.[0] || null);
            }}
            className="flex-1 block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>

        <p>Isi artikel:</p>
        <ReactQuill theme="snow" value={value} onChange={setValue} />

        <div className="my-5 flex justify-end">
          <div
            className="rounded-2xl text-sm px-4 py-2 bg-blue-50 text-blue-700 font-bold cursor-pointer hover:bg-blue-100"
            onClick={handleUpload}
          >
            <div className="flex items-center gap-2">
              <p>Kirim Artikel</p>
              <IoSend />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
