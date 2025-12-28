// src/app/(admin)/admin/products/page.tsx
import Link from "next/link";
import {connectToDatabase} from "../../../../lib/mongodb";
import Product from "../../../../models/Product";
import {SectionHeader} from "../../../../components/admin/SectionHeader";
import {ProductRow} from "../../../../components/admin/products/ProductRow";
import {AdminProductsFilters} from "../../../../components/admin/products/AdminProductsFilter";
import {FilterQuery} from "mongoose";

type ProductDocForQuery = {
  title: string;
  slug: string;
  styleCode: string;
  status?: "ACTIVE" | "HIDDEN";
  category?: "TSHIRT" | "HOODIE";
  gender?: "MENS" | "WOMENS" | "KIDS" | "UNISEX";
  collectionSlug?: string;
  variants?: Array<{stock?: number}>;
};

export default async function AdminProductsPage(props: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const searchParams = await props.searchParams;
  await connectToDatabase();
  const where: FilterQuery<ProductDocForQuery> = {};

  // q (title/styleCode/slug)
 
  const q = typeof searchParams.q === "string" ? searchParams.q.trim() : "";
  if (q) {
    where.$or = [
      {title: {$regex: q, $options: "i"}},
      {styleCode: {$regex: q, $options: "i"}},
      {slug: {$regex: q, $options: "i"}},
    ];
  }

  // status
  const status =
    typeof searchParams.status === "string" ? searchParams.status : "";
  if (status === "ACTIVE" || status === "HIDDEN") {
    where.status = status;
  }

  // category
  const category =
    typeof searchParams.category === "string" ? searchParams.category : "";
  if (category === "TSHIRT" || category === "HOODIE") {
    where.category = category;
  }

  // gender
  const gender =
    typeof searchParams.gender === "string" ? searchParams.gender : "";
  if (["MENS", "WOMENS", "KIDS", "UNISEX"].includes(gender)) {
    where.gender = gender;
  }

  // collection
  const collection =
    typeof searchParams.collection === "string"
      ? searchParams.collection.trim()
      : "";
  if (collection) {
    where.collectionSlug = collection;
  }

  // stock (OUT/LOW/GOOD) wg Twojej reguły:
  // OUT: wszystkie 0 -> brak elemMatch stock > 0
  // LOW: istnieje wariant stock < 5 oraz istnieje wariant stock > 0 (żeby nie łapać OUT)
  // GOOD: brak wariantu stock < 5 oraz istnieje wariant stock >= 5
  const stock =
    typeof searchParams.stock === "string" ? searchParams.stock : "";

  if (stock === "OUT") {
    where.variants = {$not: {$elemMatch: {stock: {$gt: 0}}}};
  }

  if (stock === "LOW") {
    where.$and = [
      ...(where.$and ?? []),
      {variants: {$elemMatch: {stock: {$lt: 5}}}},
      {variants: {$elemMatch: {stock: {$gt: 0}}}},
    ];
  }

  if (stock === "GOOD") {
    where.$and = [
      ...(where.$and ?? []),
      {variants: {$not: {$elemMatch: {stock: {$lt: 5}}}}},
      {variants: {$elemMatch: {stock: {$gte: 5}}}},
    ];
  }

  const products = await Product.find(where)
    .sort({createdAt: -1})
    .select({
      title: 1,
      slug: 1,
      styleCode: 1,
      price: 1,
      currency: 1,
      gender: 1,
      status: 1,
      collectionSlug: 1,
      variants: 1,
      category: 1,
      createdAt: 1,
    })
    .limit(200)
    .lean<
      Array<{
        _id: unknown;
        title: string;
        slug: string;
        styleCode: string;
        price: number;
        currency?: string | null;
        gender?: string | null;
        status?: "ACTIVE" | "HIDDEN";
        category?: "TSHIRT" | "HOODIE";
        variants?: Array<{
          sku?: string;
          size?: string;
          color?: string;
          stock?: number;
        }>;
        collectionSlug?: string | null;
        createdAt: Date;
      }>
    >();

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Catalog"
        title="Products"
        description="Create and manage products available in the store."
      />

      <AdminProductsFilters
        defaults={{
          q: typeof searchParams.q === "string" ? searchParams.q : "",
          status:
            typeof searchParams.status === "string" ? searchParams.status : "",
          category:
            typeof searchParams.category === "string"
              ? searchParams.category
              : "",
          gender:
            typeof searchParams.gender === "string" ? searchParams.gender : "",
          collection:
            typeof searchParams.collection === "string"
              ? searchParams.collection
              : "",
          stock:
            typeof searchParams.stock === "string" ? searchParams.stock : "",
        }}
      />

      <div className="flex items-center justify-between gap-3">
        <div className="text-sm text-zinc-600">
          Total:{" "}
          <span className="font-semibold text-black">{products.length}</span>
        </div>

        <Link
          href="/admin/products/new"
          className="rounded-full bg-black px-5 py-2 text-sm font-semibold text-white hover:bg-black/90"
        >
          + Add product
        </Link>
      </div>

      <div className="rounded-3xl border border-zinc-200 bg-white overflow-hidden">
        <div className="hidden sm:block px-5 py-3 border-b border-zinc-200">
          <div className="grid grid-cols-20 gap-4 text-[11px] uppercase tracking-[0.18em] text-zinc-500">
            <div className="col-span-1" />
            <div className="col-span-4">Title</div>
            <div className="col-span-3">StyleCode</div>
            <div className="col-span-2">Category</div>
            <div className="col-span-3">Collection</div>
            <div className="col-span-2">Stock</div>
            <div className="col-span-2 text-right">Price</div>
            <div className="col-span-1">Status</div>
            <div className="col-span-2 text-right">Actions</div>
          </div>
        </div>

        <div className="divide-y divide-zinc-200">
          {products.map((p) => (
            <ProductRow
              key={String(p._id)}
              product={{
                _id: String(p._id),
                title: p.title,
                styleCode: p.styleCode,
                price: p.price,
                currency: p.currency ?? "GBP",
                status: p.status ?? "ACTIVE",
                category: p.category,
                collectionSlug: p.collectionSlug ?? null,
                variants: Array.isArray(p.variants) ? p.variants : [],
              }}
            />
          ))}

          {products.length === 0 ? (
            <div className="px-5 py-10 text-sm text-zinc-600">
              No products yet.
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
