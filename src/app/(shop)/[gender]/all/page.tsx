// Nowy
// app/(shop)/[gender]/all/page.tsx

import ProductsListPage from "../../../../components/products/ProductsListPage";
import {getProducts} from "../../../../lib/products";

type PageProps = {
  params: {gender: "mens" | "womens"};
  searchParams: {[key: string]: string | string[] | undefined};
};

const GenderAllPage = async (props: PageProps) => {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const {gender} = params;

  // 🔹 PAGE
  const pageParam = searchParams.page;
  const currentPage =
    typeof pageParam === "string" && !Number.isNaN(Number(pageParam))
      ? Math.max(1, Number(pageParam))
      : 1;
  // 🔹 SIZES (multi)
  const sizeParam = searchParams.size;
  let sizes: string[] | undefined;

  if (Array.isArray(sizeParam)) {
    sizes = sizeParam;
  } else if (typeof sizeParam === "string") {
    sizes = [sizeParam];
  }
  // 🔹 COLORS (multi)
  const colorParam = searchParams.color;
  let colors: string[] | undefined;

  if (Array.isArray(colorParam)) {
    colors = colorParam;
  } else if (typeof colorParam === "string") {
    colors = [colorParam];
  }

  // 🔹 SORT
  const sortParam = searchParams.sort;
  const sort =
    typeof sortParam === "string"
      ? (sortParam as "newest" | "price_asc" | "price_desc")
      : undefined;

  const {items, total, totalPages, page, limit} = await getProducts({
    gender,
    mode: "all",
    sizes,
    colors,
    page: currentPage,
    limit: 4, // możesz zmienić
    sort,
  });

  return (
    <ProductsListPage
      gender={gender}
      mode="all"
      products={items}
      selectedSizes={sizes}
      selectedColors={colors}
      currentPage={page}
      totalPages={totalPages}
      totalItems={total}
      pageSize={limit}
    />
  );
};

export default GenderAllPage;
