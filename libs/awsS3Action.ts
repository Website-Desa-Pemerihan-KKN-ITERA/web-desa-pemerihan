"use server";
import { randomUUID } from "crypto";
import { s3Client, s3Conf } from "@/libs/config/awsS3";
import {
  PutObjectCommand,
  GetObjectCommand,
  HeadBucketCommand,
  CreateBucketCommand,
  S3ServiceException,
  ObjectIdentifier,
  DeleteObjectsCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import * as z from "zod";
import { UploadImgMetaSchema } from "./config/fileValidation";

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
  } catch (e) {
    // Casting error 'e' menjadi S3ServiceException agar properti $metadata terbaca
    const error = e as S3ServiceException;

    if (error.$metadata?.httpStatusCode === 404) {
      try {
        await s3Client.send(
          new CreateBucketCommand({ Bucket: s3Conf.BUCKET_NAME }),
        );
        console.log(`Bucket ${s3Conf.BUCKET_NAME} dibuat.`);
        isBucketInitialized = true;
      } catch (createErr) {
        const createError = createErr as S3ServiceException;

        // Cek error name dan status code
        if (
          createError.name === "BucketAlreadyOwnedByYou" ||
          createError.name === "BucketAlreadyExists" ||
          createError.$metadata?.httpStatusCode === 409
        ) {
          isBucketInitialized = true;
        } else {
          console.error("Error creating bucket: ", createError);
          throw createError;
        }
      }
    } else {
      // Jika error bukan 404, lempar kembali
      throw error;
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
          message: "Format file salah atau ukuran file terlalu besar",
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

export async function deleteImgInBucket(objectKey: string[]) {
  try {
    if (!objectKey || objectKey.length === 0) {
      throw new Error("Nama file tidak boleh kosong");
    }

    const objToDel: ObjectIdentifier[] = objectKey.map((key) => ({ Key: key }));

    const command = new DeleteObjectsCommand({
      Bucket: s3Conf.BUCKET_NAME,
      Delete: {
        Objects: objToDel,
        Quiet: false,
      },
    });

    await s3Client.send(command);
  } catch (err) {
    return err;
  }
}
