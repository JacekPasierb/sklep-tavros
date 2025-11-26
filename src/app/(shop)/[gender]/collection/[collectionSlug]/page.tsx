// app/(shop)/[gender]/collection/[collectionSlug]/page.tsx

import ProductsListPage from "../../../../../components/products/ProductsListPage";

import type {SortOption} from "../../../../../types/filters";
import {getProducts} from "../../../../../lib/products";

type PageProps = {
  params: {
    gender: "mens" | "womens";
    collectionSlug: string;
  };
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
};

export default async function GenderCollectionPage(props: PageProps) {
  const params = await props.params;
  const searchParams = await props.searchParams;

  const {gender, collectionSlug} = params;

  // 🔹 page
  const pageParam = searchParams.page;
  const currentPage =
    typeof pageParam === "string" && !Number.isNaN(Number(pageParam))
      ? Math.max(1, Number(pageParam))
      : 1;

  // 🔹 sizes (multi)
  const sizeParam = searchParams.size;
  let sizes: string[] | undefined;

  if (Array.isArray(sizeParam)) {
    sizes = sizeParam as string[];
  } else if (typeof sizeParam === "string") {
    sizes = [sizeParam];
  }

  // 🔹 colors (multi)
  const colorParam = searchParams.color;
  let colors: string[] | undefined;

  if (Array.isArray(colorParam)) {
    colors = colorParam as string[];
  } else if (typeof colorParam === "string") {
    colors = [colorParam];
  }

  // 🔹 sort
  const sortParam = searchParams.sort;
  const sort: SortOption =
    typeof sortParam === "string" ? (sortParam as SortOption) : "newest";

  const {items, total, totalPages, page, limit} = await getProducts({
    gender,
    mode: "collection",
    collectionSlug,
    sizes,
    colors,
    page: currentPage,
    limit: 12,
    sort,
  });

  return (
    <ProductsListPage
      gender={gender}
      mode="collection"
      collectionSlug={collectionSlug}
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
