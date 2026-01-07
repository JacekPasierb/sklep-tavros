// src/components/products/ProductOverlay.tsx
import { SaleState } from "../../lib/utils/shop/products/view";

type Props = {
  sale: SaleState;
};

export default function ProductOverlay({ sale }: Props) {
  const { hasSale, isNew, discountPercent } = sale;

  if (!hasSale && !isNew) return null;

  return (
    <>
      {hasSale && (
        <span className="absolute left-2 top-2 z-10 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded shadow-md">
          SALE -{discountPercent}%
        </span>
      )}

      {isNew && (
        <span className="absolute left-2 bottom-2 z-10 inline-flex items-center rounded-full border border-[#F5D96B] bg-black/80 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#F5D96B]">
          NEW
        </span>
      )}
    </>
  );
}
