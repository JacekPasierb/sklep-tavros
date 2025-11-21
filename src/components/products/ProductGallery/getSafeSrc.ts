// components/product/ProductGallery/getSafeSrc.ts
export const getSafeSrc = (src?: string | null) =>
    typeof src === "string" && src.trim()
      ? src
      : "/placeholder.png";
  