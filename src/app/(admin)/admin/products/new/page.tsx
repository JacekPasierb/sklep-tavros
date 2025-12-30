import {AdminProductForm} from "../../../../../components/admin/products/AdminProductForm";
import SectionHeader from "../../../../../components/admin/SectionHeader";

const AdminNewProductPage = () => {
  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Catalog"
        title="New product"
        description="Create a product (basic fields first — you can extend later)."
      />
      <AdminProductForm mode="create" />
    </div>
  );
};
export default AdminNewProductPage;
