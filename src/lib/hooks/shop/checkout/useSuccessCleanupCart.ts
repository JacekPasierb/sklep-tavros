// src/lib/hooks/useSuccessCleanupCart.ts
"use client";

import {useEffect} from "react";

import type {useRouter} from "next/navigation";
import {clearServerCart} from "../../../services/shop/cart.service";

type SessionStatus = "loading" | "authenticated" | "unauthenticated";

type Params = {
  sessionId: string | null;
  status: SessionStatus;
  router: ReturnType<typeof useRouter>;
  clearGuestCart: () => void;
  mutate: (key: string) => Promise<unknown>;
};

export const useSuccessCleanupCart = ({
  sessionId,
  status,
  router,
  clearGuestCart,
  mutate,
}: Params) => {
  //sprawdzamy czy ktos nie wchodzi recznie z url na strone i kieruje takiego na "/"
  useEffect(() => {
    if (!sessionId) {
      router.replace("/");
      return;
    }
    //sprawdzam czy uzytkownik to zalogowany
    if (status === "loading") return;

    const run = async () => {
      try {
        if (status === "authenticated") {
          //czysci koszyk zalogowanego DB
          await clearServerCart({clearAll: true});
          await mutate("/api/cart");
        } else {
          //czyści koszyk zustand
          clearGuestCart();
        }
      } catch (error) {
        console.error("Error clearing cart after success:", error);
      }
    };

    run();
  }, [sessionId, status, router, clearGuestCart, mutate]);
};
