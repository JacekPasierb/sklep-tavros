import { SortOption } from "../filters";

import { ShopGender } from "./productsList";


export type ProductsMode = "all" | "bestseller" | "collection" | "sale" | "new";

export type GetProductsOptions = {
  gender?: ShopGender;         
  mode?: ProductsMode;
  collectionSlug?: string;
  sizes?: string[];
  colors?: string[];
  page?: number;
  limit?: number;
  sort?: SortOption;
};

export type ProductsResult<T> = {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};
