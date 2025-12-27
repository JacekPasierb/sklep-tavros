// src/app/(admin)/admin/products/new/page.tsx
import { AdminCreateProductForm } from "../../../../../components/admin/products/AdminCreateProductForm";
import {SectionHeader} from "../../../../../components/admin/SectionHeader";


export default function AdminNewProductPage() {
  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Catalog"
        title="New product"
        description="Create a product (basic fields first — you can extend later)."
      />
      <AdminCreateProductForm />
    </div>
  );
}
