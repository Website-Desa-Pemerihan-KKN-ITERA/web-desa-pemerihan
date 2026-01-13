"use server";
import { randomUUID } from "crypto";
import { s3Client, s3Conf } from "@/libs/awsS3";
import {
  PutObjectCommand,
  GetObjectCommand,
  HeadBucketCommand,
  CreateBucketCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import * as z from "zod";
import { UploadImgMetaSchema } from "./config/fileValidation";
const UploadSchema = z.object({
  originalName: z.string(),
  type: z.string(),
  size: z.number(),
});

type Error = {
  message: string;
  code: string;
  status: number;
  details?: unknown;
};

type UploadSuccess = {
  url: string;
  objectName: string;
  message: string;
};

type Result<T> = { success: true; data: T } | { success: false; error: Error };

let isBucketInitialized = false;

// mending fungsi ini di taro di tempat lain atau disini?
// kalau di taro di tempat lain sebagai helper ntar tinggal passing by parameter aja
// kenapa begini? karena kalau terus terusan mau cek bucket udah di buat apa belum kan jadi overhead di tiap request
// nah jadi gw buat tuh variable global isBucketInitialized, yang mana jadi tanda apakah bucketInit() udah di jalanin
// atau belum gitu...
// ====================================================================================================================  //
// CAUTION : need futher testing, idk edgecase that i left, remove this section in case its already tested and run fine  //
//           i also do some console print there, checkout, validate it, please FQwawa Femboy lovarusu                    //
//           it runs well when post and get the article but who knows??                                                  //
// ====================================================================================================================  //
export async function bucketInit() {
  if (isBucketInitialized) return;

  try {
    await s3Client.send(new HeadBucketCommand({ Bucket: s3Conf.BUCKET_NAME }));
    isBucketInitialized = true;
  } catch (e: any) {
    if (e.$metadata?.httpStatusCode === 404) {
      try {
        await s3Client.send(
          new CreateBucketCommand({ Bucket: s3Conf.BUCKET_NAME }),
        );
        console.log(`Bucket ${s3Conf.BUCKET_NAME} dibuat.`); // untuk debugging aja
        isBucketInitialized = true;
      } catch (err: any) {
        // mungkin aja bucketnya udah pernah di buat?
        if (
          err.name === "BucketAlreadyOwnedByYou" ||
          err.name === "BucketAlreadyExists" ||
          err.$metadata?.httpStatusCode === 409 // untuk fallback minio, katanya minio return 409, idk if it real or no
        ) {
          isBucketInitialized = true;
        } else {
          console.error("error ketika buat bucket: ", err);
          // debug thing hapus aja kalau udah guarantee gaada bug (it not executed in my case, idk other else tho, so i kept it)
          throw err;
        }
      }
    } else {
      // in case bukan 404
      throw e;
    }
  }
}

export async function getPresignedUploadUrl(
  originalName: string,
  type: string,
  size: number,
): Promise<Result<UploadSuccess>> {
  try {
    await bucketInit();

    console.log(type);
    const fileUpdate = {
      originalName: originalName,
      mimeType: type,
      size: size,
    };

    const fileAudit = UploadImgMetaSchema.safeParse(fileUpdate);

    if (!fileAudit.success) {
      return {
        success: false,
        error: {
          message: "Format file salah",
          code: "VALIDATION_ERROR",
          status: 422,
          details: z.treeifyError(fileAudit.error),
        },
      };
    }

    // making object name from random uuid
    const extension = fileAudit.data.originalName.split(".").pop();
    const objectName = `${randomUUID()}.${extension}`;

    console.log(type);

    const command = new PutObjectCommand({
      Bucket: s3Conf.BUCKET_NAME,
      Key: objectName,
      ContentType: type,
    });

    const presignedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: s3Conf.uploadExpiry,
    });

    return {
      success: true,
      data: {
        url: presignedUrl,
        objectName,
        message: "Presigned upload URL berhasil dibuat",
      },
    };
  } catch (err) {
    console.error("s3 Error:", err);
    return {
      success: false,
      error: {
        message: "Gagal membuat presigned upload URL",
        code: "S3_PRESIGNED_URL_ERROR",
        status: 500,
        details: err instanceof Error ? err.message : err,
      },
    };
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
