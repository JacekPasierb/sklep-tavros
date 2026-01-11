// src/lib/utils/shop/products/view.ts

type ProductLike = {
  _id?: unknown;
  title?: string;
  price: number;
  oldPrice?: number | null;
  tags?: string[] | null;
  images?: Array<{src: string} | string> | null;
  heroImage?: string | null;
};

export type SaleState = {
  hasSale: boolean;
  isNew: boolean;
  discountPercent: number; // 0 jeśli brak sale
};

/**
 * Ustala stan sprzedażowy do UI: SALE / NEW / procent zniżki
 */
export const getSaleState = (product: ProductLike): SaleState => {
  const isNew = Boolean(product.tags?.includes("new"));

  const hasSale =
    Boolean(product.tags?.includes("sale")) &&
    typeof product.oldPrice === "number" &&
    product.oldPrice > product.price;

  const discountPercent = hasSale
    ? Math.round(
        ((product.oldPrice! - product.price) / product.oldPrice!) * 100
      )
    : 0;

  return {hasSale, isNew, discountPercent};
};

/**
 * Zwraca listę URL-i obrazków produktu do galerii/slidera.
 * Obsługuje: images jako {src} albo string, fallback na heroImage.
 */
export const getProductImageUrls = (product: ProductLike): string[] => {
  const urls = (product.images ?? [])
    .map((img) => (typeof img === "string" ? img : img?.src))
    .filter(Boolean) as string[];

  if (urls.length) return urls;

  if (product.heroImage) return [product.heroImage];

  return [];
};
