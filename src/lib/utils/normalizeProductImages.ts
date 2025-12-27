// lib/utils/normalizeProductImages.ts
import type { ProductImage } from "../../types/product";

export function normalizeProductImages(images: ProductImage[] | undefined, max = 5) {
  const safe = (images ?? [])
    .filter((img) => !!img?.src)
    .slice(0, max)
    .map((img) => ({
      src: img.src,
      alt: img.alt ?? "",
      primary: !!img.primary,
    }));

  if (safe.length === 0) return [];

  // jeśli nie ma primary → ustaw pierwszy
  if (!safe.some((i) => i.primary)) safe[0].primary = true;

  // jeśli jest kilka primary → zostaw pierwszy jako primary
  let found = false;
  for (const img of safe) {
    if (img.primary && !found) found = true;
    else if (img.primary && found) img.primary = false;
  }

  return safe;
}
