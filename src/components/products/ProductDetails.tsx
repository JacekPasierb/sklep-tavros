"use client";
import {useState} from "react";
// import {useUserCart} from "../../lib/useUserCart";
import {TypeProduct} from "../../types/product";

interface ProductInfoProps {
  product: TypeProduct;
}

const ProductDetails = ({product}: ProductInfoProps) => {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [sizeError, setSizeError] = useState(false);

  const variants = product?.variants ?? [];

  // 🔹 SALE / NEW
  const hasSale =
    product.tags?.includes("sale") &&
    typeof product.oldPrice === "number" &&
    product.oldPrice > product.price;

  const formatPrice = (value: number) =>
    Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: product.currency ?? "GBP",
    }).format(value);

  // const {addItem, isLoading} = useUserCart();
  const handleAddToCart = async () => {
    // TODO: logika koszyka
  };

  return (
    <div className="lg:sticky lg:top-10 px-4 mx-auto lg:px-0">
      {/* Tytuł */}
      <h1 className="mt-6 text-2xl font-semibold lg:mt-0">{product.title}</h1>

      {/* Ceny + badge SALE / NEW */}
      <div className="mt-3 mb-6 flex flex-wrap items-center gap-3">
        {/* aktualna cena */}
        <p className="text-2xl font-semibold text-gray-900">
          {formatPrice(product.price ?? 0)}
        </p>

        {/* stara cena */}
        {hasSale && typeof product.oldPrice === "number" && (
          <p className="text-sm text-gray-400 line-through">
            {formatPrice(product.oldPrice)}
          </p>
        )}
      </div>

      {/* Rozmiary */}
      {!!variants.length && (
        <>
          <h2 className="mb-2 font-medium">Select size:</h2>
          {sizeError && (
            <p className="mb-2 text-sm text-red-600">Please select a size</p>
          )}
          <ul className="grid grid-cols-4 gap-3 sm:grid-cols-4 my-4 lg:gap-2">
            {variants.map((v) => {
              const disabled = v.stock < 1;
              const selected = selectedSize === v.size;
              return (
                <li key={v.size}>
                  <button
                    type="button"
                    onClick={() => {
                      if (!disabled) {
                        setSelectedSize(v.size);
                        setSizeError(false);
                      }
                    }}
                    disabled={disabled}
                    aria-pressed={selected}
                    aria-label={`Size ${v.size}${
                      disabled ? " (out of stock)" : ""
                    }`}
                    className={[
                      "relative w-full border px-0 text-sm transition h-11 min-w-[5rem]",
                      "flex items-center justify-center",
                      selected
                        ? "border-black bg-black text-white"
                        : "border-zinc-300 bg-white text-zinc-900 hover:border-black",
                      disabled &&
                        "cursor-not-allowed border-zinc-200 bg-zinc-50 text-zinc-400 hover:border-zinc-200",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20",
                    ].join(" ")}
                  >
                    <span className="font-medium">{v.size}</span>
                    {disabled && (
                      <span
                        aria-hidden="true"
                        className="absolute inset-0 flex items-center justify-center"
                      >
                        <span className="block h-px w-8 rotate-12 bg-zinc-300" />
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </>
      )}

      {/* Przycisk dodania do koszyka */}
      <button
        type="button"
        onClick={handleAddToCart}
        disabled={(!!variants.length && !selectedSize) || isAdding}
        className="w-full bg-black px-6 py-3 text-white hover:bg-black/90 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isAdding ? "Adding..." : "Add to cart"}
      </button>
    </div>
  );
};

export default ProductDetails;
