// components/products/ProductCard.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import {Heart} from "lucide-react";
import {useSession} from "next-auth/react";
import {useEffect, useMemo, useState} from "react";

import {TypeProduct} from "../../types/product";

import {useUserFavorites} from "../../lib/hooks/useUserFavorites";
import {TrashX} from "../icons/TrashX";
import {useFavoritesStore} from "../../store/favoritesStore";
import { isCustomerSession } from "../../lib/utils/isCustomer";

type Props = {
  product: TypeProduct;
  showHeart?: boolean; // na liście true, na stronie /favorites można dać false
  onRemoved?: (id: string) => void;
};

const ProductCard = ({product, showHeart = true, onRemoved}: Props) => {
  const {data: session, status} = useSession();
  const isCustomer = isCustomerSession(session, status);
  


  // const isLoggedIn = status === "authenticated";

  // 👇 prosty, standardowy guard na hydrację (żeby SSR == 1. render klienta)
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(true);
  }, []);

  // ------- GUEST (Zustand) -------
  const isFavGuest = useFavoritesStore((s) => s.isFavorite(product._id));
  const toggleGuest = useFavoritesStore((s) => s.toggle);
  const removeGuest = useFavoritesStore((s) => s.remove);

  // ------- USER (API + SWR) -------
  const {
    ids: serverFavIds,
    add,
    remove,
    isLoading: favsLoading,
  } = useUserFavorites(isCustomer);

  const isFavUser = useMemo(
    () => serverFavIds?.has(product._id) ?? false,
    [serverFavIds, product._id]
  );

  const [busy, setBusy] = useState(false);

  // dopóki nie zhydratujemy, traktujemy jak nie-ulubiony,
  // żeby nie rozjechać się z HTML-em z SSR
  const fav = hydrated ? (isCustomer ? isFavUser : isFavGuest) : false;

  const mainImage =
    product.images?.find((i) => i.primary)?.src ??
    product.images?.[0]?.src ??
    "/placeholder.png";

  const mainAlt =
    product.images?.find((i) => i.primary)?.alt ??
    product.images?.[0]?.alt ??
    product.title;

  // ------- SALE / NEW --------
  const hasSale =
    product.tags?.includes("sale") &&
    typeof product.oldPrice === "number" &&
    product.oldPrice > product.price;

  const discountPercent = hasSale
    ? Math.round(
        ((product.oldPrice! - product.price) / product.oldPrice!) * 100
      )
    : 0;

  const isNew = product.tags?.includes("new");

  const formatPrice = (value: number) =>
    Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: product.currency ?? "GBP",
    }).format(value);

  const disabled = busy || (isCustomer && favsLoading);

  // ------- HANDLERY ULUBIONYCH -------
  async function toggleFavorite() {
    if (disabled) return;

    // gość – tylko lokalny store
    if (!isCustomer) {
      toggleGuest(product._id);
      return;
    }

    // zalogowany – sync z API
    try {
      setBusy(true);
      if (isFavUser) {
        await remove(product._id);
      } else {
        await add(product._id);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setBusy(false);
    }
  }

  async function removeFavorite() {
    if (disabled) return;

    if (!isCustomer) {
      removeGuest(product._id);
      onRemoved?.(product._id);
      return;
    }

    try {
      setBusy(true);
      await remove(product._id);
      onRemoved?.(product._id);
    } catch (e) {
      console.error(e);
    } finally {
      setBusy(false);
    }
  }

  return (
    <article className="flex flex-col">
      {/* IMAGE + BADGES */}
      <Link href={`/product/${product.slug}`} className="block group">
        <div className="relative aspect-[3/4] w-full overflow-hidden  bg-gray-100">
          {hasSale && (
            <span
              className="
            absolute left-3 top-3 z-[5]
            bg-[#E50000]/90 
            backdrop-blur-sm
            px-3 py-1.5
            rounded-md
            text-[12px] font-semibold tracking-[0.15em]
            uppercase text-white
            shadow-sm
          "
            >
              Sale - {discountPercent}%
            </span>
          )}

          <Image
            src={mainImage}
            alt={mainAlt}
            fill
            sizes="(min-width: 1024px) 25vw, 50vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />

          {isNew && (
            <span className="absolute bottom-2 left-2 z-[5] inline-flex items-center rounded-full border border-[#F5D96B] bg-black/80 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#F5D96B] shadow-sm">
              NEW MODEL
            </span>
          )}

          {/* HEART – tylko po hydracji, żeby nie było warningów z Reacta */}
          {showHeart && hydrated && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleFavorite();
              }}
              className="absolute right-2 top-2 rounded-full bg-white/80 p-1 shadow hover:bg-white"
              aria-label={fav ? "Remove from wishlist" : "Add to wishlist"}
              aria-pressed={fav}
              disabled={disabled}
              title={fav ? "In wishlist" : "Add to wishlist"}
            >
              <Heart
                className={`h-5 w-5 ${
                  fav ? "fill-red-500 text-red-500" : "text-zinc-700"
                }`}
              />
            </button>
          )}
        </div>
      </Link>

      {/* TITLE + PRICE */}
      <div className="mt-3 flex  justify-between items-center">
        <div>
          <Link
            href={`/product/${product.slug}`}
            className="line-clamp-2 text-sm font-medium text-gray-900"
          >
            {product.title}
          </Link>

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

        {/* opcjonalny krzyżyk np. na stronie /favorites */}
        {!showHeart && onRemoved && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              removeFavorite();
            }}
            title="Remove from wishlist"
            className="ml-2  p-1 border border-zinc-200 align-middle hover:cursor-pointer "
            aria-label="Remove from wishlist"
            disabled={disabled}
          >
            <TrashX className="text-zinc-700" size={18} />
          </button>
        )}
      </div>
    </article>
  );
};

export default ProductCard;
