import {ProductRow} from "./ProductRow";

type ProductRowModel = {
  _id: string;
  title: string;
  styleCode: string;
  price: number;
  currency: string;
  status: "ACTIVE" | "HIDDEN";
  category?: "TSHIRT" | "HOODIE";
  collectionSlug?: string | null;
  variants: Array<{
    sku?: string;
    size?: string;
    color?: string;
    stock?: number;
  }>;
};

type Props = {
  products: ProductRowModel[];
};

const AdminProductsList = ({products}: Props) => {
  return (
    <div className="rounded-3xl border border-zinc-200 bg-white overflow-hidden">
      <div className="hidden sm:block px-5 py-3 border-b border-zinc-200">
        <div className="grid grid-cols-20 gap-4 text-[11px] uppercase tracking-[0.18em] text-zinc-500">
          <div className="col-span-1" />
          <div className="col-span-4">Title</div>
          <div className="col-span-3">StyleCode</div>
          <div className="col-span-2">Category</div>
          <div className="col-span-3">Collection</div>
          <div className="col-span-2">Stock</div>
          <div className="col-span-2 text-right">Price</div>
          <div className="col-span-1">Status</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>
      </div>

      <div className="divide-y divide-zinc-200">
        {products.map((p) => (
          <ProductRow key={p._id} product={p} />
        ))}

        {products.length === 0 ? (
          <div className="px-5 py-10 text-sm text-zinc-600">
            No products yet.
          </div>
        ) : null}
      </div>
    </div>
  );
};
export default AdminProductsList;
