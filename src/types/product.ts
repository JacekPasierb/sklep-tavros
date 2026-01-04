// types/product.ts
// src/types/product.ts
export type ProductGender = "mens" | "womens" | "kids";
export type ProductCategory = "TSHIRT" | "HOODIE";
export type ProductStatus = "ACTIVE" | "HIDDEN";

export const PRODUCT_GENDERS = ["mens", "womens", "kids"] as const;
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

  images?: ProductImage[]; 
  variants?: Variant[];

  gender: ProductGender;
  collectionSlug?: string;
  tags?: string[];

  // --- CONTENT / DESCRIPTION ---
  summary?: string; 
  sections?: ProductSection[]; 
  styleCode?: string; 
  deliveryReturns?: ProductTextBlock; 
};

// export type ProductInput = Omit<TypeProduct, "_id">;
