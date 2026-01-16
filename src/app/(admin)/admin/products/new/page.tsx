
import { AdminProductForm } from "@/components/admin/products/AdminProductForm/AdminProductForm";
import SectionHeader from "@/components/admin/SectionHeader";
import { DEFAULT_PRODUCT_INITIAL } from "@/lib/utils/admin/products/defaultProductInitial";

const AdminNewProductPage = () => {
  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Catalog"
        title="New product"
        description="Create a product (basic fields first — you can extend later)."
      />
      <AdminProductForm mode="create" initialProduct={DEFAULT_PRODUCT_INITIAL}/>
    </div>
  );
};
export default AdminNewProductPage;
