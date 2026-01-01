// src/app/(admin)/admin/products/page.tsx

import SectionHeader from "../../../../components/admin/SectionHeader";

import {AdminProductsFilters} from "../../../../components/admin/products/AdminProductsFilter";

import normalizeAdminProductsQuery from "../../../../lib/utils/admin/products/normalizeAdminProductsQuery";
import getAdminProducts from "../../../../lib/services/admin/products.service";
import AdminProductsTopBar from "../../../../components/admin/products/AdminProductsTopBar";
import AdminProductsList from "../../../../components/admin/products/AdminProductsList";

const AdminProductsPage = async (props: {
  searchParams: Record<string, string | string[] | undefined>;
}) => {
  const searchParams = await props.searchParams;
  const query = normalizeAdminProductsQuery(searchParams, {limit: 200});
  const {products, total} = await getAdminProducts(query);

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Catalog"
        title="Products"
        description="Create and manage products available in the store."
      />
      <AdminProductsFilters
        defaults={{
          q: query.q,
          status: query.status,
          category: query.category,
          gender: query.gender,
          collection: query.collection,
          stock: query.stock,
        }}
      />
      <AdminProductsTopBar total={total} />
      <AdminProductsList products={products} />
    </div>
  );
};
export default AdminProductsPage;
