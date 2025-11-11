import ProductCard from "../../components/ProductCard";
import SortSelect from "../../components/SortSelect";

type Product = {
  _id: string;
  title: string;
  slug: string;
  price: number;
  images?: string[];
};

async function getProducts(page = 1, limit = 12, sort?: string) {
  const base = process.env.NEXTAUTH_URL || ""; // ENV lub z nagłówków
  const url = new URL("/api/products", base);
  url.searchParams.set("gender", "MENS");
  url.searchParams.set("page", String(page));
  url.searchParams.set("limit", String(limit));
  if (sort) {
    url.searchParams.set("sort", sort);
  }

  const res = await fetch(url.toString(), {cache: "no-store"});
  if (!res.ok) throw new Error("failed");
  return res.json() as Promise<{
    ok: boolean;
    data: Product[];
    total: number;
    page: number;
    limit: number;
  }>;
}

// ⬇️ W Next 16 searchParams jest Promise — trzeba await
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{page?: string; sort?: string}>;
}) {
  const sp = await searchParams;
  const page = Number(sp.page ?? 1);
  const limit = 4;
  const sort = sp.sort ?? "newest";
console.log("sort",sort);


  const {data, total} = await getProducts(page, limit, sort);
  const totalPages = Math.max(1, Math.ceil(total / limit));
  console.log("da", data);

  return (
    <div className="container mx-auto  px-4 py-8">
      <header className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          {/* <h1 className="text-2xl font-semibold capitalize">{slug}</h1> */}
          <p className="text-sm text-neutral-500">
            All Products:{" "}
            <span className="font-medium text-neutral-800">{total}</span>
          </p>
        </div>
        <SortSelect currentSort={sort} />
      </header>
      <section className="container mx-auto max-w-7xl px-4 py-8">
        <h1 className="mb-6 text-2xl font-semibold">Men’s — All</h1>

        <section className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {data.map((p) => (
            <ProductCard key={p._id} product={p} showHeart={true} />
          ))}
        </section>

        <nav className="mt-8 flex items-center justify-center gap-3 text-sm">
          <a
            className={`rounded border px-3 py-1 ${
              page === 1 ? "pointer-events-none opacity-50" : ""
            }`}
            href={`/mens/all?page=${Math.max(1, page - 1)}${
              sort ? `&sort=${sort}` : ""
            }`}
          >
            ← Prev
          </a>
          <span>
            Page {page} / {totalPages}
          </span>
          <a
            className={`rounded border px-3 py-1 ${
              page >= totalPages ? "pointer-events-none opacity-50" : ""
            }`}
            href={`/mens/all?page=${Math.min(totalPages, page + 1)}${
              sort ? `&sort=${sort}` : ""
            }`}
          >
            Next →
          </a>
        </nav>
      </section>
    </div>
  );
}
