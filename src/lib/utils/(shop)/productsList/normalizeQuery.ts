// normalizeQuery zamienia nieprzewidywalne searchParams z URL-a na bezpieczny,
// przewidywalny obiekt, którego możesz spokojnie używać w serwisach i DB. //

import {ProductsListQuery} from "../../../../types/(shop)/productsList";
import {parsePositiveInt} from "../../shared/number";
import {normalizeSizes} from "./normalizeSizes";
import {parseSort} from "./parseSort";
import {toStringArray} from "./toStringArray";

export type ProductsListSearchParams = Record<
  string,
  string | string[] | undefined
>;
export const normalizeQuery = (
  sp: ProductsListSearchParams
): ProductsListQuery => {
  const pageValue =
    typeof sp.page === "string"
      ? sp.page
      : Array.isArray(sp.page)
      ? sp.page[0]
      : undefined;

  return {
    page: parsePositiveInt(pageValue, 1),
    sizes: normalizeSizes(sp.size),
    colors: toStringArray(sp.color),
    sort: parseSort(sp.sort),
  };
};
