// lib/mappers/admin/productEdit.mapper.ts

import {ProductLean} from "../../../types/admin/productEdit";
import {AdminProductFormInitial} from "../../../types/admin/productForm";

export const toAdminProductInitial = (
  p: ProductLean
): AdminProductFormInitial => {
  return {
    _id: String(p._id),
    title: p.title ?? "",
    slug: p.slug ?? "",
    price: Number(p.price ?? 0),
    oldPrice: p.oldPrice ?? null,
    gender: p.gender ?? "MENS",
    category: p.category ?? "TSHIRT",
    collectionSlug: p.collectionSlug ?? "",
    tags: Array.isArray(p.tags) ? p.tags : [],
    images: Array.isArray(p.images) ? p.images : [],
    variants: Array.isArray(p.variants) ? p.variants : [],
    summary: p.summary ?? "",
    styleCode: p.styleCode ?? "",
    sections: Array.isArray(p.sections) ? p.sections : [],
    deliveryReturns: {
      title: p.deliveryReturns?.title ?? "Delivery & Returns",
      content: p.deliveryReturns?.content ?? "",
    },
  };
};
