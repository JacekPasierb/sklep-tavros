// components/cart/CartDrawer.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { X, Minus, Plus } from "lucide-react";
import { useMemo } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import { useCartUiStore } from "../../store/cartUiStore";
import { useCartStore } from "../../store/cartStore";

import type { CartItem } from "../../types/cart";
import { useUserCart } from "../../lib/hooks/useUserCart";
import { getImageSrc } from "../../lib/utils/getImageSrc";
import { isCustomerSession } from "../../lib/utils/isCustomer";
import formatMoney from "../../lib/utils/shop/formatMoney";

type UiCartItem = CartItem & { key?: string };

const FREE_SHIPPING_THRESHOLD = 125; // £125 – próg darmowej dostawy

export const CartDrawer = () => {
  const { isOpen, close } = useCartUiStore();
  const router = useRouter();

  const { data: session, status } = useSession();
const isCustomer = isCustomerSession(session, status);
  
  const isAuthLoading = status === "loading";
  // const isLoggedIn = status === "authenticated";

  // ---- KOSZYK USERA (API) ----
  const {
    cart,
    isLoading: userLoading,
    updateQty,
    removeItem,
  } = useUserCart(isCustomer);

  // ---- KOSZYK GOŚCIA (ZUSTAND) ----
  const guestRawItems = useCartStore((s) => s.items);
  const guestUpdate = useCartStore((s) => s.update);
  const guestRemove = useCartStore((s) => s.remove);
  const getGuestSubtotal = useCartStore((s) => s.getSubtotal);
  const getGuestCount = useCartStore((s) => s.getTotalItems);

  const guestItems: (CartItem & { key: string })[] = useMemo(
    () =>
      Object.entries(guestRawItems)
        .sort(([, a], [, b]) => b.addedAt - a.addedAt)
        .map(([k, it]) => ({
          ...it,
          key: it.key ?? k,
          image:
            it.image ||
            (Array.isArray(it.images) ? it.images[0] : undefined) ||
            it.heroImage ||
            "",
        })),
    [guestRawItems]
  );

  // ---- WYBÓR ŹRÓDŁA ----
  const items: UiCartItem[] = isCustomer ? cart ?? [] : guestItems;

  const subtotal = isCustomer
    ? items.reduce((sum, item) => {
        const price = Number(item.price) || 0;
        const qty = Number(item.qty) || 0;
        return sum + price * qty;
      }, 0)
    : getGuestSubtotal();

  const count = isCustomer
    ? items.reduce((sum, item) => sum + item.qty, 0)
    : getGuestCount();

  // 🔹 globalny stan ładowania: auth (czy user zalogowany) + koszyk usera
  const isLoading = isAuthLoading || (isCustomer && userLoading);

  const freeShippingLeft = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const freeShippingProgress = Math.min(
    100,
    (subtotal / FREE_SHIPPING_THRESHOLD) * 100
  );

  if (!isOpen) return null;

  const handleDecrease = (item: UiCartItem) => {
    if (isCustomer) {
      if (item.qty <= 1) {
        removeItem({
          productId: item.productId,
          size: item.size,
          color: item.color,
        });
      } else {
        updateQty({
          productId: item.productId,
          size: item.size,
          color: item.color,
          qty: item.qty - 1,
        });
      }
      return;
    }

    if (!item.key) return;
    if (item.qty <= 1) {
      guestRemove(item.key);
    } else {
      guestUpdate(item.key, item.qty - 1);
    }
  };

  const handleIncrease = (item: UiCartItem) => {
    if (isCustomer) {
      updateQty({
        productId: item.productId,
        size: item.size,
        color: item.color,
        qty: item.qty + 1,
      });
      return;
    }

    if (!item.key) return;
    guestUpdate(item.key, item.qty + 1);
  };

  const handleRemove = (item: UiCartItem) => {
    if (isCustomer) {
      removeItem({
        productId: item.productId,
        size: item.size,
        color: item.color,
      });
    } else if (item.key) {
      guestRemove(item.key);
    }
  };

 

  const handleCheckout = () => {
    if (!items.length) return; // safety
    close();
    router.push("/checkout");
  };

  return (
    <>
      {/* backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
        onClick={close}
      />

      {/* drawer */}
      <aside
        className="
          fixed inset-y-0 right-0 z-50 flex w-full max-w-lg flex-col
          border-l border-zinc-200/80 bg-white/95 shadow-[0_24px_80px_rgba(15,23,42,0.45)]
          backdrop-blur-xl
        "
        aria-label="Shopping bag"
      >
        {/* HEADER */}
        <header className="flex items-center justify-between px-6 py-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-zinc-900">
                Your bag
              </h2>
              {!isLoading && count > 0 && (
                <span className="rounded-full bg-zinc-900 px-2 py-0.5 text-[11px] font-semibold text-white">
                  {count}
                </span>
              )}
            </div>
            <p className="text-xs text-zinc-500">
              {isLoading
                ? "Loading your bag..."
                : count === 0
                ? "Start building your look."
                : `${count} ${count === 1 ? "item" : "items"} · ${formatMoney(
                    subtotal ?? 0
                  )}`}
            </p>
          </div>

          <button
            type="button"
            onClick={close}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-700 shadow-sm hover:border-zinc-300 hover:bg-zinc-50"
            aria-label="Close bag"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        {/* FREE SHIPPING BAR */}
        {!isLoading && count > 0 && (
          <div className="px-6 pb-3">
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3">
              <div className="flex items-center justify-between text-[11px] font-medium text-zinc-700">
                <span>
                  {freeShippingLeft > 0 ? (
                    <>
                      You&apos;re{" "}
                      <span className="font-semibold">
                        {formatMoney(freeShippingLeft)}
                      </span>{" "}
                      away from{" "}
                      <span className="font-semibold">
                        free express delivery
                      </span>
                      .
                    </>
                  ) : (
                    <span className="font-semibold text-emerald-600">
                      You unlocked free express delivery.
                    </span>
                  )}
                </span>
                <span className="hidden text-[10px] uppercase tracking-[0.14em] text-zinc-500 sm:inline">
                  Shipping perk
                </span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-zinc-200">
                <div
                  className="h-full rounded-full bg-zinc-900 transition-[width] duration-300"
                  style={{ width: `${freeShippingProgress}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto px-6 pb-4 pt-2">
          {isLoading ? (
            <p className="py-10 text-center text-sm text-zinc-500">
              Loading your bag...
            </p>
          ) : !items.length ? (
            <div className="flex h-full flex-col items-center justify-center py-10 text-center">
              <p className="mb-2 text-sm font-medium text-zinc-900">
                Your bag is empty
              </p>
              <p className="max-w-xs text-xs text-zinc-500">
                Explore the latest drops and add pieces you love. We&apos;ll
                keep them here for you.
              </p>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => {
               const img = getImageSrc(item.image, item.images);

              

                return (
                  <li
                    key={item.key ?? item.productId}
                    className="
                      flex gap-3 rounded-2xl border border-zinc-200/80 bg-white/90
                      px-3 py-3 shadow-sm ring-1 ring-transparent
                      hover:border-zinc-300 hover:ring-zinc-100 transition
                    "
                  >
                    {/* thumb */}
                    <Link
                      href={`/product/${item.slug}`}
                      className="relative h-24 w-20 flex-shrink-0 overflow-hidden  bg-zinc-100"
                      onClick={close}
                    >
                      <Image
                        src={img}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    </Link>

                    {/* info + qty + price */}
                    <div className="flex flex-1 flex-col justify-between">
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-1">
                          <Link
                            href={`/product/${item.slug}`}
                            onClick={close}
                            className="line-clamp-2 text-sm font-medium text-zinc-900"
                          >
                            {item.title}
                          </Link>

                          <div className="flex flex-wrap items-center gap-2 text-[11px] text-zinc-500">
                            {item.size && (
                              <span>
                                Size{" "}
                                <span className="font-medium text-zinc-800">
                                  {item.size}
                                </span>
                              </span>
                            )}
                            {item.color && (
                              <span className="inline-flex items-center gap-1">
                                <span>Colour</span>
                                <span className="font-medium capitalize text-zinc-800">
                                  {item.color}
                                </span>
                              </span>
                            )}
                            {item.sku && (
                              <span className="text-[10px] text-zinc-400">
                                SKU: {item.sku}
                              </span>
                            )}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemove(item)}
                          className="text-[11px] font-medium text-zinc-400 hover:text-zinc-700"
                          aria-label="Remove item"
                        >
                          Remove
                        </button>
                      </div>

                      <div className="mt-3 flex items-center justify-between">
                        {/* qty */}
                        <div className="inline-flex items-center gap-1 rounded-full border border-zinc-300 bg-zinc-50/80 px-2 py-1 text-xs">
                          <button
                            type="button"
                            onClick={() => handleDecrease(item)}
                            className="inline-flex h-6 w-6 items-center justify-center rounded-full hover:bg-zinc-200/80"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="mx-1 min-w-[1.5rem] text-center text-sm font-medium text-zinc-900">
                            {item.qty}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleIncrease(item)}
                            className="inline-flex h-6 w-6 items-center justify-center rounded-full hover:bg-zinc-200/80"
                            aria-label="Increase quantity"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>

                        {/* price */}
                        <div className="text-right">
                          <span className="block text-sm font-semibold text-zinc-900">
                            {formatMoney(
                              (Number(item.price) || 0) *
                                (Number(item.qty) || 0)
                            )}
                          </span>
                          {item.price && (
                            <span className="text-[11px] text-zinc-400">
                              {formatMoney(Number(item.price))} each
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* FOOTER */}
        <footer className="border-t border-zinc-200/80 bg-white/95 px-6 pb-5 pt-3">
          <div className="mb-3 flex items-center justify-between text-sm">
            <span className="text-zinc-600">Subtotal</span>
            <span className="text-base font-semibold text-zinc-900">
              {formatMoney(subtotal ?? 0)}
            </span>
          </div>

          <button
            onClick={handleCheckout}
            type="button"
            disabled={!items.length || isLoading}
            className="
              inline-flex w-full flex-col items-center justify-center
              rounded-full bg-zinc-900 px-6 py-3.5 text-sm font-semibold
              tracking-[0.14em] uppercase text-white shadow-lg shadow-zinc-900/30
              transition hover:bg-black hover:shadow-zinc-900/40
              disabled:cursor-not-allowed disabled:bg-zinc-900/70 disabled:text-zinc-400 disabled:shadow-none
            "
          >
            <span>{isLoading ? "Checking your bag..." : "Checkout"}</span>
            <span className="mt-0.5 text-[10px] font-normal tracking-[0.18em] text-zinc-300">
              Secure payment • Free returns
            </span>
          </button>

          <p className="mt-3 text-[11px] text-zinc-400">
            Taxes and shipping are calculated at checkout.
          </p>
        </footer>
      </aside>
    </>
  );
};
