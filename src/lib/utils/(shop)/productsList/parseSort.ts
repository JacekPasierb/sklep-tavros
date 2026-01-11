import { ProductsSort } from "../../../../types/(shop)/productsList";

const ALLOWED_SORTS = ["newest", "price_asc", "price_desc"] as const;

export const parseSort = (value: unknown): ProductsSort | undefined =>
  ALLOWED_SORTS.includes(value as ProductsSort) ? value as ProductsSort : undefined;
