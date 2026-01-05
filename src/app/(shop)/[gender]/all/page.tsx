import ProductsListPage from "../../../../components/products/ProductsListPage";
import {
  getProducts,
  getAvailableProductFilters,
} from "../../../../lib/services/shop/products.service";

import {normalizeProductsListQuery} from "../../../../lib/utils/shop/normalizeProductsListQuery";
import {
  ProductsListSearchParams,
  ShopGender,
} from "../../../../types/shop/productsList";

type PageProps = {
  params: {gender: ShopGender};
  searchParams: ProductsListSearchParams;
};

const GenderAllPage = async (props: PageProps) => {
  const {gender} = await props.params;
  const searchParams = await props.searchParams;
  const query = normalizeProductsListQuery(searchParams);

  const [productsRes, filtersRes] = await Promise.all([
    getProducts({
      gender,
      mode: "all",
      sizes: query.sizes,
      colors: query.colors,
      page: query.page,
      limit: 24,
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
