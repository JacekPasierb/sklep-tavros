// components/layout/Header/IconsBar.tsx
"use client";

import { Heart, ShoppingBag, User } from "lucide-react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useCartUiStore } from "../../../store/cartUiStore";
import { useCartStore } from "../../../store/cartStore";
import { CartDrawer } from "../../cart/CartDrawer";

import { CartItem } from "../../../types/cart";
import { useUserCart } from "../../../lib/hooks/useUserCart";

const IconsBar = () => {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";
  const isAuthLoading = status === "loading";

  const openCart = useCartUiStore((s) => s.open);

  // ---- GOŚĆ: licznik z Zustand ----
  const guestRawItems = useCartStore((s) => s.items);
  const guestCount = useMemo(
    () =>
      Object.values(guestRawItems).reduce(
        (sum, item) => sum + item.qty,
        0
      ),
    [guestRawItems]
  );

  // ---- USER: licznik z API (/api/cart) ----
  const { cart } = useUserCart(isAuthenticated);
  const userCount = useMemo(
    () =>
      cart
        ? cart.reduce(
            (sum: number, item: CartItem) => sum + item.qty,
            0
          )
        : 0,
    [cart]
  );

  // ---- HYDRATION GUARD ----
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setHydrated(true), 0);
    return () => clearTimeout(timer);
  }, []);

  // liczba do wyświetlenia w badge
  const cartCount = hydrated
    ? isAuthenticated
      ? userCount
      : guestCount
    : 0;

  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLLIElement | null>(null);

  useEffect(() => {
    if (!userMenuOpen) return;

    const handleClick = (e: MouseEvent) => {
      if (!userMenuRef.current) return;
      if (!userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [userMenuOpen]);

  const userName =
    session?.user?.name ||
    session?.user?.email?.split("@")[0] ||
    "My account";

  const wishlistHref = "/favorites";

  // dla mobile – gdy ładuje sesję, traktujemy jako "sprawdź konto"
  const accountHref =
    status === "authenticated"
      ? "/account"
      : status === "unauthenticated"
      ? "/signin"
      : "/account";

  return (
    <>
      <div className="flex gap-1 justify-self-end md:gap-4">
        <ul
          className="flex gap-1 justify-self-end md:gap-4"
          aria-label="Header actions"
        >
          {/* USER + DROPDOWN (DESKTOP) */}
          <li ref={userMenuRef} className="relative hidden lg:block">
            <button
              type="button"
              aria-label="Account menu"
              aria-expanded={userMenuOpen}
              onClick={() => setUserMenuOpen((prev) => !prev)}
              className="grid h-9 w-9 place-items-center lg:h-12 lg:w-12"
            >
              <User className="h-6 w-6" />
            </button>

            {userMenuOpen && (
              <div
                className="
                  absolute right-0 top-full translate-y-5
                  min-w-[260px]
                  rounded-b-2xl rounded-t-none
                  border border-zinc-200
                  bg-white/95 py-3 text-sm
                  shadow-xl backdrop-blur-sm
                "
              >
                {isAuthLoading ? (
                  /* 🔹 WARIANT: JESZCZE SPRAWDZAMY SESJĘ */
                  <div className="px-4 py-3 text-xs text-zinc-600">
                    <p className="text-[11px] tracking-[0.16em] text-zinc-500">
                      TAVROS
                    </p>
                    <p className="mt-2 font-medium text-zinc-900">
                      Loading your account…
                    </p>
                    <p className="mt-1 text-[11px] text-zinc-500">
                      Please wait a moment while we check your login status.
                    </p>
                  </div>
                ) : isAuthenticated ? (
                  /* 🔹 WARIANT: ZALOGOWANY */
                  <>
                    <div className="px-4 pb-3">
                      <p className="text-xs uppercase tracking-wide text-zinc-500">
                        Signed in as
                      </p>
                      <p className="truncate text-sm font-medium text-zinc-900">
                        {userName}
                      </p>
                    </div>

                    <div className="border-t border-zinc-100" />

                    <div className="flex flex-col gap-1 px-2 py-2">
                      <Link
                        href="/account"
                        onClick={() => setUserMenuOpen(false)}
                        className="rounded-lg px-3 py-2 text-left hover:bg-zinc-50"
                      >
                        My account
                      </Link>
                      <Link
                        href="/favorites"
                        onClick={() => setUserMenuOpen(false)}
                        className="rounded-lg px-3 py-2 text-left hover:bg-zinc-50"
                      >
                        Wishlist
                      </Link>
                    </div>

                    <div className="border-t border-zinc-100" />

                    <div className="px-3 pt-2">
                      <button
                        type="button"
                        onClick={() => signOut({ callbackUrl: "/" })}
                        className="w-full rounded-full bg-black px-4 py-2.5 text-xs font-semibold text-white hover:bg-black/90"
                      >
                        Log out
                      </button>
                    </div>
                  </>
                ) : (
                  /* 🔹 WARIANT: NIEZALOGOWANY */
                  <>
                    <div className="px-4 pb-3">
                      <p className="text-xs tracking-[0.16em] text-zinc-500">
                        TAVROS
                      </p>
                      <p className="mt-1 text-xs text-zinc-600">
                        Save favourites, track orders & checkout faster.
                      </p>
                    </div>

                    <div className="border-t border-zinc-100" />

                    <div className="flex flex-col gap-2 px-3 pt-3 pb-2">
                      <Link
                        href="/register"
                        onClick={() => setUserMenuOpen(false)}
                        className="w-full rounded-full border border-zinc-300 bg-white px-4 py-2.5 text-[13px] font-medium text-zinc-900 hover:border-zinc-400 hover:bg-zinc-50 hover:shadow-sm"
                      >
                        Create account
                      </Link>
                      <Link
                        href="/signin"
                        onClick={() => setUserMenuOpen(false)}
                        className="w-full rounded-full bg-black px-4 py-2.5 text-[13px] font-semibold text-white hover:bg-black/90"
                      >
                        Log in
                      </Link>
                    </div>
                  </>
                )}
              </div>
            )}
          </li>

          {/* MOBILE ACCOUNT IKONA */}
          <li className="lg:hidden">
            <Link
              href={accountHref}
              aria-label="Account"
              className="grid h-9 w-9 place-items-center"
            >
              <User className="h-6 w-6" />
            </Link>
          </li>

          {/* WISHLIST */}
          <li>
            <Link
              href={wishlistHref}
              aria-label="Wishlist"
              className="grid h-9 w-9 place-items-center lg:h-12 lg:w-12"
            >
              <Heart className="h-6 w-6" />
            </Link>
          </li>
        </ul>

        {/* KOSZYK */}
        <button
          aria-label="Open cart"
          onClick={openCart}
          className="relative grid h-9 w-9 place-items-center lg:h-12 lg:w-12"
        >
          <ShoppingBag className="h-6 w-6" />

          {/* badge z ilością produktów */}
          {hydrated && cartCount > 0 && (
            <span
              className="absolute -right-0.5 -top-0.5
                min-h-[18px] min-w-[18px]
                rounded-full bg-black px-1
                text-[10px] font-semibold text-white
                flex items-center justify-center"
            >
              {cartCount}
            </span>
          )}
        </button>
      </div>

      <CartDrawer />
    </>
  );
};

export default IconsBar;
