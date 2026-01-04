import { AdminProductFormInitial } from "../../../../types/admin/productForm";

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
