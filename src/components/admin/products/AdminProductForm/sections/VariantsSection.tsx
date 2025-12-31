import { ColorRow, Size, SIZES } from "../../../../../types/admin/productForm";
import { ProductCategory } from "../../../../../types/product";



type Props = {
  category: ProductCategory;
  colorRows: ColorRow[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onChangeRow: (index: number, patch: Partial<ColorRow>) => void;
  onChangeStock: (index: number, size: Size, value: string) => void;
};

export function VariantsSection({
  category,
  colorRows,
  onAdd,
  onRemove,
  onChangeRow,
  onChangeStock,
}: Props) {
  return (
    <div className="rounded-3xl border border-zinc-200 bg-white p-4 sm:p-5 space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">
            Stock by color (sizes are fixed)
          </p>
          <p className="text-sm text-zinc-600">
            Dodajesz kolor, a potem wpisujesz stock dla:{" "}
            <span className="font-semibold text-black">{SIZES.join(", ")}</span>.
          </p>
        </div>

        <button
          type="button"
          onClick={onAdd}
          className="rounded-full border border-zinc-200 bg-white px-4 py-2 text-xs font-semibold hover:bg-zinc-50"
        >
          + Add color
        </button>
      </div>

      <div className="space-y-3">
        {colorRows.map((row, i) => (
          <div key={i} className="rounded-2xl border border-zinc-200 bg-zinc-50/50 p-3 space-y-3">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-12 items-end">
              <div className="sm:col-span-5">
                <label className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">
                  Color
                </label>
                <input
                  value={row.color}
                  onChange={(e) => onChangeRow(i, { color: e.target.value })}
                  className="mt-2 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-2 text-sm outline-none focus:border-black"
                  placeholder="black"
                />
              </div>

              <div className="sm:col-span-5">
                <label className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">
                  SKU prefix (optional)
                </label>
                <input
                  value={row.skuPrefix ?? ""}
                  onChange={(e) => onChangeRow(i, { skuPrefix: e.target.value })}
                  className="mt-2 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-2 text-sm outline-none focus:border-black"
                  placeholder={`TVR-${category}-BLK`}
                />
              </div>

              <div className="sm:col-span-2 flex sm:justify-end">
                <button
                  type="button"
                  onClick={() => onRemove(i)}
                  disabled={colorRows.length <= 1}
                  className="w-full rounded-full border border-zinc-200 bg-white px-4 py-2 text-xs font-semibold hover:bg-zinc-50 disabled:opacity-50"
                >
                  Remove
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-6">
              {SIZES.map((size) => (
                <div key={size}>
                  <label className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">
                    {size}
                  </label>
                  <input
                    value={row.stockBySize[size]}
                    onChange={(e) => onChangeStock(i, size, e.target.value)}
                    inputMode="numeric"
                    className="mt-2 w-full rounded-2xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-black"
                    placeholder="0"
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
