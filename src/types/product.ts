type Variant = {
  size: string;
  sku: string;
  stock: number;
  color: string; 
};

export type TypeProduct = {
  _id: string;
  title: string;
  slug: string;
  price: number;
  oldPrice?: number;
  images?: string[];
  variants?: Variant[];
  currency?: string;
  gender: "MENS" | "WOMENS" | "UNISEX" | "KIDS";
  collectionSlug?: string;
  tags?: string[]; 
};
