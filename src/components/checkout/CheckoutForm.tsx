"use client";

import {FormEvent} from "react";
import type {AppRouterInstance} from "next/dist/shared/lib/app-router-context.shared-runtime";

import formatMoney from "@/lib/utils/shared/formatMoney";
import {SHIPPING_CONFIG, ShippingMethod} from "@/lib/config/shop/shipping";

type Props = {
  router: AppRouterInstance;

  itemCount: number;
  email: string;

  isSubmitting: boolean;
  formError: string | null;

  shippingMethod: ShippingMethod;
  shippingCost: number;

  onSubmit: (e: FormEvent) => void;
  onShippingMethodChange: (m: ShippingMethod) => void;

  // fields
  firstName: string;
  lastName: string;
  phone: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;

  onFirstNameChange: (v: string) => void;
  onLastNameChange: (v: string) => void;
  onEmailChange: (v: string) => void;
  onPhoneChange: (v: string) => void;
  onStreetChange: (v: string) => void;
  onCityChange: (v: string) => void;
  onPostalCodeChange: (v: string) => void;
  onCountryChange: (v: string) => void;
};

const CheckoutForm = (props: Props) => {
  const {
    router,
    itemCount,
    email,
    isSubmitting,
    formError,
    shippingMethod,
    shippingCost,
    onSubmit,
    onShippingMethodChange,

    firstName,
    lastName,
    phone,
    street,
    city,
    postalCode,
    country,
    onFirstNameChange,
    onLastNameChange,
    onEmailChange,
    onPhoneChange,
    onStreetChange,
    onCityChange,
    onPostalCodeChange,
    onCountryChange,
  } = props;

  return (
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
          onSubmit={onSubmit}
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
                  onChange={(e) => onFirstNameChange(e.target.value)}
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
                  onChange={(e) => onLastNameChange(e.target.value)}
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
                  onChange={(e) => onEmailChange(e.target.value)}
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
                  onChange={(e) => onPhoneChange(e.target.value)}
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
                  onChange={(e) => onStreetChange(e.target.value)}
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
                  onChange={(e) => onCityChange(e.target.value)}
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
                  onChange={(e) => onPostalCodeChange(e.target.value)}
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
                  onChange={(e) => onCountryChange(e.target.value)}
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
                onClick={() => onShippingMethodChange("standard")}
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
                  {formatMoney(SHIPPING_CONFIG.STANDARD_COST)}
                </span>
              </button>

              <button
                type="button"
                onClick={() => onShippingMethodChange("express")}
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
                    : formatMoney(SHIPPING_CONFIG.EXPRESS_COST)}
                </span>
              </button>
            </div>
          </div>

          {formError && (
            <p className="text-xs font-medium text-red-600">{formError}</p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex w-full items-center justify-center rounded-full bg-zinc-900 px-6 py-3 text-sm font-semibold tracking-[0.14em] uppercase text-white shadow-lg shadow-zinc-900/30 transition hover:bg-black hover:shadow-zinc-900/40 disabled:cursor-not-allowed disabled:bg-zinc-900/60 disabled:text-zinc-300 disabled:shadow-none"
          >
            {isSubmitting ? "Redirecting to payment..." : "Continue to payment"}
          </button>
        </form>
      )}
    </section>
  );
};
export default CheckoutForm;
