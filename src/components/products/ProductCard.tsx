"use client";

import Link from "next/link";
import Image from "next/image";
import {TypeProduct} from "../../types/product";

type Props = {
  product: TypeProduct;
};

export default function ProductCard({product}: Props) {
  const mainImage = product.images?.[0] ?? "/placeholder.png";
// sprawdzamy czy sale
  const hasSale =
    product.tags?.includes("sale") &&
    typeof product.oldPrice === "number" &&
    product.oldPrice > product.price;

  const discountPercent = hasSale
    ? Math.round(
        ((product.oldPrice! - product.price) / product.oldPrice!) * 100
      )
    : 0;

  const formatPrice = (value: number) =>
    Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: product.currency ?? "GBP",
    }).format(value);
// sprawdzamy czy sale
//sprawdzamy czy new
const isNew = product.tags?.includes("new");

//sprawdzamy czy new

  return (
    <article className="flex flex-col">
      {/* OBRAZEK + BADGE SALE */}
      <Link href={`/product/${product.slug}`} className="block">
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-100 rounded-md">
          
          {/* 🔥 SALE BADGE — czerwone, premium, na obrazku */}
          {hasSale && (
            <span className="
              absolute top-2 left-2 z-[5]
              bg-red-600 text-white 
              text-xs font-bold 
              px-2 py-0.5 rounded 
              shadow-md tracking-wide
            ">
              SALE -{discountPercent}%
            </span>
          )}

          <Image
            src={mainImage}
            alt={product.title}
            fill
            sizes="(min-width: 1024px) 25vw, 50vw"
            className="object-cover transition-transform duration-300 hover:scale-105"
          />


{isNew && (
    <span
      className="absolute bottom-2 left-2 z-[5]
                 inline-flex items-center
                 rounded-full border border-[#F5D96B]
                 bg-black/80 px-2 py-0.5
                 text-[10px] font-semibold uppercase
                 tracking-[0.15em] text-[#F5D96B]
                 shadow-sm"
    >
      NEW MODEL
    </span>
  )}


        </div>
      </Link>

      {/* NAZWA PRODUKTU */}
      <div className="mt-3">
        <Link
          href={`/product/${product.slug}`}
          className="text-sm font-medium text-gray-900 line-clamp-2"
        >
          {product.title}
        </Link>

        {/* CENA */}
        <div className="mt-1 flex items-baseline gap-2">
          {hasSale && product.oldPrice && (
            <span className="text-xs text-gray-400 line-through">
              {formatPrice(product.oldPrice)}
            </span>
          )}

          <span className="text-sm font-semibold text-gray-900">
            {formatPrice(product.price)}
          </span>
        </div>
      </div>
    </article>
  );
}
