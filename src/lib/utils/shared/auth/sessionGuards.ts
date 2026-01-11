// src/lib/utils/shared/auth/sessionGuards.ts
import type { Session } from "next-auth";

type AuthStatus = "loading" | "authenticated" | "unauthenticated";

export const isCustomerSession=(session: Session | null, status: AuthStatus) =>{
  return status === "authenticated" && session?.user?.role === "user";
}

export const isAdminSession=(session: Session | null, status: AuthStatus)=> {
  return status === "authenticated" && session?.user?.role === "admin";
}
