"use client";

import {FormEvent, useMemo, useState} from "react";
import {useSession} from "next-auth/react";
import {useRouter} from "next/navigation";

import {useCartStore} from "../../../store/cartStore";

import {ShippingMethod} from "../../../lib/config/shop/shipping";
import {UiCartItem} from "../../../types/checkout";
import {
  calculateShippingCost,
  getFreeExpressProgress,
} from "../../../lib/utils/shop/shipping";
import {useUserCart} from "../../../lib/hooks/shop/useUserCart";

import CheckoutForm from "../../../components/checkout/CheckoutForm";
import OrderSummary from "../../../components/checkout/OrderSummary";
import {createCheckoutSession} from "../../../lib/services/shop/checkout.service";
import {isCustomerSession} from "../../../lib/utils/shared/auth/sessionGuards";

const CheckoutPage = () => {
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

  const freeExpress = useMemo(
    () => getFreeExpressProgress(subtotal),
    [subtotal]
  );

  // ---- PAGE LOADING ----
  const isCartLoading = isCustomer && userLoading;
  const isPageLoading = isAuthLoading || isCartLoading;

  // -----------------------------
  // FORM STATE
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
      const res = await createCheckoutSession({
        items,
        customer: {
          firstName,
          lastName,
          email,
          phone,
          address: {street, city, postalCode, country},
        },
        shipping: {method: shippingMethod, cost: shippingCost},
      });

      if (!res.ok) {
        setFormError(res.error || "Something went wrong. Please try again.");
        setIsSubmitting(false);
        return;
      }

      if (!res.url) {
        setFormError("Could not start payment session. Please try again.");
        setIsSubmitting(false);
        return;
      }

      router.push(res.url);
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

  return (
    <main className="min-h-screen bg-zinc-50/60">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 pb-16 pt-10 lg:flex-row lg:px-6">
        <CheckoutForm
          router={router}
          itemCount={itemCount}
          email={email}
          isSubmitting={isSubmitting}
          formError={formError}
          shippingMethod={shippingMethod}
          shippingCost={shippingCost}
          onSubmit={handleSubmit}
          onShippingMethodChange={setShippingMethod}
          // fields
          firstName={firstName}
          lastName={lastName}
          phone={phone}
          street={street}
          city={city}
          postalCode={postalCode}
          country={country}
          onFirstNameChange={setFirstName}
          onLastNameChange={setLastName}
          onEmailChange={setEmailOverride}
          onPhoneChange={setPhone}
          onStreetChange={setStreet}
          onCityChange={setCity}
          onPostalCodeChange={setPostalCode}
          onCountryChange={setCountry}
        />

        <OrderSummary
          items={items}
          itemCount={itemCount}
          subtotal={subtotal}
          shippingCost={shippingCost}
          total={total}
          freeExpress={freeExpress}
        />
      </div>
    </main>
  );
};
export default CheckoutPage;
