"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
import { getPresignedUploadUrl } from "@/libs/awsS3Action";
import { IoSend } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

// kode ini gunanya biar react quill gk dirender secara ssr di development biar gk error
const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
  loading: () => <p>Loading Editor...</p>,
});

export default function Page() {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [title, setTitle] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddArticle = async (objectName: string) => {
    try {
      const token = localStorage.getItem("auth");
      // kalo post ini gagal atau batal disimpen ntar di backend udah otomatis ngehapus gambar yang kekirim lewat featuredImageUrl
      const res = await fetch("/api/article", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: title,
          content: value,
          shortDescription: shortDescription,
          featuredImageUrl: objectName,
        }),
      });

      if (!res.ok) {
        throw new Error("Request failed");
      }

      alert("Berhasil terkirim");
      router.push("/admin/dashboard/article");
    } catch (err) {
      alert("Gagal terkirim");
      console.error(err);
      throw err;
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Mohon pilih gambar terlebih dahulu");
      return;
    }
    // validasi size file di frontend
    const MAX_SIZE_MB = 5;
    const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024; // 5.242.880 bytes

    const isFileTooLarge = file.size > MAX_SIZE_BYTES;

    if (isFileTooLarge) {
      alert(
        `Salah satu file melebihi ${MAX_SIZE_MB} MB. Harap kompres atau pilih gambar lain.`,
      );
      return;
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
      const result = await getPresignedUploadUrl(
        file.name,
        file.type,
        file.size,
      );

      if (!result.success) {
        throw new Error(result.error.message);
      }

      const { url, objectName } = result.data;

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

      // run fungsi handleAddArticle setelah selesai kirim gambar ke s3
      await handleAddArticle(objectName);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="m-10">
        <div className="flex flex-col mb-5">
          <p>Judul:</p>
          <input
            className="border px-2 py-1 border-gray-300 w-1/2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <div className="flex flex-col mb-5">
          <p>Deskripsi Singkat:</p>
          <input
            className="border px-2 py-1 border-gray-300 w-full"
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
            disabled={isLoading}
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
            disabled={isLoading}
            className="text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
          />
        </div>

        <p>Isi artikel:</p>
        <div className={isLoading ? "pointer-events-none opacity-60" : ""}>
          <ReactQuill theme="snow" value={value} onChange={setValue} />
        </div>

        <div className="my-5 flex justify-end">
          <div
            className={`rounded-2xl text-sm px-4 py-2 font-bold transition-all ${
              isLoading
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-blue-50 text-blue-700 cursor-pointer hover:bg-blue-100"
            }`}
            onClick={isLoading ? undefined : handleUpload}
          >
            <div className="flex items-center gap-2">
              {isLoading ? (
                <>
                  <p>Sedang Mengirim...</p>
                  <AiOutlineLoading3Quarters className="animate-spin" />
                </>
              ) : (
                <>
                  <p>Kirim Artikel</p>
                  <IoSend />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
