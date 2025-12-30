import { ProductCategory, ProductGender } from "../product";

export type ProductLean = {
  _id: unknown;
  title?: string;
  slug?: string;
  price?: number;
  oldPrice?: number | null;
  gender?: ProductGender;
  category?: ProductCategory;
  collectionSlug?: string | null;
  tags?: string[];
  images?: Array<{src: string; alt?: string; primary?: boolean}>;
  variants?: Array<{
    sku?: string;
    size?: string;
    color?: string;
    stock?: number;
  }>;
  summary?: string;
  styleCode?: string;
  sections?: Array<{title: string; items: string[]}>;
  deliveryReturns?: {title?: string; content?: string};
};


