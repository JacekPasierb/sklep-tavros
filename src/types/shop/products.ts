import {ProductsListMode, ProductsSort, ShopGender} from "./productsList";

export type GetProductsOptions = {
  gender?: ShopGender;
  mode?: ProductsListMode;
  collectionSlug?: string;
  sizes?: string[];
  colors?: string[];
  page?: number;
  limit?: number;
  sort?: ProductsSort;
};

export type ProductsResult<T> = {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};
