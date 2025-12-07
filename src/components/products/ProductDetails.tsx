"use client";
import {useEffect, useMemo, useState} from "react";
import {TypeProduct} from "../../types/product";
import {useSession} from "next-auth/react";
import {useUserFavorites} from "../../lib/useUserFavorites";
import {useFavoritesStore} from "../../store/favoritesStore";
import {Heart, ShoppingBag} from "lucide-react";

import {useUserCart} from "../../lib/useUserCart";

import { useCartStore } from "../../store/cartStore";

interface ProductInfoProps {
  product: TypeProduct;
}

const ProductDetails = ({product}: ProductInfoProps) => {
  

  // ---------- ULUBIONE ----------
  const {status} = useSession();
  const isLoggedIn = status === "authenticated";

  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(true);
  }, []);

  // GUEST – Zustand
  const isFavGuest = useFavoritesStore((s) => s.isFavorite(product._id));
  const toggleGuest = useFavoritesStore((s) => s.toggle);

  // USER – API + SWR (favorites)
  const {
    ids: serverFavIds,
    add,
    remove,
    isLoading: favsLoading,
  } = useUserFavorites(isLoggedIn);

  const isFavUser = useMemo(
    () => serverFavIds?.has(product._id) ?? false,
    [serverFavIds, product._id]
  );

  const [busyFav, setBusyFav] = useState(false);

  const fav = hydrated ? (isLoggedIn ? isFavUser : isFavGuest) : false;
  const favDisabled = busyFav || (isLoggedIn && favsLoading);

  async function toggleFavorite() {
    if (favDisabled) return;

    if (!isLoggedIn) {
      toggleGuest(product._id);
      return;
    }

    try {
      setBusyFav(true);
      if (isFavUser) {
        await remove(product._id);
      } else {
        await add(product._id);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setBusyFav(false);
    }
  }

  // ---------- KOSZYK ----------
  const {addItem, isLoading: cartLoading} = useUserCart();

  // ---------- ROZMIARY / KOLORY / CENY ----------
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [sizeError, setSizeError] = useState(false);

  const variants = useMemo(() => product?.variants ?? [], [product]);

  // czy mamy kolory
  const hasColorVariants = variants.some((v) => v.color);
  const colors = useMemo(() => {
    if (!variants.some((v) => v.color)) return [];
    return Array.from(
      new Set(variants.map((v) => v.color).filter(Boolean))
    );
  }, [variants]);

  // ⭐ domyślny kolor = pierwszy z listy
  useEffect(() => {
    if (hasColorVariants && colors.length && !selectedColor) {
      setSelectedColor(colors[0]);
    }
  }, [hasColorVariants, colors, selectedColor]);

  // rozmiary dla wybranego koloru, albo wszystkie jeśli brak kolorów
  const sizeOptions = hasColorVariants
    ? selectedColor
      ? variants.filter((v) => v.color === selectedColor)
      : []
    : variants;

  const hasSale =
    product.tags?.includes("sale") &&
    typeof product.oldPrice === "number" &&
    product.oldPrice > product.price;

  const formatPrice = (value: number) =>
    Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: product.currency ?? "GBP",
    }).format(value);

  const needsColor = hasColorVariants;

  const disableAdd =
    cartLoading ||
    (!!sizeOptions.length && !selectedSize) ||
    (needsColor && !selectedColor) ||
    isAdding;

    const handleAddToCart = async () => {
      const chosenVariant = variants.find(
        (v) =>
          v.size === selectedSize &&
          (!hasColorVariants || v.color === selectedColor)
      );
    
      if (!chosenVariant) {
        setSizeError(true);
        return;
      }
    
      // --- 1. GOŚĆ → localStorage (Zustand) ---
      if (!isLoggedIn) {
        useCartStore.getState().add({
          key: "", // zostanie wygenerowany
          productId: String(product._id),
          slug: product.slug,
          title: product.title,
          price: product.price,
          image: product.images?.[0],
          qty: 1,
          size: chosenVariant.size,
          color: chosenVariant.color,
        });
    
       
        return;
      }
    
      // --- 2. USER → MongoDB + SWR ---
      try {
        setIsAdding(true);
    
        await addItem({
          productId: String(product._id),
          size: chosenVariant.size,
          color: chosenVariant.color,
          qty: 1,
        });
    
       
      } catch (e) {
        console.error(e);
      } finally {
        setIsAdding(false);
      }
    };
    

  return (
    <div className="mx-auto px-4 lg:sticky lg:top-10 lg:px-0">
      {/* HEADER: title + price + heart */}
      <div className="mt-6 flex items-start justify-between gap-4 lg:mt-0">
        <div>
          <h1 className="text-2xl font-semibold">{product.title}</h1>

          <div className="mt-3 mb-6 flex flex-wrap items-center gap-3">
            <p className="text-2xl font-semibold text-gray-900">
              {formatPrice(product.price ?? 0)}
            </p>

            {hasSale && typeof product.oldPrice === "number" && (
              <p className="text-sm text-gray-400 line-through">
                {formatPrice(product.oldPrice)}
              </p>
            )}
          </div>
        </div>

        {hydrated && (
          <button
            type="button"
            onClick={toggleFavorite}
            disabled={favDisabled}
            className="mt-1 inline-flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 bg-white hover:border-zinc-400 hover:bg-zinc-50 disabled:opacity-50"
            aria-label={fav ? "Remove from wishlist" : "Add to wishlist"}
            aria-pressed={fav}
          >
            <Heart
              className={`h-7 w-7 ${
                fav ? "fill-black text-black" : "text-zinc-700"
              }`}
            />
          </button>
        )}
      </div>

      {/* KOLORY (jeśli są) */}
      {hasColorVariants && colors.length > 0 && (
        <>
          <h2 className="mb-2 text-sm font-medium tracking-wide text-zinc-900">
            Select colour
          </h2>

          <ul className="mb-4 flex flex-wrap gap-2">
            {colors.map((color) => {
              const selected = selectedColor === color;
              return (
                <li key={color}>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedColor(color);
                      setSelectedSize(null);
                      setSizeError(false);
                    }}
                    className={[
                      "group inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium capitalize tracking-wide transition",
                      selected
                        ? "border-black bg-black text-white shadow-sm"
                        : "border-zinc-300 bg-white text-zinc-900 hover:border-black hover:bg-zinc-50",
                    ].join(" ")}
                  >
                    <span
                      className="h-3 w-3 rounded-full border border-zinc-300 group-hover:border-zinc-400"
                      style={{backgroundColor: color || "#ffffff"}}
                      aria-hidden="true"
                    />
                    <span>{color}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </>
      )}

      {/* ROZMIARY */}
      {!!sizeOptions.length && (
        <>
          <h2 className="mb-2 text-sm font-medium tracking-wide text-zinc-900">
            Select size
          </h2>
          {sizeError && (
            <p className="mb-2 text-xs text-red-600">
              Please select a size{needsColor ? " and colour" : ""}.
            </p>
          )}

          <ul className="my-4 grid grid-cols-4 gap-3 sm:grid-cols-4 lg:gap-2">
            {sizeOptions.map((v) => {
              const disabled = v.stock < 1;
              const selected = selectedSize === v.size;

              return (
                <li key={`${v.color ?? "no-color"}-${v.size}`}>
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
                      v.color ? ` ${v.color}` : ""
                    }${disabled ? " (out of stock)" : ""}`}
                    className={[
                      "relative group flex h-11 min-w-[3rem] w-full items-center justify-center rounded-full border text-sm font-medium tracking-wide transition",
                      selected
                        ? "border-black bg-black text-white shadow-sm"
                        : "border-zinc-300 bg-white text-zinc-900 hover:border-black hover:bg-zinc-50",
                      disabled &&
                        "cursor-not-allowed border-zinc-200 bg-zinc-100 text-zinc-400 opacity-60 hover:border-zinc-200 hover:bg-zinc-100",
                    ].join(" ")}
                  >
                    <span>{v.size}</span>

                    {disabled && (
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-black/90 px-3 py-1 text-[11px] font-medium text-white shadow-lg opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity"
                      >
                        Rozmiar niedostępny
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </>
      )}

      {/* ADD TO BAG */}
      <button
        type="button"
        onClick={handleAddToCart}
        disabled={disableAdd}
        className="
          mt-2 inline-flex w-full items-center justify-center gap-2
          rounded-full border border-transparent bg-black
          px-6 py-3 text-sm font-semibold tracking-[0.12em] uppercase
          text-white shadow-sm transition
          hover:bg-black/90 hover:shadow-md
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20
          disabled:cursor-not-allowed disabled:border-zinc-700
          disabled:bg-zinc-900 disabled:text-zinc-400 disabled:shadow-none
        "
        aria-label={isAdding ? "Adding to bag" : "Add to bag"}
      >
        <ShoppingBag className="h-4 w-4" aria-hidden="true" />
        <span>{isAdding ? "Adding..." : "Add to bag"}</span>
      </button>
    </div>
  );
};

export default ProductDetails;
