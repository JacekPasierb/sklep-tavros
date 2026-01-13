"use client";

import Image from "next/image";
import Link from "next/link";
import {X, ChevronRight} from "lucide-react";
import {useEffect, useMemo, useState} from "react";
import useSWR from "swr";
import {useSession, signOut} from "next-auth/react";
import {useRouter} from "next/navigation";
import {ShopGender} from "@/types/(shop)/product";
import {getProductsListBasePath} from "@/lib/utils/(shop)/productsList/getProductsListBasePath";
import {CollectionItem} from "@/types/(shop)/collections";
import {getUserLabel} from "@/lib/utils/shared/auth/getUserLabel";

type Props = {open: boolean; onClose: () => void};

type PanelItem =
  | {label: string; href: string; special?: boolean}
  | {label: string; children: Array<{label: string; href: string}>};

const fetcher = (url: string) =>
  fetch(url, {cache: "no-store"}).then((r) => r.json());
const accent = "emerald-600";

const TABS: {id: ShopGender; label: string}[] = [
  {id: "mens", label: "MENS"},
  {id: "womens", label: "WOMENS"},
  {id: "kids", label: "KIDS"},
];
const MobileMenu = ({open, onClose}: Props) => {
  const [tab, setTab] = useState<ShopGender>("mens");
  const [expanded, setExpanded] = useState<string | null>(null);

  const {data: session, status} = useSession();
  const isAuthed = status === "authenticated";
  const router = useRouter();

  useEffect(() => {
    document.body.classList.toggle("overflow-hidden", open);
    return () => document.body.classList.remove("overflow-hidden");
  }, [open]);

  // ✅ POBIERANIE KOLEKCJI Z API (tylko gdy menu otwarte)
  const {data, isLoading, error} = useSWR(
    open ? [`/api/collections`, tab] : null,
    ([base, t]) => fetcher(`${base}?gender=${t.toLowerCase()}`),
    {
      keepPreviousData: true,
      revalidateOnFocus: false,
      revalidateIfStale: true,
      revalidateOnMount: true,
      dedupingInterval: 0,
    }
  );

  // ✅ Statyczne pozycje + dynamiczne „Shop By Collection"
  const panels = useMemo<PanelItem[]>(() => {
    const collections: CollectionItem[] = data?.items ?? [];

    const base: PanelItem[] = [
      {
        label: "New In",
        href: getProductsListBasePath({gender: tab, mode: "new"}),
        special: true,
      },
      {
        label: "Shop All",
        href: getProductsListBasePath({gender: tab, mode: "all"}),
      },
      {
        label: "Best Seller",
        href: getProductsListBasePath({gender: tab, mode: "bestseller"}),
      },
      {
        label: "Sale",
        href: getProductsListBasePath({gender: tab, mode: "sale"}),
      },
    ];

    const dynamicCollections: PanelItem = {
      label: "Shop By Collection",
      children: collections.map((c) => ({label: c.label, href: c.href})),
    };

    return [...base, dynamicCollections];
  }, [tab, data?.items]);

  const toggleSection = (label: string) =>
    setExpanded((prev) => (prev === label ? null : label));

  const userLabel = getUserLabel(session);

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-[92vw] max-w-[420px] bg-white shadow-2xl transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-hidden={!open}
      >
        <div className="flex h-full flex-col">
          {/* TOP */}
          <div className="flex-none border-b px-4 pt-3 pb-2">
            <div className="mb-2 flex items-center justify-between">
              <div className="flex gap-5 text-sm font-semibold uppercase tracking-wide">
                {TABS.map(({id, label}) => (
                  <button
                    key={id}
                    onClick={() => setTab(id)}
                    className={`pb-2 transition-colors ${
                      tab === id
                        ? `border-b-2 border-${accent} text-black`
                        : "text-zinc-500 hover:text-black"
                    }`}
                    aria-pressed={tab === id}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <button
                aria-label="Close menu"
                onClick={onClose}
                className="grid h-9 w-9 place-items-center rounded-full border border-zinc-200 hover:bg-zinc-50"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* MIDDLE */}
          <div className="flex-1 overflow-y-auto px-3 py-3">
            <ul className="space-y-3">
              {panels.map((it) => (
                <li key={it.label}>
                  {"children" in it ? (
                    <div className="rounded-xl border border-zinc-200 bg-white shadow-sm">
                      <button
                        className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-[15px] font-medium"
                        onClick={() => toggleSection(it.label)}
                      >
                        <span>{it.label}</span>
                        <ChevronRight
                          className={`h-5 w-5 shrink-0 transition-transform ${
                            expanded === it.label ? "rotate-90" : ""
                          }`}
                        />
                      </button>

                      {expanded === it.label && (
                        <ul className="px-2 pb-2">
                          {isLoading && (
                            <li className="px-3 py-2 text-sm text-zinc-500">
                              Loading…
                            </li>
                          )}
                          {error && (
                            <li className="px-3 py-2 text-sm text-red-600">
                              Failed to load collections
                            </li>
                          )}
                          {!isLoading &&
                            !error &&
                            it.children!.length === 0 && (
                              <li className="px-3 py-2 text-sm text-zinc-500">
                                No collections
                              </li>
                            )}
                          {it.children!.map((c) => (
                            <li key={c.href}>
                              <Link
                                href={c.href}
                                onClick={onClose}
                                className="block rounded-lg px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50"
                              >
                                {c.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ) : (
                    <Link
                      href={it.href!}
                      onClick={onClose}
                      className={`block rounded-xl border border-zinc-200 px-4 py-3 text-[15px] font-medium shadow-sm transition hover:shadow ${
                        "special" in it && it.special
                          ? "bg-gradient-to-r from-black to-zinc-800 text-white"
                          : "bg-white"
                      }`}
                    >
                      {it.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* BOTTOM */}
          <div
            className="flex-none border-t bg-zinc-50/60 px-5 py-5"
            style={{
              paddingBottom: "calc(env(safe-area-inset-bottom,0px)+0.75rem)",
            }}
          >
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="space-y-1">
                <p className="text-xs tracking-[0.25em] text-zinc-500">
                  TAVROS
                </p>
                <Image
                  src="/icons/logo.svg"
                  alt="Brand logo"
                  width={120}
                  height={40}
                  className="h-auto w-32 object-contain"
                />
              </div>

              {!isAuthed ? (
                <>
                  <div className="grid w-full grid-cols-2 gap-3">
                    <Link
                      href="/register"
                      onClick={onClose}
                      className="rounded-full border border-zinc-300 bg-white py-2 text-sm font-medium hover:border-zinc-400 hover:shadow-sm"
                    >
                      Create Account
                    </Link>
                    <Link
                      href="/signin"
                      onClick={onClose}
                      className="rounded-full bg-black py-2 text-sm font-semibold text-white hover:bg-zinc-900"
                    >
                      Log in
                    </Link>
                  </div>
                  <p className="text-[11px] leading-snug text-zinc-500">
                    Save favourites, track orders & checkout faster.
                  </p>
                </>
              ) : (
                <>
                  <p className="text-xs text-zinc-600">
                    Signed in as{" "}
                    <span className="font-semibold">{userLabel}</span>
                  </p>
                  <div className="grid w-full grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        router.push("/account");
                      }}
                      className="rounded-full border border-zinc-300 bg-white py-2 text-sm font-medium hover:border-zinc-400 hover:shadow-sm"
                    >
                      My account
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        router.push("/favorites");
                      }}
                      className="rounded-full border border-zinc-300 bg-white py-2 text-sm font-medium hover:border-zinc-400 hover:shadow-sm"
                    >
                      Favourites
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={async () => {
                      onClose();
                      await signOut({callbackUrl: "/"}); // po wylogowaniu na home
                    }}
                    className="mt-2 w-full rounded-full bg-black py-2 text-sm font-semibold text-white hover:bg-zinc-900"
                  >
                    Log out
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
export default MobileMenu;
