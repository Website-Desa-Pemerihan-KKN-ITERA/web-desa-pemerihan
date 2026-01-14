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
  const [file, setFile] = useState<(File | null)[]>([]);
  const fileInputRef = useRef<(HTMLInputElement | null)[]>([]);
  const howMuchImages = [0, 1, 2, 3, 4];

  const handleAddArticle = async (objectName: string[]) => {
    try {
      const token = localStorage.getItem("auth");
      console.log(objectName);

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
    }
  };

  const handleUpload = async () => {
    // A. Filter: Hanya ambil yang bukan null (membuang empty slots)
    // BENAR (Mengecek keberadaan file secara pasti)
    const validFiles = file.filter((f): f is File => !!f);

    if (validFiles.length === 0) {
      alert("Pilih minimal satu gambar!");
      return;
    }

    try {
      // B. Map: Ubah setiap file menjadi sebuah Promise upload
      const uploadPromises = validFiles.map(async (currentFile) => {
        // 1. Get Presigned URL

        const result = await getPresignedUploadUrl(
          currentFile.name,
          currentFile.type,
          currentFile.size,
        );

        if (!result.success) {
          throw new Error(result.error.message);
        }

        const { url, objectName } = result.data;

        // 2. Upload ke MinIO (PUT)
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

        // 3. Return objectName jika sukses
        return objectName;
      });

      // C. Promise.all: Tunggu semua proses upload selesai
      // Hasilnya adalah array berisi objectName yang sukses: ["img1.jpg", "img2.png", ...]

      const uploadedObjectNames = (await Promise.all(uploadPromises)).filter(
        (name): name is string => typeof name === "string",
      );
      if (uploadedObjectNames.length === 0) {
        throw new Error("Tidak ada gambar yang berhasil diupload");
      }

      // D. Panggil fungsi simpan ke DB dengan array hasil upload
      handleAddArticle(uploadedObjectNames);
    } catch (err: any) {
      console.error("Upload Error:", err);
      alert("Terjadi kesalahan saat mengupload gambar.");
    }
  };

  // custom trigger biar minjem fungsi dari <input/> di button custom
  const handleCustomClick = (index: number) => {
    fileInputRef.current[index]?.click();
  };
  console.log(file);

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
                      // 4. LOGIC MENGUBAH ARRAY PADA INDEX TERTENTU
                      setFile((prev) => {
                        const newFiles = [...prev]; // Copy array lama
                        newFiles[i] = selectedFile; // Ubah index ke-i
                        return newFiles; // Simpan array baru
                      });
                    }
                  }}
                  className="hidden"
                />
              </div>

              {/* the real input gambar*/}
              {!file[i] ? (
                <div className="flex">
                  <div
                    className="flex items-center justify-center text-sm text-slate-400
              bg-slate-50 w-30 h-30 rounded-2xl border border-slate-200 cursor-pointer
              mb-5 flex-col hover:bg-slate-100 transition"
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
                  className="flex items-center justify-center text-sm text-slate-400
            bg-slate-50 w-30 h-30 rounded-2xl border border-slate-200 cursor-pointer
            mb-5 flex-col hover:bg-slate-100 transition"
                />
              )}
            </div>
          ))}
        </div>

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
