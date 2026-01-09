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

export function formatDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC", 
  });
}

export function formatTime(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "UTC", 
  });
}
