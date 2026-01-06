"use client";

import {FormEvent, useMemo, useState} from "react";
import {useSession} from "next-auth/react";
import {useRouter} from "next/navigation";

import {CartItem} from "../../../types/cart";
import {useCartStore} from "../../../store/cartStore";
import {useUserCart} from "../../../lib/hooks/useUserCart";
import {getImageSrc} from "../../../lib/utils/getImageSrc";
import {isCustomerSession} from "../../../lib/utils/isCustomer";
import formatMoney from "../../../lib/utils/shop/formatMoney";

import {
  calculateShippingCost,
  EXPRESS_SHIPPING_COST,
  STANDARD_SHIPPING_COST,
  getFreeExpressProgress,
  ShippingMethod,
} from "../../../lib/cost/shipping";

type UiCartItem = CartItem & {key?: string};

export default function CheckoutPage() {
  const router = useRouter();
  const {data: session, status} = useSession();

  const isAuthLoading = status === "loading";

  // ---- CUSTOMER? ----
  const isCustomer = isCustomerSession(session, status);

  // ---- CART (API) ----
  const {cart, isLoading: userLoading} = useUserCart(isCustomer);

  // ---- CART (GUEST / ZUSTAND) ----
  const guestRawItems = useCartStore((s) => s.items);

  const guestItems = useMemo(() => {
    return Object.entries(guestRawItems)
      .sort(([, a], [, b]) => b.addedAt - a.addedAt)
      .map(([k, it]) => ({
        ...it,
        key: it.key ?? k,
        image:
          it.image ||
          (Array.isArray(it.images) ? it.images[0] : undefined) ||
          it.heroImage ||
          "",
      }));
  }, [guestRawItems]);

  // ---- CART FINAL ----
  const items: UiCartItem[] = useMemo(() => {
    return isCustomer ? cart ?? [] : guestItems;
  }, [isCustomer, cart, guestItems]);

  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => {
      const price = Number(item.price) || 0;
      const qty = Number(item.qty) || 0;
      return sum + price * qty;
    }, 0);
  }, [items]);

  const itemCount = useMemo(() => {
    return items.reduce((sum, item) => sum + (Number(item.qty) || 0), 0);
  }, [items]);

  // ---- FREE EXPRESS PROGRESS ----
  const freeExpress = useMemo(() => {
    return getFreeExpressProgress(subtotal);
  }, [subtotal]);

  // ---- PAGE LOADING ----
  const isCartLoading = isCustomer && userLoading;
  const isPageLoading = isAuthLoading || isCartLoading;

  // -----------------------------
  // CUSTOMER FORM
  // -----------------------------
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [emailOverride, setEmailOverride] = useState<string | null>(null);
  const [phone, setPhone] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("United Kingdom");

  const email = emailOverride ?? session?.user?.email ?? "";

  const [shippingMethod, setShippingMethod] =
    useState<ShippingMethod>("standard");

  const shippingCost = calculateShippingCost(subtotal, shippingMethod);
  const total = itemCount > 0 ? subtotal + shippingCost : 0;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!items.length) {
      setFormError("Your bag is empty.");
      return;
    }

    if (!email.trim()) {
      setFormError("Please provide your email address.");
      return;
    }

    try {
      setIsSubmitting(true);

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          items,
          customer: {
            firstName,
            lastName,
            email,
            phone,
            address: {
              street,
              city,
              postalCode,
              country,
            },
          },
          shipping: {
            method: shippingMethod,
            cost: shippingCost,
          },
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setFormError(data.error || "Something went wrong. Please try again.");
        setIsSubmitting(false);
        return;
      }

      if (!data.url) {
        setFormError("Could not start payment session. Please try again.");
        setIsSubmitting(false);
        return;
      }

      router.push(data.url as string);
    } catch (error) {
      console.error(error);
      setFormError("Unexpected error. Please try again.");
      setIsSubmitting(false);
    }
  };

  // ---- LOADING SKELETON ----
  if (isPageLoading) {
    return (
      <main className="min-h-screen bg-zinc-50/60">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 pb-16 pt-10 lg:flex-row lg:px-6">
          <section className="w-full lg:w-2/3">
            <div className="h-6 w-32 rounded bg-zinc-200 animate-pulse" />
            <div className="mt-3 h-4 w-64 rounded bg-zinc-200 animate-pulse" />
            <div className="mt-6 h-80 rounded-2xl border border-zinc-200 bg-white/80 animate-pulse" />
          </section>
          <aside className="w-full lg:w-1/3">
            <div className="h-64 rounded-2xl border border-zinc-200 bg-white/80 animate-pulse" />
          </aside>
        </div>
      </main>
    );
  }

  // ---- PAGE ----
  return (
    <main className="min-h-screen bg-zinc-50/60">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 pb-16 pt-10 lg:flex-row lg:px-6">
        {/* LEFT */}
        <section className="w-full lg:w-2/3">
          <h1 className="text-xl font-semibold tracking-tight text-zinc-900 sm:text-2xl">
            Checkout
          </h1>
          <p className="mt-1 text-xs text-zinc-500">
            Secure payment with Stripe. We never store your card details.
          </p>

          {itemCount === 0 && (
            <div className="mt-6 rounded-2xl border border-zinc-200 bg-white px-4 py-6 text-sm text-zinc-600">
              <p>Your bag is empty. Add some products before you checkout.</p>
              <button
                type="button"
                onClick={() => router.push("/")}
                className="mt-4 inline-flex items-center justify-center rounded-full bg-zinc-900 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-white hover:bg-black"
              >
                Continue shopping
              </button>
            </div>
          )}

          {itemCount > 0 && (
            <form
              onSubmit={handleSubmit}
              className="mt-6 space-y-6 rounded-2xl border border-zinc-200 bg-white px-4 py-5 shadow-sm sm:px-6 sm:py-6"
            >
              {/* Contact */}
              <div>
                <h2 className="text-sm font-semibold text-zinc-900">
                  Contact details
                </h2>
                <p className="mt-1 text-xs text-zinc-500">
                  We&apos;ll use this to send you order updates.
                </p>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="sm:col-span-1">
                    <label className="text-xs font-medium text-zinc-700">
                      First name
                    </label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm outline-none transition focus:border-zinc-900 focus:bg-white"
                      autoComplete="given-name"
                      required
                    />
                  </div>
                  <div className="sm:col-span-1">
                    <label className="text-xs font-medium text-zinc-700">
                      Last name
                    </label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm outline-none transition focus:border-zinc-900 focus:bg-white"
                      autoComplete="family-name"
                      required
                    />
                  </div>
                  <div className="sm:col-span-1">
                    <label className="text-xs font-medium text-zinc-700">
                      Email address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmailOverride(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm outline-none transition focus:border-zinc-900 focus:bg-white"
                      autoComplete="email"
                      required
                    />
                  </div>
                  <div className="sm:col-span-1">
                    <label className="text-xs font-medium text-zinc-700">
                      Phone (optional)
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm outline-none transition focus:border-zinc-900 focus:bg-white"
                      autoComplete="tel"
                    />
                  </div>
                </div>
              </div>

              {/* Address */}
              <div>
                <h2 className="text-sm font-semibold text-zinc-900">
                  Shipping address
                </h2>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className="text-xs font-medium text-zinc-700">
                      Street address
                    </label>
                    <input
                      type="text"
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm outline-none transition focus:border-zinc-900 focus:bg-white"
                      autoComplete="street-address"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-zinc-700">
                      City
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm outline-none transition focus:border-zinc-900 focus:bg-white"
                      autoComplete="address-level2"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-zinc-700">
                      Postal code
                    </label>
                    <input
                      type="text"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm outline-none transition focus:border-zinc-900 focus:bg-white"
                      autoComplete="postal-code"
                      required
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-xs font-medium text-zinc-700">
                      Country
                    </label>
                    <input
                      type="text"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm outline-none transition focus:border-zinc-900 focus:bg-white"
                      autoComplete="country-name"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Delivery */}
              <div>
                <h2 className="text-sm font-semibold text-zinc-900">
                  Delivery method
                </h2>
                <p className="mt-1 text-xs text-zinc-500">
                  Choose how you&apos;d like your order to be delivered.
                </p>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => setShippingMethod("standard")}
                    className={`flex flex-col items-start rounded-xl border px-3 py-3 text-left text-xs transition ${
                      shippingMethod === "standard"
                        ? "border-zinc-900 bg-zinc-900 text-white"
                        : "border-zinc-200 bg-zinc-50 text-zinc-900 hover:border-zinc-900/60"
                    }`}
                  >
                    <span className="font-semibold tracking-wide uppercase">
                      Standard
                    </span>
                    <span className="mt-1 text-[11px] opacity-80">
                      2–4 business days
                    </span>
                    <span className="mt-2 text-xs font-semibold">
                      {formatMoney(STANDARD_SHIPPING_COST)}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShippingMethod("express")}
                    className={`flex flex-col items-start rounded-xl border px-3 py-3 text-left text-xs transition ${
                      shippingMethod === "express"
                        ? "border-zinc-900 bg-zinc-900 text-white"
                        : "border-zinc-200 bg-zinc-50 text-zinc-900 hover:border-zinc-900/60"
                    }`}
                  >
                    <div className="flex w-full items-center justify-between gap-2">
                      <span className="font-semibold tracking-wide uppercase">
                        Express
                      </span>
                      {shippingMethod === "express" && shippingCost === 0 && (
                        <span className="rounded-full bg-emerald-500 px-2 py-[2px] text-[10px] font-semibold uppercase text-white">
                          Free
                        </span>
                      )}
                    </div>
                    <span className="mt-1 text-[11px] opacity-80">
                      Next-day delivery (working days)
                    </span>
                    <span className="mt-2 text-xs font-semibold">
                      {shippingMethod === "express" && shippingCost === 0
                        ? "Free"
                        : formatMoney(EXPRESS_SHIPPING_COST)}
                    </span>
                  </button>
                </div>
              </div>

              {formError && (
                <p className="text-xs font-medium text-red-600">{formError}</p>
              )}

              <button
                type="submit"
                disabled={isSubmitting || !items.length}
                className="inline-flex w-full items-center justify-center rounded-full bg-zinc-900 px-6 py-3 text-sm font-semibold tracking-[0.14em] uppercase text-white shadow-lg shadow-zinc-900/30 transition hover:bg-black hover:shadow-zinc-900/40 disabled:cursor-not-allowed disabled:bg-zinc-900/60 disabled:text-zinc-300 disabled:shadow-none"
              >
                {isSubmitting
                  ? "Redirecting to payment..."
                  : "Continue to payment"}
              </button>
            </form>
          )}
        </section>

        {/* RIGHT */}
        <aside className="w-full lg:w-1/3">
          <div className="sticky top-6 space-y-4">
            <div className="rounded-2xl border border-zinc-200 bg-white px-4 py-4 shadow-sm sm:px-5 sm:py-5">
              <h2 className="text-sm font-semibold text-zinc-900">
                Order summary
              </h2>
              <p className="mt-1 text-xs text-zinc-500">
                {itemCount} {itemCount === 1 ? "item" : "items"}
              </p>

              <div className="mt-4 space-y-3 max-h-64 overflow-y-auto pr-1">
                {items.map((item) => {
                  const img = getImageSrc(
                    item.image ?? item.images?.[0] ?? item.heroImage
                  );

                  return (
                    <div
                      key={item.key ?? item.productId}
                      className="flex items-center gap-3"
                    >
                      <div className="relative h-16 w-14 flex-shrink-0 overflow-hidden rounded-lg bg-zinc-100">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={img}
                          alt={item.title}
                          className="h-full w-full object-cover"
                        />
                        {Number(item.qty) > 1 && (
                          <span className="absolute right-1 top-1 rounded-full bg-black/80 px-1.5 text-[10px] font-semibold text-white">
                            ×{item.qty}
                          </span>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="line-clamp-2 text-xs font-medium text-zinc-900">
                          {item.title}
                        </p>
                        <p className="mt-0.5 text-[11px] text-zinc-500">
                          {item.size && <span>Size {item.size}</span>}
                          {item.color && (
                            <span className="ml-2 capitalize">
                              · {item.color}
                            </span>
                          )}
                        </p>
                      </div>
                      <span className="text-xs font-semibold text-zinc-900">
                        {formatMoney(
                          (Number(item.price) || 0) * (Number(item.qty) || 0)
                        )}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 space-y-2 text-sm">
                <div className="flex items-center justify-between text-xs text-zinc-600">
                  <span>Subtotal</span>
                  <span className="font-medium text-zinc-900">
                    {formatMoney(subtotal)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-zinc-600">
                  <span>Shipping</span>
                  <span className="font-medium text-zinc-900">
                    {itemCount === 0
                      ? "—"
                      : shippingCost === 0
                      ? "Free"
                      : formatMoney(shippingCost)}
                  </span>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between border-t border-dashed border-zinc-200 pt-3 text-sm">
                <span className="text-zinc-800">Total</span>
                <span className="text-base font-semibold text-zinc-900">
                  {formatMoney(total)}
                </span>
              </div>
            </div>

            {itemCount > 0 && (
              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-[11px] text-zinc-700">
                <div className="mb-2 flex items-center justify-between font-medium">
                  <span>Shipping perk</span>
                  <span className="text-[10px] uppercase tracking-[0.14em] text-zinc-500">
                    Free express
                  </span>
                </div>

                <p>
                  {freeExpress.left > 0 ? (
                    <>
                      Add{" "}
                      <span className="font-semibold">
                        {formatMoney(freeExpress.left)}
                      </span>{" "}
                      more to unlock{" "}
                      <span className="font-semibold">
                        free express delivery
                      </span>
                      .
                    </>
                  ) : (
                    <span className="font-semibold text-emerald-600">
                      You unlocked free express delivery on this order.
                    </span>
                  )}
                </p>

                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-zinc-200">
                  <div
                    className="h-full rounded-full bg-zinc-900 transition-[width] duration-300"
                    style={{width: `${freeExpress.progress}%`}}
                  />
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>
    </main>
  );
}
