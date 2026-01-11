export type ShopGender = "mens" | "womens" | "kids";

export type ProductCategory = "TSHIRT" | "HOODIE";
export type ProductStatus = "ACTIVE" | "HIDDEN";

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

  gender: ShopGender;
  collectionSlug?: string;
  tags?: string[];

  // --- CONTENT / DESCRIPTION ---
  summary?: string;
  sections?: ProductSection[];
  styleCode?: string;
  deliveryReturns?: ProductTextBlock;
};
