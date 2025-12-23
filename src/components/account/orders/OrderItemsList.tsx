// src/components/account/orders/OrderItemsList.tsx
import React from "react";
import Link from "next/link";
import Image from "next/image";
import {AccountOrder} from "../../../types/order";
import {formatPrice} from "../../../lib/utils/orders";

type OrderItemsListProps = {
  order: AccountOrder;
};

export const OrderItemsList: React.FC<OrderItemsListProps> = ({order}) => {
  return (
    <div className="flex-1 space-y-3">
      {order.items.map((item, idx) => {
        const slug = item.productId?.slug;
        const href = slug ? `/product/${slug}` : "#";

        // images: [{ src, alt, primary }]
        const imgObj = item.productId?.images?.[0];
        const imgSrc = imgObj?.src ?? null;
        const imgAlt = imgObj?.alt ?? item.title ?? "Product image";

        const qty = typeof item.qty === "number" ? item.qty : 0;
        const price = typeof item.price === "number" ? item.price : 0;
        const lineTotal = price * qty;

        const productId = item.productId?._id ?? "no-product";
        const sizeKey = item.size ?? "no-size";
        const colorKey = item.color ?? "no-color";

        // ✅ klucz wariantu (unikalny nawet gdy ten sam produkt pojawi się kilka razy)
        const key = `${productId}-${sizeKey}-${colorKey}-${idx}`;

        return (
          <Link
            key={key}
            href={href}
            aria-disabled={!slug}
            className={[
              "flex items-center gap-3 rounded-2xl bg-zinc-50 px-3 py-2.5",
              !slug ? "pointer-events-none opacity-60" : "",
            ].join(" ")}
          >
            <div className="h-16 w-16 overflow-hidden rounded-xl border bg-zinc-100">
              {imgSrc ? (
                <Image
                  src={imgSrc}
                  alt={imgAlt}
                  width={80}
                  height={80}
                  className="h-full w-full object-cover"
                  unoptimized
                />
              ) : (
                <div className="flex h-full items-center justify-center text-[10px] text-zinc-400">
                  No image
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-zinc-900">
                {item.title}
              </p>

              <p className="text-xs text-zinc-500">
                Qty {qty}
                {item.size ? (
                  <span className="ml-2">· Size {item.size}</span>
                ) : null}
                {item.color ? (
                  <span className="ml-2 capitalize">· {item.color}</span>
                ) : null}
              </p>
            </div>

            <div className="shrink-0 text-right">
              <p className="text-sm font-semibold text-zinc-900">
                {formatPrice(lineTotal, order.currency)}
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
};
