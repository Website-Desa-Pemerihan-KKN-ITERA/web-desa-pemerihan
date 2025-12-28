"use server";
import { s3Client, minioConf } from "@/libs/minio";
import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export async function getPresignedUploadUrl(
  originalName: string,
  type: string,
) {
  try {
    // Pastikan bucket ada (Auto create jika belum ada - opsional)
    // const bucketExists = await minioClient.bucketExists(minioConf.BUCKET_NAME);
    // if (!bucketExists) {
    //   await minioClient.makeBucket(minioConf.BUCKET_NAME, "us-east-1");
    // }

    const objectName = `${Date.now()}-${originalName.replace(/\s/g, "-")}`;

    const command = new PutObjectCommand({
      Bucket: minioConf.BUCKET_NAME,
      Key: objectName,
      ContentType: type,
    });

    const presignedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: minioConf.uploadExpiry,
    });

    return { success: true, url: presignedUrl, objectName };
  } catch (error) {
    console.error("Minio Error:", error);
    return { success: false, error: "Gagal generate URL" };
  }
}

export async function getPresignedDownloadUrl(objectName: string) {
  try {
    if (!objectName) {
      throw new Error("Nama file tidak boleh kosong");
    }

    const command = new GetObjectCommand({
      Bucket: minioConf.BUCKET_NAME,
      Key: objectName,
    });

    const presignedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: minioConf.downloadExpiry,
    });

    return { success: true, url: presignedUrl };
  } catch (error) {
    console.error("Minio Download Error:", error);
    return { success: false, error: "Gagal mengambil file" };
  }
}
