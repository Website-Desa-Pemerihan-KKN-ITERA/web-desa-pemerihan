"use server";
import { randomUUID } from "crypto";
import { s3Client, s3Conf } from "@/libs/awsS3";
import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export async function getPresignedUploadUrl(
  originalName: string,
  type: string,
) {
  try {
    // Pastikan bucket ada (Auto create jika belum ada - opsional)
    // const bucketExists = await s3Client.bucketExists(minioConf.BUCKET_NAME);
    // if (!bucketExists) {
    //   await s3Client.makeBucket(minioConf.BUCKET_NAME, "us-east-1");
    // }

    // making object name from random uuid
    const extension = originalName.split(".").pop();
    const objectName = `${randomUUID()}.${extension}`;

    const command = new PutObjectCommand({
      Bucket: s3Conf.BUCKET_NAME,
      Key: objectName,
      ContentType: type,
    });

    const presignedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: s3Conf.uploadExpiry,
    });

    return { success: true, url: presignedUrl, objectName };
  } catch (error) {
    console.error("s3 Error:", error);
    return { success: false, error: "Gagal generate URL" };
  }
}

export async function getPresignedDownloadUrl(objectName: string) {
  try {
    if (!objectName) {
      throw new Error("Nama file tidak boleh kosong");
    }

    const command = new GetObjectCommand({
      Bucket: s3Conf.BUCKET_NAME,
      Key: objectName,
    });

    const presignedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: s3Conf.downloadExpiry,
    });

    return { success: true, url: presignedUrl };
  } catch (error) {
    console.error("s3 Download Error:", error);
    return { success: false, error: "Gagal mengambil file" };
  }
}
