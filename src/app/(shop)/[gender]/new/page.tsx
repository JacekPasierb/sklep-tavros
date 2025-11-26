import ProductsListPage from "../../../../components/products/ProductsListPage";
import { getProducts } from "../../../lib/products";
import type { SortOption } from "../../../../types/filters";

type PageProps = {
  params: { gender: "mens" | "womens" };
  searchParams: { [key: string]: string | string[] | undefined };
};

const GenderNewPage = async (props: PageProps) => {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const { gender } = params;

  // page
  const pageParam = searchParams.page;
  const currentPage =
    typeof pageParam === "string" && !Number.isNaN(Number(pageParam))
      ? Math.max(1, Number(pageParam))
      : 1;

  // sizes
  const sizeParam = searchParams.size;
  const sizes =
    Array.isArray(sizeParam)
      ? (sizeParam as string[])
      : typeof sizeParam === "string"
      ? [sizeParam]
      : undefined;

  // colors
  const colorParam = searchParams.color;
  const colors =
    Array.isArray(colorParam)
      ? (colorParam as string[])
      : typeof colorParam === "string"
      ? [colorParam]
      : undefined;

  // sort
  const sortParam = searchParams.sort;
  const sort: SortOption =
    typeof sortParam === "string" ? (sortParam as SortOption) : "newest";

  const { items, total, totalPages, page, limit } = await getProducts({
    gender,
    mode: "new",
    sizes,
    colors,
    page: currentPage,
    limit: 12,
    sort,
  });

  return (
    <ProductsListPage
      gender={gender}
      mode="new"
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
};

export default GenderNewPage;
