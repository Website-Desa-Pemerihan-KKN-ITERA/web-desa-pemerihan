"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { getPresignedUploadUrl } from "@/libs/awsS3Action";
import { IoSave } from "react-icons/io5";
import { LuImagePlus, LuPencil } from "react-icons/lu";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

interface ShopItemFormProps {
  initialData: {
    id: number;
    name: string;
    entryFee: number;
    contact: string;
    owner: string;
    description: string;
    mapsUrl: string;
    previewUrl: string[];
    openDay: string[];
    openTimeFrom: Date;
    openTimeTo: Date;
  };
}

const days = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];

export default function EditTourshopForm({ initialData }: ShopItemFormProps) {
  const MAX_IMAGES = 5;
  const router = useRouter();
  const fileInputRef = useRef<(HTMLInputElement | null)[]>([]);
  const existingUrls = initialData.previewUrl;

  const [name, setName] = useState(initialData.name);
  const [price, setPrice] = useState(initialData.entryFee);
  const [contact, setContact] = useState(initialData.contact);
  const [owner, setOwner] = useState(initialData.owner);
  const [mapsUrl, setMapsUrl] = useState(initialData.mapsUrl);
  const [description, setDescription] = useState(initialData.description);
  const [files, setFiles] = useState<(File | null)[]>(
    Array(MAX_IMAGES).fill(null),
  );

  const [openHour, setOpenHour] = useState("08");
  const [openMinute, setOpenMinute] = useState("00");
  const [closeHour, setCloseHour] = useState("17");
  const [closeMinute, setCloseMinute] = useState("00");
  const [selectedDays, setSelectedDays] = useState<string[]>(
    initialData.openDay,
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleDayToggle = (day: string) => {
    if (isLoading) return;

    setSelectedDays((prev) => {
      if (prev.includes(day)) {
        return prev.filter((d) => d !== day);
      } else {
        return [...prev, day];
      }
    });
  };

  const handleCustomClick = (index: number) => {
    if (isLoading) return;
    fileInputRef.current[index]?.click();
  };

  const getPreviewUrl = (index: number) => {
    if (files[index]) {
      return URL.createObjectURL(files[index]!);
    }
    return existingUrls[index] ?? null;
  };

  const handleProcess = async () => {
    const validFiles = files.filter((f): f is File => !!f);
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

    // validasi
    if (name.length < 1) {
      alert(`Nama minimal 1 huruf!`);
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

    setIsLoading(true);

    try {
      const token = localStorage.getItem("auth");

      const filesToUpload = files
        .map((file, index) => ({ file, index }))
        .filter(({ file }) => file !== null) as {
        file: File;
        index: number;
      }[];

      const uploaded = await Promise.all(
        filesToUpload.map(async ({ file, index }) => {
          const result = await getPresignedUploadUrl(
            file.name,
            file.type,
            file.size,
          );

          if (!result.success) {
            throw new Error(result.error.message);
          }
          const { url, objectName } = result.data;

          const res = await fetch(url, {
            method: "PUT",
            body: file,
            headers: { "Content-Type": file.type },
          });

          if (!res.ok) throw new Error("Upload gagal");

          return { index, objectName };
        }),
      );

      const imageUrls = [...existingUrls];

      uploaded.forEach(({ index, objectName }) => {
        imageUrls[index] = objectName;
      });

      const finalOpenDays = days.filter((day) => selectedDays.includes(day));
      const now = new Date();
      const openDate = new Date(now);
      openDate.setHours(Number(openHour), Number(openMinute), 0, 0);
      const closeDate = new Date(now);
      closeDate.setHours(Number(closeHour), Number(closeMinute), 0, 0);

      const res = await fetch(`/api/tourspot/id/${initialData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          entryFee: price,
          contact,
          owner,
          openDay: finalOpenDays,
          mapsUrl,
          openTimeFrom: openDate.toISOString(),
          openTimeTo: closeDate.toISOString(),
          description,
          imagesUrl: imageUrls,
        }),
      });

      if (!res.ok) throw new Error("Update gagal");

      alert("Item berhasil diperbarui!");
      router.push("/admin/dashboard/tourspot");
      router.refresh();
    } catch (err) {
      console.error(err);
      alert("Gagal memperbarui item");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="m-10">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Edit Barang</h1>

      {/* Nama barang */}
      <div className="flex flex-col mb-5">
        <p>Nama Barang:</p>
        <input
          className="border px-2 py-1 border-gray-300 w-1/2 rounded disabled:bg-gray-100 disabled:text-gray-500"
          value={name}
          placeholder="Nama Barang"
          onChange={(e) => setName(e.target.value)}
          disabled={isLoading}
        />
      </div>

      {/* Harga */}
      <div className="flex flex-col mb-5">
        <p>Harga:</p>
        <input
          className="border px-2 py-1 border-gray-300 w-1/3 rounded disabled:bg-gray-100 disabled:text-gray-500"
          type="number"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          disabled={isLoading}
        />
      </div>

      {/* Owner */}
      <div className="flex flex-col mb-5">
        <p>Nama Pemilik/Toko:</p>
        <input
          className="border px-2 py-1 border-gray-300 w-1/3 rounded disabled:bg-gray-100 disabled:text-gray-500"
          placeholder="Dani"
          value={owner}
          onChange={(e) => setOwner(e.target.value)}
          disabled={isLoading}
        />
      </div>

      {/* Contact */}
      <div className="flex flex-col mb-5">
        <p>Nomor Whatsapp:</p>
        <input
          className="border px-2 py-1 border-gray-300 w-1/3 rounded disabled:bg-gray-100 disabled:text-gray-500"
          placeholder="081234567890"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          disabled={isLoading}
        />
      </div>

      {/* Maps Url */}
      <div className="flex flex-col mb-5">
        <p>Link Maps:</p>
        <input
          className="border px-2 py-1 border-gray-300 w-1/3 rounded disabled:bg-gray-100 disabled:text-gray-500"
          placeholder="https://xxxxxxxxxx"
          value={mapsUrl}
          onChange={(e) => setMapsUrl(e.target.value)}
          disabled={isLoading}
        />
      </div>

      {/* Hari */}
      <div className="flex flex-col mb-5">
        <p className="mb-2">Hari Operasional (Pilih Hari):</p>

        <div className="flex flex-wrap gap-4">
          {days.map((day) => (
            <div key={day} className="flex items-center gap-2">
              <input
                type="checkbox"
                id={`day-${day}`}
                value={day}
                checked={selectedDays.includes(day)}
                onChange={() => handleDayToggle(day)}
                className="w-4 h-4 cursor-pointer disabled:cursor-not-allowed"
                disabled={isLoading}
              />
              <label
                htmlFor={`day-${day}`}
                className={`cursor-pointer select-none ${isLoading ? "text-gray-400 cursor-not-allowed" : ""}`}
              >
                {day}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Jam */}
      <div className="flex flex-col mb-5">
        <div>
          <p>Jam Buka:</p>
          <div className="flex items-center gap-2">
            <select
              className="border px-2 py-1 border-gray-300 disabled:bg-gray-100 disabled:text-gray-500"
              value={openHour}
              onChange={(e) => setOpenHour(e.target.value)}
              disabled={isLoading}
            >
              {[...Array(24)].map((_, i) => {
                const hour = String(i).padStart(2, "0");
                return (
                  <option key={hour} value={hour}>
                    {hour}
                  </option>
                );
              })}
            </select>
            <span>:</span>
            <select
              className="border px-2 py-1 border-gray-300 disabled:bg-gray-100 disabled:text-gray-500"
              value={openMinute}
              onChange={(e) => setOpenMinute(e.target.value)}
              disabled={isLoading}
            >
              {[...Array(60)].map((_, i) => {
                const minute = String(i).padStart(2, "0");
                return (
                  <option key={minute} value={minute}>
                    {minute}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
      </div>

      <div className="flex flex-col mb-5">
        <div>
          <p>Jam Tutup:</p>
          <div className="flex items-center gap-2">
            <select
              className="border px-2 py-1 border-gray-300 disabled:bg-gray-100 disabled:text-gray-500"
              value={closeHour}
              onChange={(e) => setCloseHour(e.target.value)}
              disabled={isLoading}
            >
              {[...Array(24)].map((_, i) => {
                const hour = String(i).padStart(2, "0");
                return (
                  <option key={hour} value={hour}>
                    {hour}
                  </option>
                );
              })}
            </select>
            <span>:</span>
            <select
              className="border px-2 py-1 border-gray-300 disabled:bg-gray-100 disabled:text-gray-500"
              value={closeMinute}
              onChange={(e) => setCloseMinute(e.target.value)}
              disabled={isLoading}
            >
              {[...Array(60)].map((_, i) => {
                const minute = String(i).padStart(2, "0");
                return (
                  <option key={minute} value={minute}>
                    {minute}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
      </div>

      {/* Gambar */}
      <div className="flex flex-col mb-5">
        <p className="mb-2">Gambar:</p>

        <div className="flex gap-3 flex-wrap">
          {Array.from({ length: MAX_IMAGES }).map((_, i) => {
            const preview = getPreviewUrl(i);

            return (
              <div key={i} className="flex flex-col items-center">
                {/* hidden file input */}
                <input
                  type="file"
                  accept="image/*"
                  ref={(el) => {
                    fileInputRef.current[i] = el;
                  }}
                  className="hidden"
                  disabled={isLoading}
                  onChange={(e) => {
                    const selected = e.target.files?.[0];
                    if (!selected) return;

                    setFiles((prev) => {
                      const copy = [...prev];
                      copy[i] = selected;
                      return copy;
                    });
                  }}
                />

                {/* Preview / Upload box */}
                {preview ? (
                  <div
                    onClick={() => handleCustomClick(i)}
                    className={`relative overflow-hidden rounded-2xl w-40 h-40 border border-slate-200 group transition
                        ${isLoading ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}
                  >
                    <img
                      src={preview}
                      alt={`preview-${i}`}
                      className={`w-full h-full object-cover transition ${!isLoading && "group-hover:scale-105"}`}
                    />
                    {!isLoading && (
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                        <LuPencil className="text-white text-2xl" />
                      </div>
                    )}
                  </div>
                ) : (
                  <div
                    onClick={() => handleCustomClick(i)}
                    className={`flex items-center justify-center text-sm text-slate-400
                      bg-slate-50 w-40 h-40 rounded-2xl border border-slate-200 
                      flex-col transition ${isLoading ? "cursor-not-allowed opacity-60" : "cursor-pointer hover:bg-slate-100"}`}
                  >
                    <LuImagePlus className="text-2xl mb-2" />
                    <span>Upload</span>
                  </div>
                )}

                <p className="text-xs text-gray-500 mt-2">
                  {files[i]
                    ? "Gambar baru"
                    : existingUrls[i]
                      ? "Gambar lama"
                      : "Kosong"}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Deskripsi */}
      <div className="flex flex-col gap-2 mb-5">
        <p>Deskripsi barang:</p>
        <textarea
          className="border px-2 py-1 border-gray-300 w-full md:w-1/2 rounded min-h-[100px] disabled:bg-gray-100 disabled:text-gray-500"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={isLoading}
        />
      </div>

      {/* Submit */}
      <div className="my-5 flex justify-end md:w-1/2">
        <div
          className={`rounded-2xl text-sm px-4 py-2 font-bold transition shadow-md flex items-center gap-2
            ${
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
