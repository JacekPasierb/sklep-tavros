"use client";

import {useSession, signOut} from "next-auth/react";
import Link from "next/link";
import {useAuthRedirect} from "@/lib/hooks/shop/auth/useAuthRedirect";

 const AccountPage = () => {
  const {data: session, status} = useSession();

  useAuthRedirect(status, "/signin?callbackUrl=/account");

  if (status === "loading") {
    return (
      <section className="container mx-auto px-4 py-10">
        <div className="mx-auto w-full max-w-md rounded-2xl bg-white px-6 py-8 shadow-sm">
          <p className="text-center text-sm text-zinc-600">
            Checking your session…
          </p>
        </div>
      </section>
    );
  }

  if (!session?.user) return null;

  const user = session.user as {
    name?: string | null;
    email?: string | null;
    role?: string;
  };

  return (
    <section className="container mx-auto px-4 py-10">
      <div className="mx-auto w-full max-w-2xl rounded-2xl bg-white px-6 py-8 shadow-sm">
        {/* Nagłówek */}
        <h1 className="text-3xl font-semibold mb-2 tracking-tight">
          My Account
        </h1>
        <p className="text-sm text-zinc-600 mb-8">
          Manage your orders, personal details, and saved items.
        </p>

        {/* Dane użytkownika */}
        <div className="mb-8 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-4">
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
            Signed in as
          </p>

          <p className="mt-1 text-lg font-medium text-zinc-900">
            {user.name || user.email}
          </p>

          <p className="text-xs text-zinc-600">{user.email}</p>

          {user.role && (
            <span className="inline-flex mt-2 w-fit rounded-full bg-black px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white">
              {user.role}
            </span>
          )}
        </div>

        {/* LINKI DO FUNKCJI KONTA */}
        <div className="space-y-4 mb-10">
          <h2 className="text-sm font-semibold text-zinc-900">Your sections</h2>

          <Link
            href="/account/orders"
            className="flex items-center justify-between rounded-lg border px-4 py-3 hover:bg-zinc-50"
          >
            <span className="text-sm font-medium">Order history</span>
            <span className="text-zinc-400">&rarr;</span>
          </Link>

          <Link
            href="/favorites"
            className="flex items-center justify-between rounded-lg border px-4 py-3 hover:bg-zinc-50"
          >
            <span className="text-sm font-medium">Wishlist</span>
            <span className="text-zinc-400">&rarr;</span>
          </Link>

          <Link
            href="/account/personal-details"
            className="flex items-center justify-between rounded-lg border px-4 py-3 hover:bg-zinc-50"
          >
            <span className="text-sm font-medium">Personal details</span>
            <span className="text-zinc-400">&rarr;</span>
          </Link>
        </div>

        {/* Logout */}
        <div className="flex justify-between items-center pt-4 border-t">
          <p className="text-xs text-zinc-500">Want to end your session?</p>

          <button
            onClick={() => signOut({callbackUrl: "/"})}
            className="rounded-full bg-black px-4 py-2 text-xs font-semibold text-white hover:bg-black/90"
          >
            Log out
          </button>
        </div>
      </div>
    </section>
  );
};
export default AccountPage;