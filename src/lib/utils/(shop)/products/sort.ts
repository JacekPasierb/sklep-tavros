import {ProductsSort} from "@/types/(shop)/productsList";

export const buildSort = (sort?: ProductsSort): Record<string, 1 | -1> => {
  if (sort === "price_asc") return {price: 1};
  if (sort === "price_desc") return {price: -1};
  return {createdAt: -1};
};
