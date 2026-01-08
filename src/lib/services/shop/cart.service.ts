// src/lib/services/shop/cart.service.ts
export type ClearCartPayload = { clearAll: true };

export async function clearServerCart(payload: ClearCartPayload) {
  const res = await fetch("/api/cart", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    // próbujemy wyciągnąć błąd, ale nie wywalamy exceptiona, bo to cleanup
    const data = await res.json().catch(() => ({}));
    console.error("Failed to clear cart in API:", data);
  }

  return res.ok;
}
