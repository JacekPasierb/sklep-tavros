// app/(shop)/[gender]/collection/[collectionSlug]/page.tsx

import ProductsListPage from "../../../../../components/products/ProductsListPage";
import {
  getAvailableProductFilters,
  getProducts,
} from "../../../../../lib/services/shop/products.service";
import {normalizeProductsListQuery} from "../../../../../lib/utils/shop/normalizeProductsListQuery";

import {
  ProductsListSearchParams,
  ShopGender,
} from "../../../../../types/shop/productsList";

type PageProps = {
  params: {
    gender: ShopGender;
    collectionSlug: string;
  };
  searchParams: ProductsListSearchParams;
};

const GenderCollectionPage = async (props: PageProps) => {
  const {gender, collectionSlug} = await props.params;
  const searchParams = await props.searchParams;

  const query = normalizeProductsListQuery(searchParams);

  const [productsRes, filtersRes] = await Promise.all([
    getProducts({
      gender,
      mode: "collection",
      collectionSlug,
      sizes: query.sizes,
      colors: query.colors,
      page: query.page,
      limit: 24,
      sort: query.sort,
    }),

    getAvailableProductFilters({
      gender,
      mode: "collection",
    }),
  ]);

  const {items, total, totalPages, page, limit} = productsRes;

  return (
    <ProductsListPage
      gender={gender}
      mode="collection"
      collectionSlug={collectionSlug}
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
export default GenderCollectionPage;
