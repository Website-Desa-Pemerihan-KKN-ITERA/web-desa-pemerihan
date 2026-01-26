const isObjectKey = (value: string): boolean =>
  !value.startsWith("http://") && !value.startsWith("https://");

export function mergeImages(
  maxImg: number,
  incoming: string[],
  existing: string[],
) {
  const imageArr: string[] = [];
  const imageDelArr: string[] = [];

  for (let i = 0; i < maxImg; i++) {
    const newUrl = incoming?.[i];
    const oldUrl = existing?.[i];

    if (typeof newUrl === "string" && isObjectKey(newUrl)) {
      imageArr.push(newUrl);

      if (typeof oldUrl === "string" && newUrl !== oldUrl) {
        imageDelArr.push(oldUrl);
      }
    } else if (typeof oldUrl === "string") {
      imageArr.push(oldUrl);
    }
  }

  return {
    imageArr: imageArr,
    imageDelArr: imageDelArr,
  };
}
