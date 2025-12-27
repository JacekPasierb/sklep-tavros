"use client";

import {useEffect, useRef, useState} from "react";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {signOut} from "next-auth/react";
import {Menu, X, ExternalLink, LogOut} from "lucide-react";

type Item = {href: string; label: string};

const items: Item[] = [
  {href: "/admin", label: "Dashboard"},
  {href: "/admin/orders", label: "Orders"},
  {href: "/admin/users", label: "Users"},
  { href: "/admin/products", label: "Products" },
];

export function AdminMobileMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const panelRef = useRef<HTMLDivElement | null>(null);



  // zamykaj po ESC
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  // klik poza panelem
  useEffect(() => {
    if (!open) return;
    const onMouseDown = (e: MouseEvent) => {
      if (!panelRef.current) return;
      if (!panelRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, [open]);

  return (
    <div className="relative sm:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2 rounded-full border border-zinc-200 px-4 py-2 text-sm hover:bg-zinc-50 transition"
        aria-label="Open admin menu"
        aria-expanded={open}
      >
        <Menu className="h-4 w-4" />
        Menu
      </button>

      {open && (
        <>
          {/* overlay */}
          <div className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[1px]" />

          {/* panel */}
          <div
            ref={panelRef}
            className="
              fixed right-3 top-16 z-50 w-[min(92vw,340px)]
              rounded-2xl border border-zinc-200 bg-white shadow-xl
              overflow-hidden
            "
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-200">
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">
                  Admin
                </p>
                <p className="text-sm font-semibold text-black">Tavros</p>
              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full border border-zinc-200 p-2 hover:bg-zinc-50 transition"
                aria-label="Close menu"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-2">
              {items.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={()=>setOpen(false)}
                    className={[
                      "flex items-center justify-between rounded-xl px-3 py-2 text-sm transition",
                      active ? "bg-black text-white" : "hover:bg-zinc-50",
                    ].join(" ")}
                  >
                    <span className="font-medium">{item.label}</span>
                    <span className="text-zinc-400">→</span>
                  </Link>
                );
              })}
            </div>

            <div className="border-t border-zinc-200 p-2">
              <Link
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between rounded-xl px-3 py-2 text-sm hover:bg-zinc-50 transition"
              >
                <span className="inline-flex items-center gap-2 font-medium">
                  <ExternalLink className="h-4 w-4" />
                  View store
                </span>
                <span className="text-zinc-400">↗</span>
              </Link>

              <button
                type="button"
                onClick={() => signOut({callbackUrl: "/"})}
                className="mt-1 w-full flex items-center justify-between rounded-xl px-3 py-2 text-sm hover:bg-zinc-50 transition"
              >
                <span className="inline-flex items-center gap-2 font-medium">
                  <LogOut className="h-4 w-4" />
                  Sign out
                </span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
