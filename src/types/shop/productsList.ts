export type ShopGender = "mens" | "womens" | "kids";

export type ProductsListMode = "all" | "bestseller" | "collection" | "sale" | "new";

export type ProductsListSearchParams = Record<
  string,
  string | string[] | undefined
>;

export type ProductsSort = "newest" | "price_asc" | "price_desc";

export type ProductsListQuery = {
  page: number;
  sizes?: string[];
  colors?: string[];
  sort?: ProductsSort;
};
