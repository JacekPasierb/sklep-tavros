type Variant = {
  size: string;
  sku: string;
  stock: number;
};

export type TypeProduct = {
  _id: string;
  title: string;
  slug: string;
  price: number;
  images?: string[];
  variants?: Variant[];
  currency?: string;
  gender?: string;
  collectionSlug?: string;
};


