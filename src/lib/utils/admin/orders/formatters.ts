import {Customer} from "../../../../types/customer";

export function formatCustomerName(c?: Customer | null) {
  const first = c?.firstName?.trim();
  const last = c?.lastName?.trim();
  const full = [first, last].filter(Boolean).join(" ");
  return full || "—";
}

export function formatAddress(address?: Customer["address"] | null) {
  if (!address) return "—";
  const parts = [
    address.street,
    address.city,
    address.postalCode,
    address.country,
  ].filter(Boolean);

  return parts.length ? parts.join(", ") : "—";
}




