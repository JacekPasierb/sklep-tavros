
import {normalizeQuery, ProductsListSearchParams} from "@/lib/utils/(shop)/productsList/normalizeQuery";

import ProductsListPage from "@/components/products/ProductsListPage";
import {
  getProducts,
  getAvailableProductFilters,
} from "@/lib/services/shop/products.service";

import {SHOP_PRODUCTS_PAGE_SIZE} from "@/lib/config/shop/pagination";

import {  ShopGender } from "@/types/(shop)/product";

type PageProps = {
  params: {gender: ShopGender};
  searchParams: ProductsListSearchParams;
};

const GenderAllPage = async (props: PageProps) => {
  const {gender} = await props.params;
  const searchParams = await props.searchParams;
  const query = normalizeQuery(searchParams);
 
  const [productsRes, filtersRes] = await Promise.all([
    getProducts({
      gender,
      mode: "all",
      sizes: query.sizes,
      colors: query.colors,
      page: query.page,
      limit: SHOP_PRODUCTS_PAGE_SIZE,
      sort: query.sort,
    }),

    getAvailableProductFilters({
      gender,
      mode: "all",
    }),
  ]);

  const {items, total, totalPages, page, limit} = productsRes;

  return (
    <ProductsListPage
      gender={gender}
      mode="all"
      products={items}
      selectedSizes={query.sizes}
      selectedColors={query.colors}
      availableSizes={filtersRes.sizes}
      availableColors={filtersRes.colors}
      currentPage={page}
      totalPages={totalPages}
      totalItems={total}
      pageSize={limit}
    />
  );
};

export default GenderAllPage;
