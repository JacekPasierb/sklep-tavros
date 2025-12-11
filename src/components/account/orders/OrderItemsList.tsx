// src/components/account/orders/OrderItemsList.tsx
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { AccountOrder } from "../../../types/order";
import { formatPrice } from "../../../lib/utils/orders";


type OrderItemsListProps = {
  order: AccountOrder;
};

export const OrderItemsList: React.FC<OrderItemsListProps> = ({ order }) => {
  return (
    <div className="flex-1 space-y-3">
      {order.items.map((item, idx) => {
        const img = item.productId?.images?.[0];
        const slug = item.productId.slug;
        const lineTotal = item.price * item.qty;

        return (
          <Link
            key={idx}
            href={`/product/${slug}`}
            className="flex items-center gap-3 rounded-2xl bg-zinc-50 px-3 py-2.5"
          >
            <div className="h-16 w-16 border bg-zinc-100 overflow-hidden">
              {img ? (
                <Image
                  src={img}
                  alt={item.title}
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

            <div className="flex flex-col flex-1">
              <p className="text-sm font-medium text-zinc-900">{item.title}</p>
              <p className="text-xs text-zinc-500">Qty {item.qty}</p>
            </div>

            <div className="text-right">
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
