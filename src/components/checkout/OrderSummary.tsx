"use client";


import { getImageSrc } from "../../lib/utils/getImageSrc";
import formatMoney from "../../lib/utils/shop/formatMoney";
import { FreeExpressProgress, UiCartItem } from "../../types/checkout";




type Props = {
  items: UiCartItem[];
  itemCount: number;
  subtotal: number;
  shippingCost: number;
  total: number;
  freeExpress: FreeExpressProgress;
};

export default function OrderSummary(props: Props) {
  const { items, itemCount, subtotal, shippingCost, total, freeExpress } = props;

  return (
    <aside className="w-full lg:w-1/3">
      <div className="sticky top-6 space-y-4">
        <div className="rounded-2xl border border-zinc-200 bg-white px-4 py-4 shadow-sm sm:px-5 sm:py-5">
          <h2 className="text-sm font-semibold text-zinc-900">Order summary</h2>
          <p className="mt-1 text-xs text-zinc-500">
            {itemCount} {itemCount === 1 ? "item" : "items"}
          </p>

          <div className="mt-4 space-y-3 max-h-64 overflow-y-auto pr-1">
            {items.map((item) => {
              const img = getImageSrc(
                item.image ?? item.images?.[0] ?? item.heroImage
              );

              return (
                <div
                  key={item.key ?? item.productId}
                  className="flex items-center gap-3"
                >
                  <div className="relative h-16 w-14 flex-shrink-0 overflow-hidden rounded-lg bg-zinc-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img}
                      alt={item.title}
                      className="h-full w-full object-cover"
                    />
                    {Number(item.qty) > 1 && (
                      <span className="absolute right-1 top-1 rounded-full bg-black/80 px-1.5 text-[10px] font-semibold text-white">
                        ×{item.qty}
                      </span>
                    )}
                  </div>

                  <div className="flex-1">
                    <p className="line-clamp-2 text-xs font-medium text-zinc-900">
                      {item.title}
                    </p>
                    <p className="mt-0.5 text-[11px] text-zinc-500">
                      {item.size && <span>Size {item.size}</span>}
                      {item.color && (
                        <span className="ml-2 capitalize">· {item.color}</span>
                      )}
                    </p>
                  </div>

                  <span className="text-xs font-semibold text-zinc-900">
                    {formatMoney(
                      (Number(item.price) || 0) * (Number(item.qty) || 0)
                    )}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mt-4 space-y-2 text-sm">
            <div className="flex items-center justify-between text-xs text-zinc-600">
              <span>Subtotal</span>
              <span className="font-medium text-zinc-900">
                {formatMoney(subtotal)}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs text-zinc-600">
              <span>Shipping</span>
              <span className="font-medium text-zinc-900">
                {itemCount === 0
                  ? "—"
                  : shippingCost === 0
                  ? "Free"
                  : formatMoney(shippingCost)}
              </span>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between border-t border-dashed border-zinc-200 pt-3 text-sm">
            <span className="text-zinc-800">Total</span>
            <span className="text-base font-semibold text-zinc-900">
              {formatMoney(total)}
            </span>
          </div>
        </div>

        {itemCount > 0 && (
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-[11px] text-zinc-700">
            <div className="mb-2 flex items-center justify-between font-medium">
              <span>Shipping perk</span>
              <span className="text-[10px] uppercase tracking-[0.14em] text-zinc-500">
                Free express
              </span>
            </div>

            <p>
              {freeExpress.left > 0 ? (
                <>
                  Add{" "}
                  <span className="font-semibold">
                    {formatMoney(freeExpress.left)}
                  </span>{" "}
                  more to unlock{" "}
                  <span className="font-semibold">free express delivery</span>.
                </>
              ) : (
                <span className="font-semibold text-emerald-600">
                  You unlocked free express delivery on this order.
                </span>
              )}
            </p>

            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-zinc-200">
              <div
                className="h-full rounded-full bg-zinc-900 transition-[width] duration-300"
                style={{ width: `${freeExpress.progress}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
