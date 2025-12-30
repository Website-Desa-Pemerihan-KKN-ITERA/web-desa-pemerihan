// gw buat gini biar konsisten sama fungsi helper yang lain
// wkwkwk ternyata gw baca baca ginian bisa pake <T> kea template cpp
// mungkin ide bagus untuk buat ini di export jadi generic respon api result
// untuk helper lain
// =========================================== //
// Caution: belum gw coba, tapi harusnya work  //
// =========================================== //
type ApiResult<T> =
  | { success: true; data: T; error?: never }
  | { success: false; error: string; data?: never };

interface Response {
  message: string;
  data: any;
}

export const deleteArticleById = async (
  id: number | string,
  token: string,
): Promise<ApiResult<Response>> => {
  const url = `/api/article/id/${id}`;

  try {
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: result.error || "Gagal menghapus artikel",
      };
    }

    return {
      success: true,
      data: result,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || "Terjadi kesalahan ketike delete",
    };
  }
};
