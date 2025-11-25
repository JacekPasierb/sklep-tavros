import ProductsListPage from "../../../../components/products/ProductsListPage";
import { getProducts } from "../../../lib/products";
import type { SortOption } from "../../../../types/filters";

type PageProps = {
  params: { gender: "mens" | "womens" };
  searchParams: { [key: string]: string | string[] | undefined };
};

export default async function GenderSalePage({ params, searchParams }: PageProps) {
  const { gender } = await params;

  const pageParam = searchParams.page;
  const currentPage =
    typeof pageParam === "string" && !Number.isNaN(Number(pageParam))
      ? Math.max(1, Number(pageParam))
      : 1;

  // sizes
  const sizeParam = searchParams.size;
  const sizes = Array.isArray(sizeParam)
    ? sizeParam
    : typeof sizeParam === "string"
    ? [sizeParam]
    : undefined;

  // colors
  const colorParam = searchParams.color;
  const colors = Array.isArray(colorParam)
    ? colorParam
    : typeof colorParam === "string"
    ? [colorParam]
    : undefined;

  // sort
  const sortParam = searchParams.sort;
  const sort: SortOption =
    typeof sortParam === "string" ? (sortParam as SortOption) : "newest";

  const { items, total, totalPages, page, limit } = await getProducts({
    gender,
    mode: "sale",
    sizes,
    colors,
    page: currentPage,
    limit: 12,
    sort,
  });

  return (
    <ProductsListPage
      gender={gender}
      mode="sale"
      products={items}
      selectedSizes={sizes}
      selectedColors={colors}
      currentPage={page}
      totalPages={totalPages}
      totalItems={total}
      pageSize={limit}
      selectedSort={sort}
    />
  );
}
