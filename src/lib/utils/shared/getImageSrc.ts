// lib/utils/getImageSrc.ts
export const getImageSrc = (
  image?: string | {src?: string} | null,
  images?: Array<string | {src?: string}>
) => {
  if (typeof image === "string") return image;
  if (typeof image?.src === "string") return image.src;
  if (typeof images?.[0] === "string") return images[0];
  if (typeof images?.[0]?.src === "string") return images[0].src;
  return "/images/placeholder.webp";
};
