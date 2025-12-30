import {
  AdminProductsQuery,
  AdminProductsSearchParams,
  
  StockFilter,
} from "../../../../types/admin/products";
import { ProductCategory, ProductGender, ProductStatus } from "../../../../types/product";

const asString = (v: string | string[] | undefined) => {
  return typeof v === "string" ? v : "";
};

const normalizeText = (v: string) => {
  return v.trim();
};

const isStatus = (v: string): v is ProductStatus => {
  return v === "ACTIVE" || v === "HIDDEN";
};

const isCategory = (v: string): v is ProductCategory => {
  return v === "TSHIRT" || v === "HOODIE";
};

const isGender = (v: string): v is ProductGender => {
  return v === "MENS" || v === "WOMENS" || v === "KIDS" || v === "UNISEX";
};

const isStock = (v: string): v is StockFilter => {
  return v === "" || v === "OUT" || v === "LOW" || v === "GOOD";
};

const normalizeAdminProductsQuery = (
  sp: AdminProductsSearchParams,
  options?: {limit?: number}
): AdminProductsQuery => {
  const limit = options?.limit ?? 200;

  const q = normalizeText(asString(sp.q));
  const statusRaw = asString(sp.status);
  const categoryRaw = asString(sp.category);
  const genderRaw = asString(sp.gender);
  const collection = normalizeText(asString(sp.collection));
  const stockRaw = asString(sp.stock);

  return {
    q,
    status: isStatus(statusRaw) ? statusRaw : "",
    category: isCategory(categoryRaw) ? categoryRaw : "",
    gender: isGender(genderRaw) ? genderRaw : "",
    collection,
    stock: isStock(stockRaw) ? stockRaw : "",
    limit,
  };
};
export default normalizeAdminProductsQuery;
