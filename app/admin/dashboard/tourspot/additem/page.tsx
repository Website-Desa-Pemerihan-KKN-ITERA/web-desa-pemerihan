"use client";
import { useState, useRef } from "react";
import { IoSend } from "react-icons/io5";
import { getPresignedUploadUrl } from "@/libs/awsS3Action";
import { useRouter } from "next/navigation";
import { LuImagePlus } from "react-icons/lu";

const days = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];

export default function Page() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [contact, setContact] = useState("");
  const [owner, setOwner] = useState("");
  const [description, setDescription] = useState("");
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [openHour, setOpenHour] = useState("08");
  const [openMinute, setOpenMinute] = useState("00");
  const [closeHour, setCloseHour] = useState("17");
  const [closeMinute, setCloseMinute] = useState("00");
  const [file, setFile] = useState<(File | null)[]>([]);
  const fileInputRef = useRef<(HTMLInputElement | null)[]>([]);
  const howMuchImages = [0, 1, 2, 3, 4];

  const handleDayToggle = (day: string) => {
    setSelectedDays((prev) => {
      if (prev.includes(day)) {
        return prev.filter((d) => d !== day);
      } else {
        return [...prev, day];
      }
    });
  };

  const handleAddTourSpot = async (objectName: string[]) => {
    try {
      const token = localStorage.getItem("auth");

      if (selectedDays.length === 0) {
        alert("Pilih minimal satu hari operasional!");
        return;
      }

      const finalOpenDays = days.filter((day) => selectedDays.includes(day));
      const now = new Date();
      const openDate = new Date(now);
      openDate.setHours(Number(openHour), Number(openMinute), 0, 0);
      const closeDate = new Date(now);
      closeDate.setHours(Number(closeHour), Number(closeMinute), 0, 0);

      const res = await fetch("/api/tourspot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: name,
          entryFee: price,
          contact: contact,
          owner: owner,
          description: description,
          imagesUrl: objectName,
          openDay: finalOpenDays,
          openTimeFrom: openDate.toISOString(),
          openTimeTo: closeDate.toISOString(),
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
    const validFiles = file.filter((f): f is File => !!f);

    if (validFiles.length === 0) {
      alert("Pilih minimal satu gambar!");
      return;
    }

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

      handleAddTourSpot(uploadedObjectNames);
    } catch (err) {
      console.error("Upload Error:", err);
      alert("Terjadi kesalahan saat mengupload gambar.");
    }
  };

  const handleCustomClick = (index: number) => {
    fileInputRef.current[index]?.click();
  };

  return (
    <>
      <div className="m-10">
        <div className="flex flex-col mb-5">
          <p>Nama Lokasi Pariwisata:</p>
          <input
            className="border px-2 py-1 border-gray-300 w-1/2"
            value={name}
            placeholder="Melloi"
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="flex flex-col mb-5">
          <p>Biaya Masuk:</p>
          <input
            className="border px-2 py-1 border-gray-300 w-1/3"
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
          />
        </div>

        <div className="flex flex-col mb-5">
          <p>Nama Kontak Pemilik/Pengurus Lokasi Pariwisata:</p>
          <input
            className="border px-2 py-1 border-gray-300 w-1/3"
            placeholder="Dani"
            value={owner}
            onChange={(e) => setOwner(e.target.value)}
          />
        </div>

        <div className="flex flex-col mb-5">
          <p>Nomor Whatsapp:</p>
          <input
            className="border px-2 py-1 border-gray-300 w-1/3"
            placeholder="081234567890"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
          />
        </div>

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
                  className="w-4 h-4 cursor-pointer"
                />
                <label
                  htmlFor={`day-${day}`}
                  className="cursor-pointer select-none"
                >
                  {day}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col mb-5">
          <div>
            <p>Jam Buka:</p>
            <div className="flex items-center gap-2">
              <select
                className="border px-2 py-1 border-gray-300"
                value={openHour}
                onChange={(e) => setOpenHour(e.target.value)}
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
                className="border px-2 py-1 border-gray-300"
                value={openMinute}
                onChange={(e) => setOpenMinute(e.target.value)}
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
                className="border px-2 py-1 border-gray-300"
                value={closeHour}
                onChange={(e) => setCloseHour(e.target.value)}
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
                className="border px-2 py-1 border-gray-300"
                value={closeMinute}
                onChange={(e) => setCloseMinute(e.target.value)}
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

        <div className="flex items-start gap-2">
          <span>Gambar: </span>
          {howMuchImages.map((i) => (
            <div key={i}>
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
                />
              </div>

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

        <div className="flex gap-5 mb-5 flex-col md:flex-row">
          <p>Masukan deskripsi barang:</p>
          <textarea
            className="border px-2 py-1 border-gray-300 w-full md:w-1/2"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

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
