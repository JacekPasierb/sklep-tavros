"use client";

import Link from "next/link";
import {usePathname} from "next/navigation";

type Item = {href: string; label: string};

const items: Item[] = [
  {href: "/admin", label: "Dashboard"},
  {href: "/admin/orders", label: "Orders"},
  { href: "/admin/products", label: "Products" },
  {href: "/admin/users", label: "Users"},
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <div className="hidden sm:flex items-center gap-2">
      {items.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={[
              "rounded-full px-4 py-2 text-sm transition",
              "border border-zinc-200",
              isActive ? "bg-black text-white border-black" : "bg-white text-black hover:bg-zinc-50",
            ].join(" ")}
          >
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}
