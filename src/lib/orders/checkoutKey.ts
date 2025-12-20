// lib/orders/checkoutKey.ts
import crypto from "crypto";

export type CheckoutItem = {
  productId?: string;
  slug?: string;
  title?: string;
  price: number;
  qty: number;
  size?: string | null;
  color?: string | null;
};

export type ShippingMethod = "standard" | "express";

export type CheckoutCustomer = {
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    postalCode?: string;
    country?: string;
  };
};

export function getCheckoutKey(params: {
  email: string;
  userId?: string | null;          // ✅ dodane
  items: CheckoutItem[];
  customer?: CheckoutCustomer;     // ✅ dodane
  shippingMethod: ShippingMethod;
  shippingCost?: number;           // ✅ dodane
  currency?: string;               // ✅ dodane
}) {
  const {
    email,
    userId,
    items,
    customer,
    shippingMethod,
    shippingCost = 0,
    currency = "gbp",
  } = params;

  // 🔒 sortujemy items → kolejność nie ma znaczenia
  const normalizedItems = [...items]
    .map((item) => ({
      productId: item.productId ?? null,
      slug: item.slug ?? null,
      price: Number(item.price || 0),
      qty: Number(item.qty || 0),
      size: item.size ?? null,
      color: item.color ?? null,
    }))
    .sort((a, b) => {
      const aKey = `${a.productId}-${a.slug}-${a.size}-${a.color}-${a.price}`;
      const bKey = `${b.productId}-${b.slug}-${b.size}-${b.color}-${b.price}`;
      return aKey.localeCompare(bKey);
    });

  // minimalna normalizacja customer (żeby nie zmieniał checkoutKey przez np. spacje)
  const normalizedCustomer = customer
    ? {
        firstName: customer.firstName?.trim() ?? null,
        lastName: customer.lastName?.trim() ?? null,
        phone: customer.phone?.trim() ?? null,
        address: customer.address
          ? {
              street: customer.address.street?.trim() ?? null,
              city: customer.address.city?.trim() ?? null,
              postalCode: customer.address.postalCode?.trim() ?? null,
              country: customer.address.country?.trim() ?? null,
            }
          : null,
      }
    : null;

  const payload = JSON.stringify({
    email: email.trim().toLowerCase(),
    userId: userId ?? null,
    shippingMethod,
    shippingCost: Number(shippingCost || 0),
    currency: currency.trim().toLowerCase(),
    customer: normalizedCustomer,
    items: normalizedItems,
  });

  return crypto.createHash("sha256").update(payload).digest("hex");
}
