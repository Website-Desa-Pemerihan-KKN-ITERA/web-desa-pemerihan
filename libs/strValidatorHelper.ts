import { z } from "zod";

// saya kira beberapa validator string lebih baik di letakan disini,
// in case for reusablity

export const slugSchema = z
  .string()
  .min(1, "Slug tidak boleh kosong")
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Slug hanya boleh huruf kecil, angka, dan dash",
  );
