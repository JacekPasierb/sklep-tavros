"use client";

import {useEffect} from "react";
import {useRouter} from "next/navigation";
import {useSession, signOut} from "next-auth/react";

export default function AccountPage() {
  const router = useRouter();
  const {data: session, status} = useSession();

  // 🔐 Jeśli user nie jest zalogowany → przekieruj na /signin
  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/signin?reason=myaccount&callbackUrl=/account");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <section className="container mx-auto px-4 py-10">
        <div className="mx-auto w-full max-w-md rounded-2xl bg-white px-6 py-8 shadow-sm">
          <p className="text-center text-sm text-zinc-600">
            Sprawdzam status logowania…
          </p>
        </div>
      </section>
    );
  }

  // tutaj już powinno być przekierowanie, ale dla bezpieczeństwa:
  if (!session) return null;

  const user = session.user as {
    id?: string;
    email?: string | null;
    name?: string | null;
    role?: string;
  };

  return (
    <section className="container mx-auto px-4 py-10">
      <div className="mx-auto w-full max-w-2xl rounded-2xl bg-white px-6 py-8 shadow-sm">
        <h1 className="mb-2 text-2xl font-semibold tracking-tight">
          My account
        </h1>
        <p className="mb-6 text-sm text-zinc-600">
          Zarządzaj swoim profilem, zamówieniami i ulubionymi produktami.
        </p>

        {/* Karta z danymi użytkownika */}
        <div className="mb-6 rounded-xl border border-zinc-200 bg-zinc-50/60 px-4 py-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
            Signed in as
          </p>
          <p className="mt-1 text-sm font-medium text-zinc-900">
            {user.name || user.email || "User"}
          </p>
          {user.email && (
            <p className="text-xs text-zinc-600">{user.email}</p>
          )}
          {user.role && (
            <p className="mt-1 inline-flex rounded-full bg-zinc-900 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-50">
              {user.role}
            </p>
          )}
        </div>

        {/* Tu kiedyś włożysz zakładki: Orders, Favorites itd. */}
        <div className="mb-8 space-y-3">
          <h2 className="text-sm font-semibold text-zinc-900">
            Account overview
          </h2>
          <p className="text-sm text-zinc-600">
            W kolejnych krokach możesz tutaj dodać:
          </p>
          <ul className="list-disc pl-5 text-sm text-zinc-600">
            <li>historię zamówień,</li>
            <li>listę ulubionych produktów,</li>
            <li>dane adresowe i płatności.</li>
          </ul>
        </div>

        {/* Logout */}
        <div className="flex justify-between items-center gap-3">
          <p className="text-xs text-zinc-500">
            Chcesz zakończyć sesję na tym urządzeniu?
          </p>
          <button
            type="button"
            onClick={() => signOut({callbackUrl: "/"})}
            className="rounded-full bg-black px-4 py-2 text-xs font-semibold text-white hover:bg-black/90"
          >
            Log out
          </button>
        </div>
      </div>
    </section>
  );
}
