import ProductsListPage from "@/components/products/ProductsListPage";
import { SHOP_PRODUCTS_PAGE_SIZE } from "@/lib/config/shop/pagination";
import {
  getAvailableProductFilters,
  getProducts,
} from "@/lib/services/shop/products.service";
import { normalizeQuery } from "@/lib/utils/(shop)/productsList/normalizeQuery";


import {
  ProductsListSearchParams,
  ShopGender,
} from "@/types/shop/productsList";

type PageProps = {
  params: {gender: ShopGender};
  searchParams: ProductsListSearchParams;
};

const GenderNewPage = async (props: PageProps) => {
  const {gender} = await props.params;
  const searchParams = await props.searchParams;

  const query = normalizeQuery(searchParams);

  const [productsRes, filtersRes] = await Promise.all([
    getProducts({
      gender,
      mode: "new",
      sizes: query.sizes,
      colors: query.colors,
      page: query.page,
      limit: SHOP_PRODUCTS_PAGE_SIZE,
      sort: query.sort,
    }),

    getAvailableProductFilters({
      gender,
      mode: "new",
    }),
  ]);

  const {items, total, totalPages, page, limit} = productsRes;

  return (
    <ProductsListPage
      gender={gender}
      mode="new"
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

export default GenderNewPage;
