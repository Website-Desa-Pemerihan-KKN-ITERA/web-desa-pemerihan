export const generateSlug = (text: string) => {
  const date = Date.now();
  const newSlugPrefix = text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
  return newSlugPrefix + "-" + date;
};
