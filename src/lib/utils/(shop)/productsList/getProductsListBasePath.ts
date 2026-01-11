import { ShopGender } from "../../../../types/(shop)/product";
import { ProductsListMode } from "../../../../types/(shop)/productsList";

  
  /**
   * getProductsListBasePath
   *
   * Zwraca bazowy path (bez query string) dla listy produktów.
   * Używane głównie do linku "Reset/Clear filters" oraz EmptyState.
   */
  export const getProductsListBasePath = (opts: {
    gender: ShopGender;
    mode: ProductsListMode;
    collectionSlug?: string;
  }) => {
    const {gender, mode, collectionSlug} = opts;
  
    if (mode === "collection" && collectionSlug) {
      return `/${gender}/collection/${collectionSlug}`;
    }
  
    const map: Record<Exclude<ProductsListMode, "collection">, string> = {
      all: `/${gender}/all`,
      bestseller: `/${gender}/bestseller`,
      sale: `/${gender}/sale`,
      new: `/${gender}/new`,
    };
  
    return map[mode === "collection" ? "all" : mode] ?? `/${gender}/all`;
  };
  