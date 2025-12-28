// src/app/(admin)/admin/products/[id]/edit/page.tsx

import {notFound} from "next/navigation";
import {connectToDatabase} from "../../../../../../lib/mongodb";
import Product from "../../../../../../models/Product";
import {SectionHeader} from "../../../../../../components/admin/SectionHeader";
import {AdminProductForm} from "../../../../../../components/admin/products/AdminProductForm";

type Gender = "MENS" | "WOMENS" | "KIDS";
type Category = "TSHIRT" | "HOODIE";

type ProductLean = {
  _id: unknown;
  title?: string;
  slug?: string;
  price?: number;
  oldPrice?: number | null;
  gender?: Gender;
  category?: Category;
  collectionSlug?: string | null;
  tags?: string[];
  images?: Array<{src: string; alt?: string; primary?: boolean}>;
  variants?: Array<{
    sku?: string;
    size?: string;
    color?: string;
    stock?: number;
  }>;
  summary?: string;
  styleCode?: string;
  sections?: Array<{title: string; items: string[]}>;
  deliveryReturns?: {title?: string; content?: string};
};

export default async function AdminEditProductPage({
  params,
}: {
  params: Promise<{id: string}>;
}) {
  const {id} = await params;
  await connectToDatabase();

  const p = await Product.findById(id).lean<ProductLean>();
  if (!p) return notFound();

  const initialProduct = {
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
    deliveryReturns: p.deliveryReturns ?? {
      title: "Delivery & Returns",
      content: "",
    },
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Catalog"
        title="Edit product"
        description="Update product details."
      />
      <AdminProductForm mode="edit" initialProduct={initialProduct} />
    </div>
  );
}
