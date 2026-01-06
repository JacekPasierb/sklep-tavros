"use client";

import {useEffect} from "react";
import {useRouter} from "next/navigation";

export function useAuthRedirect(status: string, redirectTo: string) {
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace(redirectTo);
    }
  }, [status, redirectTo, router]);
}
