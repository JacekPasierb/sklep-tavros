import { ProductCategory, ShopGender } from "../(shop)/product";


export type CollectionGender = "mens" | "womens" | "kids";

export type CollectionDTO = {
  slug: string;
  name: string;
  gender: CollectionGender[];
};

export type ImgInput = {
  src: string;
  uploading?: boolean;
};

export type SectionInput = {
  title: string;
  itemsText: string;
};

export const SIZES = ["XS", "S", "M", "L", "XL", "XXL"] as const;
export type Size = (typeof SIZES)[number];

export type ColorRow = {
  color: string;
  skuPrefix?: string;
  stockBySize: Record<Size, string>;
};

export type AdminProductFormInitial = {
  _id: string;
  title: string;
  slug: string;
  price: number;
  oldPrice: number | null;
  gender: ShopGender;
  category: ProductCategory;
  collectionSlug: string;
  tags: string[];
  images: Array<{src: string; alt?: string; primary?: boolean}>;
  variants: Array<{
    sku?: string;
    size?: string;
    color?: string;
    stock?: number;
  }>;
  summary: string;
  styleCode: string;
  sections: Array<{title: string; items: string[]}>;
  deliveryReturns: {title: string; content: string};
};
