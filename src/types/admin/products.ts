
import { ProductCategory, ProductGender, ProductStatus } from "../product";



export type StockFilter = "" | "OUT" | "LOW" | "GOOD";

export type AdminProductsSearchParams = Record<
  string,
  string | string[] | undefined
>;

export type AdminProductsQuery = {
  q: string;
  status: "" | ProductStatus;
  category: "" | ProductCategory;
  gender: "" | ProductGender;
  collection: string;
  stock: StockFilter;
  limit: number;
};

export type ProductDocForQuery = {
  title: string;
  slug: string;
  styleCode: string;
  status?: ProductStatus;
  category?: ProductCategory;
  gender?: ProductGender;
  collectionSlug?: string;
  variants?: Array<{stock?: number}>;
};

export type AdminProductListItem = {
  _id: string;
  title: string;
  slug: string;
  styleCode: string;
  price: number;
  currency: string;
  gender?: string | null;
  status: ProductStatus;
  category?: ProductCategory;
  collectionSlug?: string | null;
  variants: Array<{
    sku?: string;
    size?: string;
    color?: string;
    stock?: number;
  }>;
  createdAt: string;
};

export type AdminProductsResult = {
  products: AdminProductListItem[];
  total: number;
  
};
