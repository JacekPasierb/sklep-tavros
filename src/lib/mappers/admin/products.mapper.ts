import {AdminProductListItem, ProductRow} from "../../../types/admin/products";

/**
 * Mapper: zamienia rekord produktu z bazy (ProductRow)
 * na format używany w panelu admina (AdminProductListItem).
 */
export const toAdminListItem = (p: ProductRow): AdminProductListItem => {
  return {
    _id: String(p._id),
    title: p.title,
    slug: p.slug,
    styleCode: p.styleCode,
    price: p.price,
    currency: (p.currency ?? "GBP").toUpperCase(),
    gender: p.gender ?? null,
    status: p.status ?? "ACTIVE",
    category: p.category,
    collectionSlug: p.collectionSlug ?? null,
    variants: Array.isArray(p.variants) ? p.variants : [],
    createdAt: p.createdAt.toISOString(),
  };
};
