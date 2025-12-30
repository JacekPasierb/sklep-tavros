import Link from "next/link";

type Props = {
  total: number;
};

const AdminProductsTopBar = ({total}: Props) => {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="text-sm text-zinc-600">
        Total: <span className="font-semibold text-black">{total}</span>
      </div>

      <Link
        href="/admin/products/new"
        className="rounded-full bg-black px-5 py-2 text-sm font-semibold text-white hover:bg-black/90"
      >
        + Add product
      </Link>
    </div>
  );
};
export default AdminProductsTopBar;
