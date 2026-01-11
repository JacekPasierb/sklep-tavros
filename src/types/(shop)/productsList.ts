export type ProductsSort = "newest" | "price_asc" | "price_desc";

export type ProductsListQuery = {
  page: number;
  sizes?: string[];
  colors?: string[];
  sort?: ProductsSort;
};

export type ProductsListMode =
  | "all"
  | "bestseller"
  | "collection"
  | "sale"
  | "new";
