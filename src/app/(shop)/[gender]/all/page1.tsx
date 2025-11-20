import ProductCard from "../../components/ProductCard";
import SortSelect from "../../components/SortSelect";
import Pagination from "../../components/Pagination";
import FiltersBar from "../../components/FiltersBar";
import EmptyProducts from "../../components/EmptyProducts";

type Product = {
  _id: string;
  title: string;
  slug: string;
  price: number;
  images?: string[];
};

type Filters = {
  sizes?: string[];
  colors?: string[];
  inStock?: boolean;
};

async function getProducts(
  gender: string,
  page = 1,
  limit = 12,
  sort?: string,
  filters?: Filters,
  bestseller?: boolean
) {
  const base = process.env.NEXTAUTH_URL || ""; // ENV lub z nagłówków
  const url = new URL("/api/products", base);
  url.searchParams.set("gender", gender.toUpperCase());
  url.searchParams.set("page", String(page));
  url.searchParams.set("limit", String(limit));
  if (sort) {
    url.searchParams.set("sort", sort);
  }
  if (bestseller) url.searchParams.set("bestseller", "true");

  if (filters?.sizes?.length) {
    url.searchParams.set("sizes", filters.sizes.join(","));
  }
  if (filters?.colors?.length) {
    url.searchParams.set("colors", filters.colors.join(","));
  }
  if (filters?.inStock) {
    url.searchParams.set("inStock", "true");
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
  params,
  searchParams,
}: {
  params: Promise<{gender: string}>;
  searchParams: Promise<{[key: string]: string | string[] | undefined}>;
}) {
  const {gender} = await params;
  const sp = await searchParams;

  // Helper function to get string value from searchParams
  const getString = (
    value: string | string[] | undefined
  ): string | undefined => {
    if (Array.isArray(value)) return value[0];
    return value;
  };

  // pagination + sort
  const page = Number(getString(sp.page) ?? 1);
  const limit = 4;
  const sort = getString(sp.sort) ?? "newest";

  // filters
  const sizesParam = getString(sp.sizes);
  const colorsParam = getString(sp.colors);
  const sizes = sizesParam ? sizesParam.split(",").filter(Boolean) : [];
  const colors = colorsParam ? colorsParam.split(",").filter(Boolean) : [];
  const inStock = getString(sp.inStock) === "true";

  const {data, total} = await getProducts(gender, page, limit, sort, {
    sizes,
    colors,
    inStock,
  });

  const totalPages = Math.max(1, Math.ceil(total / limit));

  const basePath = `/${gender}/all`;

  return (
    <section className="container mx-auto px-4 py-8">
      <div className="text-center py-4">
        <h1 className="mb-6 text-2xl font-semibold">
          {gender === "mens" ? "MEN’S — CLOTHING" : "WOMEN’S — CLOTHING"}
        </h1>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores
          incidunt fugit ratione ducimus porro praesentium temporibus nam
          consequuntur earum aspernatur?
        </p>
      </div>

      <hr className="my-8 border-neutral-300" />

      {/* SORTOWANIE + ILOŚĆ */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <p className="text-sm text-neutral-500">
          All Products:{" "}
          <span className="font-medium text-neutral-800">{total}</span>
        </p>

        <SortSelect currentSort={sort} />
      </div>

      {/* <hr className="my-8 border-neutral-300" /> */}

      {/* FILTRY */}
      <FiltersBar />

      {/* LISTA PRODUKTÓW */}
      {data.length === 0 ? (
        <EmptyProducts path={basePath} />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 mt-6">
          {data.map((p) => (
            <ProductCard key={p._id} product={p} showHeart />
          ))}
        </div>
      )}

      {/* PAGINACJA */}
      <Pagination
        basePath={basePath}
        page={page}
        totalPages={totalPages}
        query={{
          sort,
          sizes: sizes.length ? sizes.join(",") : undefined,
          colors: colors.length ? colors.join(",") : undefined,
          inStock: inStock ? "true" : undefined,
        }}
      />
    </section>
  );
}
