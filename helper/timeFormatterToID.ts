export function timeFormatter(iso: string) {
  const date = new Date(iso);
  const formatted = date.toLocaleString("id-ID", {
    timeZone: "Asia/Jakarta",
    dateStyle: "full",
    timeStyle: "medium",
  });

  return formatted;
}
