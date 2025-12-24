// src/lib/utils/isCustomer.ts
import type { Session } from "next-auth";

export function isCustomerSession(session: Session | null, status: string) {
  return status === "authenticated" && session?.user?.role === "user";
}

export function isAdminSession(session: Session | null, status: string) {
  return status === "authenticated" && session?.user?.role === "admin";
}
