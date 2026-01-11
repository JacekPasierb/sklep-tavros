// src/lib/utils/shop/productsListHeadings.ts

import {ShopGender} from "@/types/(shop)/product";
import {ProductsListMode} from "@/types/(shop)/productsList";

const GENDER_SHORT: Record<ShopGender, string> = {
  mens: "MEN’S",
  womens: "WOMEN’S",
  kids: "KIDS",
};

const GENDER_CLOTHING: Record<ShopGender, string> = {
  mens: "MEN’S — CLOTHING",
  womens: "WOMEN’S — CLOTHING",
  kids: "KIDS — CLOTHING",
};

export function getProductsListHeading(opts: {
  gender: ShopGender;
  mode: ProductsListMode;
  collectionSlug?: string;
}) {
  const {gender, mode, collectionSlug} = opts;

  if (mode === "all") {
    return {
      title: GENDER_CLOTHING[gender],
      description:
        "Our most popular pieces, chosen by customers for quality and design.",
    };
  }

  if (mode === "bestseller") {
    return {
      title: `${GENDER_SHORT[gender]} — BESTSELLERS`,
      description:
        "Discover premium clothing crafted for everyday comfort and timeless style.",
    };
  }

  if (mode === "new") {
    return {
      title: `${GENDER_SHORT[gender]} — NEW IN`,
      description: "Limited offers on selected styles. Don’t miss out.",
    };
  }

  if (mode === "sale") {
    return {
      title: `SALE — ${GENDER_SHORT[gender]} COLLECTION`,
      description: "Limited offers on selected styles. Don’t miss out.",
    };
  }

  if (mode === "collection") {
    const slug = (collectionSlug ?? "").replace(/-/g, " ").toUpperCase();
    return {
      title: `${GENDER_SHORT[gender]} — COLLECTION ${slug}`,
      description: "A curated selection designed to match your style.",
    };
  }

  return {title: GENDER_CLOTHING[gender]};
}
