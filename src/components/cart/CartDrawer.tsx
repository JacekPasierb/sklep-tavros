// components/cart/CartDrawer.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import {X, Minus, Plus} from "lucide-react";
import {useMemo} from "react";
import {useSession} from "next-auth/react";

import {useCartUiStore} from "../../store/cartUiStore";
import {useCartStore} from "../../store/cartStore";
import {useUserCart} from "../../lib/useUserCart";
import type {CartItem} from "../../types/cart";

type UiCartItem = CartItem & {key?: string};

export const CartDrawer = () => {
  const {isOpen, close} = useCartUiStore();

  // kto jest zalogowany?
  const {status} = useSession();
  const isLoggedIn = status === "authenticated";

  // ---- KOSZYK USERA (API) ----
  const {
    cart,
    isLoading: userLoading,
    updateQty,
    removeItem,
  } = useUserCart(isLoggedIn);

  // ---- KOSZYK GOŚCIA (ZUSTAND) ----
  const guestRawItems = useCartStore((s) => s.items);
  const guestUpdate = useCartStore((s) => s.update);
  const guestRemove = useCartStore((s) => s.remove);
  const getGuestSubtotal = useCartStore((s) => s.getSubtotal);
  const getGuestCount = useCartStore((s) => s.getTotalItems);

  const guestItems: (CartItem & {key: string})[] = useMemo(
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
  const items: UiCartItem[] = isLoggedIn ? cart ?? [] : guestItems;

  const subtotal = isLoggedIn
    ? items.reduce((sum, item) => {
        const price = Number(item.price) || 0;
        const qty = Number(item.qty) || 0;
        return sum + price * qty;
      }, 0)
    : getGuestSubtotal();
  const count = isLoggedIn
    ? items.reduce((sum, item) => sum + item.qty, 0)
    : getGuestCount();

  const isLoading = isLoggedIn ? userLoading : false;

  if (!isOpen) return null;

  const handleDecrease = (item: UiCartItem) => {
    if (isLoggedIn) {
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

    // GOŚĆ – Zustand
    if (!item.key) return;
    if (item.qty <= 1) {
      guestRemove(item.key);
    } else {
      guestUpdate(item.key, item.qty - 1);
    }
  };

  const handleIncrease = (item: UiCartItem) => {
    if (isLoggedIn) {
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
    if (isLoggedIn) {
      removeItem({
        productId: item.productId,
        size: item.size,
        color: item.color,
      });
    } else if (item.key) {
      guestRemove(item.key);
    }
  };

  const formatPrice = (value: number) =>
    Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
    }).format(value);

  return (
    <>
      {/* tło */}
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
        onClick={close}
      />

      {/* panel */}
      <aside
        className="
          fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col
          bg-white shadow-xl
        "
        aria-label="Shopping bag"
      >
        {/* header */}
        <header className="flex items-center justify-between border-b px-5 py-4">
          <div className="flex flex-col">
            <h2 className="text-sm font-semibold uppercase tracking-[0.16em]">
              Your bag
            </h2>
            <span className="text-xs text-zinc-500">
              {count} {count === 1 ? "item" : "items"}
            </span>
          </div>

          <button
            type="button"
            onClick={close}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full hover:bg-zinc-100"
            aria-label="Close bag"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        {/* content */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {isLoading ? (
            <p className="py-10 text-center text-sm text-zinc-500">
              Loading your bag...
            </p>
          ) : !items.length ? (
            <div className="flex h-full flex-col items-center justify-center py-10 text-center">
              <p className="mb-2 text-sm font-medium text-zinc-800">
                Your bag is empty
              </p>
              <p className="max-w-xs text-xs text-zinc-500">
                Browse the collection and add some pieces to your bag.
              </p>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => {
                const img =
                  item.image ??
                  item.images?.[0] ??
                  item.heroImage ??
                  "/placeholder.png";

                return (
                  <li
                    key={item.key ?? item.productId}
                    className="flex gap-3 border-b border-zinc-100 pb-4 last:border-b-0"
                  >
                    {/* thumb */}
                    <Link
                      href={`/product/${item.slug}`}
                      className="relative h-24 w-20 flex-shrink-0 overflow-hidden rounded-md bg-zinc-100"
                      onClick={close}
                    >
                      <Image
                        src={img}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    </Link>

                    {/* info + qty */}
                    <div className="flex flex-1 flex-col justify-between">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <Link
                            href={`/product/${item.slug}`}
                            onClick={close}
                            className="line-clamp-2 text-sm font-medium text-zinc-900"
                          >
                            {item.title}
                          </Link>

                          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-zinc-500">
                            {item.size && (
                              <span>
                                Size:{" "}
                                <span className="font-medium">{item.size}</span>
                              </span>
                            )}
                            {item.sku && (
                              <span className="text-[11px] text-zinc-400">
                                SKU: {item.sku}
                              </span>
                            )}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemove(item)}
                          className="text-xs text-zinc-400 hover:text-zinc-700"
                          aria-label="Remove item"
                        >
                          Remove
                        </button>
                      </div>

                      <div className="mt-2 flex items-center justify-between">
                        {/* qty */}
                        <div className="inline-flex items-center rounded-full border border-zinc-300 px-2 py-1 text-xs">
                          <button
                            type="button"
                            onClick={() => handleDecrease(item)}
                            className="inline-flex h-6 w-6 items-center justify-center rounded-full hover:bg-zinc-100"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="mx-2 min-w-[1.5rem] text-center text-sm">
                            {item.qty}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleIncrease(item)}
                            className="inline-flex h-6 w-6 items-center justify-center rounded-full hover:bg-zinc-100"
                            aria-label="Increase quantity"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>

                        {/* price */}
                        <span className="text-sm font-semibold text-zinc-900">
                          {formatPrice(
                            (Number(item.price) || 0) * (Number(item.qty) || 0)
                          )}
                        </span>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* footer */}
        <footer className="border-t px-5 py-4">
          <div className="mb-3 flex items-center justify-between text-sm">
            <span className="text-zinc-600">Subtotal</span>
            <span className="text-base font-semibold text-zinc-900">
              {formatPrice(subtotal ?? 0)}
            </span>
          </div>

          <button
            type="button"
            disabled={!items.length}
            className="
              inline-flex w-full items-center justify-center rounded-full
              bg-black px-6 py-3 text-sm font-semibold tracking-[0.12em]
              uppercase text-white shadow-sm transition
              hover:bg-black/90 hover:shadow-md
              disabled:cursor-not-allowed disabled:bg-zinc-900 disabled:text-zinc-500
            "
          >
            Checkout
          </button>

          <p className="mt-2 text-[11px] text-zinc-400">
            Taxes and shipping calculated at checkout.
          </p>
        </footer>
      </aside>
    </>
  );
};
