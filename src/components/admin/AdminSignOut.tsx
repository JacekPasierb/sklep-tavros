"use client";

import {signOut} from "next-auth/react";

export function AdminSignOut() {
  return (
    <button
      onClick={() => signOut({callbackUrl: "/signin"})}
      className="rounded-full bg-black px-5 py-2 text-sm font-medium text-white transition hover:bg-black/90"
    >
      Sign out
    </button>
  );
}
