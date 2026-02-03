"use client";
import { useState, useRef } from "react";
import { IoSend } from "react-icons/io5";
import { getPresignedUploadUrl } from "@/libs/awsS3Action";
import { useRouter } from "next/navigation";
import { LuImagePlus } from "react-icons/lu";
// [TAMBAH] Import icon loading
import { AiOutlineLoading3Quarters } from "react-icons/ai";

export default function Page() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [contact, setContact] = useState("");
  const [owner, setOwner] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<(File | null)[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fileInputRef = useRef<(HTMLInputElement | null)[]>([]);
  const howMuchImages = [0, 1, 2, 3, 4];

  const handleAddArticle = async (objectName: string[]) => {
    try {
      const token = localStorage.getItem("auth");

      const res = await fetch("/api/shopitem", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: name,
          price: price,
          contact: contact,
          owner: owner,
          description: description,
          imagesUrl: objectName,
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
      throw err;
    }
  };

  const handleUpload = async () => {
    const validFiles = file.filter((f): f is File => !!f);

    if (validFiles.length === 0) {
      alert("Pilih minimal satu gambar!");
      return;
    }

    // validasi size file di frontend
    const MAX_SIZE_MB = 5;
    const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024; // 5.242.880 bytes

    const isFileTooLarge = validFiles.some((f) => f.size > MAX_SIZE_BYTES);

    if (isFileTooLarge) {
      alert(
        `Salah satu file melebihi ${MAX_SIZE_MB} MB. Harap kompres atau pilih gambar lain.`,
      );
      return;
    }

    if (name.length < 2) {
      alert(`Nama minimal 2 huruf!`);
      return;
    }
    if (!contact.startsWith("08") && !contact.startsWith("62")) {
      alert("Nomor telepon wajib di awali dengan 08");
    }
    if (contact.length < 10) {
      alert(`Nomor whatsapp minimal 10 angka!`);
      return;
    }
    if (contact.length > 13) {
      alert(`Nomor whatsapp maksimal 12 angka!`);
      return;
    }
    if (price < 100) {
      alert("Harga minimum 100 rupiah");
    }

    setIsLoading(true);

    try {
      const uploadPromises = validFiles.map(async (currentFile) => {
        const result = await getPresignedUploadUrl(
          currentFile.name,
          currentFile.type,
          currentFile.size,
        );

        if (!result.success) {
          throw new Error(result.error.message);
        }

        const { url, objectName } = result.data;

        const uploadRes = await fetch(url, {
          method: "PUT",
          body: currentFile,
          headers: {
            "Content-Type": currentFile.type,
          },
        });

        if (!uploadRes.ok) {
          throw new Error(`Gagal upload file ${currentFile.name} ke storage`);
        }

        return objectName;
      });

      const uploadedObjectNames = (await Promise.all(uploadPromises)).filter(
        (name): name is string => typeof name === "string",
      );

      if (uploadedObjectNames.length === 0) {
        throw new Error("Tidak ada gambar yang berhasil diupload");
      }

      await handleAddArticle(uploadedObjectNames);
    } catch (err) {
      console.error("Upload Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCustomClick = (index: number) => {
    if (isLoading) return;
    fileInputRef.current[index]?.click();
  };

  return (
    <>
      <div className="m-10">
        {/* Input nama barang */}
        <div className="flex flex-col mb-5">
          <p>Nama Barang:</p>
          <input
            className="border px-2 py-1 border-gray-300 w-1/2 disabled:bg-gray-100 disabled:text-gray-500"
            value={name}
            placeholder="Melloi"
            onChange={(e) => setName(e.target.value)}
            disabled={isLoading}
          />
        </div>

        {/* Input harga barang */}
        <div className="flex flex-col mb-5">
          <p>Harga:</p>
          <input
            className="border px-2 py-1 border-gray-300 w-1/3 disabled:bg-gray-100 disabled:text-gray-500"
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            disabled={isLoading}
          />
        </div>

        {/* Input nama penjual */}
        <div className="flex flex-col mb-5">
          <p>Nama Pemilik/Toko:</p>
          <input
            className="border px-2 py-1 border-gray-300 w-1/3 disabled:bg-gray-100 disabled:text-gray-500"
            placeholder="Dani"
            value={owner}
            onChange={(e) => setOwner(e.target.value)}
            disabled={isLoading}
          />
        </div>

        {/* Input Contact penjual */}
        <div className="flex flex-col mb-5">
          <p>Nomor Whatsapp:</p>
          <input
            className="border px-2 py-1 border-gray-300 w-1/3 disabled:bg-gray-100 disabled:text-gray-500"
            placeholder="081234567890"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <div className="flex items-start gap-2">
          <span>Gambar: </span>
          {howMuchImages.map((i) => (
            <div key={i}>
              {/* Input gambar (hidden)*/}
              <div>
                <input
                  type="file"
                  accept="image/*"
                  ref={(el) => {
                    fileInputRef.current[i] = el;
                  }}
                  onChange={(e) => {
                    const selectedFile = e.target.files?.[0];
                    if (selectedFile) {
                      setFile((prev) => {
                        const newFiles = [...prev];
                        newFiles[i] = selectedFile;
                        return newFiles;
                      });
                    }
                  }}
                  className="hidden"
                  disabled={isLoading}
                />
              </div>

              {/* the real input gambar*/}
              {!file[i] ? (
                <div className="flex">
                  <div
                    className={`flex items-center justify-center text-sm text-slate-400
                      bg-slate-50 w-30 h-30 rounded-2xl border border-slate-200 
                      mb-5 flex-col transition ${isLoading ? "cursor-not-allowed opacity-60" : "cursor-pointer hover:bg-slate-100"}`}
                    onClick={() => handleCustomClick(i)}
                  >
                    <LuImagePlus className="text-2xl mb-2" />
                    <span>Tambah</span>
                  </div>
                </div>
              ) : (
                <img
                  src={URL.createObjectURL(file[i]!)}
                  onClick={() => handleCustomClick(i)}
                  className={`flex items-center justify-center text-sm text-slate-400
                    bg-slate-50 w-30 h-30 rounded-2xl border border-slate-200 
                    mb-5 flex-col transition object-cover ${isLoading ? "cursor-not-allowed opacity-60" : "cursor-pointer hover:bg-slate-100"}`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Input deskripsi */}
        <div className="flex gap-5 mb-5 flex-col md:flex-row">
          <p>Masukan deskripsi barang:</p>
          <textarea
            className="border px-2 py-1 border-gray-300 w-full md:w-1/2 disabled:bg-gray-100 disabled:text-gray-500"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isLoading}
          />
        </div>

        {/* Tombol kirim */}
        <div className="my-5 flex justify-end">
          <div
            className={`rounded-2xl text-sm px-4 py-2 font-bold transition flex items-center gap-2 ${
              isLoading
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-blue-50 text-blue-700 cursor-pointer hover:bg-blue-100"
            }`}
            onClick={isLoading ? undefined : handleUpload}
          >
            {isLoading ? (
              <>
                <p>Sedang Mengupload...</p>
                <AiOutlineLoading3Quarters className="animate-spin" />
              </>
            ) : (
              <>
                <p>Upload Barang</p>
                <IoSend />
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
