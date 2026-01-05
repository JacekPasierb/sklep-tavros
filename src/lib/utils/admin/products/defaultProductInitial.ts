import { AdminProductFormInitial } from "../../../../types/admin/productForm";
/**
 * DEFAULT_PRODUCT_INITIAL
 *
 * Domyślny stan początkowy formularza produktu w panelu admina
 * używany w trybie "create".
 *
 * Zapewnia:
 * - kompletne, bezpieczne dane startowe (bez undefined),
 * - spójność formularza,
 * - możliwość użycia jednego formularza dla trybu create i edit.
 *
 * ❗ To NIE jest model bazy danych ani payload API.
 * Jest to wyłącznie struktura UI dla AdminProductForm.
 */

export const DEFAULT_PRODUCT_INITIAL: AdminProductFormInitial = {
  _id: "",
  title: "",
  slug: "",
  price: 0,
  oldPrice: null,
  gender: "mens",
  category: "TSHIRT",
  collectionSlug: "",
  tags: [],
  images: [],
  variants: [],
  summary: "",
  styleCode: "",
  sections: [{ title: "Details", items: [] }],
  deliveryReturns: { title: "Delivery & Returns", content: "" },
};
