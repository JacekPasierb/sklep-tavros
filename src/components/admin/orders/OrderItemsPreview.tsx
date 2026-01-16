import type {PublicOrderItem} from "@/types/admin/orders";

export default function OrderItemsPreview({items}: {items: PublicOrderItem[]}) {
  if (!items?.length) {
    return (
      <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-600">
        No items.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
      <div className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">
        Items
      </div>

      <div className="mt-3 space-y-2">
        {items.map((it, idx) => (
          <div
            key={`${it.slug ?? it.title ?? "item"}-${idx}`}
            className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-zinc-200 bg-white px-3 py-2"
          >
            <div className="min-w-0">
              <div className="truncate text-sm font-medium text-zinc-900">
                {it.title || it.slug || "Item"}
              </div>
              <div className="mt-0.5 text-xs text-zinc-600">
                Qty: {it.qty ?? 0}
                {"  •  "}
                {it.size ? `Size: ${it.size}` : "Size: —"}
                {"  •  "}
                {it.color ? `Color: ${it.color}` : "Color: —"}
              </div>
            </div>

            <div className="shrink-0 text-sm font-semibold text-zinc-900">
              {typeof it.price === "number" ? it.price.toFixed(2) : "—"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
