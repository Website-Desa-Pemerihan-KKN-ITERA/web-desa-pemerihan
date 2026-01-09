"use client";
import { useState, useRef } from "react";
import { IoSend } from "react-icons/io5";
import { getPresignedUploadUrl } from "@/libs/awsS3Action";
import { useRouter } from "next/navigation";
import { LuImagePlus } from "react-icons/lu";

export default function Page() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [contact, setContact] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddArticle = async (objectName: string) => {
    try {
      const token = localStorage.getItem("auth");

      const res = await fetch("http://localhost:3000/api/shopitem", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: name,
          price: price,
          contact: contact,
          description: description,
          featuredImageUrl: objectName,
          // additionalImages: ["xxxxxx"]
        }),
      });

      if (!res.ok) {
        throw new Error("Request failed");
      }

      alert("Berhasil terkirim");
      router.push("/admin/dashboard/shop");
    } catch (err) {
      alert("Gagal terkirim");
      console.error(err);
    }
  };
  console.log(file);

  const handleUpload = async () => {
    if (file.length == 0) return;

    try {
      const { success, url, objectName, error } = await getPresignedUploadUrl(
        file[0].name,
        file[0].type,
      );

      if (!success || !url || !objectName) {
        throw new Error(error || "Gagal mendapatkan URL upload");
      }

      // upload to minio (Direct from Browser)
      const uploadRes = await fetch(url, {
        method: "PUT",
        body: file[0],
        headers: {
          "Content-Type": file[0].type,
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

  // custom trigger biar minjem fungsi dari <input/> di button custom
  const handleCustomClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <div className="m-10">
        {/* Input nama barang */}
        <div className="flex flex-col mb-5">
          <p>Nama Barang:</p>
          <input
            className="border px-2 py-1 border-gray-300 w-1/2"
            value={name}
            placeholder="Melloi"
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* Input harga barang */}
        <div className="flex flex-col mb-5">
          <p>Harga:</p>
          <input
            className="border px-2 py-1 border-gray-300 w-1/3"
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
          />
        </div>

        {/* Input Contact penjual */}
        <div className="flex flex-col mb-5">
          <p>Nomor Whatsapp:</p>
          <input
            className="border px-2 py-1 border-gray-300 w-1/3"
            placeholder="081234567890"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
          />
        </div>

        {/* Input gambar (hidden)*/}
        <div className="flex items-center gap-5">
          <p>Gambar:</p>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={(e) => {
              const selectedFile = e.target.files?.[0];
              if (selectedFile) {
                setFile([selectedFile]);
              }
            }}
            className="hidden"
          />
        </div>

        {/* Custom input image button */}
        {!file[0] ? (
          <div className="flex">
            <div
              className="flex items-center justify-center text-sm text-slate-400
              bg-slate-50 w-30 h-30 rounded-2xl border border-slate-200 cursor-pointer
              mb-5 flex-col hover:bg-slate-100 transition"
              onClick={handleCustomClick}
            >
              <LuImagePlus className="text-2xl mb-2" />
              <span>Tambah</span>
            </div>
          </div>
        ) : (
          <img
            src={URL.createObjectURL(file[0])}
            onClick={handleCustomClick}
            className="flex items-center justify-center text-sm text-slate-400
            bg-slate-50 w-30 h-30 rounded-2xl border border-slate-200 cursor-pointer
            mb-5 flex-col hover:bg-slate-100 transition"
          />
        )}

        {/* Input deskripsi */}
        <div className="flex gap-5 mb-5 flex-col md:flex-row">
          <p>Masukan deskripsi barang:</p>
          <textarea
            className="border px-2 py-1 border-gray-300 w-full md:w-1/2"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Tombol kirim */}
        <div className="my-5 flex justify-end">
          <div
            className="rounded-2xl text-sm px-4 py-2 bg-blue-50 text-blue-700
            font-bold cursor-pointer hover:bg-blue-100 transition"
            onClick={handleUpload}
          >
            <div className="flex items-center gap-2">
              <p>Upload Barang</p>
              <IoSend />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
