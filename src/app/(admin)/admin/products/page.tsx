// src/app/(admin)/admin/products/page.tsx
import Link from "next/link";
import {connectToDatabase} from "../../../../lib/mongodb";
import Product from "../../../../models/Product";
import {SectionHeader} from "../../../../components/admin/SectionHeader";

export default async function AdminProductsPage() {
  await connectToDatabase();

  const products = await Product.find({})
    .sort({createdAt: -1})
    .select({
      title: 1,
      slug: 1,
      styleCode: 1,
      price: 1,
      currency: 1,
      gender: 1,
      status: 1,
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
          <div className="grid grid-cols-12 gap-4 text-[11px] uppercase tracking-[0.18em] text-zinc-500">
            <div className="col-span-5">Title</div>
            <div className="col-span-3">StyleCode</div>
            <div className="col-span-2 text-right">Price</div>
            <div className="col-span-2">Created</div>
          </div>
        </div>

        <div className="divide-y divide-zinc-200">
          {products.map((p) => (
            <div key={String(p._id)} className="px-5 py-4">
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-12 sm:gap-4 sm:items-center">
                <div className="sm:col-span-5 min-w-0">
                  <div className="truncate text-sm font-semibold text-black">
                    {p.title}
                  </div>
                  <div className="sm:hidden text-xs text-zinc-500 truncate">
                    {p.styleCode}
                  </div>
                </div>

                <div className="hidden sm:block sm:col-span-3 min-w-0">
                  <div className="truncate text-sm text-zinc-700">
                    {p.styleCode}
                  </div>
                </div>

                <div className="sm:col-span-2 sm:text-right text-sm text-black">
                  {Number(p.price).toFixed(2)}{" "}
                  {(p.currency ?? "GBP").toUpperCase()}
                </div>

                <div className="sm:col-span-2 text-xs text-zinc-500">
                  {new Date(p.createdAt).toLocaleDateString("en-GB")}
                </div>
              </div>
            </div>
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
