"use client";

import {useSearchParams, useRouter} from "next/navigation";
import {useEffect} from "react";
import Link from "next/link";
import {useCartStore} from "../../store/cartStore";
import {useSession} from "next-auth/react";
import {useSWRConfig} from "swr";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get("session_id");

  const {status} = useSession();
  // jeśli w store masz "clear", to zostaw tak; jeśli "clearCart", zmień na s.clearCart
  const clearCart = useCartStore((s) => s.clear);
  const {mutate} = useSWRConfig();

  useEffect(() => {
    // ktoś wszedł ręcznie bez session_id → wracamy na stronę główną
    if (!sessionId) {
      router.replace("/");
      return;
    }

    // czekamy aż NextAuth załaduje status
    if (status === "loading") return;

    const cleanupCart = async () => {
      try {
        if (status === "authenticated") {
          // 🔐 zalogowany → czyścimy koszyk w Mongo przez API
          const res = await fetch("/api/cart", {
            method: "DELETE",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({clearAll: true}),
          });

          if (!res.ok) {
            const data = await res.json().catch(() => ({}));
            console.error("Failed to clear cart in API:", data);
          }

          // 🔁 powiedz SWR-owi, żeby odświeżył koszyk
          await mutate("/api/cart");
        } else {
          // 🧺 gość → czyścimy koszyk w Zustand
          if (typeof clearCart === "function") {
            clearCart();
          }
        }
      } catch (error) {
        console.error("Error clearing cart after success:", error);
      }
    };

    cleanupCart();
  }, [sessionId, status, router, clearCart, mutate]); // ⬅️ dodany mutate

  // blokujemy miganie zanim redirect zadziała
  if (!sessionId) return null;

  return (
    <main className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <p className="text-xs uppercase tracking-[0.18em] text-green-600 mb-2">
          Payment successful
        </p>

        <h1 className="text-2xl font-semibold mb-3">
          Thank you for your order
        </h1>

        <p>
          We&apos;ve received your payment and we&apos;re preparing your
          package. You will receive a confirmation email shortly.
        </p>

        <div className="flex flex-col gap-2">
          <Link
            href="/"
            className="inline-flex w-full items-center justify-center rounded-full
                       bg-black px-6 py-3 text-sm font-semibold uppercase tracking-[0.12em]
                       text-white hover:bg-black/90"
          >
            Continue shopping
          </Link>
        </div>
      </div>
    </main>
  );
}
