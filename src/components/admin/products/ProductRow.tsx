"use client";

import Link from "next/link";
import {useMemo, useState} from "react";
import {ProductHiddenToggle} from "./ProductHiddenToggle";
import {
  AdminProductListItem,
  AdminProductVariantRow,
} from "../../../types/admin/products";
import formatMoney from "../../../lib/utils/shop/formatMoney";
import {
  getStockBadgeClass,
  getStockStatus,
} from "../../../lib/utils/admin/products/stock";

type Props = {
  product: AdminProductListItem;
};

export const ProductRow = ({product}: Props) => {
  const [open, setOpen] = useState(false);

  const variants = useMemo<AdminProductVariantRow[]>(() => {
    return Array.isArray(product.variants) ? product.variants : [];
  }, [product.variants]);

  const sorted = useMemo(() => {
    return [...variants].sort((a, b) => {
      const sa = (a.size ?? "").toString();
      const sb = (b.size ?? "").toString();
      return sa.localeCompare(sb);
    });
  }, [variants]);

  const totalStock = useMemo(() => {
    return variants.reduce(
      (sum, v) => sum + Math.max(0, Number(v.stock ?? 0)),
      0
    );
  }, [variants]);

  const stockStatus = useMemo(() => getStockStatus(variants), [variants]);

  return (
    <div className="px-5 py-4">
      {/* ROW */}
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-20 sm:gap-4 sm:items-center">
        {/* Expand */}
        <div className="sm:col-span-1">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-zinc-200 text-zinc-700 hover:bg-zinc-50"
            aria-label={open ? "Collapse variants" : "Expand variants"}
          >
            {open ? "–" : "+"}
          </button>
        </div>

        {/* Title */}
        <div className="sm:col-span-4 min-w-0">
          <div className="truncate text-sm font-semibold text-black">
            {product.title}
            {product.status === "HIDDEN" ? (
              <span className="ml-2 rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-semibold text-zinc-600">
                HIDDEN
              </span>
            ) : null}
          </div>
          <div className="sm:hidden text-xs text-zinc-500 truncate">
            {product.styleCode}
          </div>
        </div>

        {/* StyleCode */}
        <div className="hidden sm:block sm:col-span-3 min-w-0">
          <div className="truncate text-sm text-zinc-700">
            {product.styleCode}
          </div>
        </div>

        {/* Category */}
        <div className="sm:col-span-2 text-xs text-zinc-700">
          {product.category ?? "—"}
        </div>

        {/* Collection */}
        <div className="sm:col-span-3 text-xs text-zinc-700 truncate">
          {product.collectionSlug ?? "—"}
        </div>

        {/* Stock */}
        <div className="sm:col-span-2 text-xs flex items-center justify-start gap-2">
          <span className="font-semibold text-zinc-900">{totalStock}</span>
          <span
            className={[
              "inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold",
              getStockBadgeClass(stockStatus),
            ].join(" ")}
          >
            {stockStatus}
          </span>
        </div>

        {/* Price */}
        <div className="sm:col-span-2 sm:text-right text-sm text-black">
          {formatMoney(product.price)}
        </div>

        {/* Status */}
        <div className="sm:col-span-1">
          <ProductHiddenToggle
            productId={product._id}
            status={product.status ?? "ACTIVE"}
          />
        </div>

        {/* Actions */}
        <div className="sm:col-span-2 sm:text-right text-xs text-zinc-500">
          <Link
            href={`/admin/products/${product._id}/edit`}
            className="font-semibold underline underline-offset-4"
          >
            Edit
          </Link>
        </div>
      </div>

      {/* EXPANDED VARIANTS */}
      {open ? (
        <div className="mt-3 rounded-2xl border border-zinc-200 bg-zinc-50 p-3">
          <div className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">
            Variants
          </div>

          {sorted.length === 0 ? (
            <div className="mt-2 text-sm text-zinc-600">No variants.</div>
          ) : (
            <div className="mt-2 overflow-hidden rounded-xl border border-zinc-200 bg-white">
              <div className="grid grid-cols-12 gap-3 border-b border-zinc-200 px-3 py-2 text-[11px] uppercase tracking-[0.18em] text-zinc-500">
                <div className="col-span-2">Size</div>
                <div className="col-span-3">Color</div>
                <div className="col-span-2 text-right">Stock</div>
                <div className="col-span-5">SKU</div>
              </div>

              <div className="divide-y divide-zinc-200">
                {sorted.map((v, idx) => (
                  <div
                    key={`${v.size ?? "?"}-${v.color ?? "?"}-${idx}`}
                    className="grid grid-cols-12 gap-3 px-3 py-2 text-sm"
                  >
                    <div className="col-span-2 font-semibold text-zinc-900">
                      {v.size ?? "—"}
                    </div>
                    <div className="col-span-3 text-zinc-700">
                      {v.color ?? "—"}
                    </div>
                    <div className="col-span-2 text-right font-semibold text-zinc-900">
                      {Math.max(0, Number(v.stock ?? 0))}
                    </div>
                    <div className="col-span-5 text-zinc-600 truncate">
                      {v.sku?.trim() ? v.sku : "—"}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};
