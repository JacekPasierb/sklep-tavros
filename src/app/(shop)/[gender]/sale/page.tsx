import ProductsListPage from "../../../../components/products/ProductsListPage";
import {getProducts} from "../../../../lib/services/shop/products.service";
import {normalizeProductsListQuery} from "../../../../lib/utils/shop/normalizeProductsListQuery";

import {
  ProductsListSearchParams,
  ShopGender,
} from "../../../../types/shop/productsList";

type PageProps = {
  params: {gender: ShopGender};
  searchParams: ProductsListSearchParams;
};

const GenderSalePage = async (props: PageProps) => {
  const {gender} = await props.params;
  const searchParams = await props.searchParams;
  const query = normalizeProductsListQuery(searchParams);

  const {items, total, totalPages, page, limit} = await getProducts({
    gender,
    mode: "sale",
    sizes: query.sizes,
    colors: query.colors,
    page: query.page,
    limit: 12,
    sort: query.sort,
  });

  return (
    <ProductsListPage
      gender={gender}
      mode="sale"
      products={items}
      selectedSizes={query.sizes}
      selectedColors={query.colors}
      currentPage={page}
      totalPages={totalPages}
      totalItems={total}
      pageSize={limit}
      selectedSort={query.sort}
    />
  );
};
export default GenderSalePage;
