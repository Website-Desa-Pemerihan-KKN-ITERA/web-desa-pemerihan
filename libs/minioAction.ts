"use server";
import { minioClient, minioConf } from "@/libs/minio";

// ACTION 1: Mendapatkan URL Izin Upload
export async function getPresignedUploadUrl(
  originalName: string,
  type: string,
) {
  try {
    // Pastikan bucket ada (Auto create jika belum ada - opsional)
    const bucketExists = await minioClient.bucketExists(minioConf.BUCKET_NAME);
    if (!bucketExists) {
      await minioClient.makeBucket(minioConf.BUCKET_NAME, "us-east-1");
    }

    // Buat nama file unik agar tidak tertimpa
    const objectName = `${Date.now()}-${originalName.replace(/\s/g, "-")}`;

    const presignedUrl = await minioClient.presignedPutObject(
      minioConf.BUCKET_NAME,
      objectName,
      minioConf.uploadExpiry,
    );

    return { success: true, url: presignedUrl, objectName };
  } catch (error) {
    console.error("Minio Error:", error);
    return { success: false, error: "Gagal generate URL" };
  }
}

// ACTION 2: Mendapatkan URL Izin Download (Read)
export async function getPresignedDownloadUrl(objectName: string) {
  try {
    // Validasi input sederhana
    if (!objectName) {
      throw new Error("Nama file tidak boleh kosong");
    }

    // Generate URL
    const presignedUrl = await minioClient.presignedGetObject(
      minioConf.BUCKET_NAME,
      objectName,
      minioConf.downloadExpiry,
    );

    return { success: true, url: presignedUrl };
  } catch (error) {
    console.error("Minio Download Error:", error);
    return { success: false, error: "Gagal mengambil file" };
  }
}
