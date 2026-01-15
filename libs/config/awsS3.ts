import { S3Client } from "@aws-sdk/client-s3";

// found this way from gemini lol, the aws sdk v3 docs is kinda separated and modular
const protocol = process.env.MINIO_USE_SSL === "true" ? "https" : "http";
const endpoint = `${protocol}://${process.env.MINIO_ENDPOINT || "localhost"}:${process.env.MINIO_PORT || "9000"}`;

export const s3Client = new S3Client({
  region: "us-east-1",
  endpoint: process.env.SUPABASE_BUCKET_LINK || endpoint,
  credentials: {
    accessKeyId: process.env.MINIO_ACCESS_KEY!,
    secretAccessKey: process.env.MINIO_SECRET_KEY!,
  },
  forcePathStyle: true, // biar style nya dipaksa gaya minio, bukan gaya aws
});

export const s3Conf = {
  BUCKET_NAME: process.env.MINIO_BUCKET_NAME || "uploads",
  downloadExpiry: 1 * (60 * 60),
  uploadExpiry: 0.12 * (60 * 60), // 5 menit, gw buat gini biar standar aja formatnya jadi cuma perlu ubah digit jam di depannya
};
