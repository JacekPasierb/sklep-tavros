// types/product.ts
// src/types/product.ts
export type ProductGender = "MENS" | "WOMENS" | "KIDS";
export type ProductCategory = "TSHIRT" | "HOODIE";
export type ProductStatus = "ACTIVE" | "HIDDEN";

export const PRODUCT_GENDERS = ["MENS", "WOMENS", "KIDS"] as const;
export const PRODUCT_CATEGORIES = ["TSHIRT", "HOODIE"] as const;
export const PRODUCT_STATUSES = ["ACTIVE", "HIDDEN"] as const;

export type ProductImage = {
  src: string;
  alt?: string;
  primary?: boolean;
};

export type Variant = {
  size?: string;
  sku?: string;
  stock: number;
  color: string;
};

export type ProductSection = {
  title: string;
  items: string[];
};

export type ProductTextBlock = {
  title?: string;
  content?: string;
};

export type TypeProduct = {
  _id: string;

  title: string;
  slug: string;

  price: number;
  oldPrice?: number;
  currency?: string;

  images?: ProductImage[];          // ✅ było string[]
  variants?: Variant[];

  gender: "MENS" | "WOMENS" | "UNISEX" | "KIDS";
  collectionSlug?: string;
  tags?: string[];

  // --- CONTENT / DESCRIPTION ---
  summary?: string;                  // ✅ z modelu
  sections?: ProductSection[];        // ✅ z modelu
  styleCode?: string;                // ✅ z modelu
  deliveryReturns?: ProductTextBlock; // ✅ luźno typowane, bo mongoose default/undefined
};

// export type ProductInput = Omit<TypeProduct, "_id">;