import * as Minio from "minio";

export const minioClient = new Minio.Client({
  endPoint: process.env.MINIO_ENDPOINT || "localhost",
  port: parseInt(process.env.MINIO_PORT || "9000"),
  useSSL: process.env.MINIO_USE_SSL === "true",
  accessKey: process.env.MINIO_ACCESS_KEY!,
  secretKey: process.env.MINIO_SECRET_KEY!,
});

export const minioConf = {
  BUCKET_NAME: process.env.MINIO_BUCKET_NAME || "uploads",
  downloadExpiry: 1 * (60 * 60),
  uploadExpiry: 0.12 * (60 * 60), // 5 menit, gw buat gini biar standar aja formatnya jadi cuma perlu ubah digit jam di depannya
};
