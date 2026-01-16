// src/app/(admin)/admin/products/[id]/edit/page.tsx

import {notFound} from "next/navigation";

import SectionHeader from "@/components/admin/SectionHeader";
import {AdminProductForm} from "@/components/admin/products/AdminProductForm/AdminProductForm";
import {getProductLeanById} from "@/lib/services/admin/productEdit.service";
import {toAdminProductInitial} from "@/lib/mappers/admin/productEdit.mapper";

const AdminEditProductPage = async ({
  params,
}: {
  params: Promise<{id: string}>;
}) => {
  const {id} = await params;
  const p = await getProductLeanById(id);
  if (!p) return notFound();

  const initialProduct = toAdminProductInitial(p);
  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Catalog"
        title="Edit product"
        description="Update product details."
      />
      <AdminProductForm mode="edit" initialProduct={initialProduct} />
    </div>
  );
};
export default AdminEditProductPage;
