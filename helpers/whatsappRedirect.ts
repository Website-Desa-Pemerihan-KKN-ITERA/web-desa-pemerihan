// https://wa.me/6281234567890?text=Halo%20Budi%2C%20saya%20tertarik%20dengan%20Madu%20Apikalis
const prefix = "https://wa.me/";

export function whatsappRedirect(
  productName: string,
  dialNum: string,
  sellerName: string | null,
): string {
  const name = sellerName ? ` ${sellerName}` : "";
  const message = `Halo${name}, saya tertarik dengan ${productName}`;
  const encodedMessage = encodeURIComponent(message);
  const url = `${prefix}${dialNum}?text=${encodedMessage}`;
  return url;
}
